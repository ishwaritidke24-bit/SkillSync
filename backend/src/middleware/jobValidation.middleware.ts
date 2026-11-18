import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const validateJobInput = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, requiredSkills, experienceMin, experienceMax, status } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ success: false, message: 'Job title is required' });
    return;
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    res.status(400).json({ success: false, message: 'Job description is required' });
    return;
  }

  if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
    res.status(400).json({ success: false, message: 'Required skills must be a non-empty array' });
    return;
  }

  const validSkills = requiredSkills.filter((s) => typeof s === 'string' && s.trim().length > 0);
  if (validSkills.length === 0) {
    res.status(400).json({ success: false, message: 'At least one valid required skill must be provided' });
    return;
  }

  if (experienceMin === undefined || typeof experienceMin !== 'number' || experienceMin < 0) {
    res.status(400).json({ success: false, message: 'Minimum experience must be a non-negative number' });
    return;
  }

  if (experienceMax === undefined || typeof experienceMax !== 'number' || experienceMax < 0) {
    res.status(400).json({ success: false, message: 'Maximum experience must be a non-negative number' });
    return;
  }

  if (experienceMax < experienceMin) {
    res.status(400).json({ success: false, message: 'Maximum experience must be greater than or equal to minimum experience' });
    return;
  }

  if (status !== undefined && status !== 'active' && status !== 'deactivated') {
    res.status(400).json({ success: false, message: 'Job status must be either active or deactivated' });
    return;
  }

  next();
};

export const validateJobUpdateInput = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, requiredSkills, experienceMin, experienceMax, status } = req.body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    res.status(400).json({ success: false, message: 'Job title must be a non-empty string' });
    return;
  }

  if (description !== undefined && (typeof description !== 'string' || !description.trim())) {
    res.status(400).json({ success: false, message: 'Job description must be a non-empty string' });
    return;
  }

  if (requiredSkills !== undefined) {
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      res.status(400).json({ success: false, message: 'Required skills must be a non-empty array' });
      return;
    }
  }

  if (experienceMin !== undefined && (typeof experienceMin !== 'number' || experienceMin < 0)) {
    res.status(400).json({ success: false, message: 'Minimum experience must be a non-negative number' });
    return;
  }

  if (experienceMax !== undefined && (typeof experienceMax !== 'number' || experienceMax < 0)) {
    res.status(400).json({ success: false, message: 'Maximum experience must be a non-negative number' });
    return;
  }

  if (experienceMin !== undefined && experienceMax !== undefined && experienceMax < experienceMin) {
    res.status(400).json({ success: false, message: 'Maximum experience must be greater than or equal to minimum experience' });
    return;
  }

  if (status !== undefined && status !== 'active' && status !== 'deactivated') {
    res.status(400).json({ success: false, message: 'Job status must be either active or deactivated' });
    return;
  }

  next();
};

export const validateMongoId = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const rawId = req.params[paramName];
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: `Invalid ID format for ${paramName}` });
      return;
    }
    next();
  };
};
