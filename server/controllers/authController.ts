import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { config } from '../config/index.ts';
import { db } from '../db/store.ts';
import { User, Role } from '../types/index.ts';

function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user: User) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export const register = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
      return;
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'An account with this email address already exists',
      });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'USER',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.createUser(newUser);
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: sanitizeUser(newUser),
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

export const login = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    const user = db.getUserByEmail(email.trim());
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
      return;
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

export const quickDemoLogin = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { accountType } = req.body; // 'monish' | 'admin' | 'guest'
    let user: User | undefined;

    if (accountType === 'admin') {
      user = db.getUserByEmail('admin@secondlife.local');
    } else if (accountType === 'guest') {
      user = db.getUserByEmail('guest@secondlife.local');
    } else {
      // Default: Monish (the primary hackathon demo user)
      user = db.getUserByEmail('monish@secondlife.local');
    }

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Demo account not found in database',
      });
      return;
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: `Signed in as ${user.name} (${user.role})`,
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Demo sign-in failed',
    });
  }
};

export const getMe = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  res.json({
    success: true,
    data: {
      user: sanitizeUser(req.user),
    },
  });
};

export const updateProfile = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const { name, avatar } = req.body;
  const updated = db.updateUser(req.user.id, {
    ...(name ? { name: name.trim() } : {}),
    ...(avatar ? { avatar: avatar.trim() } : {}),
  });

  if (!updated) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: sanitizeUser(updated),
    },
  });
};
