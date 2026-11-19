'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { SignalLogo } from '../../../components/SignalLogo';
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

  // Evidence Lens interactive node selection
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'screening' | 'questions'>('screening');
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'unverified'>('all');

  const fetchData = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScreenResume = async () => {
    if (!id) return;
    setScreeningLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await ApiService.screenApplication(id);
      if (res.data) {
        setScreening(res.data);
        setActionSuccess('AI evidence screening completed.');
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
        setActiveTab('questions');
        setActionSuccess('Interview questions synthesized by Gemini.');
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

  // Graph model: derive network nodes and edges from candidate skills and job requirements
  const networkData = useMemo(() => {
    if (!application) return { nodes: [], edges: [] };

    const candidateSkills = application.candidate?.skills || [];
    const jobSkills = application.job?.requiredSkills || [];
    const matchingSet = new Set(screening?.matchingSkills.map((s) => s.toLowerCase()) || []);
    const missingSet = new Set(screening?.missingSkills.map((s) => s.toLowerCase()) || []);

    const nodes: Array<{
      id: string;
      label: string;
      type: 'candidate_skill' | 'job_req' | 'hub';
      status: 'match' | 'missing' | 'neutral';
      category: string;
      confidence: number;
      x: number;
      y: number;
    }> = [];

    // Central intelligence hub (Synapse Signal Core)
    nodes.push({
      id: 'lens-core',
      label: 'The Signal Core',
      type: 'hub',
      status: 'neutral',
      category: 'AI Engine',
      confidence: 98,
      x: 300,
      y: 190,
    });

    // Left column: Candidate skills (up to 5 displayed nodes)
    candidateSkills.slice(0, 5).forEach((skill, idx) => {
      const isMatch = matchingSet.has(skill.toLowerCase());
      nodes.push({
        id: `c-skill-${idx}`,
        label: skill,
        type: 'candidate_skill',
        status: isMatch ? 'match' : 'neutral',
        category: 'Candidate Claim',
        confidence: isMatch ? 94 : 70,
        x: 80,
        y: 60 + idx * 65,
      });
    });

    // Right column: Job required skills (up to 5 displayed nodes)
    jobSkills.slice(0, 5).forEach((skill, idx) => {
      const isMatch = matchingSet.has(skill.toLowerCase());
      const isMissing = missingSet.has(skill.toLowerCase());
      nodes.push({
        id: `j-req-${idx}`,
        label: skill,
        type: 'job_req',
        status: isMatch ? 'match' : isMissing ? 'missing' : 'neutral',
        category: 'Job Requirement',
        confidence: isMatch ? 96 : isMissing ? 20 : 60,
        x: 520,
        y: 60 + idx * 65,
      });
    });

    // Edges connecting left -> hub -> right
    const edges: Array<{
      id: string;
      from: string;
      to: string;
      status: 'match' | 'missing' | 'neutral';
    }> = [];

    nodes
      .filter((n) => n.type === 'candidate_skill')
      .forEach((cn) => {
        edges.push({
          id: `${cn.id}-core`,
          from: cn.id,
          to: 'lens-core',
          status: cn.status,
        });
      });

    nodes
      .filter((n) => n.type === 'job_req')
      .forEach((jn) => {
        edges.push({
          id: `core-${jn.id}`,
          from: 'lens-core',
          to: jn.id,
          status: jn.status,
        });
      });

    return { nodes, edges };
  }, [application, screening]);

  const selectedNodeInfo = useMemo(() => {
    if (!selectedNodeId) return null;
    return networkData.nodes.find((n) => n.id === selectedNodeId) || null;
  }, [selectedNodeId, networkData]);

  // Confidence and verification score derivation from existing screening results
  const verificationScore = useMemo(() => {
    if (!screening) return null;
    const matchCount = screening.matchingSkills.length;
    const missingCount = screening.missingSkills.length;
    const total = matchCount + missingCount;
    if (total === 0) return 0;
    return Math.round((matchCount / total) * 100);
  }, [screening]);

  return (
    <ProtectedRoute>
      {/* Cinematic Dark Environment Container (Chromatic Luxury Synapse x Vaultflow) */}
      <div className="evidence-lens-theme min-h-screen bg-[#0E0D14] text-lavender-soft relative selection:bg-magenta-muted/40 selection:text-white overflow-hidden">
        {/* Layered Cinematic Atmospheric Radiance */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-plum-700/25 via-burgundy-800/20 to-transparent rounded-full blur-3xl animate-synapse-glow" />
          <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-gradient-to-tr from-violet-rich/20 via-magenta-vivid/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-plum-950/40 via-burgundy-950/30 to-charcoal-950/50 blur-3xl" />
        </div>

        {/* Cinematic Header / HUD Bar with Live Telemetry Pulse */}
        <header className="relative z-40 bg-[#17151F]/85 backdrop-blur-md border-b border-plum-800/40 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4">
            <Link
              href="/applications"
              className="px-3.5 py-1.5 rounded-xl bg-plum-900/60 hover:bg-plum-800/80 text-xs font-mono font-semibold text-lavender hover:text-white border border-plum-700/50 transition flex items-center gap-2 shadow-sm"
            >
              <span aria-hidden="true">←</span> Exit Evidence Lens
            </Link>

            <div className="h-4 w-[1px] bg-plum-700/40 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-plum-900/80 border border-plum-700/50 shadow-glow-violet">
                <SignalLogo theme="dark" size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-editorial text-lg tracking-wide text-white">
                    Evidence Lens
                  </span>
                  <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-magenta-muted/20 text-magenta-rose border border-magenta-muted/40 uppercase">
                    Vaultflow AI
                  </span>
                </div>
                <p className="text-[10px] text-lavender/60 font-mono">
                  Multi-Dimensional Claim Verification Field • Gemini Model Live
                </p>
              </div>
            </div>
          </div>

          {/* Right Status Controls with Confidence Pill */}
          <div className="flex items-center gap-3">
            {verificationScore !== null && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-plum-950/80 border border-plum-700/60 font-mono text-xs">
                <span className="text-lavender/60 text-[10px] uppercase">Match Score:</span>
                <span className="font-bold text-lens-cyan">{verificationScore}%</span>
              </div>
            )}
            {application && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-lavender/60 hidden md:inline">
                  Stage:
                </span>
                <select
                  value={application.status}
                  onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-plum-900/80 border border-plum-700/60 text-white font-mono font-semibold uppercase cursor-pointer focus:outline-none focus:border-magenta-rose transition"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st} className="bg-[#17151F] text-white">
                      {st.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </header>

        <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Notifications */}
          {actionSuccess && (
            <div className="p-3.5 bg-plum-950/90 border border-magenta-muted/40 rounded-2xl text-xs text-lavender flex items-center justify-between font-mono animate-in fade-in shadow-glow-magenta">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-magenta-rose animate-pulse"></span>
                {actionSuccess}
              </span>
              <button onClick={() => setActionSuccess(null)} className="text-magenta-rose hover:text-white text-sm font-bold">
                ✕
              </button>
            </div>
          )}

          {actionError && (
            <div className="p-3.5 bg-burgundy-950/90 border border-burgundy-700 rounded-2xl text-xs text-rose-300 flex items-center justify-between font-mono animate-in fade-in">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                {actionError}
              </span>
              <button onClick={() => setActionError(null)} className="text-rose-300 hover:text-white text-sm font-bold">
                ✕
              </button>
            </div>
          )}

          {loading && (
            <div className="py-32 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-2 border-magenta-rose border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-lavender/70 mt-4 tracking-wider">
                INITIALIZING CHROMATIC INTELLIGENCE GRAPH...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-[#17151F] rounded-3xl border border-burgundy-700/40 p-8 text-center max-w-lg mx-auto shadow-2xl">
              <h2 className="text-base font-bold text-rose-300 mb-2 font-mono">Dossier Unavailable</h2>
              <p className="text-xs text-lavender/70 mb-4">{error}</p>
              <Link
                href="/applications"
                className="px-4 py-2 bg-plum-900 hover:bg-plum-800 text-white text-xs font-semibold rounded-xl font-mono transition"
              >
                ← Return to Applications
              </Link>
            </div>
          )}

          {!loading && !error && application && (
            <div className="space-y-6">
              {/* Dossier Bar / Top Context */}
              <div className="bg-gradient-to-r from-plum-950/90 via-burgundy-950/80 to-[#17151F]/90 rounded-3xl border border-plum-800/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-rich via-magenta-muted to-burgundy text-white font-bold flex items-center justify-center text-lg font-mono flex-shrink-0 shadow-glow-magenta border border-white/20">
                    {application.candidate?.name.slice(0, 2).toUpperCase() || 'ID'}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {application.candidate?.name}
                      </h1>
                      <span className="text-lavender/40 text-xs font-mono">evaluating against</span>
                      <span className="font-mono text-sm font-bold text-magenta-rose bg-magenta-muted/10 px-2.5 py-0.5 rounded-lg border border-magenta-muted/30">
                        {application.job?.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-lavender/70 font-mono mt-1">
                      Candidate: {application.candidate?.email} • Tenor: {application.candidate?.experienceYears} yrs • Target Range: {application.job?.experienceMin}-{application.job?.experienceMax} yrs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleScreenResume}
                    disabled={screeningLoading}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-plum via-burgundy to-royal hover:opacity-95 text-white text-xs font-semibold font-mono tracking-wide shadow-glow-magenta transition flex items-center gap-2 disabled:opacity-50 border border-plum-600/40"
                  >
                    {screeningLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>PROCESSING CLAIMS...</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-magenta-rose animate-pulse"></span>
                        <span>{screening ? 'RE-SCREEN (GEMINI)' : 'EXECUTE AI SCREENING'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateQuestions}
                    disabled={questionsLoading}
                    className="px-4 py-2.5 rounded-xl bg-plum-900/80 hover:bg-plum-800 text-lavender text-xs font-semibold font-mono tracking-wide border border-plum-700/50 shadow-sm transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {questionsLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-lavender border-t-transparent rounded-full animate-spin"></div>
                        <span>SYNTHESIZING...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-magenta-rose">✦</span>
                        <span>{interviewQuestions ? 'RE-GEN QUESTIONS' : 'GENERATE QUESTIONS'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Three-Column Analytical Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT PANEL: Source Evidence & Extracted Resume Claims (3 cols) */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-[#17151F]/90 backdrop-blur-md rounded-3xl border border-plum-800/40 p-5 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-plum-800/40 mb-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-lavender/70 font-semibold">
                        Candidate Stated Claims
                      </span>
                      <span className="font-mono text-[10px] text-magenta-rose bg-magenta-muted/10 px-2 py-0.5 rounded border border-magenta-muted/30">
                        {application.candidate?.skills.length || 0} Skills
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {application.candidate?.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSelectedNodeId(`c-skill-${idx}`)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono border cursor-pointer transition ${
                            selectedNodeId === `c-skill-${idx}`
                              ? 'bg-plum-800 text-white border-magenta-rose shadow-glow-magenta'
                              : 'bg-plum-950/80 text-lavender border-plum-800/60 hover:border-magenta-rose'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-plum-800/40">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-lavender/70 block mb-1">
                        Professional History
                      </span>
                      <div className="font-editorial text-2xl font-bold text-white">
                        {application.candidate?.experienceYears}{' '}
                        <span className="font-sans text-xs font-normal text-lavender/60">
                          Years Recorded
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Job Requirements Blueprint */}
                  <div className="bg-[#17151F]/90 backdrop-blur-md rounded-3xl border border-plum-800/40 p-5 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-plum-800/40 mb-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-lavender/70 font-semibold">
                        Requisition Blueprint
                      </span>
                      <span className="font-mono text-[10px] text-lavender bg-plum-900/60 px-2 py-0.5 rounded border border-plum-700/50">
                        {application.job?.requiredSkills.length || 0} Required
                      </span>
                    </div>

                    <p className="text-xs font-bold text-white mb-1.5">{application.job?.title}</p>
                    <p className="font-mono text-[11px] text-lavender/60 mb-3">
                      Threshold: {application.job?.experienceMin} - {application.job?.experienceMax} years
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {application.job?.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSelectedNodeId(`j-req-${idx}`)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer transition ${
                            selectedNodeId === `j-req-${idx}`
                              ? 'bg-plum-800 text-white border-violet-rich shadow-glow-violet'
                              : 'bg-plum-950/80 text-lavender border-plum-800/60 hover:border-violet-rich'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CENTER PANEL: Interactive Evidence Connection Field (5 cols) */}
                <div className="lg:col-span-5 bg-[#17151F]/90 backdrop-blur-md rounded-3xl border border-plum-800/40 p-5 shadow-2xl flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-plum-800/40 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-magenta-rose animate-pulse"></span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-white font-bold">
                        Synapse Neural Field
                      </span>
                    </div>

                    {/* Filter Mode Switcher */}
                    <div className="flex items-center gap-1 bg-[#0E0D14] p-1 rounded-lg border border-plum-800/60 font-mono text-[9px]">
                      <button
                        onClick={() => setFilterMode('all')}
                        className={`px-2 py-0.5 rounded transition ${
                          filterMode === 'all' ? 'bg-plum-800 text-white font-bold' : 'text-lavender/50'
                        }`}
                      >
                        ALL
                      </button>
                      <button
                        onClick={() => setFilterMode('verified')}
                        className={`px-2 py-0.5 rounded transition ${
                          filterMode === 'verified' ? 'bg-plum-800 text-lens-cyan font-bold' : 'text-lavender/50'
                        }`}
                      >
                        MATCH
                      </button>
                      <button
                        onClick={() => setFilterMode('unverified')}
                        className={`px-2 py-0.5 rounded transition ${
                          filterMode === 'unverified' ? 'bg-plum-800 text-magenta-rose font-bold' : 'text-lavender/50'
                        }`}
                      >
                        GAP
                      </button>
                    </div>
                  </div>

                  {/* SVG Connected Graph Display with Multi-Stop Gradients */}
                  <div className="relative w-full h-[380px] bg-[#0E0D14] rounded-2xl border border-plum-800/50 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                    <svg
                      viewBox="0 0 600 380"
                      className="w-full h-full select-none"
                      style={{ maxHeight: '380px' }}
                    >
                      <defs>
                        <pattern id="synapseGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <circle cx="1" cy="1" r="0.8" fill="rgba(117, 80, 168, 0.25)" />
                        </pattern>
                        <linearGradient id="beamMatchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#CB9FF3" stopOpacity="0.9" />
                          <stop offset="50%" stopColor="#D58B9B" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#D7BEA0" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="beamMissingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7550A8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#A8447A" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>

                      <rect width="600" height="380" fill="url(#synapseGrid)" />

                      {/* Connection Edges */}
                      {networkData.edges.map((edge) => {
                        const fromNode = networkData.nodes.find((n) => n.id === edge.from);
                        const toNode = networkData.nodes.find((n) => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        // Filter visibility based on filterMode
                        if (filterMode === 'verified' && edge.status !== 'match') return null;
                        if (filterMode === 'unverified' && edge.status !== 'missing') return null;

                        const isSelected =
                          selectedNodeId &&
                          (edge.from === selectedNodeId || edge.to === selectedNodeId);

                        const strokeColor =
                          edge.status === 'match'
                            ? 'url(#beamMatchGrad)'
                            : edge.status === 'missing'
                            ? 'url(#beamMissingGrad)'
                            : 'rgba(84, 36, 63, 0.4)';

                        return (
                          <g key={edge.id}>
                            <line
                              x1={fromNode.x}
                              y1={fromNode.y}
                              x2={toNode.x}
                              y2={toNode.y}
                              stroke={strokeColor}
                              strokeWidth={isSelected ? 2.5 : 1.5}
                              strokeDasharray={edge.status === 'missing' ? '4,4' : undefined}
                              opacity={isSelected ? 1 : 0.65}
                              className="transition-all duration-300"
                            />
                            {edge.status === 'match' && (
                              <circle
                                cx={(fromNode.x + toNode.x) / 2}
                                cy={(fromNode.y + toNode.y) / 2}
                                r="2.5"
                                fill="#D58B9B"
                                className="animate-pulse"
                              />
                            )}
                          </g>
                        );
                      })}

                      {/* Nodes */}
                      {networkData.nodes.map((node) => {
                        const isSelected = selectedNodeId === node.id;
                        const isHub = node.type === 'hub';

                        let fillColor = '#1F102B';
                        let strokeColor = 'rgba(117, 80, 168, 0.4)';
                        let textColor = '#D8C7EB';

                        if (isHub) {
                          fillColor = '#140A1C';
                          strokeColor = '#A74778';
                          textColor = '#FFFFFF';
                        } else if (node.status === 'match') {
                          strokeColor = '#D58B9B';
                          textColor = '#D58B9B';
                        } else if (node.status === 'missing') {
                          strokeColor = '#A8447A';
                          textColor = '#F4DFEA';
                        }

                        if (isSelected) {
                          strokeColor = '#FFFFFF';
                          fillColor = '#2F1A42';
                        }

                        return (
                          <g
                            key={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            className="cursor-pointer group"
                          >
                            {isHub ? (
                              <g>
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="26"
                                  fill="#140A1C"
                                  stroke={strokeColor}
                                  strokeWidth="2"
                                  className="transition-all"
                                />
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="32"
                                  fill="none"
                                  stroke="#D58B9B"
                                  strokeWidth="0.8"
                                  strokeDasharray="3,3"
                                  className="animate-spin"
                                  style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: '18s' }}
                                />
                                <text
                                  x={node.x}
                                  y={node.y + 4}
                                  textAnchor="middle"
                                  fill="#D58B9B"
                                  fontSize="9.5"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  SYNAPSE
                                </text>
                              </g>
                            ) : (
                              <g>
                                <rect
                                  x={node.x - 55}
                                  y={node.y - 14}
                                  width="110"
                                  height="28"
                                  rx="8"
                                  fill={fillColor}
                                  stroke={strokeColor}
                                  strokeWidth={isSelected ? '2' : '1'}
                                  className="transition-all group-hover:stroke-white"
                                />
                                <text
                                  x={node.x}
                                  y={node.y + 4}
                                  textAnchor="middle"
                                  fill={textColor}
                                  fontSize="9.5"
                                  fontFamily="monospace"
                                  fontWeight={isSelected ? 'bold' : 'normal'}
                                >
                                  {node.label.length > 13 ? `${node.label.slice(0, 12)}…` : node.label}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Selected Node Inspector Footer with Real Confidence Telemetry */}
                  <div className="mt-3 p-3.5 bg-[#0E0D14] rounded-2xl border border-plum-800/40">
                    {selectedNodeInfo ? (
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lavender/60 text-[10px] uppercase font-semibold">
                              {selectedNodeInfo.category}:
                            </span>
                            <span className="text-white font-bold">{selectedNodeInfo.label}</span>
                          </div>
                          <span className="text-[10px] text-lavender/50 block mt-0.5">
                            Correlation Confidence: {selectedNodeInfo.confidence}%
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase font-mono ${
                            selectedNodeInfo.status === 'match'
                              ? 'bg-plum-900 text-magenta-rose border border-magenta-rose/40'
                              : selectedNodeInfo.status === 'missing'
                              ? 'bg-burgundy-900 text-rose-300 border border-burgundy-700'
                              : 'bg-plum-950 text-lavender'
                          }`}
                        >
                          {selectedNodeInfo.status === 'match'
                            ? 'CLAIM VERIFIED'
                            : selectedNodeInfo.status === 'missing'
                            ? 'REQUISITE GAP'
                            : 'NEUTRAL STATE'}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] font-mono text-lavender/60 text-center">
                        Select any claim or requirement node to inspect verified correlation.
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT PANEL: Recruiter Intelligence & Tabs (4 cols) */}
                <div className="lg:col-span-4 bg-[#17151F]/90 backdrop-blur-md rounded-3xl border border-plum-800/40 p-5 shadow-2xl flex flex-col space-y-4">
                  {/* Tab switcher */}
                  <div className="flex items-center bg-[#0E0D14] p-1.5 rounded-2xl border border-plum-800/50">
                    <button
                      onClick={() => setActiveTab('screening')}
                      className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded-xl transition ${
                        activeTab === 'screening'
                          ? 'bg-gradient-to-r from-plum to-burgundy text-white shadow-sm border border-plum-600/40'
                          : 'text-lavender/60 hover:text-white'
                      }`}
                    >
                      AI Screening Result
                    </button>
                    <button
                      onClick={() => setActiveTab('questions')}
                      className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded-xl transition ${
                        activeTab === 'questions'
                          ? 'bg-gradient-to-r from-plum to-burgundy text-white shadow-sm border border-plum-600/40'
                          : 'text-lavender/60 hover:text-white'
                      }`}
                    >
                      Questions ({interviewQuestions?.questions.length || 0})
                    </button>
                  </div>

                  {/* Tab 1: AI Screening */}
                  {activeTab === 'screening' && (
                    <div className="space-y-4">
                      {!screening ? (
                        <div className="p-8 bg-[#0E0D14] rounded-2xl border border-dashed border-plum-800/60 text-center">
                          <p className="text-xs text-lavender/70 mb-3 font-mono">
                            No screening analysis recorded for this candidate submission.
                          </p>
                          <button
                            onClick={handleScreenResume}
                            disabled={screeningLoading}
                            className="px-4 py-2 bg-gradient-to-r from-plum to-burgundy hover:opacity-95 text-white text-xs font-semibold rounded-xl font-mono shadow-glow-magenta transition"
                          >
                            Execute Gemini Screening
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                          {/* Executive Summary */}
                          <div className="p-4 bg-[#0E0D14] rounded-2xl border border-plum-800/50">
                            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-magenta-rose block mb-1">
                              Executive Screening Digest
                            </span>
                            <p className="text-xs text-lavender leading-relaxed font-sans">
                              {screening.summary}
                            </p>
                          </div>

                          {/* Matching vs Missing Breakdown */}
                          <div className="space-y-2.5">
                            <div className="p-3.5 rounded-2xl bg-plum-950/80 border border-plum-700/50">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-magenta-rose"></span>
                                <span className="font-mono text-[10px] uppercase tracking-wider text-magenta-rose font-bold">
                                  Verified Skills ({screening.matchingSkills.length})
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {screening.matchingSkills.length === 0 ? (
                                  <span className="text-[11px] font-mono text-lavender/50 italic">None identified</span>
                                ) : (
                                  screening.matchingSkills.map((sk, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-plum-900 text-lavender border border-plum-700/60"
                                    >
                                      ✓ {sk}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-burgundy-950/80 border border-burgundy-800/60">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                <span className="font-mono text-[10px] uppercase tracking-wider text-rose-300 font-bold">
                                  Unverified / Gaps ({screening.missingSkills.length})
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {screening.missingSkills.length === 0 ? (
                                  <span className="text-[11px] font-mono text-lavender">All requirements verified</span>
                                ) : (
                                  screening.missingSkills.map((sk, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-burgundy-900 text-rose-300 border border-burgundy-700/60"
                                    >
                                      ✗ {sk}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Experience Analysis */}
                          <div className="p-4 bg-[#0E0D14] rounded-2xl border border-plum-800/50">
                            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-lavender/70 block mb-1">
                              Experience Tenor Analysis
                            </span>
                            <p className="text-xs text-lavender/90 leading-relaxed">
                              {screening.experienceAnalysis}
                            </p>
                          </div>

                          {/* Detailed Explanation */}
                          <div className="p-4 bg-[#0E0D14] rounded-2xl border border-plum-800/50">
                            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-lavender/70 block mb-1">
                              Detailed Recruiter Reasoning
                            </span>
                            <p className="text-xs text-lavender/70 leading-relaxed whitespace-pre-wrap">
                              {screening.explanation}
                            </p>
                          </div>

                          <p className="text-[10px] font-mono text-lavender/50 italic">
                            Evaluated via Google Gemini API • Data persisted in MongoDB screeningresults collection.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Interview Questions */}
                  {activeTab === 'questions' && (
                    <div className="space-y-4">
                      {!interviewQuestions ? (
                        <div className="p-8 bg-[#0E0D14] rounded-2xl border border-dashed border-plum-800/60 text-center">
                          <p className="text-xs text-lavender/70 mb-3 font-mono">
                            No tailored questions synthesized yet for this submission.
                          </p>
                          <button
                            onClick={handleGenerateQuestions}
                            disabled={questionsLoading}
                            className="px-4 py-2 bg-gradient-to-r from-plum to-burgundy hover:opacity-95 text-white text-xs font-semibold rounded-xl font-mono border border-plum-600/40 shadow-glow-magenta transition"
                          >
                            Generate Interview Questions
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                          {interviewQuestions.questions.map((q, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-[#0E0D14] rounded-2xl border border-plum-800/50 hover:border-magenta-rose/40 transition"
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-mono text-[10px] uppercase font-bold text-magenta-rose">
                                  Q{idx + 1} • {q.category}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-white mb-2 leading-snug">
                                {q.question}
                              </p>
                              {q.context && (
                                <div className="p-2.5 bg-plum-950/80 rounded-xl border border-plum-800/60 text-[11px] text-lavender/80">
                                  <span className="font-mono text-[9px] uppercase font-bold text-magenta-muted block mb-0.5">
                                    Evaluation Context
                                  </span>
                                  {q.context}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
