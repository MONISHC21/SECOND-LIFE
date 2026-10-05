import { Router } from 'express';
import { getSustainabilityMetrics } from '../controllers/sustainabilityController.ts';
import { optionalAuthenticate } from '../middleware/auth.ts';

const router = Router();

router.get('/', optionalAuthenticate, getSustainabilityMetrics);

export default router;
