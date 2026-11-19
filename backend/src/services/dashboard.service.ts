import { Candidate } from '../models/candidate.model.js';
import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';

export interface DashboardStats {
  totalCandidates: number;
  activeJobs: number;
  totalApplications: number;
  statusCounts: {
    applied: number;
    screening: number;
    interview: number;
    offered: number;
    rejected: number;
  };
}

export class DashboardService {
  static async getStats(): Promise<DashboardStats> {
    const [totalCandidates, activeJobs, totalApplications, statusAgg] = await Promise.all([
      Candidate.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      Application.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusCounts = {
      applied: 0,
      screening: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
    };

    statusAgg.forEach((item: { _id: string; count: number }) => {
      if (item._id in statusCounts) {
        statusCounts[item._id as keyof typeof statusCounts] = item.count;
      }
    });

    return {
      totalCandidates,
      activeJobs,
      totalApplications,
      statusCounts,
    };
  }
}
