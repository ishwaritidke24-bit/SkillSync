import { Request, Response } from 'express';
import { DashboardService } from '../../services/dashboard.service.js';

export const getDashboardStatsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await DashboardService.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve dashboard analytics',
    });
  }
};
