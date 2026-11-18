'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { Navbar } from '../../../components/Navbar';
import { ApiService } from '../../../services/api';
import { Application, ScreeningResult, InterviewQuestion, ApplicationStatus } from '../../../types';

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [application, setApplication] = useState<Application | null>(null);
  const [screening, setScreening] = useState<ScreeningResult | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Action states
  const [screeningLoading, setScreeningLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const appRes = await ApiService.getApplicationById(id);
      if (appRes.data) {
        setApplication(appRes.data);
      }

      // Load existing screening result if available
      try {
        const screenRes = await ApiService.getScreeningResult(id);
        if (screenRes.data) setScreening(screenRes.data);
      } catch (_) {
        // No screening yet
      }

      // Load existing interview questions if available
      try {
        const qRes = await ApiService.getInterviewQuestions(id);
        if (qRes.data) setInterviewQuestions(qRes.data);
      } catch (_) {
        // No questions yet
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleScreenResume = async () => {
    if (!id) return;
    setScreeningLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await ApiService.screenApplication(id);
      if (res.data) {
        setScreening(res.data);
        setActionSuccess('AI resume screening completed successfully!');
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to run AI resume screening');
    } finally {
      setScreeningLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!id) return;
    setQuestionsLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await ApiService.generateQuestions(id);
      if (res.data) {
        setInterviewQuestions(res.data);
        setActionSuccess('Interview questions generated successfully!');
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to generate interview questions');
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application) return;
    try {
      await ApiService.updateApplicationStatus(application._id, newStatus);
      setApplication({ ...application, status: newStatus });
      setActionSuccess(`Application status changed to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update status');
    }
  };

  const statuses: ApplicationStatus[] = ['applied', 'screening', 'interview', 'offered', 'rejected'];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/applications" className="hover:underline">
              Applications
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Application Review</span>
          </div>

          {loading && (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 mt-4">Loading application from MongoDB...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm">
              <h2 className="text-lg font-bold text-red-600 mb-2">Error</h2>
              <p className="text-sm text-slate-600 mb-4">{error}</p>
              <Link href="/applications" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium">
                Back to Applications
              </Link>
            </div>
          )}

          {actionSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{actionSuccess}</span>
              </div>
              <button onClick={() => setActionSuccess(null)} className="text-xs text-emerald-700 font-bold">×</button>
            </div>
          )}

          {actionError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{actionError}</span>
              </div>
              <button onClick={() => setActionError(null)} className="text-xs text-red-700 font-bold">×</button>
            </div>
          )}

          {!loading && !error && application && (
            <div className="space-y-6">
              {/* Application Header Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {application.candidate?.name}
                      </h1>
                      <span className="text-slate-400 font-normal">applying for</span>
                      <span className="text-lg font-bold text-teal-700">
                        {application.job?.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Candidate: {application.candidate?.email} • Applied on{' '}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status:</label>
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                      className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white shadow-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* AI Actions Row */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleScreenResume}
                    disabled={screeningLoading}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {screeningLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>{screening ? 'Re-screen Resume (AI)' : 'Screen Resume with AI'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateQuestions}
                    disabled={questionsLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {questionsLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating Questions...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{interviewQuestions ? 'Regenerate Questions' : 'Generate Interview Questions'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Screening Results Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">AI Resume Screening Result</h2>
                    <p className="text-xs text-slate-500">
                      Objective analysis comparing extracted resume against job requirements
                    </p>
                  </div>
                  {screening && (
                    <span className="text-xs text-slate-400">
                      Evaluated {new Date(screening.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {!screening ? (
                  <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                    <p className="text-sm text-slate-600 mb-3">
                      Resume screening has not been run for this application yet.
                    </p>
                    <button
                      onClick={handleScreenResume}
                      disabled={screeningLoading}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Run AI Screening Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Screening Summary Alert */}
                    <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-1">
                        Screening Summary
                      </h3>
                      <p className="text-sm text-teal-950 leading-relaxed">{screening.summary}</p>
                    </div>

                    {/* Skills Comparison Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Matching Skills */}
                      <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                            Matching Skills ({screening.matchingSkills.length})
                          </h4>
                        </div>
                        {screening.matchingSkills.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">No exact matching required skills identified.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {screening.matchingSkills.map((sk, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md">
                                ✓ {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Missing or Unverified Skills */}
                      <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                            Missing or Unverified Skills ({screening.missingSkills.length})
                          </h4>
                        </div>
                        {screening.missingSkills.length === 0 ? (
                          <p className="text-xs text-emerald-700 font-medium text-xs">All required job skills verified in resume.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {screening.missingSkills.map((sk, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-medium rounded-md">
                                ✗ {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experience Analysis */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Experience Comparison
                      </h4>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed">
                        {screening.experienceAnalysis}
                      </div>
                    </div>

                    {/* Detailed Explanation */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Recruiter Analysis & Explanation
                      </h4>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {screening.explanation}
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 italic">
                      Notice: AI-assisted evaluation provides screening support. Final hiring decisions remain exclusively with the recruiter.
                    </div>
                  </div>
                )}
              </div>

              {/* Interview Questions Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Tailored Interview Questions</h2>
                    <p className="text-xs text-slate-500">
                      Generated questions to evaluate technical depth and verify resume claims
                    </p>
                  </div>
                  {interviewQuestions && (
                    <span className="text-xs text-slate-400">
                      {interviewQuestions.questions.length} questions ready
                    </span>
                  )}
                </div>

                {!interviewQuestions ? (
                  <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                    <p className="text-sm text-slate-600 mb-3">
                      No interview questions have been generated for this application yet.
                    </p>
                    <button
                      onClick={handleGenerateQuestions}
                      disabled={questionsLoading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Generate Interview Questions
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interviewQuestions.questions.map((q, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                            Q{idx + 1} • {q.category}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 mb-2">
                          {q.question}
                        </p>
                        {q.context && (
                          <p className="text-xs text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200/80">
                            <span className="font-semibold text-slate-700">Evaluation Context:</span> {q.context}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
