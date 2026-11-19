'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { WorkspaceLayout } from '../../../components/WorkspaceLayout';
import { CandidateForm } from '../../../components/CandidateForm';
import { ApiService } from '../../../services/api';
import { CreateCandidatePayload } from '../../../types';

export default function AddCandidatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateCandidate = async (payload: CreateCandidatePayload) => {
    setIsSubmitting(true);
    try {
      const res = await ApiService.createCandidate(payload);
      setSuccessMessage('Candidate profile created successfully! Redirecting...');
      setTimeout(() => {
        router.push(res.data ? `/candidates/${res.data._id}` : '/candidates');
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
            <Link href="/candidates" className="hover:text-plum-950 transition">
              Candidates
            </Link>
            <span className="text-plum-300">/</span>
            <span className="text-plum-950 font-bold">Onboard Talent</span>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury p-7 sm:p-9 shadow-luxury-card relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-plum via-burgundy to-magenta-rose" />

            <div className="mb-6 border-b border-border-luxury pb-5">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-magenta-muted">
                Talent Registration
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-plum-950 tracking-tight mt-1">
                Onboard New Candidate.
              </h1>
              <p className="text-xs text-charcoal-600 mt-1">
                Enter contact details, core skill set, and total years of professional history.
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

            <CandidateForm
              onSubmit={handleCreateCandidate}
              submitButtonText="Register Candidate"
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
