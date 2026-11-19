'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { WorkspaceLayout } from '../../../components/WorkspaceLayout';
import { ApiService } from '../../../services/api';
import { Job } from '../../../types';

export default function JobDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await ApiService.getJobById(id);
        if (res.data) {
          setJob(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleDeactivate = async () => {
    if (!job) return;
    const confirmed = window.confirm(`Are you sure you want to deactivate "${job.title}"?`);
    if (!confirmed) return;

    try {
      setIsDeactivating(true);
      const res = await ApiService.deactivateJob(job._id);
      if (res.data) {
        setJob(res.data);
      }
    } catch (err: any) {
      alert(`Deactivation failed: ${err.message}`);
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <ProtectedRoute>
      <WorkspaceLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Link href="/jobs" className="hover:text-text-primary transition">
              Positions
            </Link>
            <span>/</span>
            <span className="text-text-primary font-semibold">Position Specifications</span>
          </div>

          {loading && (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-text-secondary mt-4">Loading position details...</p>
            </div>
          )}

          {error && (
            <div className="bg-surface rounded-2xl border border-coral/30 p-8 text-center shadow-subtle">
              <h2 className="text-base font-bold text-red-700 mb-2">Position Error</h2>
              <p className="text-xs text-text-secondary mb-4">{error}</p>
              <Link href="/jobs" className="px-4 py-2 bg-brand text-white rounded-xl text-xs font-semibold">
                Back to Positions
              </Link>
            </div>
          )}

          {!loading && !error && job && (
            <div className="bg-surface rounded-2xl border border-border-neutral shadow-subtle overflow-hidden">
              {/* Header Banner */}
              <div className="p-6 sm:p-8 border-b border-border-neutral bg-surface-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
                        {job.title}
                      </h1>
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
                    <p className="text-xs text-text-secondary mt-1">
                      Position ID: <span className="font-mono text-text-primary">{job._id}</span> • Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/jobs/${job._id}/edit`}
                      className="px-3.5 py-2 text-xs font-semibold text-brand bg-soft-violet hover:bg-brand/10 rounded-xl border border-brand/20 transition"
                    >
                      Edit Position
                    </Link>
                    {job.status === 'active' && (
                      <button
                        onClick={handleDeactivate}
                        disabled={isDeactivating}
                        className="px-3.5 py-2 text-xs font-semibold text-red-800 bg-soft-coral hover:bg-red-100 rounded-xl border border-coral/30 transition disabled:opacity-50"
                      >
                        {isDeactivating ? 'Archiving...' : 'Deactivate'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Role Description
                  </h3>
                  <div className="p-5 bg-canvas/40 rounded-xl border border-border-neutral text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Required Competencies ({job.requiredSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-soft-violet text-brand text-xs font-semibold rounded-lg border border-brand/15"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Experience Requirement Baseline
                  </h3>
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-canvas/60 border border-border-neutral rounded-xl text-xs font-semibold text-text-primary">
                    <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{job.experienceMin} to {job.experienceMax} years of verified experience</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
