'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { ApiService } from '../../services/api';
import { DashboardStats, Job } from '../../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, jobsRes] = await Promise.all([
        ApiService.getDashboardStats(),
        ApiService.getJobs('active'),
      ]);
      if (statsRes.data) {
        setStats(statsRes.data);
      }
      if (jobsRes.data) {
        setRecentJobs(jobsRes.data.slice(0, 3));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load recruitment dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const isEmpty =
    stats &&
    stats.totalCandidates === 0 &&
    stats.activeJobs === 0 &&
    stats.totalApplications === 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Recruitment Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Overview of jobs, candidate talent pool, applications, and pipeline stages.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/jobs/create"
                className="inline-flex items-center justify-center px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Post Job
              </Link>
              <Link
                href="/candidates/add"
                className="inline-flex items-center justify-center px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add Candidate
              </Link>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
              <button onClick={fetchDashboardData} className="text-xs font-semibold underline text-red-800">
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 mt-4">Retrieving recruitment metrics from MongoDB Atlas...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && isEmpty && (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">No recruitment activity yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Get started by creating your first job posting or adding a candidate profile.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Link
                  href="/jobs/create"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Post First Job
                </Link>
                <Link
                  href="/candidates/add"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Add Candidate
                </Link>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && !error && stats && !isEmpty && (
            <div className="space-y-6">
              {/* Primary Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Total Candidates */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Candidates
                    </span>
                    <span className="p-2 rounded-lg bg-teal-50 text-teal-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900 mt-3">{stats.totalCandidates}</p>
                  <Link href="/candidates" className="text-xs font-medium text-teal-600 hover:underline mt-2 inline-block">
                    View candidate talent pool →
                  </Link>
                </div>

                {/* Active Jobs */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Active Jobs
                    </span>
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900 mt-3">{stats.activeJobs}</p>
                  <Link href="/jobs" className="text-xs font-medium text-indigo-600 hover:underline mt-2 inline-block">
                    Manage job postings →
                  </Link>
                </div>

                {/* Total Applications */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Applications
                    </span>
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900 mt-3">{stats.totalApplications}</p>
                  <Link href="/applications" className="text-xs font-medium text-emerald-600 hover:underline mt-2 inline-block">
                    Review applications →
                  </Link>
                </div>
              </div>

              {/* Application Status Pipeline Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Application Status Counts</h2>
                    <p className="text-xs text-slate-500">Breakdown of applications across recruitment stages</p>
                  </div>
                  <Link href="/applications" className="text-xs font-semibold text-teal-600 hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {/* Applied */}
                  <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl">
                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">
                      Applied
                    </span>
                    <p className="text-2xl font-extrabold text-blue-900 mt-1">{stats.statusCounts.applied}</p>
                  </div>

                  {/* Screening */}
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
                      Screening
                    </span>
                    <p className="text-2xl font-extrabold text-amber-900 mt-1">{stats.statusCounts.screening}</p>
                  </div>

                  {/* Interview */}
                  <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block">
                      Interview
                    </span>
                    <p className="text-2xl font-extrabold text-indigo-900 mt-1">{stats.statusCounts.interview}</p>
                  </div>

                  {/* Offered */}
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                      Offered
                    </span>
                    <p className="text-2xl font-extrabold text-emerald-900 mt-1">{stats.statusCounts.offered}</p>
                  </div>

                  {/* Rejected */}
                  <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl">
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                      Rejected
                    </span>
                    <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.statusCounts.rejected}</p>
                  </div>
                </div>
              </div>

              {/* Active Openings Quick Access */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Active Job Positions</h2>
                    <p className="text-xs text-slate-500">Latest active vacancies stored in MongoDB</p>
                  </div>
                  <Link href="/jobs" className="text-xs font-semibold text-teal-600 hover:underline">
                    View all {stats.activeJobs} jobs →
                  </Link>
                </div>

                {recentJobs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No active positions found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {recentJobs.map((j) => (
                      <div key={j._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <Link href={`/jobs/${j._id}`} className="font-bold text-sm text-slate-900 hover:text-teal-600">
                            {j.title}
                          </Link>
                          <p className="text-xs text-slate-500 mt-1">
                            Experience: {j.experienceMin}–{j.experienceMax} years
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {j.requiredSkills.slice(0, 3).map((sk, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-medium">
                                {sk}
                              </span>
                            ))}
                            {j.requiredSkills.length > 3 && (
                              <span className="text-[10px] text-slate-400 self-center">+{j.requiredSkills.length - 3}</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            Posted {new Date(j.createdAt).toLocaleDateString()}
                          </span>
                          <Link href={`/jobs/${j._id}`} className="text-xs font-semibold text-teal-700 hover:underline">
                            Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
