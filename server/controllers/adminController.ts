import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { db } from '../db/store.ts';

export const getUsers = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const users = db.getUsers().map((u) => {
      const { passwordHash, ...rest } = u;
      const inv = db.getInventoryByUserId(u.id);
      return {
        ...rest,
        inventoryCount: inv.length,
        totalComponentsOwned: inv.reduce((sum, item) => sum + item.quantity, 0),
      };
    });

    res.json({ success: true, data: { users } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['GUEST', 'USER', 'ADMIN'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role specified' });
      return;
    }

    const updated = db.updateUser(id, { role });
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const { passwordHash, ...rest } = updated;
    res.json({ success: true, message: `User role updated to ${role}`, data: { user: rest } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    if (req.user && req.user.id === id) {
      res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
      return;
    }

    const deleted = db.deleteUser(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, message: 'User and associated data deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSystemOverview = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const analytics = db.getSystemAnalytics();
    res.json({
      success: true,
      data: { analytics },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
