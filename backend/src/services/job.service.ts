import mongoose from 'mongoose';
import { Job, IJob, JobStatus } from '../models/job.model.js';

export interface CreateJobInput {
  title: string;
  description: string;
  requiredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  status?: JobStatus;
}

export interface UpdateJobInput {
  title?: string;
  description?: string;
  requiredSkills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  status?: JobStatus;
}

export class JobService {
  static async createJob(data: CreateJobInput): Promise<IJob> {
    const job = new Job({
      title: data.title.trim(),
      description: data.description.trim(),
      requiredSkills: data.requiredSkills.map((s) => s.trim()).filter(Boolean),
      experienceMin: data.experienceMin,
      experienceMax: data.experienceMax,
      status: data.status || 'active',
    });

    return await job.save();
  }

  static async getAllJobs(filter?: { status?: JobStatus }): Promise<IJob[]> {
    const query: Record<string, any> = {};
    if (filter?.status) {
      query.status = filter.status;
    }
    return await Job.find(query).sort({ createdAt: -1 });
  }

  static async getJobById(id: string): Promise<IJob | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Job.findById(id);
  }

  static async updateJob(id: string, data: UpdateJobInput): Promise<IJob | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const job = await Job.findById(id);
    if (!job) {
      return null;
    }

    if (data.title !== undefined) job.title = data.title.trim();
    if (data.description !== undefined) job.description = data.description.trim();
    if (data.requiredSkills !== undefined) {
      job.requiredSkills = data.requiredSkills.map((s) => s.trim()).filter(Boolean);
    }
    if (data.experienceMin !== undefined) job.experienceMin = data.experienceMin;
    if (data.experienceMax !== undefined) job.experienceMax = data.experienceMax;
    if (data.status !== undefined) job.status = data.status;

    return await job.save();
  }

  static async deactivateJob(id: string): Promise<IJob | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return await Job.findByIdAndUpdate(
      id,
      { status: 'deactivated' },
      { new: true, runValidators: true }
    );
  }
}
