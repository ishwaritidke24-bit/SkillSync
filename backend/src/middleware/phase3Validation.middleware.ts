import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const validateCandidateInput = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, skills, experienceYears } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ success: false, message: 'Candidate name is required' });
    return;
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({ success: false, message: 'Candidate email is required' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    return;
  }

  if (!Array.isArray(skills) || skills.length === 0) {
    res.status(400).json({ success: false, message: 'At least one candidate skill is required' });
    return;
  }

  const validSkills = skills.filter((s) => typeof s === 'string' && s.trim().length > 0);
  if (validSkills.length === 0) {
    res.status(400).json({ success: false, message: 'At least one valid skill must be provided' });
    return;
  }

  if (experienceYears === undefined || typeof experienceYears !== 'number' || experienceYears < 0) {
    res.status(400).json({ success: false, message: 'Experience years must be a non-negative number' });
    return;
  }

  next();
};

export const validateCandidateUpdateInput = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, skills, experienceYears } = req.body;

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    res.status(400).json({ success: false, message: 'Candidate name cannot be empty' });
    return;
  }

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address' });
      return;
    }
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills) || skills.length === 0) {
      res.status(400).json({ success: false, message: 'Skills must be a non-empty array' });
      return;
    }
  }

  if (experienceYears !== undefined && (typeof experienceYears !== 'number' || experienceYears < 0)) {
    res.status(400).json({ success: false, message: 'Experience years must be a non-negative number' });
    return;
  }

  next();
};

export const validateApplicationInput = (req: Request, res: Response, next: NextFunction): void => {
  const { candidateId, jobId, status } = req.body;

  if (!candidateId || !mongoose.Types.ObjectId.isValid(candidateId)) {
    res.status(400).json({ success: false, message: 'A valid candidateId is required' });
    return;
  }

  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    res.status(400).json({ success: false, message: 'A valid jobId is required' });
    return;
  }

  const validStatuses = ['applied', 'screening', 'interview', 'offered', 'rejected'];
  if (status !== undefined && !validStatuses.includes(status)) {
    res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    return;
  }

  next();
};

export const validateApplicationStatusUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { status } = req.body;

  const validStatuses = ['applied', 'screening', 'interview', 'offered', 'rejected'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({
      success: false,
      message: `Invalid or missing status. Allowed: ${validStatuses.join(', ')}`,
    });
    return;
  }

  next();
};
