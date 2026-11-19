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
          <div className="flex items-center gap-2 text-xs font-mono text-charcoal-600">
            <Link href="/jobs" className="hover:text-plum-950 transition">
              Positions
            </Link>
            <span className="text-plum-300">/</span>
            <span className="text-plum-950 font-bold">Create Opening</span>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury p-7 sm:p-9 shadow-luxury-card relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-plum via-burgundy to-magenta-rose" />

            <div className="border-b border-border-luxury pb-5 mb-6">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-magenta-muted">
                Vacancy Definition
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-plum-950 tracking-tight mt-1">
                Post New Opening.
              </h1>
              <p className="text-xs text-charcoal-600 mt-1">
                Define the title, role parameters, required skill set, and experience thresholds.
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-plum-100 border border-plum-200 rounded-2xl text-xs font-mono text-plum-900 flex items-center gap-2.5">
                <svg className="w-5 h-5 text-plum-800 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
