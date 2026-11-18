'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Navbar } from '../../components/Navbar';
import { ResumeUploadModal } from '../../components/ResumeUploadModal';
import { ApiService } from '../../services/api';
import { Candidate, PaginationMeta } from '../../types';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Resume Upload Modal state
  const [selectedCandidate, setSelectedCandidate] = useState<{ id: string; name: string } | null>(null);

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ApiService.getCandidates({
        search: searchTerm || undefined,
        skill: skillFilter || undefined,
        page: currentPage,
        limit: 10,
      });

      if (res.data) {
        setCandidates(res.data);
      }
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, skillFilter, currentPage]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"? This will also remove associated applications and resume records.`);
    if (!confirmed) return;

    try {
      await ApiService.deleteCandidate(id);
      fetchCandidates();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
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
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidates</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage candidate profiles, skills, resumes, and application associations.
              </p>
            </div>
            <Link
              href="/candidates/add"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg shadow-sm transition gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Candidate
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="w-full sm:w-48">
                <input
                  type="text"
                  placeholder="Filter by skill..."
                  value={skillFilter}
                  onChange={(e) => {
                    setSkillFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 w-full md:w-auto text-right">
              Total candidates: <span className="font-semibold text-slate-800">{pagination.total}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => fetchCandidates()} className="text-xs font-semibold underline">Retry</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 mt-4">Loading candidates from MongoDB...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && candidates.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">No candidates found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm || skillFilter ? 'No candidates match your search filters.' : 'Add your first candidate profile to start tracking applications.'}
              </p>
              <div className="mt-5">
                <Link
                  href="/candidates/add"
                  className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
                >
                  Add Candidate
                </Link>
              </div>
            </div>
          )}

          {/* Candidate Table / Cards */}
          {!loading && !error && candidates.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider text-left">
                    <tr>
                      <th className="px-6 py-3.5">Candidate</th>
                      <th className="px-6 py-3.5">Skills</th>
                      <th className="px-6 py-3.5">Experience</th>
                      <th className="px-6 py-3.5">Resume</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {candidates.map((cand) => (
                      <tr key={cand._id} className="hover:bg-slate-50/70 transition">
                        <td className="px-6 py-4">
                          <Link href={`/candidates/${cand._id}`} className="font-semibold text-slate-900 hover:text-teal-600 block">
                            {cand.name}
                          </Link>
                          <span className="text-xs text-slate-500">{cand.email}</span>
                          {cand.phone && <span className="text-xs text-slate-400 block">{cand.phone}</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {cand.skills.map((skill, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium">
                          {cand.experienceYears} {cand.experienceYears === 1 ? 'year' : 'years'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cand.resume ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Attached
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedCandidate({ id: cand._id, name: cand.name })}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 rounded text-xs font-semibold transition"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              Upload PDF
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/candidates/${cand._id}`}
                              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                            >
                              Details
                            </Link>
                            <button
                              onClick={() => handleDelete(cand._id, cand.name)}
                              className="px-2.5 py-1 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-700 rounded transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-slate-500">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={currentPage >= pagination.totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Modal for PDF Upload */}
          {selectedCandidate && (
            <ResumeUploadModal
              candidateId={selectedCandidate.id}
              candidateName={selectedCandidate.name}
              isOpen={!!selectedCandidate}
              onClose={() => setSelectedCandidate(null)}
              onUploadSuccess={fetchCandidates}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
