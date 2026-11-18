'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';
import { Navbar } from '../../../../components/Navbar';
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
      setSuccessMessage('Job updated successfully! Redirecting...');
      setTimeout(() => {
        router.push(`/jobs/${id}`);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/jobs" className="hover:underline">
              Jobs
            </Link>
            <span>/</span>
            <Link href={`/jobs/${id}`} className="hover:underline">
              {job?.title || 'Job Details'}
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Edit</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Job Opening</h1>
              <p className="text-sm text-slate-500 mt-1">
                Update job details, criteria or status.
              </p>
            </div>

            {loading && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 mt-3">Fetching job data...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
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
                submitButtonText="Update Job"
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
