import { Router } from 'express';
import {
  createApplicationHandler,
  getAllApplicationsHandler,
  getApplicationByIdHandler,
  updateApplicationStatusHandler,
} from './application.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/role.middleware.js';
import {
  validateApplicationInput,
  validateApplicationStatusUpdate,
} from '../../middleware/phase3Validation.middleware.js';
import { validateMongoId } from '../../middleware/jobValidation.middleware.js';

const router = Router();

// Protect all application routes
router.use(authenticate);

// GET /api/applications - List all applications (supports ?status=, ?jobId=, ?candidateId=)
router.get('/', authorize('Admin', 'Recruiter'), getAllApplicationsHandler);

// GET /api/applications/:id - Get individual application details
router.get('/:id', authorize('Admin', 'Recruiter'), validateMongoId('id'), getApplicationByIdHandler);

// POST /api/applications - Create a new application linking candidate and job
router.post('/', authorize('Admin', 'Recruiter'), validateApplicationInput, createApplicationHandler);

// PATCH /api/applications/:id/status - Update application status independently
router.patch(
  '/:id/status',
  authorize('Admin', 'Recruiter'),
  validateMongoId('id'),
  validateApplicationStatusUpdate,
  updateApplicationStatusHandler
);

export const applicationRouter = router;
