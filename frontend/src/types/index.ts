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

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  count?: number;
  data?: T;
}
