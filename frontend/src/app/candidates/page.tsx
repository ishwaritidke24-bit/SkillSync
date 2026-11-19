'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { WorkspaceLayout } from '../../components/WorkspaceLayout';
import { ResumeUploadModal } from '../../components/ResumeUploadModal';
import { ApiService } from '../../services/api';
import { Candidate, PaginationMeta } from '../../types';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Resume Upload Modal
  const [uploadCandidate, setUploadCandidate] = useState<{ id: string; name: string } | null>(null);

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
        if (res.data.length > 0 && !selectedCandidateId) {
          setSelectedCandidateId(res.data[0]._id);
        }
      }
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, skillFilter, currentPage, selectedCandidateId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Load split-view selected candidate details
  useEffect(() => {
    if (!selectedCandidateId) {
      setSelectedCandidateDetail(null);
      return;
    }
    const loadDetail = async () => {
      try {
        setDetailLoading(true);
        const res = await ApiService.getCandidateById(selectedCandidateId);
        if (res.data) {
          setSelectedCandidateDetail(res.data);
        }
      } catch (err) {
        console.error('Failed to load candidate details:', err);
      } finally {
        setDetailLoading(false);
      }
    };
    loadDetail();
  }, [selectedCandidateId]);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Delete profile for "${name}"? Associated applications and resume documents will be removed.`
    );
    if (!confirmed) return;

    try {
      await ApiService.deleteCandidate(id);
      if (selectedCandidateId === id) {
        setSelectedCandidateId(null);
      }
      fetchCandidates();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <ProtectedRoute>
      <WorkspaceLayout
        headerAction={
          <Link
            href="/candidates/add"
            className="px-3.5 py-1.5 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-subtle transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Candidate</span>
          </Link>
        }
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-neutral pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Talent Pool Directory
              </span>
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mt-1">
                Candidate Profiles.
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Manage talent profiles, attached PDF resumes, skills, and linked job submissions.
              </p>
            </div>

            <div className="text-xs font-medium text-text-secondary self-start sm:self-auto">
              Total Talents: <span className="font-bold text-text-primary">{pagination.total}</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-surface p-4 rounded-2xl border border-border-neutral shadow-subtle flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search candidate by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-canvas/40 border border-border-neutral rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                />
                <svg className="w-4 h-4 text-text-tertiary absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="w-full px-3.5 py-2 text-xs bg-canvas/40 border border-border-neutral rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-soft-coral border border-coral/30 rounded-2xl text-xs text-red-800 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => fetchCandidates()} className="font-semibold underline text-red-900">Retry</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-text-secondary mt-4">Loading talent pool...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && candidates.length === 0 && (
            <div className="text-center py-20 bg-surface rounded-2xl border border-border-neutral shadow-subtle p-8">
              <div className="w-12 h-12 rounded-xl bg-canvas text-brand mx-auto flex items-center justify-center mb-3 border border-border-neutral">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-text-primary">No candidate profiles found</h3>
              <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
                {searchTerm || skillFilter ? 'No candidates match your current filter criteria.' : 'Start expanding your recruitment pipeline by onboarding candidate profiles.'}
              </p>
              <div className="mt-5">
                <Link
                  href="/candidates/add"
                  className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-subtle transition inline-block"
                >
                  Onboard Candidate
                </Link>
              </div>
            </div>
          )}

          {/* Split-View Talent Workspace (Desktop Split, Mobile Stacked) */}
          {!loading && !error && candidates.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Candidate List (7 Cols) */}
              <div className="lg:col-span-7 bg-surface rounded-2xl border border-border-neutral shadow-subtle overflow-hidden">
                <div className="divide-y divide-border-neutral">
                  {candidates.map((cand) => {
                    const isSelected = selectedCandidateId === cand._id;
                    return (
                      <div
                        key={cand._id}
                        onClick={() => setSelectedCandidateId(cand._id)}
                        className={`p-4 sm:p-5 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-soft-violet/40 border-l-4 border-l-brand'
                            : 'hover:bg-canvas/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-text-primary truncate">
                                {cand.name}
                              </h3>
                              {cand.resume ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-soft-mint text-emerald-900 border border-emerald-200">
                                  Resume Attached
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-canvas text-text-secondary border border-border-neutral">
                                  No Resume
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary mt-0.5 truncate">{cand.email}</p>

                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {cand.skills.slice(0, 4).map((sk, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-canvas rounded text-[11px] font-medium text-text-primary border border-border-neutral">
                                  {sk}
                                </span>
                              ))}
                              {cand.skills.length > 4 && (
                                <span className="text-[11px] text-text-tertiary self-center">
                                  +{cand.skills.length - 4}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-bold text-text-primary">
                              {cand.experienceYears} {cand.experienceYears === 1 ? 'yr' : 'yrs'}
                            </span>
                            <div className="mt-2 flex items-center justify-end gap-1">
                              <Link
                                href={`/candidates/${cand._id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 text-text-secondary hover:text-brand hover:bg-surface rounded-lg transition"
                                title="Open Full Profile"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(cand._id, cand.name);
                                }}
                                className="p-1.5 text-text-secondary hover:text-red-700 hover:bg-surface rounded-lg transition"
                                title="Delete Candidate"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="p-4 border-t border-border-neutral flex items-center justify-between bg-surface-subtle">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 border border-border-neutral rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary bg-surface disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-text-secondary">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      disabled={currentPage >= pagination.totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      className="px-3 py-1.5 border border-border-neutral rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary bg-surface disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Selected Candidate Quick Preview Panel (5 Cols) */}
              <div className="lg:col-span-5 bg-surface rounded-2xl border border-border-neutral p-6 shadow-subtle sticky top-24">
                {detailLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-medium text-text-secondary mt-3">Loading details...</p>
                  </div>
                ) : !selectedCandidateDetail ? (
                  <div className="text-center py-20 text-text-secondary text-xs">
                    Select a candidate profile from the directory to inspect details.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="border-b border-border-neutral pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                          Candidate Summary
                        </span>
                        <Link
                          href={`/candidates/${selectedCandidateDetail.candidate._id}`}
                          className="text-xs font-semibold text-brand hover:underline"
                        >
                          View Full Dossier →
                        </Link>
                      </div>
                      <h2 className="text-xl font-bold text-text-primary mt-1">
                        {selectedCandidateDetail.candidate.name}
                      </h2>
                      <p className="text-xs text-text-secondary">
                        {selectedCandidateDetail.candidate.email}
                        {selectedCandidateDetail.candidate.phone && ` • ${selectedCandidateDetail.candidate.phone}`}
                      </p>
                    </div>

                    {/* Stated Skills */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                        Stated Competencies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCandidateDetail.candidate.skills.map((sk: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-canvas text-text-primary text-xs font-medium rounded-lg border border-border-neutral">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Experience Info */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                        Industry Experience
                      </h4>
                      <p className="text-sm font-extrabold text-text-primary">
                        {selectedCandidateDetail.candidate.experienceYears} Years Verified
                      </p>
                    </div>

                    {/* Resume Snapshot */}
                    <div className="p-4 rounded-xl bg-canvas/60 border border-border-neutral space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                          Resume Document
                        </span>
                        {selectedCandidateDetail.resume && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-soft-mint px-2 py-0.5 rounded border border-emerald-200">
                            Parsed
                          </span>
                        )}
                      </div>

                      {selectedCandidateDetail.resume ? (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-text-primary truncate">
                            {selectedCandidateDetail.resume.fileName}
                          </p>
                          <p className="text-[11px] text-text-secondary">
                            Document size: {(selectedCandidateDetail.resume.fileSize / 1024).toFixed(1)} KB
                          </p>
                          <button
                            onClick={() =>
                              setUploadCandidate({
                                id: selectedCandidateDetail.candidate._id,
                                name: selectedCandidateDetail.candidate.name,
                              })
                            }
                            className="text-xs font-semibold text-brand hover:underline"
                          >
                            Upload updated version
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-text-secondary mb-3">No PDF resume on file.</p>
                          <button
                            onClick={() =>
                              setUploadCandidate({
                                id: selectedCandidateDetail.candidate._id,
                                name: selectedCandidateDetail.candidate.name,
                              })
                            }
                            className="w-full py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-subtle transition"
                          >
                            Upload PDF Resume
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Associated Applications */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                          Active Applications ({selectedCandidateDetail.applications.length})
                        </h4>
                      </div>
                      {selectedCandidateDetail.applications.length === 0 ? (
                        <p className="text-xs text-text-secondary italic">No active job applications submitted.</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {selectedCandidateDetail.applications.map((app: any) => (
                            <div key={app._id} className="p-3 bg-canvas/40 border border-border-neutral rounded-xl flex items-center justify-between">
                              <span className="text-xs font-bold text-text-primary truncate max-w-[180px]">
                                {app.job?.title || 'Position'}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface border border-border-neutral text-text-secondary">
                                {app.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resume Upload Modal */}
          {uploadCandidate && (
            <ResumeUploadModal
              candidateId={uploadCandidate.id}
              candidateName={uploadCandidate.name}
              isOpen={!!uploadCandidate}
              onClose={() => setUploadCandidate(null)}
              onUploadSuccess={fetchCandidates}
            />
          )}
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
