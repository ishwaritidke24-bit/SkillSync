import { Request, Response } from 'express';
import { CandidateService } from '../../services/candidate.service.js';

export const createCandidateHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidate = await CandidateService.createCandidate(req.body);
    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: candidate,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create candidate',
    });
  }
};

export const getAllCandidatesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, skill, page, limit } = req.query;
    const result = await CandidateService.getAllCandidates({
      search: typeof search === 'string' ? search : undefined,
      skill: typeof skill === 'string' ? skill : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res.status(200).json({
      success: true,
      data: result.candidates,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch candidates',
    });
  }
};

export const getCandidateByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const result = await CandidateService.getCandidateById(id);

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        candidate: result.candidate,
        resume: result.resume,
        applications: result.applications,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch candidate details',
    });
  }
};

export const updateCandidateHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const candidate = await CandidateService.updateCandidate(id, req.body);

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Candidate updated successfully',
      data: candidate,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update candidate',
    });
  }
};

export const deleteCandidateHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const success = await CandidateService.deleteCandidate(id);

    if (!success) {
      res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Candidate and associated data deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete candidate',
    });
  }
};

export const uploadResumeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const candidateId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Please select a PDF resume file to upload',
      });
      return;
    }

    const resume = await CandidateService.processResumeUpload(candidateId, req.file);

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and processed successfully',
      data: {
        _id: resume._id,
        candidate: resume.candidate,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        mimeType: resume.mimeType,
        extractedTextLength: resume.extractedText ? resume.extractedText.length : 0,
        createdAt: resume.createdAt,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Resume upload failed',
    });
  }
};
