import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { matchingService } from '../services/matchingService.ts';
import { db } from '../db/store.ts';

export const getRecommendations = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { status, category, difficulty, sort } = req.query;

    let results = matchingService.matchUserProjects(req.user.id);

    // Filter by status if specified ('READY_TO_BUILD' | 'NEAR_MATCH' | 'PARTIAL_MATCH' | 'LOW_MATCH')
    if (status && typeof status === 'string' && status !== 'ALL') {
      results = results.filter((r) => r.status === status);
    }

    // Filter by category
    if (category && typeof category === 'string' && category !== 'All') {
      results = results.filter((r) => r.project.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by difficulty
    if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
      results = results.filter((r) => r.project.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Sort options
    if (sort === 'FEWEST_MISSING') {
      results.sort((a, b) => a.missingComponents.length - b.missingComponents.length);
    } else if (sort === 'TIME_SHORTEST') {
      results.sort((a, b) => a.project.estimatedTimeHours - b.project.estimatedTimeHours);
    } else if (sort === 'WASTE_HIGHEST') {
      results.sort((a, b) => b.estimatedWasteSavedGrams - a.estimatedWasteSavedGrams);
    } else {
      // Default: Highest compatibility first
      results.sort((a, b) => b.compatibilityPercentage - a.compatibilityPercentage);
    }

    // High level metrics
    const readyToBuildCount = results.filter((r) => r.status === 'READY_TO_BUILD').length;
    const nearMatchCount = results.filter((r) => r.status === 'NEAR_MATCH').length;
    const partialMatchCount = results.filter((r) => r.status === 'PARTIAL_MATCH').length;

    res.json({
      success: true,
      data: {
        recommendations: results,
        summary: {
          totalMatchedProjects: results.length,
          readyToBuildCount,
          nearMatchCount,
          partialMatchCount,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectMatch = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { projectId } = req.params;
    const match = matchingService.getProjectMatchForUser(req.user.id, projectId);

    if (!match) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.json({
      success: true,
      data: { match },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const analyzeAdHocInventory = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { components } = req.body; // Array of { componentId, quantity }

    if (!components || !Array.isArray(components)) {
      res.status(400).json({
        success: false,
        message: 'Request body must contain a "components" array of { componentId, quantity }',
      });
      return;
    }

    const results = matchingService.matchAdHocInventory(components);

    res.json({
      success: true,
      data: {
        recommendations: results,
        summary: {
          totalMatchedProjects: results.length,
          readyToBuildCount: results.filter((r) => r.status === 'READY_TO_BUILD').length,
          nearMatchCount: results.filter((r) => r.status === 'NEAR_MATCH').length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
