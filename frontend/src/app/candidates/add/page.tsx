'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { Navbar } from '../../../components/Navbar';
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
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/candidates" className="hover:underline">
              Candidates
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Add Candidate</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New Candidate</h1>
              <p className="text-sm text-slate-500 mt-1">
                Enter contact details, core skill set, and total years of experience.
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <CandidateForm
              onSubmit={handleCreateCandidate}
              submitButtonText="Create Candidate"
              isSubmitting={isSubmitting}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
