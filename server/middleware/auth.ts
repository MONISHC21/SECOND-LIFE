import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.ts';
import { db } from '../db/store.ts';
import { User, Role } from '../types/index.ts';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication token required',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; role: Role };
    const user = db.getUserById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid session or user not found',
      });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token',
    });
  }
}

export function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; role: Role };
    const user = db.getUserById(decoded.userId);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Ignore invalid optional token
  }
  next();
}

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient privileges for this action',
      });
      return;
    }

    next();
  };
}
