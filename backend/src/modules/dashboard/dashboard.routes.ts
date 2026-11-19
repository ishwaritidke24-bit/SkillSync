import { Router } from 'express';
import { getDashboardStatsHandler } from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/role.middleware.js';

const router = Router();

// Protect dashboard statistics endpoint
router.use(authenticate);

// GET /api/dashboard/stats - Admin and Recruiter
router.get('/stats', authorize('Admin', 'Recruiter'), getDashboardStatsHandler);

export const dashboardRouter = router;
