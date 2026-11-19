import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes.js';
import { jobRouter } from './modules/job/job.routes.js';
import { candidateRouter } from './modules/candidate/candidate.routes.js';
import { applicationRouter } from './modules/application/application.routes.js';
import { screeningRouter } from './modules/screening/screening.routes.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';
import { authenticate } from './middleware/auth.middleware.js';
import { authorize } from './middleware/role.middleware.js';

export const createApp = (): Express => {
  const app = express();

  // Core middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'SkillSync Backend API' });
  });

  // Authentication routes
  app.use('/api/auth', authRouter);

  // Job management routes
  app.use('/api/jobs', jobRouter);

  // Candidate management routes
  app.use('/api/candidates', candidateRouter);

  // Application management routes
  app.use('/api/applications', applicationRouter);

  // AI Screening & Interview Questions routes
  app.use('/api/screening', screeningRouter);

  // Dashboard & Analytics routes (Phase 5)
  app.use('/api/dashboard', dashboardRouter);

  // Role verification verification test routes
  app.get('/api/protected/admin-only', authenticate, authorize('Admin'), (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Welcome Admin: access granted to admin resources.' });
  });

  app.get('/api/protected/recruiter-only', authenticate, authorize('Recruiter'), (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Welcome Recruiter: access granted to recruiter resources.' });
  });

  app.get('/api/protected/authenticated', authenticate, (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Access granted to authenticated user.' });
  });

  // Global 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Resource not found' });
  });

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Error]', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  });

  return app;
};
