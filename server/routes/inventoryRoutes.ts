import { Router } from 'express';
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  resetDemoInventory,
} from '../controllers/inventoryController.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.use(authenticate);

router.get('/', getInventory);
router.post('/', addInventoryItem);
router.post('/reset-demo', resetDemoInventory);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;
