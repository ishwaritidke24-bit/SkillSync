import { Router } from 'express';
import {
  createJobHandler,
  getAllJobsHandler,
  getJobByIdHandler,
  updateJobHandler,
  deactivateJobHandler,
} from './job.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/role.middleware.js';
import {
  validateJobInput,
  validateJobUpdateInput,
  validateMongoId,
} from '../../middleware/jobValidation.middleware.js';

const router = Router();

// All job routes require authenticated users (Admin and Recruiter)
router.use(authenticate);

// GET /api/jobs - View all jobs (Admin and Recruiter)
router.get('/', authorize('Admin', 'Recruiter'), getAllJobsHandler);

// GET /api/jobs/:id - View individual job details (Admin and Recruiter)
router.get('/:id', authorize('Admin', 'Recruiter'), validateMongoId('id'), getJobByIdHandler);

// POST /api/jobs - Create a job (Admin and Recruiter)
router.post('/', authorize('Admin', 'Recruiter'), validateJobInput, createJobHandler);

// PUT /api/jobs/:id - Update job (Admin and Recruiter)
router.put('/:id', authorize('Admin', 'Recruiter'), validateMongoId('id'), validateJobUpdateInput, updateJobHandler);

// PATCH /api/jobs/:id/deactivate - Deactivate a job (Admin and Recruiter)
router.patch('/:id/deactivate', authorize('Admin', 'Recruiter'), validateMongoId('id'), deactivateJobHandler);

export const jobRouter = router;
