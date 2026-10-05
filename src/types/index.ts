export type Role = 'GUEST' | 'USER' | 'ADMIN';

export type ComponentCondition = 'NEW' | 'GOOD' | 'USED' | 'DAMAGED';

export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type RecommendationStatus = 'READY_TO_BUILD' | 'NEAR_MATCH' | 'PARTIAL_MATCH' | 'LOW_MATCH';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export interface Component {
  id: string;
  name: string;
  category: string;
  manufacturer?: string;
  description: string;
  defaultUnit: string;
  condition: ComponentCondition;
  estimatedWeightGrams: number;
  estimatedCO2Grams: number;
  datasheetUrl?: string;
  imageUrl?: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  componentId: string;
  quantity: number;
  condition: ComponentCondition;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  component?: Component;
}

export interface ProjectRequirement {
  id: string;
  projectId: string;
  componentId: string;
  requiredQuantity: number;
  isOptional: boolean;
  notes?: string;
  component?: Component;
}

export interface ProjectInstruction {
  stepNumber: number;
  title: string;
  detail: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  difficulty: ProjectDifficulty;
  estimatedTimeHours: number;
  category: string;
  circuitDiagram?: string;
  imageUrl?: string;
  estimatedWasteSavedGrams: number;
  estimatedCO2ReductionGrams: number;
  tags: string[];
  instructions?: ProjectInstruction[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  requirements?: ProjectRequirement[];
  isFavorite?: boolean;
  matchData?: {
    compatibilityPercentage: number;
    status: RecommendationStatus;
    missingCount: number;
    isReadyToBuild: boolean;
  } | null;
}

export interface MissingComponentItem {
  componentId: string;
  componentName: string;
  category: string;
  requiredQuantity: number;
  availableQuantity: number;
  missingQuantity: number;
  isOptional: boolean;
  estimatedWeightGrams: number;
}

export interface AvailableComponentItem {
  componentId: string;
  componentName: string;
  category: string;
  requiredQuantity: number;
  userAvailableQuantity: number;
  fulfilledQuantity: number;
  isOptional: boolean;
}

export interface ProjectMatchResult {
  project: Project;
  compatibilityPercentage: number;
  status: RecommendationStatus;
  availableComponents: AvailableComponentItem[];
  missingComponents: MissingComponentItem[];
  totalRequiredCount: number;
  fulfilledRequiredCount: number;
  estimatedWasteSavedGrams: number;
  estimatedCO2ReductionGrams: number;
  isReadyToBuild: boolean;
}

export interface CompletedProject {
  id: string;
  userId: string;
  projectId: string;
  rating?: number;
  notes?: string;
  completedAt: string;
  project?: Project;
}
