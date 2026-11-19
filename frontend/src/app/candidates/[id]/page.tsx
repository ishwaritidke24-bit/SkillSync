'use client';

import { useState, useEffect } from 'react';
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

  const fetchCandidateData = async () => {
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
  };

  useEffect(() => {
    fetchCandidateData();
  }, [id]);

  return (
    <ProtectedRoute>
      <WorkspaceLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#718096]">
            <Link href="/candidates" className="hover:text-[#171923] transition-colors font-medium">
              Candidates
            </Link>
            <span className="text-[#A0AEC0]">/</span>
            <span className="text-[#171923] font-semibold">
              {candidate ? candidate.name : 'Profile Dossier'}
            </span>
          </div>

          {loading && (
            <div className="py-24 flex flex-col items-center justify-center bg-white rounded-2xl border border-[#EAECEF] shadow-card">
              <div className="w-10 h-10 border-2 border-[#5949D6] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-[#718096] mt-4">Retrieving candidate profile and resume metadata...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-card">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 font-mono font-bold">!</div>
              <h2 className="text-base font-bold text-[#171923] mb-1">Unable to Load Dossier</h2>
              <p className="text-xs text-[#718096] mb-5">{error}</p>
              <Link href="/candidates" className="inline-flex items-center px-4 py-2 bg-[#171923] hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition">
                ← Return to Directory
              </Link>
            </div>
          )}

          {!loading && !error && candidate && (
            <div className="space-y-6">
              {/* Profile Editorial Header Banner */}
              <div className="bg-white rounded-2xl border border-[#EAECEF] p-6 sm:p-8 shadow-card">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#F0F2F5]">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5949D6] to-[#4338CA] text-white flex items-center justify-center text-xl font-bold tracking-tight shadow-sm flex-shrink-0">
                      {candidate.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-[#171923] tracking-tight">{candidate.name}</h1>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E2F5EF] text-[#0D9488]">
                          Active Candidate
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#718096] mt-2 font-mono">
                        <span className="flex items-center gap-1.5 text-[#171923]">
                          <svg className="w-3.5 h-3.5 text-[#718096]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {candidate.email}
                        </span>
                        {candidate.phone && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[#718096]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {candidate.phone}
                          </span>
                        )}
                        <span>Enrolled {new Date(candidate.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2.5 bg-[#5949D6] hover:bg-[#4a3cb8] text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {resume ? 'Update PDF Resume' : 'Attach Resume'}
                    </button>
                    <Link
                      href={`/applications?candidateId=${candidate._id}`}
                      className="px-4 py-2.5 bg-[#F5F4EF] hover:bg-[#EAECEF] text-[#171923] text-xs font-semibold rounded-xl border border-[#EAECEF] transition-all"
                    >
                      View Applications ({applications.length})
                    </Link>
                  </div>
                </div>

                {/* Experience & Core Competencies Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-[#F5F4EF]/70 border border-[#EAECEF]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#718096] block mb-1">
                      Professional Tenor
                    </span>
                    <div className="text-2xl font-bold text-[#171923] tracking-tight">
                      {candidate.experienceYears}{' '}
                      <span className="text-xs font-normal text-[#718096]">
                        {candidate.experienceYears === 1 ? 'Year' : 'Years'} Total Experience
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 p-4 rounded-xl bg-[#F5F4EF]/70 border border-[#EAECEF]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#718096] block mb-2">
                      Verified Competencies ({candidate.skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-[#EAECEF] text-[#171923] text-xs rounded-lg font-medium shadow-2xs"
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
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EAECEF] p-6 shadow-card">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0F2F5] mb-5">
                    <div>
                      <h2 className="text-base font-bold text-[#171923] tracking-tight">Resume Document & Extracted Evidence</h2>
                      <p className="text-xs text-[#718096] mt-0.5">Parsed text utilized by Gemini for multi-dimensional screening</p>
                    </div>
                    {resume && (
                      <span className="text-[11px] font-mono text-[#718096] px-2.5 py-1 bg-[#F5F4EF] rounded-md border border-[#EAECEF]">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {!resume ? (
                    <div className="p-10 bg-[#F5F4EF]/50 rounded-2xl border-2 border-dashed border-[#D2D6DC] text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white text-[#718096] flex items-center justify-center mx-auto mb-3 shadow-2xs border border-[#EAECEF]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-[#171923] mb-1">No Resume Uploaded</h3>
                      <p className="text-xs text-[#718096] max-w-sm mx-auto mb-4">
                        Upload a PDF resume to extract text claims and enable deep Gemini AI multi-criteria screening.
                      </p>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-4 py-2 bg-[#5949D6] hover:bg-[#4a3cb8] text-white text-xs font-semibold rounded-xl shadow-sm transition"
                      >
                        Upload PDF Document
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* File Metadata Card */}
                      <div className="p-4 bg-[#F5F4EF]/70 rounded-xl border border-[#EAECEF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 font-mono font-bold text-xs border border-red-100">
                            PDF
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#171923]">{resume.fileName}</div>
                            <div className="text-xs text-[#718096] font-mono mt-0.5">
                              {(resume.fileSize / 1024).toFixed(1)} KB • {resume.mimeType}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-[#E2F5EF] text-[#0D9488] border border-[#A7F3D0] rounded-lg text-[11px] font-mono font-semibold">
                            ✓ Text Ingested
                          </span>
                        </div>
                      </div>

                      {/* Text Excerpt Viewer */}
                      {resume.extractedText ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-[#718096]">
                              Extracted Resume Content ({resume.extractedText.length.toLocaleString()} characters)
                            </span>
                            <span className="text-[10px] text-[#A0AEC0] font-mono">
                              UTF-8 Plaintext
                            </span>
                          </div>
                          <div className="max-h-96 overflow-y-auto p-4 bg-[#F5F4EF]/90 rounded-xl border border-[#EAECEF] text-xs font-mono text-[#2D3748] whitespace-pre-wrap leading-relaxed shadow-inner">
                            {resume.extractedText}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#718096] italic">No text extracted from this document.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Applications Column (1 Col) */}
                <div className="bg-white rounded-2xl border border-[#EAECEF] p-6 shadow-card h-fit">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0F2F5] mb-4">
                    <div>
                      <h2 className="text-base font-bold text-[#171923] tracking-tight">Applications ({applications.length})</h2>
                      <p className="text-xs text-[#718096] mt-0.5">Open pipeline submissions</p>
                    </div>
                  </div>

                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-[#718096] mb-3">No active submissions on file.</p>
                      <Link
                        href="/applications"
                        className="inline-flex items-center text-xs font-semibold text-[#5949D6] hover:underline"
                      >
                        Submit to an open role →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app) => (
                        <div
                          key={app._id}
                          className="p-3.5 rounded-xl border border-[#EAECEF] hover:border-[#5949D6]/40 transition-colors bg-[#F5F4EF]/40"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-xs font-bold text-[#171923] leading-snug">
                              {app.job?.title || 'Position'}
                            </h4>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded-md border ${
                                app.status === 'offered'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : app.status === 'rejected'
                                  ? 'bg-red-50 text-red-600 border-red-200'
                                  : app.status === 'screening' || app.status === 'interview'
                                  ? 'bg-[#EEF2FF] text-[#5949D6] border-[#C7D2FE]'
                                  : 'bg-white text-[#718096] border-[#EAECEF]'
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#718096]">
                            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                            <Link
                              href={`/applications/${app._id}`}
                              className="font-medium text-[#5949D6] hover:underline flex items-center gap-1"
                            >
                              Open Lens
                              <span aria-hidden="true">→</span>
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
