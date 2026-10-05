import { Router } from 'express';
import { getUsers, updateUserRole, deleteUser, getSystemOverview } from '../controllers/adminController.ts';
import { authenticate, requireRole } from '../middleware/auth.ts';

const router = Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getSystemOverview);

export default router;
