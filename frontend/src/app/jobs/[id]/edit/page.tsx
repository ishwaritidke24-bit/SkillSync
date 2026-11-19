'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';
import { WorkspaceLayout } from '../../../../components/WorkspaceLayout';
import { JobForm } from '../../../../components/JobForm';
import { ApiService } from '../../../../services/api';
import { Job, CreateJobPayload } from '../../../../types';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await ApiService.getJobById(id);
        if (res.data) {
          setJob(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleUpdate = async (payload: CreateJobPayload) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await ApiService.updateJob(id, payload);
      setSuccessMessage('Job position updated successfully! Redirecting...');
      setTimeout(() => {
        router.push(`/jobs/${id}`);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <WorkspaceLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-charcoal-600">
            <Link href="/jobs" className="hover:text-plum-950 transition">
              Positions
            </Link>
            <span className="text-plum-300">/</span>
            <Link href={`/jobs/${id}`} className="hover:text-plum-950 transition truncate max-w-[200px]">
              {job?.title || 'Details'}
            </Link>
            <span className="text-plum-300">/</span>
            <span className="text-plum-950 font-bold">Edit</span>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury p-7 sm:p-9 shadow-luxury-card relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-plum via-burgundy to-magenta-rose" />

            <div className="border-b border-border-luxury pb-5 mb-6">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-magenta-muted">
                Update Vacancy
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-plum-950 tracking-tight mt-1">
                Edit Position.
              </h1>
              <p className="text-xs text-charcoal-600 mt-1">
                Modify parameters, required competencies, or activation status.
              </p>
            </div>

            {loading && (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-plum-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-charcoal-600 mt-3">Fetching job data...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-burgundy-soft border border-burgundy-700/30 rounded-2xl text-xs text-burgundy-950 font-mono">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-plum-100 border border-plum-200 rounded-2xl text-xs font-mono text-plum-900 flex items-center gap-2.5">
                <svg className="w-5 h-5 text-plum-800 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {job && (
              <JobForm
                initialData={{
                  title: job.title,
                  description: job.description,
                  requiredSkills: job.requiredSkills,
                  experienceMin: job.experienceMin,
                  experienceMax: job.experienceMax,
                  status: job.status,
                }}
                onSubmit={handleUpdate}
                submitButtonText="Save Changes"
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
