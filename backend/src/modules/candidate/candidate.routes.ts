import { Router } from 'express';
import {
  createCandidateHandler,
  getAllCandidatesHandler,
  getCandidateByIdHandler,
  updateCandidateHandler,
  deleteCandidateHandler,
  uploadResumeHandler,
} from './candidate.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/role.middleware.js';
import {
  validateCandidateInput,
  validateCandidateUpdateInput,
} from '../../middleware/phase3Validation.middleware.js';
import { validateMongoId } from '../../middleware/jobValidation.middleware.js';
import { resumeUpload } from '../../middleware/upload.middleware.js';

const router = Router();

// Protect all candidate routes
router.use(authenticate);

// GET /api/candidates - View candidates with search, filter, pagination
router.get('/', authorize('Admin', 'Recruiter'), getAllCandidatesHandler);

// GET /api/candidates/:id - View individual candidate details
router.get('/:id', authorize('Admin', 'Recruiter'), validateMongoId('id'), getCandidateByIdHandler);

// POST /api/candidates - Add a new candidate
router.post('/', authorize('Admin', 'Recruiter'), validateCandidateInput, createCandidateHandler);

// PUT /api/candidates/:id - Update candidate details
router.put('/:id', authorize('Admin', 'Recruiter'), validateMongoId('id'), validateCandidateUpdateInput, updateCandidateHandler);

// DELETE /api/candidates/:id - Delete candidate (and associated resume + applications)
router.delete('/:id', authorize('Admin', 'Recruiter'), validateMongoId('id'), deleteCandidateHandler);

// POST /api/candidates/:id/resume - Upload PDF resume and extract text
router.post(
  '/:id/resume',
  authorize('Admin', 'Recruiter'),
  validateMongoId('id'),
  resumeUpload.single('resume'),
  uploadResumeHandler
);

export const candidateRouter = router;
