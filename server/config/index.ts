import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'secondlife-production-jwt-secret-key-2026',
  jwtExpiresIn: '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: 'SecondLife',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  matchingThresholds: {
    readyToBuild: 100,
    nearMatch: 75,
    partialMatch: 50,
  },
};
