import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleFavorite,
  getFavorites,
  markCompleted,
} from '../controllers/projectController.ts';
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/auth.ts';

const router = Router();

router.get('/', optionalAuthenticate, getProjects);
router.get('/favorites', authenticate, getFavorites);
router.get('/:id', optionalAuthenticate, getProjectById);

router.post('/:id/favorite', authenticate, toggleFavorite);
router.post('/:id/complete', authenticate, markCompleted);

// Admin-only management
router.post('/', authenticate, requireRole('ADMIN'), createProject);
router.put('/:id', authenticate, requireRole('ADMIN'), updateProject);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteProject);

export default router;
