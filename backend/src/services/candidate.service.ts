import mongoose from 'mongoose';
import { Candidate, ICandidate } from '../models/candidate.model.js';
import { Resume, IResume } from '../models/resume.model.js';
import { Application } from '../models/application.model.js';
import { PdfExtractor } from '../utils/pdfExtractor.js';
import fs from 'fs';

export interface CreateCandidateInput {
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
}

export interface UpdateCandidateInput {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experienceYears?: number;
}

export interface GetCandidatesFilter {
  search?: string;
  skill?: string;
  page?: number;
  limit?: number;
}

export class CandidateService {
  static async createCandidate(input: CreateCandidateInput): Promise<ICandidate> {
    const existing = await Candidate.findOne({ email: input.email.toLowerCase().trim() });
    if (existing) {
      throw new Error('A candidate with this email address already exists');
    }

    const candidate = new Candidate({
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      phone: input.phone ? input.phone.trim() : undefined,
      skills: input.skills.map((s) => s.trim()).filter(Boolean),
      experienceYears: input.experienceYears,
    });

    return await candidate.save();
  }

  static async getAllCandidates(filter: GetCandidatesFilter = {}) {
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filter.limit) || 10));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (filter.search && filter.search.trim()) {
      const term = filter.search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
      ];
    }

    if (filter.skill && filter.skill.trim()) {
      query.skills = { $regex: filter.skill.trim(), $options: 'i' };
    }

    const [total, candidates] = await Promise.all([
      Candidate.countDocuments(query),
      Candidate.find(query)
        .populate('resume', 'fileName mimeType fileSize createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return {
      candidates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getCandidateById(id: string): Promise<{
    candidate: ICandidate;
    resume: IResume | null;
    applications: any[];
  } | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const candidate = await Candidate.findById(id).populate('resume');
    if (!candidate) return null;

    const [resume, applications] = await Promise.all([
      Resume.findOne({ candidate: candidate._id }),
      Application.find({ candidate: candidate._id }).populate('job', 'title status requiredSkills experienceMin experienceMax'),
    ]);

    return {
      candidate,
      resume,
      applications,
    };
  }

  static async updateCandidate(id: string, input: UpdateCandidateInput): Promise<ICandidate | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const candidate = await Candidate.findById(id);
    if (!candidate) return null;

    if (input.email && input.email.toLowerCase().trim() !== candidate.email) {
      const existing = await Candidate.findOne({ email: input.email.toLowerCase().trim() });
      if (existing) {
        throw new Error('A candidate with this email address already exists');
      }
      candidate.email = input.email.toLowerCase().trim();
    }

    if (input.name !== undefined) candidate.name = input.name.trim();
    if (input.phone !== undefined) candidate.phone = input.phone.trim();
    if (input.skills !== undefined) {
      candidate.skills = input.skills.map((s) => s.trim()).filter(Boolean);
    }
    if (input.experienceYears !== undefined) {
      candidate.experienceYears = input.experienceYears;
    }

    return await candidate.save();
  }

  static async deleteCandidate(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const candidate = await Candidate.findById(id);
    if (!candidate) return false;

    // Delete associated resume file and record
    const resume = await Resume.findOne({ candidate: candidate._id });
    if (resume) {
      if (fs.existsSync(resume.filePath)) {
        try {
          fs.unlinkSync(resume.filePath);
        } catch (e) {
          console.error('Failed to remove physical resume file:', e);
        }
      }
      await Resume.findByIdAndDelete(resume._id);
    }

    // Delete associated applications
    await Application.deleteMany({ candidate: candidate._id });

    // Delete candidate
    await Candidate.findByIdAndDelete(id);

    return true;
  }

  static async processResumeUpload(candidateId: string, file: Express.Multer.File): Promise<IResume> {
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new Error('Invalid candidate ID format');
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new Error('Candidate not found');
    }

    // Extract text from the PDF file
    let extracted;
    try {
      extracted = await PdfExtractor.extractText(file.path);
    } catch (err: any) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new Error(`PDF Processing Error: ${err.message}`);
    }

    // Delete prior resume document and file if exists
    const priorResume = await Resume.findOne({ candidate: candidate._id });
    if (priorResume) {
      if (fs.existsSync(priorResume.filePath)) {
        try {
          fs.unlinkSync(priorResume.filePath);
        } catch (e) {
          console.error('Failed to unlink old resume:', e);
        }
      }
      await Resume.findByIdAndDelete(priorResume._id);
    }

    const resumeDoc = new Resume({
      candidate: candidate._id,
      fileName: file.originalname,
      filePath: file.path,
      mimeType: file.mimetype,
      fileSize: file.size,
      extractedText: extracted.text,
    });

    const savedResume = await resumeDoc.save();

    // Link resume reference onto Candidate document
    candidate.resume = savedResume._id as mongoose.Types.ObjectId;
    await candidate.save();

    return savedResume;
  }
}
