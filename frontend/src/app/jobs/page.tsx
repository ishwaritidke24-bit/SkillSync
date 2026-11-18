'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Navbar } from '../../components/Navbar';
import { ApiService } from '../../services/api';
import { Job } from '../../types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const fetchJobs = async (filter?: string) => {
    try {
      setLoading(true);
      setError(null);
      const queryStatus = filter && filter !== 'all' ? filter : undefined;
      const res = await ApiService.getJobs(queryStatus);
      if (res.data) {
        setJobs(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(statusFilter);
  }, [statusFilter]);

  const handleDeactivate = async (id: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to deactivate "${title}"? This job will be marked as inactive.`);
    if (!confirmed) return;

    try {
      setDeactivatingId(id);
      await ApiService.deactivateJob(id);
      // Update state locally
      setJobs((prev) =>
        prev.map((job) => (job._id === id ? { ...job, status: 'deactivated' } : job))
      );
    } catch (err: any) {
      alert(`Failed to deactivate job: ${err.message}`);
    } finally {
      setDeactivatingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Job Postings</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage recruitment positions, required skills, and experience criteria.
              </p>
            </div>
            <Link
              href="/jobs/create"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg shadow-sm transition gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Post New Job
            </Link>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Filter Status:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {['all', 'active', 'deactivated'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition ${
                      statusFilter === st
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-800">{jobs.length}</span> positions
            </span>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
              <button
                onClick={() => fetchJobs(statusFilter)}
                className="text-xs font-semibold underline text-red-800 hover:text-red-950"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 mt-4">Loading job postings from MongoDB...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">No jobs found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                {statusFilter !== 'all'
                  ? `There are currently no ${statusFilter} job postings.`
                  : 'Start recruiting by creating your first job opening.'}
              </p>
              <div className="mt-5">
                <Link
                  href="/jobs/create"
                  className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
                >
                  Create First Job
                </Link>
              </div>
            </div>
          )}

          {/* Job List Grid */}
          {!loading && !error && jobs.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/jobs/${job._id}`}
                          className="text-lg font-bold text-slate-900 hover:text-teal-600 transition"
                        >
                          {job.title}
                        </Link>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                            job.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Required Skills Badges */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-medium text-slate-500 mr-1">Skills:</span>
                        {job.requiredSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-md font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Experience Info */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Experience: {job.experienceMin} – {job.experienceMax} years
                        </span>
                        <span>•</span>
                        <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <Link
                        href={`/jobs/${job._id}`}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/jobs/${job._id}/edit`}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition"
                      >
                        Edit
                      </Link>
                      {job.status === 'active' && (
                        <button
                          onClick={() => handleDeactivate(job._id, job.title)}
                          disabled={deactivatingId === job._id}
                          className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition disabled:opacity-50"
                        >
                          {deactivatingId === job._id ? 'Deactivating...' : 'Deactivate'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
