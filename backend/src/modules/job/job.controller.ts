import { Request, Response } from 'express';
import { JobService } from '../../services/job.service.js';
import { JobStatus } from '../../models/job.model.js';

export const createJobHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await JobService.createJob(req.body);
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create job',
    });
  }
};

export const getAllJobsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as JobStatus | undefined;
    const jobs = await JobService.getAllJobs({ status });
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch jobs',
    });
  }
};

export const getJobByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const job = await JobService.getJobById(id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch job',
    });
  }
};

export const updateJobHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const updatedJob = await JobService.updateJob(id, req.body);

    if (!updatedJob) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update job',
    });
  }
};

export const deactivateJobHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const deactivatedJob = await JobService.deactivateJob(id);

    if (!deactivatedJob) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Job deactivated successfully',
      data: deactivatedJob,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to deactivate job',
    });
  }
};
