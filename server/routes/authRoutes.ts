import { Router } from 'express';
import { register, login, quickDemoLogin, getMe, updateProfile } from '../controllers/authController.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', quickDemoLogin);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

export default router;
