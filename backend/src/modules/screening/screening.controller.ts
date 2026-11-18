import { Request, Response } from 'express';
import { ScreeningService } from '../../services/screening.service.js';

export const screenApplicationHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.applicationId;
    const applicationId = Array.isArray(rawId) ? rawId[0] : rawId;

    const result = await ScreeningService.screenApplication(applicationId);

    res.status(200).json({
      success: true,
      message: 'AI resume screening completed successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'AI screening failed',
    });
  }
};

export const getScreeningResultHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.applicationId;
    const applicationId = Array.isArray(rawId) ? rawId[0] : rawId;

    const result = await ScreeningService.getScreeningResult(applicationId);

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'No screening result found for this application',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch screening result',
    });
  }
};

export const generateQuestionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.applicationId;
    const applicationId = Array.isArray(rawId) ? rawId[0] : rawId;

    const questions = await ScreeningService.generateInterviewQuestions(applicationId);

    res.status(200).json({
      success: true,
      message: 'Interview questions generated successfully',
      data: questions,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to generate interview questions',
    });
  }
};

export const getQuestionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.applicationId;
    const applicationId = Array.isArray(rawId) ? rawId[0] : rawId;

    const questions = await ScreeningService.getInterviewQuestions(applicationId);

    if (!questions) {
      res.status(404).json({
        success: false,
        message: 'No generated questions found for this application',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch interview questions',
    });
  }
};
