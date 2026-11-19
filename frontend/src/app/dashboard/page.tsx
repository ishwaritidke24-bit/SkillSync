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
  const [activeStageFilter, setActiveStageFilter] = useState<string | null>(null);

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

  // Derived intelligence telemetry metrics
  const totalApps = stats?.totalApplications || 0;
  const activeJobsCount = stats?.activeJobs || 0;
  const candidatesCount = stats?.totalCandidates || 0;
  const inScreening = stats?.statusCounts.screening || 0;
  const inInterview = stats?.statusCounts.interview || 0;
  const offersExtended = stats?.statusCounts.offered || 0;

  // Real pipeline velocity calculation
  const qualifiedCandidateRatio = totalApps > 0 
    ? Math.round(((inScreening + inInterview + offersExtended) / totalApps) * 100) 
    : 0;
  const offerConversionRate = totalApps > 0 
    ? Math.round((offersExtended / totalApps) * 100) 
    : 0;

  return (
    <ProtectedRoute>
      <WorkspaceLayout
        headerAction={
          <div className="flex items-center gap-2.5">
            <Link
              href="/applications"
              className="px-3.5 py-2 rounded-xl bg-white/70 hover:bg-white text-plum-950 text-xs font-mono font-semibold border border-plum-300/60 shadow-2xs transition flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-lens-cyan animate-pulse"></span>
              <span>Evidence Lens →</span>
            </Link>
            <Link
              href="/jobs/create"
              className="px-4 py-2 bg-gradient-to-r from-plum via-burgundy to-royal text-white text-xs font-mono font-semibold tracking-wider uppercase rounded-xl shadow-glow-magenta hover:opacity-95 transition flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Position</span>
            </Link>
          </div>
        }
      >
        <div className="space-y-9">
          {/* ZONE 1: Executive Intelligence Hero with Vaultflow Atmospheric Radar Telemetry */}
          <div className="relative rounded-3xl bg-gradient-to-br from-plum-950 via-[#2A1237] to-royal-dark text-white p-8 sm:p-10 border border-plum-700/60 shadow-luxury-elevated overflow-hidden">
            {/* Ambient dynamic atmospheric light leaks */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-magenta-vivid/20 via-violet-rich/15 to-transparent rounded-full blur-3xl pointer-events-none animate-synapse-glow" />
            <div className="absolute -bottom-24 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-burgundy/30 via-royal/20 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-3.5">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-magenta-rose text-xs font-mono shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-lens-cyan animate-pulse shadow-glow-rose" />
                  <span className="font-semibold tracking-wide">EXECUTIVE INTELLIGENCE NEXUS • ATLAS & GEMINI ACTIVE</span>
                </div>
                <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.08]">
                  Talent vectors, claim verification & pipeline velocity.
                </h1>
                <p className="text-xs sm:text-sm text-lavender/85 font-normal leading-relaxed max-w-xl">
                  Synthesizing candidate assertions against job requirement blueprints. Track progression rates, verified claim ratios, and high-confidence interview signals in real time.
                </p>
              </div>

              {/* Integrated AI Telemetry Gauge Block */}
              <div className="flex-shrink-0 grid grid-cols-2 gap-3 bg-plum-950/70 p-4 rounded-2xl border border-plum-700/60 backdrop-blur-md">
                <div className="p-3 rounded-xl bg-plum-900/40 border border-plum-700/40 text-center">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-lavender/70 block mb-0.5">
                    Pipeline Velocity
                  </span>
                  <span className="font-editorial text-2xl font-bold text-lens-cyan">
                    {loading ? '…' : `${qualifiedCandidateRatio}%`}
                  </span>
                  <span className="text-[10px] font-mono text-lavender/50 block mt-0.5">Qualified Rate</span>
                </div>
                <div className="p-3 rounded-xl bg-plum-900/40 border border-plum-700/40 text-center">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-lavender/70 block mb-0.5">
                    Offer Conversion
                  </span>
                  <span className="font-editorial text-2xl font-bold text-magenta-rose">
                    {loading ? '…' : `${offerConversionRate}%`}
                  </span>
                  <span className="text-[10px] font-mono text-lavender/50 block mt-0.5">Closure Ratio</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-plum-700/40 flex items-center justify-between text-[11px] font-mono text-lavender/70">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Live Atlas Sync
                  </span>
                  <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="hover:text-white underline text-[10px] uppercase font-semibold"
                  >
                    Refresh
                  </button>
                </div>
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

          {/* ZONE 2: Chromatic Luxury Coordinated Metric Cards (Hover Lift + Progress Depth) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Talent Directory (Lavender to Soft Violet) */}
            <div className="luxury-hover-lift relative rounded-3xl bg-gradient-to-br from-[#EDE4F5] via-[#E4D5F2] to-[#D5BFEA] border border-plum-300/60 p-7 shadow-luxury-card overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-rich/15 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
              <div className="relative z-10 flex items-center justify-between mb-4">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-plum-900/90">
                  Talent Pool Directory
                </span>
                <span className="p-2.5 rounded-2xl bg-plum-900/10 text-plum-950 border border-plum-900/15 shadow-2xs group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="relative z-10 font-editorial text-5xl font-bold text-plum-950 tracking-tight leading-none mb-1">
                {loading ? '—' : candidatesCount}
              </div>
              <div className="relative z-10 mt-3 pt-3 border-t border-plum-900/15 flex items-center justify-between text-xs font-medium">
                <span className="text-plum-900/80 font-mono text-[11px]">Active Profiles Ingested</span>
                <Link href="/candidates" className="font-mono text-plum-950 hover:text-magenta-vivid font-bold flex items-center gap-1 transition-colors">
                  View Pool →
                </Link>
              </div>
            </div>

            {/* Card 2: Active Requisitions (Muted Rose to Warm Burgundy) */}
            <div className="luxury-hover-lift relative rounded-3xl bg-gradient-to-br from-[#FCE8F0] via-[#F4D1E2] to-[#E9B6CE] border border-burgundy-300/60 p-7 shadow-luxury-card overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-magenta-muted/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
              <div className="relative z-10 flex items-center justify-between mb-4">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-burgundy-950/90">
                  Active Requisitions
                </span>
                <span className="p-2.5 rounded-2xl bg-burgundy-900/10 text-burgundy-950 border border-burgundy-900/15 shadow-2xs group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              <div className="relative z-10 font-editorial text-5xl font-bold text-burgundy-950 tracking-tight leading-none mb-1">
                {loading ? '—' : activeJobsCount}
              </div>
              <div className="relative z-10 mt-3 pt-3 border-t border-burgundy-900/15 flex items-center justify-between text-xs font-medium">
                <span className="text-burgundy-950/80 font-mono text-[11px]">Open Vacancy Specs</span>
                <Link href="/jobs" className="font-mono text-burgundy-950 hover:text-magenta-vivid font-bold flex items-center gap-1 transition-colors">
                  Manage Jobs →
                </Link>
              </div>
            </div>

            {/* Card 3: Applications Pipeline (Soft Plum to Dusty Rose) */}
            <div className="luxury-hover-lift relative rounded-3xl bg-gradient-to-br from-[#EFE5F6] via-[#E7D6F0] to-[#DEC0DF] border border-royal/30 p-7 shadow-luxury-card overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-plum-600/15 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
              <div className="relative z-10 flex items-center justify-between mb-4">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-plum-950/90">
                  Applications Pipeline
                </span>
                <span className="p-2.5 rounded-2xl bg-royal/10 text-royal-dark border border-royal/15 shadow-2xs group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </span>
              </div>
              <div className="relative z-10 font-editorial text-5xl font-bold text-plum-950 tracking-tight leading-none mb-1">
                {loading ? '—' : totalApps}
              </div>
              <div className="relative z-10 mt-3 pt-3 border-t border-plum-900/15 flex items-center justify-between text-xs font-medium">
                <span className="text-plum-900/80 font-mono text-[11px]">Submissions Tracked</span>
                <Link href="/applications" className="font-mono text-plum-950 hover:text-magenta-vivid font-bold flex items-center gap-1 transition-colors">
                  Open Board →
                </Link>
              </div>
            </div>
          </div>

          {/* ZONE 3: Vaultflow Interactive Stage Flow Visualizer (Interactive Filter Pills + Segment Highlight) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1F102B] via-[#2A153A] to-[#25102D] text-white p-8 sm:p-9 border border-plum-700/60 shadow-luxury-elevated relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-magenta-muted/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-96 h-40 bg-royal/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-plum-700/50 mb-6">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-magenta-rose">
                  Interactive Pipeline Dispersion
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-1">
                  Candidate Pipeline Velocity & Stage Mix
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-plum-950/80 px-4 py-1.5 rounded-full border border-plum-700/60 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-magenta-rose animate-pulse" />
                <span className="font-mono text-xs text-lavender font-semibold">
                  {totalApps} Total Active Submissions
                </span>
              </div>
            </div>

            {/* Segmented Gradient Pipeline Bar */}
            {stats && totalApps > 0 ? (
              <div className="relative z-10 space-y-6">
                <div className="h-4 w-full bg-[#140A1C] rounded-full overflow-hidden flex shadow-inner border border-plum-700/60">
                  {stats.statusCounts.applied > 0 && (
                    <div
                      style={{
                        width: `${(stats.statusCounts.applied / totalApps) * 100}%`,
                      }}
                      className={`bg-gradient-to-r from-lavender to-plum-300 transition-all ${
                        activeStageFilter === 'applied' ? 'ring-2 ring-white ring-inset opacity-100' : 'opacity-90'
                      }`}
                      title={`Applied: ${stats.statusCounts.applied}`}
                    />
                  )}
                  {stats.statusCounts.screening > 0 && (
                    <div
                      style={{
                        width: `${(stats.statusCounts.screening / totalApps) * 100}%`,
                      }}
                      className={`bg-gradient-to-r from-royal-light to-violet-rich transition-all ${
                        activeStageFilter === 'screening' ? 'ring-2 ring-white ring-inset opacity-100' : 'opacity-90'
                      }`}
                      title={`Screening: ${stats.statusCounts.screening}`}
                    />
                  )}
                  {stats.statusCounts.interview > 0 && (
                    <div
                      style={{
                        width: `${(stats.statusCounts.interview / totalApps) * 100}%`,
                      }}
                      className={`bg-gradient-to-r from-magenta-muted to-magenta-vivid transition-all ${
                        activeStageFilter === 'interview' ? 'ring-2 ring-white ring-inset opacity-100' : 'opacity-90'
                      }`}
                      title={`Interview: ${stats.statusCounts.interview}`}
                    />
                  )}
                  {stats.statusCounts.offered > 0 && (
                    <div
                      style={{
                        width: `${(stats.statusCounts.offered / totalApps) * 100}%`,
                      }}
                      className={`bg-gradient-to-r from-magenta-rose to-champagne transition-all ${
                        activeStageFilter === 'offered' ? 'ring-2 ring-white ring-inset opacity-100' : 'opacity-90'
                      }`}
                      title={`Offered: ${stats.statusCounts.offered}`}
                    />
                  )}
                  {stats.statusCounts.rejected > 0 && (
                    <div
                      style={{
                        width: `${(stats.statusCounts.rejected / totalApps) * 100}%`,
                      }}
                      className={`bg-charcoal-700 transition-all ${
                        activeStageFilter === 'rejected' ? 'ring-2 ring-white ring-inset opacity-100' : 'opacity-80'
                      }`}
                      title={`Rejected: ${stats.statusCounts.rejected}`}
                    />
                  )}
                </div>

                {/* Stage Badges Grid with Interactive Filter Hover Feedback */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <button
                    onClick={() => setActiveStageFilter(activeStageFilter === 'applied' ? null : 'applied')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      activeStageFilter === 'applied'
                        ? 'bg-plum-900 border-white shadow-glow-violet'
                        : 'bg-plum-950/70 border-plum-700/50 hover:border-plum-500'
                    }`}
                  >
                    <span className="font-mono text-[10px] uppercase text-lavender/70 block">Applied</span>
                    <span className="text-xl font-bold text-white font-mono mt-0.5 block">
                      {stats.statusCounts.applied}
                    </span>
                    <span className="text-[10px] font-mono text-lavender/50 block mt-1">
                      {Math.round((stats.statusCounts.applied / totalApps) * 100)}% of total
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveStageFilter(activeStageFilter === 'screening' ? null : 'screening')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      activeStageFilter === 'screening'
                        ? 'bg-royal border-white shadow-glow-violet'
                        : 'bg-royal-dark/70 border-violet-rich/30 hover:border-violet-rich'
                    }`}
                  >
                    <span className="font-mono text-[10px] uppercase text-lavender block">Screening</span>
                    <span className="text-xl font-bold text-lens-cyan font-mono mt-0.5 block">
                      {stats.statusCounts.screening}
                    </span>
                    <span className="text-[10px] font-mono text-lavender/50 block mt-1">
                      {Math.round((stats.statusCounts.screening / totalApps) * 100)}% of total
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveStageFilter(activeStageFilter === 'interview' ? null : 'interview')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      activeStageFilter === 'interview'
                        ? 'bg-burgundy border-white shadow-glow-magenta'
                        : 'bg-burgundy-950/70 border-magenta-muted/40 hover:border-magenta-muted'
                    }`}
                  >
                    <span className="font-mono text-[10px] uppercase text-magenta-rose block">Interview</span>
                    <span className="text-xl font-bold text-magenta-rose font-mono mt-0.5 block">
                      {stats.statusCounts.interview}
                    </span>
                    <span className="text-[10px] font-mono text-lavender/50 block mt-1">
                      {Math.round((stats.statusCounts.interview / totalApps) * 100)}% of total
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveStageFilter(activeStageFilter === 'offered' ? null : 'offered')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      activeStageFilter === 'offered'
                        ? 'bg-plum-800 border-white shadow-glow-rose'
                        : 'bg-plum-900/60 border-champagne/40 hover:border-champagne'
                    }`}
                  >
                    <span className="font-mono text-[10px] uppercase text-champagne block">Offered</span>
                    <span className="text-xl font-bold text-champagne font-mono mt-0.5 block">
                      {stats.statusCounts.offered}
                    </span>
                    <span className="text-[10px] font-mono text-lavender/50 block mt-1">
                      {Math.round((stats.statusCounts.offered / totalApps) * 100)}% of total
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveStageFilter(activeStageFilter === 'rejected' ? null : 'rejected')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      activeStageFilter === 'rejected'
                        ? 'bg-charcoal-800 border-white shadow-sm'
                        : 'bg-charcoal-950/80 border-charcoal-700 hover:border-charcoal-500'
                    }`}
                  >
                    <span className="font-mono text-[10px] uppercase text-lavender/40 block">Archived</span>
                    <span className="text-xl font-bold text-lavender/60 font-mono mt-0.5 block">
                      {stats.statusCounts.rejected}
                    </span>
                    <span className="text-[10px] font-mono text-lavender/40 block mt-1">
                      {Math.round((stats.statusCounts.rejected / totalApps) * 100)}% of total
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs font-mono text-lavender/60">
                No pipeline submissions recorded yet. Create an application to activate stage flow analytics.
              </div>
            )}
          </div>

          {/* ZONE 4: Requisitions & Priority Openings Section */}
          <div className="rounded-3xl bg-gradient-to-br from-[#F5EEF7] via-[#EFE5F3] to-[#E9DCEE] border border-plum-300/60 p-8 sm:p-9 shadow-luxury-card space-y-6">
            <div className="flex items-center justify-between pb-5 border-b border-plum-300/50">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-plum-900">
                  Requisition Blueprints
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-plum-950 mt-1">
                  Priority Position Specifications
                </h3>
              </div>
              <Link
                href="/jobs"
                className="font-mono text-xs font-bold text-magenta-muted hover:text-plum transition-colors"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="luxury-hover-lift p-6 rounded-2xl bg-white/75 hover:bg-white border border-plum-200/70 hover:border-plum-400 transition-all flex flex-col justify-between gap-4 group shadow-luxury-subtle hover:shadow-luxury-card"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/jobs/${job._id}`}
                          className="font-bold text-sm text-plum-950 group-hover:text-magenta-vivid transition-colors leading-snug"
                        >
                          {job.title}
                        </Link>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-plum-100 text-plum-900 border border-plum-300/60">
                          {job.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-700 line-clamp-2 mt-2 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-plum-200/60 flex items-center justify-between text-[11px] font-mono text-charcoal-600">
                      <span>{job.experienceMin}-{job.experienceMax} Years Exp</span>
                      <Link
                        href={`/jobs/${job._id}`}
                        className="font-bold text-plum-950 hover:text-magenta-vivid flex items-center gap-1"
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
