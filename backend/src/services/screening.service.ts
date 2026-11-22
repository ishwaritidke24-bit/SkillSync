import mongoose from 'mongoose';
import { Application } from '../models/application.model.js';
import { Resume } from '../models/resume.model.js';
import { ScreeningResult, IScreeningResult } from '../models/screeningResult.model.js';
import { InterviewQuestion, IInterviewQuestion } from '../models/interviewQuestion.model.js';
import { GeminiService } from './gemini.service.js';

export class ScreeningService {
  /**
   * Helper to fetch and validate application context (candidate, job, resume).
   */
  private static async getApplicationContext(applicationId: string) {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      throw new Error('Invalid application ID format');
    }

    // Run application lookup and resume lookup concurrently
    const applicationPromise = Application.findById(applicationId)
      .populate('candidate')
      .populate('job')
      .lean();

    const application = (await applicationPromise) as any;
    if (!application) {
      throw new Error('Application not found');
    }

    const candidate = application.candidate;
    const job = application.job;

    if (!candidate) {
      throw new Error('Candidate record associated with this application was not found');
    }

    if (!job) {
      throw new Error('Job record associated with this application was not found');
    }

    // Retrieve resume with lean() for faster read performance
    const resume = await Resume.findOne({ candidate: candidate._id }).lean();
    if (!resume) {
      throw new Error('Candidate has no uploaded resume. Please upload a PDF resume before screening.');
    }

    if (!resume.extractedText || !resume.extractedText.trim()) {
      throw new Error('The uploaded resume has no readable or extracted text. Please re-upload a valid PDF.');
    }

    return { application, candidate, job, resume };
  }

  /**
   * Performs AI resume screening using Gemini and persists the result in MongoDB.
   */
  static async screenApplication(applicationId: string): Promise<IScreeningResult> {
    const { application, candidate, job, resume } = await this.getApplicationContext(applicationId);

    // Call Gemini Service
    const aiOutput = await GeminiService.screenResume({
      candidateName: candidate.name,
      resumeText: resume.extractedText,
      jobTitle: job.title,
      jobDescription: job.description,
      requiredSkills: job.requiredSkills || [],
      experienceMin: job.experienceMin || 0,
      experienceMax: job.experienceMax || 0,
    });

    // Upsert ScreeningResult in MongoDB for this application
    const result = await ScreeningResult.findOneAndUpdate(
      { application: application._id },
      {
        application: application._id,
        matchingSkills: aiOutput.matchingSkills,
        missingSkills: aiOutput.missingSkills,
        experienceAnalysis: aiOutput.experienceAnalysis,
        explanation: aiOutput.explanation,
        summary: aiOutput.summary,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return result;
  }

  /**
   * Retrieves existing screening result for an application.
   */
  static async getScreeningResult(applicationId: string): Promise<IScreeningResult | null> {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return null;
    }
    return await ScreeningResult.findOne({ application: applicationId });
  }

  /**
   * Generates tailored interview questions via Gemini and persists them in MongoDB.
   */
  static async generateInterviewQuestions(applicationId: string): Promise<IInterviewQuestion> {
    const { application, candidate, job, resume } = await this.getApplicationContext(applicationId);

    // Call Gemini Service
    const aiOutput = await GeminiService.generateInterviewQuestions({
      candidateName: candidate.name,
      resumeText: resume.extractedText,
      jobTitle: job.title,
      jobDescription: job.description,
      requiredSkills: job.requiredSkills || [],
      experienceMin: job.experienceMin || 0,
      experienceMax: job.experienceMax || 0,
    });

    // Upsert InterviewQuestion document in MongoDB
    const result = await InterviewQuestion.findOneAndUpdate(
      { application: application._id },
      {
        application: application._id,
        questions: aiOutput.questions,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return result;
  }

  /**
   * Retrieves generated interview questions for an application.
   */
  static async getInterviewQuestions(applicationId: string): Promise<IInterviewQuestion | null> {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return null;
    }
    return await InterviewQuestion.findOne({ application: applicationId });
  }
}
