import { Router } from 'express';
import {
  getRecommendations,
  getProjectMatch,
  analyzeAdHocInventory,
} from '../controllers/matchingController.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

// /api/recommendations -> getRecommendations
router.get('/', authenticate, getRecommendations);

// /api/recommendations/:projectId -> getProjectMatch
router.get('/:projectId', authenticate, getProjectMatch);

// /api/recommendations/analyze or /api/matching/analyze -> analyzeAdHocInventory
router.post('/analyze', analyzeAdHocInventory);

export default router;
