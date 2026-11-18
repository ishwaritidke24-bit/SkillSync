'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { ApiService } from '../../services/api';
import { Job } from '../../types';

export default function DashboardLanding() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState<boolean>(false);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        setJobsLoading(true);
        const res = await ApiService.getJobs();
        if (res.data) {
          setRecentJobs(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load recent jobs:', err);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchRecentJobs();
  }, []);

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
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 mb-1">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-sm text-slate-600">
                  You are signed in as <span className="font-semibold text-teal-700">{user?.role}</span> with full recruitment management access.
                </p>
              </div>

              <Link
                href="/jobs/create"
                className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium shadow-sm transition gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Post Job Opening
              </Link>
            </div>

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
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Management</span>
                <Link href="/jobs" className="text-sm font-medium text-teal-600 hover:underline mt-1 flex items-center gap-1">
                  View All Openings →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Access to Recent Jobs */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Recent Job Openings</h2>
                <p className="text-xs text-slate-500">Live positions stored in MongoDB</p>
              </div>
              <Link href="/jobs" className="text-xs font-medium text-teal-600 hover:underline">
                Manage all jobs
              </Link>
            </div>

            {jobsLoading && (
              <p className="text-xs text-slate-500">Loading positions...</p>
            )}

            {!jobsLoading && recentJobs.length === 0 && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <p className="text-sm text-slate-600">No jobs created yet.</p>
                <Link href="/jobs/create" className="text-xs font-semibold text-teal-600 hover:underline mt-1 inline-block">
                  + Create your first job
                </Link>
              </div>
            )}

            {!jobsLoading && recentJobs.length > 0 && (
              <div className="space-y-3">
                {recentJobs.map((j) => (
                  <div key={j._id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <Link href={`/jobs/${j._id}`} className="font-semibold text-sm text-slate-900 hover:text-teal-600">
                        {j.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Experience: {j.experienceMin}–{j.experienceMax} years • Status: <span className="capitalize font-medium text-slate-700">{j.status}</span>
                      </p>
                    </div>
                    <Link
                      href={`/jobs/${j._id}`}
                      className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role Check Verification Tool */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-2">Role-Based Access Verification</h2>
            <p className="text-sm text-slate-600 mb-4">
              Test Express authentication & authorization middleware endpoints with your active role (<span className="font-semibold text-teal-700">{user?.role}</span>).
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
