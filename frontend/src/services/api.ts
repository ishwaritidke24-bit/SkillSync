import { ApiResponse, AuthResponse, User } from '../types/auth';
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
}
