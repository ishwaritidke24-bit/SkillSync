'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Navbar } from '../../components/Navbar';
import { ApiService } from '../../services/api';
import { Application, ApplicationStatus, Job, Candidate } from '../../types';

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const initialCandidateId = searchParams.get('candidateId') || '';

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [candidateFilter, setCandidateFilter] = useState<string>(initialCandidateId);

  // New application form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ApiService.getApplications({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        candidateId: candidateFilter || undefined,
      });
      if (res.data) {
        setApplications(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, candidateFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const loadPrerequisites = async () => {
    try {
      const [jobsRes, candidatesRes] = await Promise.all([
        ApiService.getJobs('active'),
        ApiService.getCandidates({ limit: 100 }),
      ]);
      if (jobsRes.data) setJobs(jobsRes.data);
      if (candidatesRes.data) setCandidates(candidatesRes.data);
    } catch (err) {
      console.error('Failed to load prerequisites:', err);
    }
  };

  const handleOpenModal = () => {
    loadPrerequisites();
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId) {
      setFormError('Please select a candidate');
      return;
    }
    if (!selectedJobId) {
      setFormError('Please select a job opening');
      return;
    }

    setCreating(true);
    setFormError(null);
    try {
      await ApiService.createApplication({
        candidateId: selectedCandidateId,
        jobId: selectedJobId,
        status: 'applied',
      });
      setIsModalOpen(false);
      setSelectedCandidateId('');
      setSelectedJobId('');
      fetchApplications();
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit application');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      setUpdatingId(appId);
      await ApiService.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses: ApplicationStatus[] = ['applied', 'screening', 'interview', 'offered', 'rejected'];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track candidate submissions, link applicants to jobs, and update hiring pipeline status.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg shadow-sm transition gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Application
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status:</span>
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {['all', ...statuses].map((st) => (
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

        {candidateFilter && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">
              Filtered by candidate
            </span>
            <button
              onClick={() => setCandidateFilter('')}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 mt-4">Loading applications from MongoDB...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-base font-semibold text-slate-900">No applications found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {statusFilter !== 'all'
              ? `There are no applications currently in "${statusFilter}" status.`
              : 'Link a candidate to a job opening to create an application.'}
          </p>
          <div className="mt-5">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
            >
              Create First Application
            </button>
          </div>
        </div>
      )}

      {/* Applications Table */}
      {!loading && !error && applications.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Job Position</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{app.candidate?.name || 'Unknown Candidate'}</p>
                      <p className="text-xs text-slate-500">{app.candidate?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{app.job?.title || 'Unknown Position'}</p>
                      <span className={`text-xs uppercase font-medium ${app.job?.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {app.job?.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                        app.status === 'applied' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        app.status === 'screening' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        app.status === 'interview' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        app.status === 'offered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <select
                        value={app.status}
                        disabled={updatingId === app._id}
                        onChange={(e) => handleStatusChange(app._id, e.target.value as ApplicationStatus)}
                        className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700 cursor-pointer disabled:opacity-50"
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Application</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {formError}
                </div>
              )}

              {/* Candidate selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Candidate *
                </label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Select a Candidate --</option>
                  {candidates.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Job selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Job Position *
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Select an Active Job --</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title} ({j.experienceMin}-{j.experienceMax} yrs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {creating ? 'Submitting...' : 'Link Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ApplicationsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Suspense fallback={
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 mt-4">Loading applications...</p>
          </div>
        }>
          <ApplicationsContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
