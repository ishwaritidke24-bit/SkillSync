import { ApiResponse, AuthResponse, User, Job, CreateJobPayload, UpdateJobPayload } from '../types';
import { getAuthToken } from '../lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

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
}
