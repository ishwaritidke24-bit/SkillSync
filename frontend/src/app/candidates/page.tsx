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
            className="px-4 py-2 bg-gradient-to-r from-plum via-burgundy to-royal text-white text-xs font-mono font-semibold tracking-wider uppercase rounded-xl shadow-glow-magenta hover:opacity-95 transition flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Onboard Talent</span>
          </Link>
        }
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border-luxury">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-magenta-muted">
                Talent Repository
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-plum-950 mt-1">
                Candidate Dossiers.
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                Explore candidate claims, experience timelines, parsed resume files, and linked job submissions.
              </p>
            </div>

            <div className="font-mono text-xs text-charcoal-600 self-start sm:self-auto">
              Total Talents Ingested: <span className="font-bold text-plum-950">{pagination.total}</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-border-luxury shadow-luxury-subtle flex flex-col md:flex-row gap-3 items-center justify-between">
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
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono bg-neutral-tinted border border-border-luxury rounded-xl text-plum-950 placeholder:text-charcoal-600/60 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
                />
                <svg className="w-4 h-4 text-charcoal-600 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Filter by skill (e.g. React)..."
                  value={skillFilter}
                  onChange={(e) => {
                    setSkillFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-tinted border border-border-luxury rounded-xl text-plum-950 placeholder:text-charcoal-600/60 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-burgundy-soft border border-burgundy-700/30 rounded-2xl text-xs text-burgundy-950 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => fetchCandidates()} className="font-mono underline font-bold">Retry</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center bg-white/80 rounded-3xl border border-border-luxury shadow-luxury-subtle">
              <div className="w-10 h-10 border-2 border-plum-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-charcoal-600 mt-4">Retrieving talent pool records...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && candidates.length === 0 && (
            <div className="text-center py-20 bg-white/80 rounded-3xl border border-border-luxury shadow-luxury-subtle p-8">
              <div className="w-12 h-12 rounded-2xl bg-neutral-tinted text-plum mx-auto flex items-center justify-center mb-3 border border-border-luxury">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-plum-950">No candidate profiles found</h3>
              <p className="text-xs text-charcoal-600 mt-1 max-w-sm mx-auto">
                {searchTerm || skillFilter ? 'No candidates match your current filter query.' : 'Start expanding your talent roster by onboarding candidates with PDF resumes.'}
              </p>
              <div className="mt-5">
                <Link
                  href="/candidates/add"
                  className="px-4 py-2 bg-gradient-to-r from-plum to-burgundy text-white text-xs font-mono uppercase font-semibold rounded-xl shadow-glow-magenta inline-block"
                >
                  Onboard Candidate
                </Link>
              </div>
            </div>
          )}

          {/* Split-View Talent Workspace */}
          {!loading && !error && candidates.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Candidate List (7 Cols) */}
              <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury shadow-luxury-subtle overflow-hidden">
                <div className="divide-y divide-border-luxury">
                  {candidates.map((cand) => {
                    const isSelected = selectedCandidateId === cand._id;
                    return (
                      <div
                        key={cand._id}
                        onClick={() => setSelectedCandidateId(cand._id)}
                        className={`p-4 sm:p-5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-plum-100/50 border-l-4 border-l-plum-700'
                            : 'hover:bg-neutral-tinted/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-plum-950 truncate">
                                {cand.name}
                              </h3>
                              {cand.resume ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-plum-100 text-plum-900 border border-plum-200">
                                  PDF Attached
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-charcoal-600 bg-neutral-tinted border border-border-luxury">
                                  No Document
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-charcoal-600 mt-0.5 truncate font-mono">{cand.email}</p>

                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {cand.skills.slice(0, 4).map((sk, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-white rounded text-[11px] font-mono font-medium text-plum-950 border border-border-luxury">
                                  {sk}
                                </span>
                              ))}
                              {cand.skills.length > 4 && (
                                <span className="text-[11px] font-mono text-magenta-muted self-center">
                                  +{cand.skills.length - 4}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-mono font-bold text-plum-950 block">
                              {cand.experienceYears} {cand.experienceYears === 1 ? 'yr' : 'yrs'}
                            </span>
                            <div className="mt-2 flex items-center justify-end gap-1">
                              <Link
                                href={`/candidates/${cand._id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 text-charcoal-600 hover:text-plum-950 hover:bg-plum-100/60 rounded-lg transition"
                                title="Open Full Dossier"
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
                                className="p-1.5 text-charcoal-600 hover:text-burgundy hover:bg-burgundy-soft rounded-lg transition"
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
                  <div className="p-4 border-t border-border-luxury flex items-center justify-between bg-neutral-tinted/40 text-xs font-mono">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="px-3 py-1.5 bg-white border border-border-luxury rounded-lg font-semibold disabled:opacity-40"
                    >
                      ← Previous
                    </button>
                    <span className="text-charcoal-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={currentPage >= pagination.totalPages}
                      className="px-3 py-1.5 bg-white border border-border-luxury rounded-lg font-semibold disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Candidate Quick Dossier Inspector (5 Cols) */}
              <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury p-6 shadow-luxury-subtle sticky top-24">
                {detailLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-2 border-plum-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-mono text-charcoal-600 mt-3">Loading dossier snapshot...</p>
                  </div>
                ) : selectedCandidateDetail ? (
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-border-luxury">
                      <div>
                        <span className="font-mono text-[10px] uppercase font-bold text-magenta-muted">
                          Candidate Overview
                        </span>
                        <h2 className="font-editorial text-2xl font-bold text-plum-950 mt-0.5">
                          {selectedCandidateDetail.candidate.name}
                        </h2>
                        <p className="text-xs font-mono text-charcoal-600 mt-0.5">
                          {selectedCandidateDetail.candidate.email}
                        </p>
                      </div>
                      <Link
                        href={`/candidates/${selectedCandidateDetail.candidate._id}`}
                        className="px-3 py-1.5 rounded-xl bg-plum-100 hover:bg-plum-200 text-plum-950 text-xs font-mono font-semibold transition"
                      >
                        Full Profile →
                      </Link>
                    </div>

                    {/* Stats Pill */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-2xl bg-neutral-tinted border border-border-luxury">
                        <span className="font-mono text-[10px] uppercase text-charcoal-600 block">Experience</span>
                        <span className="text-base font-bold text-plum-950 font-mono">
                          {selectedCandidateDetail.candidate.experienceYears} Years
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-tinted border border-border-luxury">
                        <span className="font-mono text-[10px] uppercase text-charcoal-600 block">Submissions</span>
                        <span className="text-base font-bold text-plum-950 font-mono">
                          {selectedCandidateDetail.applications?.length || 0} Open
                        </span>
                      </div>
                    </div>

                    {/* Competency Badges */}
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-charcoal-600 block mb-2">
                        Core Competencies ({selectedCandidateDetail.candidate.skills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCandidateDetail.candidate.skills.map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white text-plum-950 border border-border-luxury shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Resume Card & Action */}
                    <div className="pt-3 border-t border-border-luxury">
                      <span className="font-mono text-[10px] uppercase font-bold text-charcoal-600 block mb-2">
                        Resume Document Status
                      </span>
                      {selectedCandidateDetail.resume ? (
                        <div className="p-3.5 rounded-2xl bg-plum-100/50 border border-plum-200 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-plum-950 block truncate">
                              {selectedCandidateDetail.resume.fileName}
                            </span>
                            <span className="text-[10px] font-mono text-charcoal-600">
                              {(selectedCandidateDetail.resume.fileSize / 1024).toFixed(1)} KB • Ingested
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setUploadCandidate({
                                id: selectedCandidateDetail.candidate._id,
                                name: selectedCandidateDetail.candidate.name,
                              })
                            }
                            className="px-2.5 py-1 text-xs font-mono font-semibold text-plum-900 bg-white border border-plum-200 rounded-lg hover:bg-plum-100 transition flex-shrink-0"
                          >
                            Update
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-neutral-tinted border-2 border-dashed border-border-luxury text-center">
                          <p className="text-xs text-charcoal-600 mb-2 font-mono">No resume attached.</p>
                          <button
                            onClick={() =>
                              setUploadCandidate({
                                id: selectedCandidateDetail.candidate._id,
                                name: selectedCandidateDetail.candidate.name,
                              })
                            }
                            className="px-3 py-1.5 bg-gradient-to-r from-plum to-burgundy text-white text-xs font-mono font-semibold rounded-xl shadow-sm"
                          >
                            Upload PDF Resume
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-mono text-charcoal-600 text-center py-10">
                    Select a candidate on the left to preview their dossier snapshot.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Resume Upload Modal */}
          {uploadCandidate && (
            <ResumeUploadModal
              candidateId={uploadCandidate.id}
              candidateName={uploadCandidate.name}
              isOpen={Boolean(uploadCandidate)}
              onClose={() => setUploadCandidate(null)}
              onUploadSuccess={() => {
                fetchCandidates();
              }}
            />
          )}
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
