'use client';

import { useState } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { ApiService } from '../../services/api';

export default function DashboardLanding() {
  const { user, logout } = useAuth();
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState<boolean>(false);

  const testEndpoint = async (endpoint: string) => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await ApiService.verifyProtected(endpoint);
      setTestResult(`Success (200): ${res.message}`);
    } catch (err: any) {
      setTestResult(`Error: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-lg text-slate-900">SkillSync</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-teal-100 text-teal-800">
                Phase 1 Auth Verification
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email} • <span className="font-semibold text-teal-700">{user?.role}</span></p>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Authenticated Session Verified</h1>
            <p className="text-sm text-slate-600">
              You are currently logged in with JWT authentication and active session state.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account ID</span>
                <p className="font-mono text-sm text-slate-800 mt-1 truncate">{user?.id}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Role</span>
                <p className="text-sm font-semibold text-teal-700 mt-1">{user?.role}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                <p className="text-sm font-medium text-emerald-600 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active & Verified
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-2">Role-Based Access Control Verification</h2>
            <p className="text-sm text-slate-600 mb-4">
              Click the actions below to verify that Express role middleware allows or rejects requests according to your active role (<span className="font-semibold text-teal-700">{user?.role}</span>).
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => testEndpoint('authenticated')}
                disabled={testing}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
              >
                Test Authenticated Route
              </button>
              <button
                onClick={() => testEndpoint('admin-only')}
                disabled={testing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Test Admin-Only Route
              </button>
              <button
                onClick={() => testEndpoint('recruiter-only')}
                disabled={testing}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
              >
                Test Recruiter-Only Route
              </button>
            </div>

            {testing && (
              <p className="text-xs text-slate-500 animate-pulse">Running authorization check...</p>
            )}

            {testResult && (
              <div className={`p-4 rounded-lg text-sm font-mono border ${
                testResult.startsWith('Success')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {testResult}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
