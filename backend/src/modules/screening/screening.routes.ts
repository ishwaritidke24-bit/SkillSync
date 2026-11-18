import { Router } from 'express';
import {
  screenApplicationHandler,
  getScreeningResultHandler,
  generateQuestionsHandler,
  getQuestionsHandler,
} from './screening.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/role.middleware.js';
import { validateMongoId } from '../../middleware/jobValidation.middleware.js';

const router = Router();

// Protect all AI screening & interview question routes
router.use(authenticate);

// POST /api/screening/:applicationId/screen - Run AI resume screening
router.post(
  '/:applicationId/screen',
  authorize('Admin', 'Recruiter'),
  validateMongoId('applicationId'),
  screenApplicationHandler
);

// GET /api/screening/:applicationId/result - Retrieve screening results
router.get(
  '/:applicationId/result',
  authorize('Admin', 'Recruiter'),
  validateMongoId('applicationId'),
  getScreeningResultHandler
);

// POST /api/screening/:applicationId/questions - Generate interview questions
router.post(
  '/:applicationId/questions',
  authorize('Admin', 'Recruiter'),
  validateMongoId('applicationId'),
  generateQuestionsHandler
);

// GET /api/screening/:applicationId/questions - Retrieve generated interview questions
router.get(
  '/:applicationId/questions',
  authorize('Admin', 'Recruiter'),
  validateMongoId('applicationId'),
  getQuestionsHandler
);

export const screeningRouter = router;
