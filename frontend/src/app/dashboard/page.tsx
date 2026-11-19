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

  return (
    <ProtectedRoute>
      <WorkspaceLayout
        headerAction={
          <Link
            href="/jobs/create"
            className="px-4 py-2 bg-gradient-to-r from-plum via-burgundy to-royal text-white text-xs font-mono font-semibold tracking-wider uppercase rounded-xl shadow-glow-magenta hover:opacity-95 transition flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Position</span>
          </Link>
        }
      >
        <div className="space-y-8">
          {/* Chromatic Hero Banner (Rich Plum & Burgundy composition with Finaura editorial type) */}
          <div className="relative rounded-3xl bg-gradient-to-br from-plum-950 via-burgundy-900 to-royal-dark text-white p-8 sm:p-10 border border-plum-700/50 shadow-luxury-card overflow-hidden">
            {/* Atmospheric light leaks */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-magenta-muted/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-rich/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-magenta-rose text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-lens-cyan animate-pulse" />
                  <span>INTELLIGENCE PULSE • LIVE MONGODB ATLAS</span>
                </div>
                <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1]">
                  Executive recruitment overview & talent vectors.
                </h1>
                <p className="text-xs sm:text-sm text-lavender/80 font-normal leading-relaxed">
                  Real-time pipeline metrics, automated resume text parsing, and Gemini-powered deep claim verification across all enterprise requisitions.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-xs font-mono text-white transition flex items-center gap-2"
                >
                  <svg
                    className={`w-3.5 h-3.5 text-magenta-rose ${loading ? 'animate-spin' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Sync Metrics</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-burgundy-soft border border-burgundy-700/30 rounded-2xl text-xs text-burgundy-950 flex items-center justify-between shadow-sm">
              <span className="font-medium">{error}</span>
              <button onClick={fetchDashboardData} className="font-mono underline text-xs font-bold">
                Retry
              </button>
            </div>
          )}

          {/* Top Tri-Color Executive Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1: Total Candidates (Plum Gradient Surface) */}
            <div className="relative rounded-2xl bg-white/90 backdrop-blur-sm border border-border-luxury p-6 shadow-luxury-subtle overflow-hidden group hover:border-plum-400 transition-all">
              <div className="absolute top-0 right-0 w-28 h-28 bg-plum-100/60 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-plum-900">
                  Talent Directory
                </span>
                <span className="p-2 rounded-xl bg-plum-100 text-plum-900">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="font-editorial text-4xl font-bold text-plum-950 tracking-tight">
                {loading ? '—' : stats?.totalCandidates ?? 0}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-charcoal-600">Active Profiles Ingested</span>
                <Link href="/candidates" className="font-mono text-magenta-muted hover:text-plum font-semibold">
                  View Pool →
                </Link>
              </div>
            </div>

            {/* Metric 2: Active Openings (Burgundy & Rose Gradient Surface) */}
            <div className="relative rounded-2xl bg-white/90 backdrop-blur-sm border border-border-luxury p-6 shadow-luxury-subtle overflow-hidden group hover:border-burgundy-400 transition-all">
              <div className="absolute top-0 right-0 w-28 h-28 bg-magenta-soft/80 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-burgundy-900">
                  Active Requisitions
                </span>
                <span className="p-2 rounded-xl bg-magenta-soft text-burgundy-800">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              <div className="font-editorial text-4xl font-bold text-plum-950 tracking-tight">
                {loading ? '—' : stats?.activeJobs ?? 0}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-charcoal-600">Open for Candidate Ingestion</span>
                <Link href="/jobs" className="font-mono text-magenta-muted hover:text-burgundy font-semibold">
                  Manage Jobs →
                </Link>
              </div>
            </div>

            {/* Metric 3: Total Submissions (Royal Violet Gradient Surface) */}
            <div className="relative rounded-2xl bg-white/90 backdrop-blur-sm border border-border-luxury p-6 shadow-luxury-subtle overflow-hidden group hover:border-royal-light transition-all">
              <div className="absolute top-0 right-0 w-28 h-28 bg-lavender-soft/80 rounded-full blur-xl group-hover:scale-125 transition-transform" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-royal-dark">
                  Applications Pipeline
                </span>
                <span className="p-2 rounded-xl bg-lavender-soft text-royal">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </span>
              </div>
              <div className="font-editorial text-4xl font-bold text-plum-950 tracking-tight">
                {loading ? '—' : stats?.totalApplications ?? 0}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-charcoal-600">Submissions Tracked</span>
                <Link href="/applications" className="font-mono text-magenta-muted hover:text-royal font-semibold">
                  Open Board →
                </Link>
              </div>
            </div>
          </div>

          {/* Pipeline Stage Distribution Card (Multi-stop Synapse / Vaultflow Visualizer) */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-border-luxury p-7 sm:p-8 shadow-luxury-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border-luxury">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-magenta-muted">
                  Pipeline Flow
                </span>
                <h3 className="font-editorial text-2xl font-bold text-plum-950 mt-0.5">
                  Application Stage Dispersion
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-magenta-rose" />
                <span className="font-mono text-xs text-charcoal-600">
                  {stats?.totalApplications ?? 0} Total in Pipeline
                </span>
              </div>
            </div>

            {/* Segmented Gradient Pipeline Bar */}
            {stats && stats.totalApplications > 0 ? (
              <div className="space-y-4">
                <div className="h-4 w-full bg-neutral-tinted rounded-full overflow-hidden flex shadow-inner border border-border-luxury">
                  {stats.statusCounts.applied > 0 && (
                    <div
                      style={{
                        width: `${(stats.statusCounts.applied / stats.totalApplications) * 100}%`,
                      }}
                      className="bg-lavender transition-all"
                      title={`Applied: ${stats.statusCounts.applied}`}
                    />
                  )}
                  {stats.statusCounts.screening > 0 && (
                    <div
                      style={{
                        width: `${(stats.statusCounts.screening / stats.totalApplications) * 100}%`,
                      }}
                      className="bg-royal transition-all"
                      title={`Screening: ${stats.statusCounts.screening}`}
                    />
                  )}
                  {stats.statusCounts.interview > 0 && (
                    <div
                      style={{
                        width: `${(stats.statusCounts.interview / stats.totalApplications) * 100}%`,
                      }}
                      className="bg-magenta-muted transition-all"
                      title={`Interview: ${stats.statusCounts.interview}`}
                    />
                  )}
                  {stats.statusCounts.offered > 0 && (
                    <div
                      style={{
                        width: `${(stats.statusCounts.offered / stats.totalApplications) * 100}%`,
                      }}
                      className="bg-magenta-rose transition-all"
                      title={`Offered: ${stats.statusCounts.offered}`}
                    />
                  )}
                  {stats.statusCounts.rejected > 0 && (
                    <div
                      style={{
                        width: `${(stats.statusCounts.rejected / stats.totalApplications) * 100}%`,
                      }}
                      className="bg-charcoal-600 transition-all"
                      title={`Rejected: ${stats.statusCounts.rejected}`}
                    />
                  )}
                </div>

                {/* Stage Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-neutral-tinted border border-border-luxury">
                    <span className="font-mono text-[10px] uppercase text-charcoal-600 block">Applied</span>
                    <span className="text-lg font-bold text-plum-950 font-mono">
                      {stats.statusCounts.applied}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-royal-soft border border-royal/20">
                    <span className="font-mono text-[10px] uppercase text-royal block">Screening</span>
                    <span className="text-lg font-bold text-royal font-mono">
                      {stats.statusCounts.screening}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-magenta-soft border border-magenta-muted/20">
                    <span className="font-mono text-[10px] uppercase text-magenta-muted block">Interview</span>
                    <span className="text-lg font-bold text-magenta-muted font-mono">
                      {stats.statusCounts.interview}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-champagne-whisper border border-champagne/40">
                    <span className="font-mono text-[10px] uppercase text-charcoal-800 block">Offered</span>
                    <span className="text-lg font-bold text-burgundy font-mono">
                      {stats.statusCounts.offered}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-tinted border border-border-luxury">
                    <span className="font-mono text-[10px] uppercase text-charcoal-600 block">Archived</span>
                    <span className="text-lg font-bold text-charcoal-700 font-mono">
                      {stats.statusCounts.rejected}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs font-mono text-charcoal-600">
                No pipeline submissions recorded yet. Create an application to activate stage flow analytics.
              </div>
            )}
          </div>

          {/* Active Vacancies Directory Showcase */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-border-luxury p-7 sm:p-8 shadow-luxury-subtle space-y-6">
            <div className="flex items-center justify-between pb-5 border-b border-border-luxury">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-magenta-muted">
                  Position Specs
                </span>
                <h3 className="font-editorial text-2xl font-bold text-plum-950 mt-0.5">
                  Priority Requisitions
                </h3>
              </div>
              <Link
                href="/jobs"
                className="font-mono text-xs font-semibold text-magenta-muted hover:text-plum transition-colors"
              >
                All Openings ({recentJobs.length}) →
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs font-mono text-charcoal-600 mb-3">No active positions currently posted.</p>
                <Link
                  href="/jobs/create"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-plum to-burgundy text-white text-xs font-mono uppercase font-semibold rounded-xl shadow-glow-magenta"
                >
                  Post First Opening
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-5 rounded-2xl bg-neutral-tinted/60 hover:bg-neutral-tinted border border-border-luxury hover:border-plum-400 transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/jobs/${job._id}`}
                          className="font-bold text-sm text-plum-950 group-hover:text-magenta-muted transition-colors leading-snug"
                        >
                          {job.title}
                        </Link>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-plum-900 border border-border-luxury">
                          {job.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-600 line-clamp-2 mt-2 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border-luxury/70 flex items-center justify-between text-[11px] font-mono text-charcoal-600">
                      <span>{job.experienceMin}-{job.experienceMax} Years Exp</span>
                      <Link
                        href={`/jobs/${job._id}`}
                        className="font-semibold text-plum-900 hover:text-magenta-vivid flex items-center gap-1"
                      >
                        Inspect Specifications →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
