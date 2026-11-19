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
            className="px-4 py-2 bg-gradient-to-r from-plum via-burgundy to-royal text-white text-xs font-mono font-semibold tracking-wider uppercase rounded-xl shadow-glow-magenta hover:opacity-95 transition flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Position</span>
          </Link>
        }
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border-luxury">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-magenta-muted">
                Requisition Matrix
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-plum-950 mt-1">
                Position Specifications.
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                Configure talent requirements, experience bounds, and core competency blueprints for Gemini AI comparison.
              </p>
            </div>

            {/* Filter Toggle Segment */}
            <div className="flex items-center gap-1 bg-white/90 p-1.5 rounded-xl border border-border-luxury shadow-luxury-subtle self-start sm:self-auto">
              {['all', 'active', 'deactivated'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-gradient-to-r from-plum to-burgundy text-white shadow-sm'
                      : 'text-charcoal-600 hover:text-plum-950 hover:bg-neutral-tinted'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center bg-white/80 rounded-3xl border border-border-luxury shadow-luxury-subtle">
              <div className="w-10 h-10 border-2 border-plum-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-charcoal-600 mt-4">Retrieving active specifications...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 bg-burgundy-soft border border-burgundy-700/30 rounded-2xl text-xs text-burgundy-950 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => fetchJobs(statusFilter)} className="font-mono underline font-bold">
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-20 bg-white/80 rounded-3xl border border-border-luxury shadow-luxury-subtle p-8">
              <div className="w-12 h-12 rounded-2xl bg-neutral-tinted text-plum flex items-center justify-center mx-auto mb-3 border border-border-luxury">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-plum-950">No positions found</h3>
              <p className="text-xs text-charcoal-600 mt-1 max-w-sm mx-auto">
                No vacancies currently match &quot;{statusFilter}&quot;. Establish a new job requisition to start matching talent.
              </p>
              <div className="mt-5">
                <Link
                  href="/jobs/create"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-plum to-burgundy text-white text-xs font-mono uppercase font-semibold rounded-xl shadow-glow-magenta"
                >
                  Create Position
                </Link>
              </div>
            </div>
          )}

          {/* Jobs Grid */}
          {!loading && !error && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => {
                const isActive = job.status === 'active';
                return (
                  <div
                    key={job._id}
                    className="bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury hover:border-plum-400 p-6 shadow-luxury-subtle hover:shadow-luxury-card transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top status indicator bar */}
                    <div
                      className={`absolute top-0 inset-x-0 h-1.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-plum via-burgundy to-magenta-rose'
                          : 'bg-charcoal-600'
                      }`}
                    />

                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <Link
                          href={`/jobs/${job._id}`}
                          className="font-bold text-base text-plum-950 group-hover:text-magenta-muted transition-colors leading-snug"
                        >
                          {job.title}
                        </Link>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            isActive
                              ? 'bg-plum-100 text-plum-900 border border-plum-200'
                              : 'bg-neutral-tinted text-charcoal-600 border border-border-luxury'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>

                      <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed mb-4">
                        {job.description}
                      </p>

                      {/* Required Skills Chips */}
                      <div className="space-y-1.5 mb-4">
                        <span className="font-mono text-[10px] uppercase font-semibold text-charcoal-600 tracking-wider block">
                          Target Competencies:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {job.requiredSkills.slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-neutral-tinted text-plum-950 border border-border-luxury"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.requiredSkills.length > 4 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-mono text-magenta-muted">
                              +{job.requiredSkills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border-luxury flex items-center justify-between text-xs font-mono">
                      <span className="text-charcoal-600">
                        {job.experienceMin}-{job.experienceMax} Yrs Exp
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/jobs/${job._id}`}
                          className="px-2.5 py-1 rounded-lg bg-neutral-tinted hover:bg-plum-100 text-plum-950 font-semibold transition"
                        >
                          Specs
                        </Link>
                        <Link
                          href={`/jobs/${job._id}/edit`}
                          className="px-2.5 py-1 rounded-lg bg-neutral-tinted hover:bg-magenta-soft text-burgundy-900 font-semibold transition"
                        >
                          Edit
                        </Link>
                        {isActive && (
                          <button
                            onClick={() => handleDeactivate(job._id, job.title)}
                            disabled={deactivatingId === job._id}
                            className="px-2.5 py-1 rounded-lg bg-burgundy-soft text-burgundy hover:bg-burgundy-700 hover:text-white transition disabled:opacity-50"
                          >
                            {deactivatingId === job._id ? '…' : 'Archive'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
