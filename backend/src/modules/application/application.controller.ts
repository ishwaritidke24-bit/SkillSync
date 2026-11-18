import { Request, Response } from 'express';
import { ApplicationService } from '../../services/application.service.js';
import { ApplicationStatus } from '../../models/application.model.js';

export const createApplicationHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateId, jobId, status } = req.body;
    const application = await ApplicationService.createApplication({
      candidateId,
      jobId,
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create application',
    });
  }
};

export const getAllApplicationsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, jobId, candidateId } = req.query;
    const applications = await ApplicationService.getAllApplications({
      status: status as ApplicationStatus | undefined,
      jobId: typeof jobId === 'string' ? jobId : undefined,
      candidateId: typeof candidateId === 'string' ? candidateId : undefined,
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch applications',
    });
  }
};

export const getApplicationByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const application = await ApplicationService.getApplicationById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch application',
    });
  }
};

export const updateApplicationStatusHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const { status } = req.body;

    const updated = await ApplicationService.updateApplicationStatus(id, status);

    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update application status',
    });
  }
};
