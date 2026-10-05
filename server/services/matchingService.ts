import { db } from '../db/store.ts';
import {
  Project,
  InventoryItem,
  ProjectMatchResult,
  RecommendationStatus,
  AvailableComponentItem,
  MissingComponentItem,
} from '../types/index.ts';

export class MatchingService {
  /**
   * Compares a user's inventory against all projects in the catalog
   * and returns ranked project match feasibility results.
   */
  public matchUserProjects(userId: string): ProjectMatchResult[] {
    const userInventory = db.getInventoryByUserId(userId);
    const projects = db.getProjects();

    const results = projects.map((project) => this.evaluateProjectFeasibility(project, userInventory));

    // Sort by compatibility percentage descending, then by fewest missing components
    return results.sort((a, b) => {
      if (b.compatibilityPercentage !== a.compatibilityPercentage) {
        return b.compatibilityPercentage - a.compatibilityPercentage;
      }
      return a.missingComponents.length - b.missingComponents.length;
    });
  }

  /**
   * Matches against an explicit ad-hoc list of inventory items
   * (e.g. For guests or interactive sandbox playground)
   */
  public matchAdHocInventory(inventory: { componentId: string; quantity: number }[]): ProjectMatchResult[] {
    const projects = db.getProjects();
    const pseudoInventory: InventoryItem[] = inventory.map((item, idx) => ({
      id: `adhoc_${idx}`,
      userId: 'adhoc',
      componentId: item.componentId,
      quantity: item.quantity,
      condition: 'GOOD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      component: db.getComponentById(item.componentId),
    }));

    const results = projects.map((project) => this.evaluateProjectFeasibility(project, pseudoInventory));

    return results.sort((a, b) => {
      if (b.compatibilityPercentage !== a.compatibilityPercentage) {
        return b.compatibilityPercentage - a.compatibilityPercentage;
      }
      return a.missingComponents.length - b.missingComponents.length;
    });
  }

  /**
   * Analyzes single project feasibility against user inventory
   */
  public evaluateProjectFeasibility(project: Project, userInventory: InventoryItem[]): ProjectMatchResult {
    const requirements = project.requirements || [];

    // Map user inventory by componentId and sum quantities if duplicated
    const userInventoryMap = new Map<string, number>();
    for (const item of userInventory) {
      const current = userInventoryMap.get(item.componentId) || 0;
      userInventoryMap.set(item.componentId, current + item.quantity);
    }

    const availableComponents: AvailableComponentItem[] = [];
    const missingComponents: MissingComponentItem[] = [];

    let totalRequiredUnits = 0;
    let fulfilledRequiredUnits = 0;

    for (const req of requirements) {
      const comp = req.component || db.getComponentById(req.componentId);
      const componentName = comp ? comp.name : req.componentId;
      const category = comp ? comp.category : 'General';
      const weightGrams = comp ? comp.estimatedWeightGrams : 20;

      const userQuantity = userInventoryMap.get(req.componentId) || 0;
      const neededQuantity = req.requiredQuantity;

      // Only mandatory requirements factor into strict feasibility percentage
      if (!req.isOptional) {
        totalRequiredUnits += neededQuantity;
        fulfilledRequiredUnits += Math.min(userQuantity, neededQuantity);
      }

      if (userQuantity >= neededQuantity) {
        // Fully available
        availableComponents.push({
          componentId: req.componentId,
          componentName,
          category,
          requiredQuantity: neededQuantity,
          userAvailableQuantity: userQuantity,
          fulfilledQuantity: neededQuantity,
          isOptional: req.isOptional,
        });
      } else if (userQuantity > 0) {
        // Partially available - has some, but not enough quantity!
        const missingCount = neededQuantity - userQuantity;
        availableComponents.push({
          componentId: req.componentId,
          componentName,
          category,
          requiredQuantity: neededQuantity,
          userAvailableQuantity: userQuantity,
          fulfilledQuantity: userQuantity,
          isOptional: req.isOptional,
        });

        missingComponents.push({
          componentId: req.componentId,
          componentName,
          category,
          requiredQuantity: neededQuantity,
          availableQuantity: userQuantity,
          missingQuantity: missingCount,
          isOptional: req.isOptional,
          estimatedWeightGrams: weightGrams * missingCount,
        });
      } else {
        // Completely missing
        missingComponents.push({
          componentId: req.componentId,
          componentName,
          category,
          requiredQuantity: neededQuantity,
          availableQuantity: 0,
          missingQuantity: neededQuantity,
          isOptional: req.isOptional,
          estimatedWeightGrams: weightGrams * neededQuantity,
        });
      }
    }

    // Calculate Feasibility / Compatibility Score (0 - 100%)
    let compatibilityPercentage = 0;
    if (totalRequiredUnits > 0) {
      compatibilityPercentage = Math.round((fulfilledRequiredUnits / totalRequiredUnits) * 100);
    } else {
      compatibilityPercentage = 100; // No requirements
    }

    // Status Assignment
    let status: RecommendationStatus = 'LOW_MATCH';
    if (compatibilityPercentage >= 100) {
      status = 'READY_TO_BUILD';
    } else if (compatibilityPercentage >= 75) {
      status = 'NEAR_MATCH';
    } else if (compatibilityPercentage >= 50) {
      status = 'PARTIAL_MATCH';
    } else {
      status = 'LOW_MATCH';
    }

    return {
      project,
      compatibilityPercentage,
      status,
      availableComponents,
      missingComponents,
      totalRequiredCount: totalRequiredUnits,
      fulfilledRequiredCount: fulfilledRequiredUnits,
      estimatedWasteSavedGrams: project.estimatedWasteSavedGrams,
      estimatedCO2ReductionGrams: project.estimatedCO2ReductionGrams,
      isReadyToBuild: status === 'READY_TO_BUILD',
    };
  }

  /**
   * Retrieves single project match for a specific user
   */
  public getProjectMatchForUser(userId: string, projectId: string): ProjectMatchResult | null {
    const project = db.getProjectById(projectId);
    if (!project) return null;

    const userInventory = db.getInventoryByUserId(userId);
    return this.evaluateProjectFeasibility(project, userInventory);
  }
}

export const matchingService = new MatchingService();
