import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { config } from './server/config/index.ts';

// Routes
import authRoutes from './server/routes/authRoutes.ts';
import componentRoutes from './server/routes/componentRoutes.ts';
import inventoryRoutes from './server/routes/inventoryRoutes.ts';
import projectRoutes from './server/routes/projectRoutes.ts';
import matchingRoutes from './server/routes/matchingRoutes.ts';
import sustainabilityRoutes from './server/routes/sustainabilityRoutes.ts';
import adminRoutes from './server/routes/adminRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const PORT = config.port;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS and security headers for iframe compatibility
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/components', componentRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/matching', matchingRoutes);
  app.use('/api/recommendations', matchingRoutes);
  app.use('/api/sustainability', sustainabilityRoutes);
  app.use('/api/admin', adminRoutes);

  // Healthcheck endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'SecondLife',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite Integration
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SecondLife] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SecondLife server:', err);
  process.exit(1);
});
