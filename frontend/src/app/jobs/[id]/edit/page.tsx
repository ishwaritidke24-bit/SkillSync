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
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Link href="/jobs" className="hover:text-text-primary transition">
              Positions
            </Link>
            <span>/</span>
            <Link href={`/jobs/${id}`} className="hover:text-text-primary transition truncate max-w-[200px]">
              {job?.title || 'Details'}
            </Link>
            <span>/</span>
            <span className="text-text-primary font-semibold">Edit</span>
          </div>

          <div className="bg-surface rounded-2xl border border-border-neutral p-6 sm:p-8 shadow-subtle">
            <div className="border-b border-border-neutral pb-5 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Update Vacancy
              </span>
              <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mt-1">
                Edit Position.
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Modify parameters, required competencies, or activation status.
              </p>
            </div>

            {loading && (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-text-secondary mt-3">Fetching job data...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-soft-coral border border-coral/30 rounded-xl text-xs text-red-800">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-soft-mint border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {!loading && !error && job && (
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
