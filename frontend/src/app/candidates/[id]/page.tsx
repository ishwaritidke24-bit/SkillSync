'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { Navbar } from '../../../components/Navbar';
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
      setError(err.message || 'Failed to load candidate');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateData();
  }, [id]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/candidates" className="hover:underline">
              Candidates
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Candidate Profile</span>
          </div>

          {loading && (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 mt-4">Loading candidate profile from MongoDB...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm">
              <h2 className="text-lg font-bold text-red-600 mb-2">Error</h2>
              <p className="text-sm text-slate-600 mb-4">{error}</p>
              <Link href="/candidates" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium">
                Back to Candidates
              </Link>
            </div>
          )}

          {!loading && !error && candidate && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{candidate.name}</h1>
                    <p className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span>{candidate.email}</span>
                      {candidate.phone && <span>• {candidate.phone}</span>}
                      <span>• Added {new Date(candidate.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {resume ? 'Re-upload Resume' : 'Upload Resume'}
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Core Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Years of Experience
                    </h3>
                    <p className="text-sm font-bold text-slate-800">
                      {candidate.experienceYears} {candidate.experienceYears === 1 ? 'Year' : 'Years'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resume Information Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900">Resume Information</h2>
                  {resume && (
                    <span className="text-xs text-slate-500">
                      Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {!resume ? (
                  <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                    <p className="text-sm text-slate-600 mb-3">No resume uploaded for this candidate yet.</p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Upload PDF Resume
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-semibold text-slate-800">{resume.fileName}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Size: {(resume.fileSize / 1024).toFixed(1)} KB • Type: {resume.mimeType}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold self-start sm:self-auto">
                        Parsed & Associated
                      </span>
                    </div>

                    {resume.extractedText && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                          Extracted Resume Content ({resume.extractedText.length} characters)
                        </h4>
                        <div className="max-h-60 overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {resume.extractedText}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Associated Applications */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Job Applications ({applications.length})</h2>
                    <p className="text-xs text-slate-500">Each application maintains its own independent status</p>
                  </div>
                  <Link
                    href={`/applications?candidateId=${candidate._id}`}
                    className="text-xs font-semibold text-teal-600 hover:underline"
                  >
                    View in Applications →
                  </Link>
                </div>

                {applications.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No job applications submitted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app._id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{app.job?.title || 'Unknown Position'}</p>
                          <p className="text-xs text-slate-500">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-semibold uppercase text-slate-700">
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
        </main>
      </div>
    </ProtectedRoute>
  );
}
