import mongoose from 'mongoose';
import { Application, IApplication, ApplicationStatus } from '../models/application.model.js';
import { Candidate } from '../models/candidate.model.js';
import { Job } from '../models/job.model.js';

export interface CreateApplicationInput {
  candidateId: string;
  jobId: string;
  status?: ApplicationStatus;
}

export class ApplicationService {
  static async createApplication(input: CreateApplicationInput): Promise<IApplication> {
    if (!mongoose.Types.ObjectId.isValid(input.candidateId)) {
      throw new Error('Invalid candidate ID format');
    }
    if (!mongoose.Types.ObjectId.isValid(input.jobId)) {
      throw new Error('Invalid job ID format');
    }

    const [candidate, job] = await Promise.all([
      Candidate.findById(input.candidateId),
      Job.findById(input.jobId),
    ]);

    if (!candidate) {
      throw new Error('Referenced candidate not found');
    }

    if (!job) {
      throw new Error('Referenced job not found');
    }

    // Check for duplicate application
    const existing = await Application.findOne({
      candidate: input.candidateId,
      job: input.jobId,
    });

    if (existing) {
      throw new Error('This candidate has already applied for this job');
    }

    const application = new Application({
      candidate: input.candidateId,
      job: input.jobId,
      status: input.status || 'applied',
    });

    return await application.save();
  }

  static async getAllApplications(filter?: { status?: ApplicationStatus; jobId?: string; candidateId?: string }) {
    const query: Record<string, any> = {};

    if (filter?.status) {
      query.status = filter.status;
    }
    if (filter?.jobId && mongoose.Types.ObjectId.isValid(filter.jobId)) {
      query.job = filter.jobId;
    }
    if (filter?.candidateId && mongoose.Types.ObjectId.isValid(filter.candidateId)) {
      query.candidate = filter.candidateId;
    }

    return await Application.find(query)
      .populate('candidate', 'name email phone skills experienceYears')
      .populate('job', 'title status requiredSkills experienceMin experienceMax')
      .sort({ createdAt: -1 });
  }

  static async getApplicationById(id: string): Promise<IApplication | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return await Application.findById(id)
      .populate('candidate')
      .populate('job');
  }

  static async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<IApplication | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const validStatuses: ApplicationStatus[] = ['applied', 'screening', 'interview', 'offered', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status value. Allowed: ${validStatuses.join(', ')}`);
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('candidate', 'name email')
      .populate('job', 'title');

    return application;
  }
}
