import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};
