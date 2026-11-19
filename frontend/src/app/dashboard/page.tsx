'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { WorkspaceLayout } from '../../components/WorkspaceLayout';
import { ApiService } from '../../services/api';
import { DashboardStats, Job } from '../../types';

export default function DashboardPage() {
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
        setRecentJobs(jobsRes.data.slice(0, 4));
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
      <WorkspaceLayout
        headerAction={
          <Link
            href="/jobs/create"
            className="px-3.5 py-1.5 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-subtle transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Post Opening</span>
          </Link>
        }
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-neutral pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Workspace Overview
              </span>
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mt-1">
                Your recruitment overview.
              </h1>
              <p className="text-sm text-text-secondary mt-1 max-w-xl">
                Active hiring pipeline metrics, live vacancies, and candidate evaluations powered by MongoDB Atlas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="px-3 py-1.5 border border-border-neutral rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary bg-surface hover:bg-canvas transition flex items-center gap-1.5"
              >
                <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-soft-coral border border-coral/30 rounded-2xl text-sm text-red-800 flex items-center justify-between shadow-subtle">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
              <button onClick={fetchDashboardData} className="text-xs font-semibold underline text-red-900">
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-text-secondary mt-4">
                Loading recruitment intelligence...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && isEmpty && (
            <div className="text-center py-20 bg-surface rounded-2xl border border-border-neutral shadow-subtle p-8">
              <div className="w-14 h-14 rounded-2xl bg-canvas text-brand mx-auto flex items-center justify-center mb-4 border border-border-neutral">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary">No recruitment activity detected</h3>
              <p className="text-sm text-text-secondary mt-1.5 max-w-sm mx-auto">
                Begin by posting a position or registering candidate profiles into the database.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href="/jobs/create"
                  className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-subtle transition"
                >
                  Post First Vacancy
                </Link>
                <Link
                  href="/candidates/add"
                  className="px-4 py-2 bg-surface hover:bg-canvas border border-border-neutral text-text-primary text-xs font-semibold rounded-xl transition"
                >
                  Register Candidate
                </Link>
              </div>
            </div>
          )}

          {/* Active Dashboard */}
          {!loading && !error && stats && !isEmpty && (
            <div className="space-y-8">
              {/* Metric Hero Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Candidates */}
                <div className="bg-surface rounded-2xl border border-border-neutral p-6 shadow-subtle relative overflow-hidden group hover:border-brand/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Talent Pool
                    </span>
                    <span className="p-2 rounded-xl bg-soft-mint text-emerald-800">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-4xl font-extrabold text-text-primary tracking-tight mt-4">
                    {stats.totalCandidates}
                  </p>
                  <div className="mt-3 pt-3 border-t border-border-neutral flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Profiles in database</span>
                    <Link href="/candidates" className="text-xs font-semibold text-brand hover:underline">
                      Explore talent →
                    </Link>
                  </div>
                </div>

                {/* Active Jobs */}
                <div className="bg-surface rounded-2xl border border-border-neutral p-6 shadow-subtle relative overflow-hidden group hover:border-brand/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Active Openings
                    </span>
                    <span className="p-2 rounded-xl bg-soft-violet text-brand">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-4xl font-extrabold text-text-primary tracking-tight mt-4">
                    {stats.activeJobs}
                  </p>
                  <div className="mt-3 pt-3 border-t border-border-neutral flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Live vacancies</span>
                    <Link href="/jobs" className="text-xs font-semibold text-brand hover:underline">
                      Manage jobs →
                    </Link>
                  </div>
                </div>

                {/* Total Applications */}
                <div className="bg-surface rounded-2xl border border-border-neutral p-6 shadow-subtle relative overflow-hidden group hover:border-brand/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Total Applications
                    </span>
                    <span className="p-2 rounded-xl bg-canvas text-text-primary">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-4xl font-extrabold text-text-primary tracking-tight mt-4">
                    {stats.totalApplications}
                  </p>
                  <div className="mt-3 pt-3 border-t border-border-neutral flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Linked submissions</span>
                    <Link href="/applications" className="text-xs font-semibold text-brand hover:underline">
                      Review pipeline →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recruitment Pipeline Breakdown */}
              <div className="bg-surface rounded-2xl border border-border-neutral p-6 sm:p-8 shadow-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-border-neutral pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">
                      Recruitment Pipeline Stages
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Distribution of applications across five independent qualification stages
                    </p>
                  </div>
                  <Link
                    href="/applications"
                    className="text-xs font-semibold text-brand hover:underline self-start sm:self-auto"
                  >
                    View All Applications →
                  </Link>
                </div>

                {/* Segmented Pipeline Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {/* Applied */}
                  <div className="p-4 bg-canvas/60 rounded-xl border border-border-neutral">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                        Applied
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-text-primary">
                      {stats.statusCounts.applied}
                    </p>
                    <span className="text-[10px] text-text-secondary">Initial Inflow</span>
                  </div>

                  {/* Screening */}
                  <div className="p-4 bg-soft-violet/50 rounded-xl border border-brand/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                        Screening
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-brand">
                      {stats.statusCounts.screening}
                    </p>
                    <span className="text-[10px] text-brand/80">AI Evidence Lens</span>
                  </div>

                  {/* Interview */}
                  <div className="p-4 bg-canvas/60 rounded-xl border border-border-neutral">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                        Interview
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-text-primary">
                      {stats.statusCounts.interview}
                    </p>
                    <span className="text-[10px] text-text-secondary">Active Dialog</span>
                  </div>

                  {/* Offered */}
                  <div className="p-4 bg-soft-mint/60 rounded-xl border border-emerald-200/60">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                        Offered
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-emerald-950">
                      {stats.statusCounts.offered}
                    </p>
                    <span className="text-[10px] text-emerald-800">Proposal Stage</span>
                  </div>

                  {/* Rejected */}
                  <div className="p-4 bg-canvas/60 rounded-xl border border-border-neutral">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                        Closed
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-text-primary">
                      {stats.statusCounts.rejected}
                    </p>
                    <span className="text-[10px] text-text-secondary">Not Proceeding</span>
                  </div>
                </div>
              </div>

              {/* Active Openings Quick Access Preview */}
              <div className="bg-surface rounded-2xl border border-border-neutral p-6 sm:p-8 shadow-subtle">
                <div className="flex items-center justify-between mb-5 border-b border-border-neutral pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">
                      Live Openings Preview
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Recruitment positions currently accepting applications
                    </p>
                  </div>
                  <Link href="/jobs" className="text-xs font-semibold text-brand hover:underline">
                    View all {stats.activeJobs} positions →
                  </Link>
                </div>

                {recentJobs.length === 0 ? (
                  <p className="text-xs text-text-secondary italic">No active positions currently available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentJobs.map((j) => (
                      <div
                        key={j._id}
                        className="p-5 bg-canvas/40 hover:bg-canvas rounded-xl border border-border-neutral transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link href={`/jobs/${j._id}`} className="font-bold text-base text-text-primary hover:text-brand transition">
                              {j.title}
                            </Link>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-soft-mint text-emerald-800 border border-emerald-200">
                              Active
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary mt-1">
                            Experience: {j.experienceMin} – {j.experienceMax} years
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {j.requiredSkills.slice(0, 4).map((sk, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-surface border border-border-neutral rounded-md text-[11px] font-medium text-text-secondary">
                                {sk}
                              </span>
                            ))}
                            {j.requiredSkills.length > 4 && (
                              <span className="text-[11px] text-text-tertiary self-center">
                                +{j.requiredSkills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border-neutral/60 flex items-center justify-between text-xs text-text-secondary">
                          <span>Posted {new Date(j.createdAt).toLocaleDateString()}</span>
                          <Link href={`/jobs/${j._id}`} className="font-semibold text-brand hover:underline">
                            Inspect Opening →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
