'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { WorkspaceLayout } from '../../components/WorkspaceLayout';
import { ApiService } from '../../services/api';
import { Application, ApplicationStatus, Job, Candidate } from '../../types';

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const initialCandidateId = searchParams.get('candidateId') || '';

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View switch: table vs pipeline cards
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table');

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [candidateFilter, setCandidateFilter] = useState<string>(initialCandidateId);

  // New application form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ApiService.getApplications({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        candidateId: candidateFilter || undefined,
      });
      if (res.data) {
        setApplications(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, candidateFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const loadPrerequisites = async () => {
    try {
      const [jobsRes, candidatesRes] = await Promise.all([
        ApiService.getJobs('active'),
        ApiService.getCandidates({ limit: 100 }),
      ]);
      if (jobsRes.data) setJobs(jobsRes.data);
      if (candidatesRes.data) setCandidates(candidatesRes.data);
    } catch (err) {
      console.error('Failed to load prerequisites:', err);
    }
  };

  const handleOpenModal = () => {
    loadPrerequisites();
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId) {
      setFormError('Please select a candidate');
      return;
    }
    if (!selectedJobId) {
      setFormError('Please select an active job opening');
      return;
    }

    setCreating(true);
    setFormError(null);
    try {
      await ApiService.createApplication({
        candidateId: selectedCandidateId,
        jobId: selectedJobId,
        status: 'applied',
      });
      setIsModalOpen(false);
      setSelectedCandidateId('');
      setSelectedJobId('');
      fetchApplications();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create application');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      setUpdatingId(appId);
      await ApiService.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses: ApplicationStatus[] = ['applied', 'screening', 'interview', 'offered', 'rejected'];

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'offered':
        return 'bg-champagne-whisper text-burgundy-950 border-champagne/40';
      case 'rejected':
        return 'bg-burgundy-soft text-burgundy border-burgundy/30';
      case 'interview':
        return 'bg-magenta-soft text-magenta-vivid border-magenta-muted/30';
      case 'screening':
        return 'bg-royal-soft text-royal border-royal/30';
      case 'applied':
      default:
        return 'bg-neutral-tinted text-charcoal-700 border-border-luxury';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-luxury">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-plum-950">
              Pipeline Submissions.
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-plum-100 text-plum-900 border border-plum-200">
              {applications.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Track candidate pipeline flow, update hiring stages, and enter the cinematic Evidence Lens for AI screening.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center bg-white/90 p-1.5 rounded-2xl border border-border-luxury shadow-luxury-subtle">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-plum to-burgundy text-white shadow-sm font-semibold'
                  : 'text-charcoal-600 hover:text-plum-950'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Table
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'pipeline'
                  ? 'bg-gradient-to-r from-plum to-burgundy text-white shadow-sm font-semibold'
                  : 'text-charcoal-600 hover:text-plum-950'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Pipeline
            </button>
          </div>

          <button
            onClick={handleOpenModal}
            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-plum via-burgundy to-royal text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-xl shadow-glow-magenta hover:opacity-95 transition gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Application
          </button>
        </div>
      </div>

      {/* Control Bar: Filter Pills & Candidate Filter */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-border-luxury shadow-luxury-subtle flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-magenta-muted mr-1">Stage:</span>
          <div className="flex flex-wrap items-center gap-1 bg-neutral-tinted p-1 rounded-xl">
            {['all', ...statuses].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-gradient-to-r from-plum to-burgundy text-white shadow-2xs font-bold'
                    : 'text-charcoal-600 hover:text-plum-950'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {candidateFilter && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-plum-900 bg-plum-100 px-3 py-1 rounded-lg border border-plum-200 font-mono">
              Filtered by candidate ID
            </span>
            <button
              onClick={() => setCandidateFilter('')}
              className="text-xs font-mono font-semibold text-magenta-muted hover:text-plum underline"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-burgundy-soft border border-burgundy-700/30 rounded-xl text-xs text-burgundy-950">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-24 flex flex-col items-center justify-center bg-white/80 rounded-3xl border border-border-luxury shadow-luxury-subtle">
          <div className="w-10 h-10 border-2 border-plum-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-charcoal-600 mt-4">Retrieving active submissions from pipeline...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-20 bg-white/80 rounded-3xl border border-border-luxury shadow-luxury-subtle p-8">
          <div className="w-12 h-12 rounded-2xl bg-neutral-tinted text-plum flex items-center justify-center mx-auto mb-3 border border-border-luxury">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-editorial text-2xl font-bold text-plum-950">No applications found</h3>
          <p className="text-xs text-charcoal-600 mt-1 max-w-sm mx-auto font-mono">
            {statusFilter !== 'all'
              ? `There are no candidate applications currently in "${statusFilter}" status.`
              : 'Link a candidate profile with an active job vacancy to begin the screening pipeline.'}
          </p>
          <div className="mt-5">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-plum to-burgundy text-white text-xs font-mono uppercase font-semibold rounded-xl shadow-glow-magenta"
            >
              Create First Application
            </button>
          </div>
        </div>
      )}

      {/* View Mode 1: Dense Editorial Table */}
      {!loading && !error && applications.length > 0 && viewMode === 'table' && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury shadow-luxury-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-luxury">
              <thead className="bg-neutral-tinted/70 text-charcoal-600 text-[10px] font-mono uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-4">Candidate Dossier</th>
                  <th className="px-6 py-4">Target Opening</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Hiring Stage</th>
                  <th className="px-6 py-4 text-right">Cinematic Intelligence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-luxury/60 text-xs">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-neutral-tinted/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/candidates/${app.candidate?._id}`}
                        className="font-bold text-plum-950 hover:text-magenta-vivid transition-colors"
                      >
                        {app.candidate?.name || 'Unknown Candidate'}
                      </Link>
                      <p className="text-[11px] text-charcoal-600 font-mono mt-0.5">{app.candidate?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/jobs/${app.job?._id}`}
                        className="font-semibold text-plum-950 hover:text-magenta-vivid transition-colors"
                      >
                        {app.job?.title || 'Unknown Position'}
                      </Link>
                      <span className="text-[11px] text-charcoal-600 block font-mono mt-0.5">
                        Experience: {app.job?.experienceMin}-{app.job?.experienceMax} yrs
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[11px] font-mono text-charcoal-600">
                      {new Date(app.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={app.status}
                        disabled={updatingId === app._id}
                        onChange={(e) => handleStatusChange(app._id, e.target.value as ApplicationStatus)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-mono font-semibold uppercase cursor-pointer disabled:opacity-50 transition-colors ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st} className="bg-white text-plum-950 font-normal">
                            {st.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/applications/${app._id}`}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-plum-950 via-burgundy-900 to-royal-dark hover:from-plum-900 hover:to-burgundy-800 text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-xl shadow-glow-magenta transition-all group border border-plum-700/50"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-lens-cyan group-hover:scale-125 transition-transform"></span>
                        Enter Lens
                        <span className="text-magenta-rose group-hover:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Mode 2: Multi-Column Pipeline Board */}
      {!loading && !error && applications.length > 0 && viewMode === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statuses.map((st) => {
            const list = applications.filter((a) => a.status === st);
            return (
              <div key={st} className="bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury p-4 shadow-luxury-subtle flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-border-luxury mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-plum-950">{st}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-neutral-tinted text-charcoal-700">
                      {list.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {list.length === 0 ? (
                    <div className="py-8 text-center text-[11px] font-mono text-charcoal-600/70 italic">
                      Empty stage
                    </div>
                  ) : (
                    list.map((app) => (
                      <div
                        key={app._id}
                        className="p-3.5 bg-neutral-tinted/60 hover:bg-neutral-tinted rounded-2xl border border-border-luxury hover:border-plum-400 transition-all flex flex-col gap-2"
                      >
                        <div>
                          <Link
                            href={`/candidates/${app.candidate?._id}`}
                            className="text-xs font-bold text-plum-950 hover:text-magenta-vivid block truncate"
                          >
                            {app.candidate?.name || 'Candidate'}
                          </Link>
                          <span className="text-[11px] font-mono text-charcoal-600 block truncate">
                            {app.job?.title || 'Position'}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-border-luxury flex items-center justify-between text-[11px]">
                          <select
                            value={app.status}
                            disabled={updatingId === app._id}
                            onChange={(e) => handleStatusChange(app._id, e.target.value as ApplicationStatus)}
                            className="text-[10px] uppercase font-mono font-semibold bg-white border border-border-luxury rounded-lg px-2 py-0.5 text-charcoal-700"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <Link
                            href={`/applications/${app._id}`}
                            className="font-mono font-semibold text-magenta-muted hover:text-plum"
                          >
                            Lens →
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-luxury-elevated border border-border-luxury animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-luxury">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-plum-950">Link New Application</h3>
                <p className="text-xs text-charcoal-600 font-mono">Associate a candidate with an active vacancy</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg text-charcoal-600 hover:text-plum-950 hover:bg-neutral-tinted flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 bg-burgundy-soft border border-burgundy-700/30 rounded-xl text-xs text-burgundy-950">
                  {formError}
                </div>
              )}

              {/* Candidate selector */}
              <div>
                <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
                  Candidate Profile *
                </label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-tinted border border-border-luxury rounded-xl text-plum-950 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
                >
                  <option value="">-- Choose Candidate --</option>
                  {candidates.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Job selector */}
              <div>
                <label className="block font-mono text-[10px] uppercase font-bold tracking-wider text-charcoal-600 mb-1.5">
                  Target Opening *
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-tinted border border-border-luxury rounded-xl text-plum-950 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
                >
                  <option value="">-- Choose Open Job --</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title} ({j.experienceMin}-{j.experienceMax} yrs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border-luxury">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-semibold text-charcoal-600 hover:bg-neutral-tinted rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-gradient-to-r from-plum to-burgundy hover:opacity-95 text-white text-xs font-mono font-semibold rounded-xl shadow-glow-magenta transition disabled:opacity-50"
                >
                  {creating ? 'Linking...' : 'Submit to Pipeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <ProtectedRoute>
      <WorkspaceLayout>
        <Suspense
          fallback={
            <div className="py-24 flex flex-col items-center justify-center bg-white/80 rounded-3xl border border-border-luxury shadow-luxury-subtle">
              <div className="w-10 h-10 border-2 border-plum-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-charcoal-600 mt-4">Initializing application dashboard...</p>
            </div>
          }
        >
          <ApplicationsContent />
        </Suspense>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
