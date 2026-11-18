export type UserRole = 'Admin' | 'Recruiter';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}

export type JobStatus = 'active' | 'deactivated';

export interface Job {
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  requiredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  status?: JobStatus;
}

export interface UpdateJobPayload {
  title?: string;
  description?: string;
  requiredSkills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  status?: JobStatus;
}

// --- Candidate & Resume Types ---

export interface ResumeMeta {
  _id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  extractedText?: string;
  createdAt: string;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
  resume?: ResumeMeta | string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCandidatePayload {
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
}

export interface UpdateCandidatePayload {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experienceYears?: number;
}

// --- Application Types ---

export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offered' | 'rejected';

export interface Application {
  _id: string;
  candidate: Candidate;
  job: Job;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationPayload {
  candidateId: string;
  jobId: string;
  status?: ApplicationStatus;
}

// --- AI Screening & Interview Question Types ---

export interface ScreeningResult {
  _id: string;
  application: string;
  matchingSkills: string[];
  missingSkills: string[];
  experienceAnalysis: string;
  explanation: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestionItem {
  question: string;
  category: string;
  context?: string;
}

export interface InterviewQuestion {
  _id: string;
  application: string;
  questions: InterviewQuestionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  count?: number;
  pagination?: PaginationMeta;
  data?: T;
}
