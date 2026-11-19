'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { WorkspaceLayout } from '../../../components/WorkspaceLayout';
import { JobForm } from '../../../components/JobForm';
import { ApiService } from '../../../services/api';
import { CreateJobPayload } from '../../../types';

export default function CreateJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateJob = async (payload: CreateJobPayload) => {
    setIsSubmitting(true);
    try {
      const res = await ApiService.createJob(payload);
      setSuccessMessage('Job opening published successfully! Redirecting...');
      setTimeout(() => {
        router.push(res.data ? `/jobs/${res.data._id}` : '/jobs');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <WorkspaceLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Link href="/jobs" className="hover:text-text-primary transition">
              Positions
            </Link>
            <span>/</span>
            <span className="text-text-primary font-semibold">Create Opening</span>
          </div>

          <div className="bg-surface rounded-2xl border border-border-neutral p-6 sm:p-8 shadow-subtle">
            <div className="border-b border-border-neutral pb-5 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Vacancy Definition
              </span>
              <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mt-1">
                Post New Opening.
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Define the title, role parameters, required skill set, and experience thresholds.
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-soft-mint border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            <JobForm
              onSubmit={handleCreateJob}
              submitButtonText="Publish Opening"
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
