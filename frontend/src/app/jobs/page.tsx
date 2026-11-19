'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { WorkspaceLayout } from '../../components/WorkspaceLayout';
import { ApiService } from '../../services/api';
import { Job } from '../../types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const fetchJobs = async (filter?: string) => {
    try {
      setLoading(true);
      setError(null);
      const queryStatus = filter && filter !== 'all' ? filter : undefined;
      const res = await ApiService.getJobs(queryStatus);
      if (res.data) {
        setJobs(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(statusFilter);
  }, [statusFilter]);

  const handleDeactivate = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${title}"? The job will be archived and closed to active applications.`
    );
    if (!confirmed) return;

    try {
      setDeactivatingId(id);
      await ApiService.deactivateJob(id);
      setJobs((prev) =>
        prev.map((job) => (job._id === id ? { ...job, status: 'deactivated' } : job))
      );
    } catch (err: any) {
      alert(`Failed to deactivate job: ${err.message}`);
    } finally {
      setDeactivatingId(null);
    }
  };

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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-neutral pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Vacancies Directory
              </span>
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mt-1">
                Open Positions.
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Manage recruitment criteria, skill definitions, and experience baselines.
              </p>
            </div>

            {/* Filter Toggle Segment */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border-neutral shadow-subtle self-start sm:self-auto">
              {['all', 'active', 'deactivated'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-brand text-white shadow-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-soft-coral border border-coral/30 rounded-2xl text-sm text-red-800 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => fetchJobs(statusFilter)} className="text-xs font-semibold underline text-red-900">
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-text-secondary mt-4">
                Loading job positions...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-20 bg-surface rounded-2xl border border-border-neutral shadow-subtle p-8">
              <div className="w-12 h-12 rounded-xl bg-canvas text-brand mx-auto flex items-center justify-center mb-3 border border-border-neutral">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-text-primary">No positions found</h3>
              <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
                {statusFilter !== 'all'
                  ? `There are no openings marked as ${statusFilter}.`
                  : 'Get started by creating your first job opening.'}
              </p>
              <div className="mt-5">
                <Link
                  href="/jobs/create"
                  className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-subtle transition inline-block"
                >
                  Create Position
                </Link>
              </div>
            </div>
          )}

          {/* Job Cards */}
          {!loading && !error && jobs.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-surface rounded-2xl border border-border-neutral p-6 shadow-subtle hover:border-brand/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/jobs/${job._id}`}
                        className="text-lg font-bold text-text-primary hover:text-brand transition truncate"
                      >
                        {job.title}
                      </Link>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          job.status === 'active'
                            ? 'bg-soft-mint text-emerald-900 border border-emerald-200'
                            : 'bg-canvas text-text-secondary border border-border-neutral'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 max-w-3xl leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-text-secondary mr-1">Required:</span>
                      {job.requiredSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 bg-canvas rounded-md border border-border-neutral text-[11px] font-medium text-text-primary"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary">
                      <span className="font-medium text-text-primary">
                        Experience: {job.experienceMin} – {job.experienceMax} years
                      </span>
                      <span>•</span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-border-neutral self-end md:self-center">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="px-3 py-1.5 bg-canvas hover:bg-border-neutral/60 border border-border-neutral text-text-primary text-xs font-semibold rounded-xl transition"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/jobs/${job._id}/edit`}
                      className="px-3 py-1.5 bg-soft-violet hover:bg-brand/10 border border-brand/20 text-brand text-xs font-semibold rounded-xl transition"
                    >
                      Edit
                    </Link>
                    {job.status === 'active' && (
                      <button
                        onClick={() => handleDeactivate(job._id, job.title)}
                        disabled={deactivatingId === job._id}
                        className="px-3 py-1.5 bg-soft-coral hover:bg-red-100 border border-coral/30 text-red-800 text-xs font-semibold rounded-xl transition disabled:opacity-50"
                      >
                        {deactivatingId === job._id ? 'Archiving...' : 'Deactivate'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
