import { Request, Response, NextFunction } from 'express';

export const validateLoginInput = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({
      success: false,
      message: 'Email is required',
    });
    return;
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Password is required and must be at least 6 characters long',
    });
    return;
  }

  next();
};
