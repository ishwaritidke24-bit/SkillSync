'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { WorkspaceLayout } from '../../../components/WorkspaceLayout';
import { ResumeUploadModal } from '../../../components/ResumeUploadModal';
import { ApiService } from '../../../services/api';
import { Candidate, ResumeMeta, Application } from '../../../types';

export default function CandidateDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [resume, setResume] = useState<ResumeMeta | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchCandidateData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await ApiService.getCandidateById(id);
      if (res.data) {
        setCandidate(res.data.candidate);
        setResume(res.data.resume);
        setApplications(res.data.applications || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load candidate profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCandidateData();
  }, [fetchCandidateData]);

  return (
    <ProtectedRoute>
      <WorkspaceLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-charcoal-600">
            <Link href="/candidates" className="hover:text-plum-950 transition-colors font-medium">
              Candidates
            </Link>
            <span className="text-plum-300">/</span>
            <span className="text-plum-950 font-bold">
              {candidate ? candidate.name : 'Dossier Profile'}
            </span>
          </div>

          {loading && (
            <div className="py-24 flex flex-col items-center justify-center bg-white/80 rounded-3xl border border-border-luxury shadow-luxury-subtle">
              <div className="w-10 h-10 border-2 border-plum-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-charcoal-600 mt-4">Retrieving candidate dossier from Atlas...</p>
            </div>
          )}

          {error && (
            <div className="bg-white/90 rounded-3xl border border-burgundy-700/30 p-8 text-center shadow-luxury-subtle">
              <div className="w-12 h-12 rounded-full bg-burgundy-soft text-burgundy flex items-center justify-center mx-auto mb-3 font-mono font-bold">!</div>
              <h2 className="font-editorial text-2xl font-bold text-plum-950 mb-1">Unable to Load Dossier</h2>
              <p className="text-xs text-charcoal-600 mb-5">{error}</p>
              <Link href="/candidates" className="inline-flex items-center px-4 py-2 bg-plum-950 hover:bg-black text-white text-xs font-mono font-semibold rounded-xl shadow-sm transition">
                ← Return to Directory
              </Link>
            </div>
          )}

          {!loading && !error && candidate && (
            <div className="space-y-6">
              {/* Profile Editorial Header Banner with Chromatic Luxury Gradients */}
              <div className="relative bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury p-7 sm:p-9 shadow-luxury-card overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-plum via-burgundy to-magenta-rose" />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border-luxury">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-plum via-burgundy to-royal text-white flex items-center justify-center text-xl font-bold tracking-tight shadow-glow-magenta flex-shrink-0 font-mono border border-white/20">
                      {candidate.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-plum-950 tracking-tight leading-none">
                          {candidate.name}
                        </h1>
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-plum-100 text-plum-900 border border-plum-200">
                          Active Profile
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-charcoal-600 mt-2 font-mono">
                        <span className="flex items-center gap-1.5 text-plum-950 font-semibold">
                          <svg className="w-3.5 h-3.5 text-magenta-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {candidate.email}
                        </span>
                        {candidate.phone && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-magenta-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {candidate.phone}
                          </span>
                        )}
                        <span>Added {new Date(candidate.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-plum to-burgundy hover:opacity-95 text-white text-xs font-mono font-semibold uppercase tracking-wider rounded-xl shadow-glow-magenta transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {resume ? 'Update PDF Resume' : 'Attach Resume'}
                    </button>
                    <Link
                      href={`/applications?candidateId=${candidate._id}`}
                      className="px-4 py-2.5 bg-neutral-tinted hover:bg-plum-100 text-plum-950 text-xs font-mono font-semibold rounded-xl border border-border-luxury transition"
                    >
                      View Applications ({applications.length})
                    </Link>
                  </div>
                </div>

                {/* Experience & Core Competencies Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-2xl bg-neutral-tinted border border-border-luxury">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal-600 block mb-1">
                      Professional Tenor
                    </span>
                    <div className="font-editorial text-3xl font-bold text-plum-950">
                      {candidate.experienceYears}{' '}
                      <span className="text-xs font-sans font-normal text-charcoal-600">
                        {candidate.experienceYears === 1 ? 'Year' : 'Years'} History
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 p-4 rounded-2xl bg-neutral-tinted border border-border-luxury">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal-600 block mb-2">
                      Verified Competency Profile ({candidate.skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-border-luxury text-plum-950 text-xs rounded-lg font-mono font-medium shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Resume Document Dossier & Application History */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Resume Document Dossier (2 Cols) */}
                <div className="lg:col-span-2 bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury p-7 shadow-luxury-subtle">
                  <div className="flex items-center justify-between pb-4 border-b border-border-luxury mb-5">
                    <div>
                      <h2 className="font-editorial text-2xl font-bold text-plum-950">Resume Document & Extracted Claims</h2>
                      <p className="text-xs text-charcoal-600 mt-0.5">Parsed text utilized by Gemini for multi-dimensional screening</p>
                    </div>
                    {resume && (
                      <span className="text-[11px] font-mono text-plum-900 px-3 py-1 bg-plum-100 rounded-lg border border-plum-200">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {!resume ? (
                    <div className="p-10 bg-neutral-tinted/60 rounded-3xl border-2 border-dashed border-border-luxury text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white text-plum flex items-center justify-center mx-auto mb-3 shadow-2xs border border-border-luxury">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="font-editorial text-xl font-bold text-plum-950 mb-1">No Resume Uploaded</h3>
                      <p className="text-xs text-charcoal-600 max-w-sm mx-auto mb-4 font-mono">
                        Attach a PDF resume to extract text claims and unlock the cinematic Evidence Lens.
                      </p>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-plum to-burgundy text-white text-xs font-mono font-semibold uppercase rounded-xl shadow-glow-magenta"
                      >
                        Upload PDF Document
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* File Metadata Card */}
                      <div className="p-4 bg-neutral-tinted rounded-2xl border border-border-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-burgundy-soft text-burgundy flex items-center justify-center font-mono font-bold text-xs border border-burgundy/30">
                            PDF
                          </div>
                          <div>
                            <div className="text-sm font-bold text-plum-950">{resume.fileName}</div>
                            <div className="text-xs text-charcoal-600 font-mono mt-0.5">
                              {(resume.fileSize / 1024).toFixed(1)} KB • {resume.mimeType}
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-plum-100 text-plum-900 border border-plum-200 rounded-lg text-xs font-mono font-semibold">
                          ✓ Text Ingested
                        </span>
                      </div>

                      {/* Text Excerpt Viewer */}
                      {resume.extractedText ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[10px] uppercase font-bold text-charcoal-600 tracking-wider">
                              Extracted Resume Content ({resume.extractedText.length.toLocaleString()} characters)
                            </span>
                            <span className="font-mono text-[10px] text-magenta-muted">
                              UTF-8 Plaintext
                            </span>
                          </div>
                          <div className="max-h-96 overflow-y-auto p-4 bg-neutral-tinted rounded-2xl border border-border-luxury text-xs font-mono text-charcoal-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                            {resume.extractedText}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-charcoal-600 font-mono italic">No text extracted from this document.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Applications Column (1 Col) */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-border-luxury p-7 shadow-luxury-subtle h-fit">
                  <div className="flex items-center justify-between pb-4 border-b border-border-luxury mb-4">
                    <div>
                      <h2 className="font-editorial text-2xl font-bold text-plum-950">Submissions ({applications.length})</h2>
                      <p className="text-xs text-charcoal-600 mt-0.5">Open pipeline requisitions</p>
                    </div>
                  </div>

                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-charcoal-600 font-mono mb-3">No active submissions on file.</p>
                      <Link
                        href="/applications"
                        className="inline-flex items-center text-xs font-mono font-semibold text-magenta-muted hover:text-plum transition-colors"
                      >
                        Link to an open role →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app) => (
                        <div
                          key={app._id}
                          className="p-4 rounded-2xl border border-border-luxury hover:border-plum-400 transition-all bg-neutral-tinted/50"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-xs font-bold text-plum-950 leading-snug">
                              {app.job?.title || 'Position'}
                            </h4>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded-md border ${
                                app.status === 'offered'
                                  ? 'bg-plum-100 text-plum-900 border-plum-200'
                                  : app.status === 'rejected'
                                  ? 'bg-burgundy-soft text-burgundy border-burgundy/30'
                                  : 'bg-white text-plum-900 border-border-luxury'
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-600">
                            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                            <Link
                              href={`/applications/${app._id}`}
                              className="font-semibold text-magenta-muted hover:text-plum flex items-center gap-1"
                            >
                              Open Lens →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal */}
          {candidate && (
            <ResumeUploadModal
              candidateId={candidate._id}
              candidateName={candidate.name}
              isOpen={showUploadModal}
              onClose={() => setShowUploadModal(false)}
              onUploadSuccess={fetchCandidateData}
            />
          )}
        </div>
      </WorkspaceLayout>
    </ProtectedRoute>
  );
}
