'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types/auth';
import { ApiService } from '../services/api';
import { getAuthToken, setAuthToken, removeAuthToken } from '../lib/utils';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await ApiService.getCurrentUser();
      if (res.data) {
        setUser(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load user session:', err);
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.login(email, password);
      if (response.data?.token) {
        setAuthToken(response.data.token);
        setUser(response.data.user);
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser: loadUser,
  };
}
