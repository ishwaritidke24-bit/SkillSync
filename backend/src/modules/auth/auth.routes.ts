import { Router } from 'express';
import { loginHandler, getMeHandler } from './auth.controller.js';
import { validateLoginInput } from '../../middleware/validation.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// POST /api/auth/login - Admin and Recruiter login
router.post('/login', validateLoginInput, loginHandler);

// GET /api/auth/me - Protected route to get authenticated user details
router.get('/me', authenticate, getMeHandler);

export const authRouter = router;
