import {
  ApiResponse,
  AuthResponse,
  User,
  Job,
  CreateJobPayload,
  UpdateJobPayload,
  Candidate,
  CreateCandidatePayload,
  UpdateCandidatePayload,
  Application,
  CreateApplicationPayload,
  ApplicationStatus,
  ScreeningResult,
  InterviewQuestion,
} from '../types';
import { getAuthToken } from '../lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  }

  // --- Auth APIs ---
  static async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/auth/me', {
      method: 'GET',
    });
  }

  static async verifyProtected(roleTestEndpoint?: string): Promise<ApiResponse<any>> {
    const path = roleTestEndpoint ? `/protected/${roleTestEndpoint}` : '/protected/authenticated';
    return this.request<ApiResponse<any>>(path, {
      method: 'GET',
    });
  }

  // --- Job Management APIs ---
  static async getJobs(status?: string): Promise<ApiResponse<Job[]>> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request<ApiResponse<Job[]>>(`/jobs${query}`, {
      method: 'GET',
    });
  }

  static async getJobById(id: string): Promise<ApiResponse<Job>> {
    return this.request<ApiResponse<Job>>(`/jobs/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  }

  static async createJob(payload: CreateJobPayload): Promise<ApiResponse<Job>> {
    return this.request<ApiResponse<Job>>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async updateJob(id: string, payload: UpdateJobPayload): Promise<ApiResponse<Job>> {
    return this.request<ApiResponse<Job>>(`/jobs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  static async deactivateJob(id: string): Promise<ApiResponse<Job>> {
    return this.request<ApiResponse<Job>>(`/jobs/${encodeURIComponent(id)}/deactivate`, {
      method: 'PATCH',
    });
  }

  // --- Candidate Management APIs ---
  static async getCandidates(params?: {
    search?: string;
    skill?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Candidate[]>> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.skill) query.append('skill', params.skill);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<ApiResponse<Candidate[]>>(`/candidates${qs}`, {
      method: 'GET',
    });
  }

  static async getCandidateById(id: string): Promise<
    ApiResponse<{
      candidate: Candidate;
      resume: any;
      applications: Application[];
    }>
  > {
    return this.request(`/candidates/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  }

  static async createCandidate(payload: CreateCandidatePayload): Promise<ApiResponse<Candidate>> {
    return this.request<ApiResponse<Candidate>>('/candidates', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async updateCandidate(id: string, payload: UpdateCandidatePayload): Promise<ApiResponse<Candidate>> {
    return this.request<ApiResponse<Candidate>>(`/candidates/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  static async deleteCandidate(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/candidates/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  static async uploadResume(candidateId: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('resume', file);

    return this.request<ApiResponse<any>>(`/candidates/${encodeURIComponent(candidateId)}/resume`, {
      method: 'POST',
      body: formData,
    });
  }

  // --- Application Management APIs ---
  static async getApplications(params?: {
    status?: string;
    jobId?: string;
    candidateId?: string;
  }): Promise<ApiResponse<Application[]>> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.jobId) query.append('jobId', params.jobId);
    if (params?.candidateId) query.append('candidateId', params.candidateId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<ApiResponse<Application[]>>(`/applications${qs}`, {
      method: 'GET',
    });
  }

  static async getApplicationById(id: string): Promise<ApiResponse<Application>> {
    return this.request<ApiResponse<Application>>(`/applications/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  }

  static async createApplication(payload: CreateApplicationPayload): Promise<ApiResponse<Application>> {
    return this.request<ApiResponse<Application>>('/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<ApiResponse<Application>> {
    return this.request<ApiResponse<Application>>(`/applications/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // --- AI Resume Screening & Interview Question APIs (Phase 4) ---
  static async screenApplication(applicationId: string): Promise<ApiResponse<ScreeningResult>> {
    return this.request<ApiResponse<ScreeningResult>>(`/screening/${encodeURIComponent(applicationId)}/screen`, {
      method: 'POST',
    });
  }

  static async getScreeningResult(applicationId: string): Promise<ApiResponse<ScreeningResult>> {
    return this.request<ApiResponse<ScreeningResult>>(`/screening/${encodeURIComponent(applicationId)}/result`, {
      method: 'GET',
    });
  }

  static async generateQuestions(applicationId: string): Promise<ApiResponse<InterviewQuestion>> {
    return this.request<ApiResponse<InterviewQuestion>>(`/screening/${encodeURIComponent(applicationId)}/questions`, {
      method: 'POST',
    });
  }

  static async getInterviewQuestions(applicationId: string): Promise<ApiResponse<InterviewQuestion>> {
    return this.request<ApiResponse<InterviewQuestion>>(`/screening/${encodeURIComponent(applicationId)}/questions`, {
      method: 'GET',
    });
  }
}
