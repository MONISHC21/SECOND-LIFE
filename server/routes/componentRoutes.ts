import { Router } from 'express';
import {
  getComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
} from '../controllers/componentController.ts';
import { authenticate, requireRole, optionalAuthenticate } from '../middleware/auth.ts';

const router = Router();

router.get('/', optionalAuthenticate, getComponents);
router.get('/:id', optionalAuthenticate, getComponentById);
router.post('/', authenticate, requireRole('ADMIN'), createComponent);
router.put('/:id', authenticate, requireRole('ADMIN'), updateComponent);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteComponent);

export default router;
