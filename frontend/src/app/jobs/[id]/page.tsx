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
          <div className="flex items-center gap-2 text-xs font-mono text-charcoal-600">
            <Link href="/jobs" className="hover:text-plum-950 transition">
              Positions
            </Link>
            <span className="text-plum-300">/</span>
            <span className="text-plum-950 font-bold">Position Specifications</span>
          </div>

          {loading && (
            <div className="py-24 flex flex-col items-center justify-center bg-white/80 rounded-3xl border border-border-luxury shadow-luxury-subtle">
              <div className="w-10 h-10 border-2 border-plum-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-charcoal-600 mt-4">Loading position details...</p>
            </div>
          )}

          {error && (
            <div className="bg-white/90 rounded-3xl border border-burgundy-700/30 p-8 text-center shadow-luxury-subtle">
              <h2 className="font-editorial text-2xl font-bold text-burgundy mb-2">Position Error</h2>
              <p className="text-xs text-charcoal-600 mb-4">{error}</p>
              <Link href="/jobs" className="px-4 py-2 bg-gradient-to-r from-plum to-burgundy text-white rounded-xl text-xs font-mono font-semibold">
                Back to Positions
              </Link>
            </div>
          )}

          {!loading && !error && job && (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury shadow-luxury-subtle overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-plum via-burgundy to-magenta-rose" />

              {/* Header Banner */}
              <div className="p-7 sm:p-9 border-b border-border-luxury bg-neutral-tinted/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-plum-950 tracking-tight leading-none">
                        {job.title}
                      </h1>
                      <span
                        className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          job.status === 'active'
                            ? 'bg-plum-100 text-plum-900 border border-plum-200'
                            : 'bg-neutral-tinted text-charcoal-600 border border-border-luxury'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-charcoal-600 mt-2">
                      Created on {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/jobs/${job._id}/edit`}
                      className="px-4 py-2 text-xs font-mono font-semibold bg-white border border-border-luxury hover:bg-plum-100 rounded-xl transition text-plum-950"
                    >
                      Edit Specification
                    </Link>
                    {job.status === 'active' && (
                      <button
                        onClick={handleDeactivate}
                        disabled={isDeactivating}
                        className="px-4 py-2 text-xs font-mono font-semibold bg-burgundy-soft hover:bg-burgundy-700 hover:text-white border border-burgundy/30 text-burgundy rounded-xl transition disabled:opacity-50"
                      >
                        {isDeactivating ? 'Deactivating...' : 'Deactivate'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-7 sm:p-9 space-y-7">
                {/* Description */}
                <div>
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-charcoal-600 mb-2">
                    Position Description
                  </h3>
                  <div className="p-5 bg-neutral-tinted rounded-2xl border border-border-luxury text-sm text-charcoal-800 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </div>
                </div>

                {/* Experience Range */}
                <div>
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-charcoal-600 mb-2">
                    Experience Requirement
                  </h3>
                  <div className="p-4 bg-neutral-tinted rounded-2xl border border-border-luxury inline-block">
                    <span className="font-editorial text-2xl font-bold text-plum-950">
                      {job.experienceMin} – {job.experienceMax} Years
                    </span>
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-charcoal-600 mb-2">
                    Mandatory Competencies ({job.requiredSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-white border border-border-luxury rounded-xl text-xs font-mono font-semibold text-plum-950 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
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
