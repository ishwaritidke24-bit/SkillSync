'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { Navbar } from '../../../components/Navbar';
import { ApiService } from '../../../services/api';
import { Job } from '../../../types';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
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
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/jobs" className="hover:underline">
              Jobs
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Job Details</span>
          </div>

          {loading && (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 mt-4">Loading job details from MongoDB...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm">
              <h2 className="text-lg font-bold text-red-600 mb-2">Error Loading Job</h2>
              <p className="text-sm text-slate-600 mb-4">{error}</p>
              <Link
                href="/jobs"
                className="inline-flex px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
              >
                Back to Jobs
              </Link>
            </div>
          )}

          {!loading && !error && job && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                          job.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Job ID: <span className="font-mono text-slate-700">{job._id}</span> • Posted on{' '}
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/jobs/${job._id}/edit`}
                      className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition"
                    >
                      Edit Job
                    </Link>
                    {job.status === 'active' && (
                      <button
                        onClick={handleDeactivate}
                        disabled={isDeactivating}
                        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition disabled:opacity-50"
                      >
                        {isDeactivating ? 'Deactivating...' : 'Deactivate'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Job Description */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Job Description
                  </h3>
                  <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-200">
                    {job.description}
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience Range */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Experience Range
                  </h3>
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{job.experienceMin} to {job.experienceMax} years required</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
