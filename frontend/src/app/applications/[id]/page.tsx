'use client';

import { useState, useEffect, useMemo } from 'react';
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
      x: number;
      y: number;
    }> = [];

    // Central intelligence hub
    nodes.push({
      id: 'lens-core',
      label: 'The Signal Core',
      type: 'hub',
      status: 'neutral',
      category: 'AI Engine',
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

  return (
    <ProtectedRoute>
      {/* Cinematic Dark Environment Container (World 02: Evidence Lens) */}
      <div className="evidence-lens-theme min-h-screen bg-[#090B14] text-[#E2E8F0] selection:bg-[#5949D6]/40 selection:text-white">
        {/* Cinematic Header / HUD Bar */}
        <header className="sticky top-0 z-40 bg-[#0E111F]/90 backdrop-blur-md border-b border-[#1F273E] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/applications"
              className="px-3 py-1.5 rounded-lg bg-[#151A2A] hover:bg-[#1D2338] text-xs font-semibold text-[#94A3B8] hover:text-white border border-[#26314D] transition flex items-center gap-1.5"
            >
              <span aria-hidden="true">←</span> Exit Evidence Lens
            </Link>

            <div className="h-4 w-[1px] bg-[#26314D] hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <SignalLogo theme="dark" size={26} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-white font-mono">
                    Evidence Lens
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[#A78BFA]/20 text-[#C4B5FD] border border-[#A78BFA]/30">
                    WORLD 02
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] font-mono">
                  Multi-Dimensional Claim Verification Field
                </p>
              </div>
            </div>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-3">
            {application && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-[#64748B] hidden md:inline">
                  Pipeline Stage:
                </span>
                <select
                  value={application.status}
                  onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#151A2A] border border-[#26314D] text-[#E2E8F0] font-mono font-semibold uppercase cursor-pointer focus:outline-none focus:border-[#65E7DA] transition"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st} className="bg-[#151A2A] text-white">
                      {st.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Notifications */}
          {actionSuccess && (
            <div className="p-3.5 bg-[#0D281E] border border-[#14532D] rounded-xl text-xs text-[#86EFAC] flex items-center justify-between font-mono animate-in fade-in">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#65E7DA] animate-pulse"></span>
                {actionSuccess}
              </span>
              <button onClick={() => setActionSuccess(null)} className="text-[#86EFAC] hover:text-white text-sm font-bold">
                ✕
              </button>
            </div>
          )}

          {actionError && (
            <div className="p-3.5 bg-[#2B1015] border border-[#7F1D1D] rounded-xl text-xs text-[#FCA5A5] flex items-center justify-between font-mono animate-in fade-in">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                {actionError}
              </span>
              <button onClick={() => setActionError(null)} className="text-[#FCA5A5] hover:text-white text-sm font-bold">
                ✕
              </button>
            </div>
          )}

          {loading && (
            <div className="py-32 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-2 border-[#65E7DA] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-[#64748B] mt-4 tracking-wider">
                ACTIVATING CINEMATIC NEURAL FIELD...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-[#151A2A] rounded-2xl border border-red-500/30 p-8 text-center max-w-lg mx-auto">
              <h2 className="text-base font-bold text-red-400 mb-2 font-mono">Dossier Unavailable</h2>
              <p className="text-xs text-[#94A3B8] mb-4">{error}</p>
              <Link
                href="/applications"
                className="px-4 py-2 bg-[#1F273E] hover:bg-[#26314D] text-white text-xs font-semibold rounded-lg font-mono transition"
              >
                ← Return to Applications
              </Link>
            </div>
          )}

          {!loading && !error && application && (
            <div className="space-y-6">
              {/* Dossier Bar / Top Context */}
              <div className="bg-[#151A2A] rounded-2xl border border-[#1F273E] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#5949D6] text-[#090B14] font-bold flex items-center justify-center text-base font-mono flex-shrink-0 shadow-lg">
                    {application.candidate?.name.slice(0, 2).toUpperCase() || 'ID'}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-lg font-bold text-white tracking-tight">
                        {application.candidate?.name}
                      </h1>
                      <span className="text-[#64748B] text-xs">evaluated for</span>
                      <span className="text-sm font-bold text-[#65E7DA] font-mono">
                        {application.job?.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] font-mono mt-1">
                      Candidate: {application.candidate?.email} • Tenor: {application.candidate?.experienceYears} yrs • Target Range: {application.job?.experienceMin}-{application.job?.experienceMax} yrs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={handleScreenResume}
                    disabled={screeningLoading}
                    className="px-4 py-2 rounded-xl bg-[#5949D6] hover:bg-[#6D5CE8] text-white text-xs font-semibold font-mono tracking-wide shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {screeningLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>PROCESSING CLAIMS...</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#65E7DA]"></span>
                        <span>{screening ? 'RE-SCREEN (GEMINI)' : 'EXECUTE AI SCREENING'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateQuestions}
                    disabled={questionsLoading}
                    className="px-4 py-2 rounded-xl bg-[#1F273E] hover:bg-[#26314D] text-[#C4B5FD] text-xs font-semibold font-mono tracking-wide border border-[#A78BFA]/40 shadow-sm transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {questionsLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin"></div>
                        <span>SYNTHESIZING...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#A78BFA]">✦</span>
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
                  <div className="bg-[#151A2A] rounded-2xl border border-[#1F273E] p-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1F273E] mb-3">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
                        Candidate Claims
                      </span>
                      <span className="text-[10px] font-mono text-[#65E7DA] bg-[#65E7DA]/10 px-2 py-0.5 rounded border border-[#65E7DA]/20">
                        {application.candidate?.skills.length || 0} Stated
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {application.candidate?.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSelectedNodeId(`c-skill-${idx}`)}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#1D2338] text-[#CBD5E1] border border-[#26314D] hover:border-[#65E7DA] cursor-pointer transition"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#1F273E]">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1.5">
                        Experience Tenor
                      </span>
                      <div className="text-xl font-bold font-mono text-white">
                        {application.candidate?.experienceYears}{' '}
                        <span className="text-xs font-normal text-[#64748B]">
                          Years Professional History
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Job Requirements Blueprint */}
                  <div className="bg-[#151A2A] rounded-2xl border border-[#1F273E] p-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1F273E] mb-3">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
                        Position Blueprint
                      </span>
                      <span className="text-[10px] font-mono text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded border border-[#A78BFA]/20">
                        {application.job?.requiredSkills.length || 0} Reqs
                      </span>
                    </div>

                    <p className="text-xs font-bold text-white mb-2">{application.job?.title}</p>
                    <p className="text-[11px] text-[#94A3B8] font-mono mb-3">
                      Experience Threshold: {application.job?.experienceMin} - {application.job?.experienceMax} years
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {application.job?.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSelectedNodeId(`j-req-${idx}`)}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1D2338] text-[#E2E8F0] border border-[#26314D] hover:border-[#A78BFA] cursor-pointer transition"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CENTER PANEL: Interactive Evidence Connection Field (5 cols) */}
                <div className="lg:col-span-5 bg-[#151A2A] rounded-2xl border border-[#1F273E] p-4 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1F273E] mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#65E7DA] animate-pulse"></span>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-white">
                        Evidence Graph Field
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      Deterministic Verification Network
                    </span>
                  </div>

                  {/* SVG Connected Graph Display */}
                  <div className="relative w-full h-[380px] bg-[#0E111F] rounded-xl border border-[#1F273E] overflow-hidden flex items-center justify-center p-2">
                    <svg
                      viewBox="0 0 600 380"
                      className="w-full h-full select-none"
                      style={{ maxHeight: '380px' }}
                    >
                      {/* Grid background markings */}
                      <defs>
                        <pattern id="lensGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <circle cx="1" cy="1" r="0.75" fill="#1F273E" />
                        </pattern>
                        <linearGradient id="beamMatch" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#65E7DA" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#C9F36A" stopOpacity="0.8" />
                        </linearGradient>
                        <linearGradient id="beamMissing" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#F87171" stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="beamNeutral" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#26314D" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#26314D" stopOpacity="0.6" />
                        </linearGradient>
                      </defs>

                      <rect width="600" height="380" fill="url(#lensGrid)" />

                      {/* Connection Edges */}
                      {networkData.edges.map((edge) => {
                        const fromNode = networkData.nodes.find((n) => n.id === edge.from);
                        const toNode = networkData.nodes.find((n) => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        const isSelected =
                          selectedNodeId &&
                          (edge.from === selectedNodeId || edge.to === selectedNodeId);

                        const strokeColor =
                          edge.status === 'match'
                            ? 'url(#beamMatch)'
                            : edge.status === 'missing'
                            ? 'url(#beamMissing)'
                            : '#26314D';

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
                              opacity={isSelected ? 1 : 0.6}
                              className="transition-all duration-300"
                            />
                            {edge.status === 'match' && (
                              <circle
                                cx={(fromNode.x + toNode.x) / 2}
                                cy={(fromNode.y + toNode.y) / 2}
                                r="2"
                                fill="#C9F36A"
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

                        let fillColor = '#1D2338';
                        let strokeColor = '#26314D';
                        let textColor = '#CBD5E1';

                        if (isHub) {
                          fillColor = '#151A2A';
                          strokeColor = '#A78BFA';
                          textColor = '#FFFFFF';
                        } else if (node.status === 'match') {
                          strokeColor = '#65E7DA';
                          textColor = '#65E7DA';
                        } else if (node.status === 'missing') {
                          strokeColor = '#F87171';
                          textColor = '#F87171';
                        }

                        if (isSelected) {
                          strokeColor = '#FFFFFF';
                          fillColor = '#26314D';
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
                                  fill="#101524"
                                  stroke={strokeColor}
                                  strokeWidth="2"
                                  className="transition-all"
                                />
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="32"
                                  fill="none"
                                  stroke="#65E7DA"
                                  strokeWidth="0.8"
                                  strokeDasharray="3,3"
                                  className="animate-spin"
                                  style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: '18s' }}
                                />
                                <text
                                  x={node.x}
                                  y={node.y + 4}
                                  textAnchor="middle"
                                  fill="#A78BFA"
                                  fontSize="10"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  SIGNAL
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

                  {/* Selected Node Inspector Footer */}
                  <div className="mt-3 p-3 bg-[#0E111F] rounded-xl border border-[#1F273E]">
                    {selectedNodeInfo ? (
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-[#64748B] block text-[10px] uppercase">
                            Selected: {selectedNodeInfo.category}
                          </span>
                          <span className="text-white font-bold">{selectedNodeInfo.label}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            selectedNodeInfo.status === 'match'
                              ? 'bg-[#65E7DA]/10 text-[#65E7DA] border border-[#65E7DA]/30'
                              : selectedNodeInfo.status === 'missing'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : 'bg-[#1D2338] text-[#94A3B8]'
                          }`}
                        >
                          {selectedNodeInfo.status === 'match'
                            ? 'CLAIM VERIFIED'
                            : selectedNodeInfo.status === 'missing'
                            ? 'GAP IDENTIFIED'
                            : 'NEUTRAL STATE'}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] font-mono text-[#64748B] text-center">
                        Click any node in the graph field to inspect candidate claim verification status.
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT PANEL: Recruiter Intelligence & Tabs (4 cols) */}
                <div className="lg:col-span-4 bg-[#151A2A] rounded-2xl border border-[#1F273E] p-5 shadow-xl flex flex-col space-y-4">
                  {/* Tab switcher */}
                  <div className="flex items-center bg-[#0E111F] p-1 rounded-xl border border-[#1F273E]">
                    <button
                      onClick={() => setActiveTab('screening')}
                      className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg transition ${
                        activeTab === 'screening'
                          ? 'bg-[#151A2A] text-white shadow-sm border border-[#26314D]'
                          : 'text-[#64748B] hover:text-[#CBD5E1]'
                      }`}
                    >
                      AI Screening Result
                    </button>
                    <button
                      onClick={() => setActiveTab('questions')}
                      className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg transition ${
                        activeTab === 'questions'
                          ? 'bg-[#151A2A] text-white shadow-sm border border-[#26314D]'
                          : 'text-[#64748B] hover:text-[#CBD5E1]'
                      }`}
                    >
                      Questions ({interviewQuestions?.questions.length || 0})
                    </button>
                  </div>

                  {/* Tab 1: AI Screening */}
                  {activeTab === 'screening' && (
                    <div className="space-y-4">
                      {!screening ? (
                        <div className="p-8 bg-[#0E111F] rounded-xl border border-dashed border-[#26314D] text-center">
                          <p className="text-xs text-[#94A3B8] mb-3 font-mono">
                            No screening analysis recorded for this candidate submission.
                          </p>
                          <button
                            onClick={handleScreenResume}
                            disabled={screeningLoading}
                            className="px-4 py-2 bg-[#5949D6] hover:bg-[#6D5CE8] text-white text-xs font-semibold rounded-xl font-mono shadow-sm transition"
                          >
                            Execute Gemini Screening
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                          {/* Executive Summary */}
                          <div className="p-3.5 bg-[#0E111F] rounded-xl border border-[#1F273E]">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#65E7DA] block mb-1">
                              Executive Screening Digest
                            </span>
                            <p className="text-xs text-[#E2E8F0] leading-relaxed font-sans">
                              {screening.summary}
                            </p>
                          </div>

                          {/* Matching vs Missing Breakdown */}
                          <div className="space-y-2">
                            <div className="p-3 rounded-xl bg-[#0D281E]/60 border border-[#14532D]">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-[#65E7DA]"></span>
                                <span className="text-[11px] font-mono uppercase tracking-wider text-[#65E7DA] font-bold">
                                  Verified Skills ({screening.matchingSkills.length})
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {screening.matchingSkills.length === 0 ? (
                                  <span className="text-[11px] text-[#64748B] italic">None identified</span>
                                ) : (
                                  screening.matchingSkills.map((sk, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#14532D]/40 text-[#86EFAC] border border-[#14532D]"
                                    >
                                      ✓ {sk}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-[#2B1015]/60 border border-[#7F1D1D]">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold">
                                  Unverified / Gaps ({screening.missingSkills.length})
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {screening.missingSkills.length === 0 ? (
                                  <span className="text-[11px] text-[#86EFAC]">All requirements verified</span>
                                ) : (
                                  screening.missingSkills.map((sk, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#7F1D1D]/30 text-[#FCA5A5] border border-[#7F1D1D]"
                                    >
                                      ✗ {sk}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Experience Analysis */}
                          <div className="p-3.5 bg-[#0E111F] rounded-xl border border-[#1F273E]">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A78BFA] block mb-1">
                              Experience Tenor Analysis
                            </span>
                            <p className="text-xs text-[#CBD5E1] leading-relaxed">
                              {screening.experienceAnalysis}
                            </p>
                          </div>

                          {/* Detailed Explanation */}
                          <div className="p-3.5 bg-[#0E111F] rounded-xl border border-[#1F273E]">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1">
                              Detailed Recruiter Reasoning
                            </span>
                            <p className="text-xs text-[#94A3B8] leading-relaxed whitespace-pre-wrap">
                              {screening.explanation}
                            </p>
                          </div>

                          <p className="text-[10px] font-mono text-[#64748B] italic">
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
                        <div className="p-8 bg-[#0E111F] rounded-xl border border-dashed border-[#26314D] text-center">
                          <p className="text-xs text-[#94A3B8] mb-3 font-mono">
                            No tailored questions synthesized yet for this submission.
                          </p>
                          <button
                            onClick={handleGenerateQuestions}
                            disabled={questionsLoading}
                            className="px-4 py-2 bg-[#1F273E] hover:bg-[#26314D] text-[#C4B5FD] text-xs font-semibold rounded-xl font-mono border border-[#A78BFA]/40 shadow-sm transition"
                          >
                            Generate Interview Questions
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                          {interviewQuestions.questions.map((q, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 bg-[#0E111F] rounded-xl border border-[#1F273E] hover:border-[#A78BFA]/40 transition"
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-mono uppercase font-bold text-[#A78BFA]">
                                  Q{idx + 1} • {q.category}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-white mb-2 leading-snug">
                                {q.question}
                              </p>
                              {q.context && (
                                <div className="p-2 bg-[#151A2A] rounded-lg border border-[#26314D] text-[11px] text-[#94A3B8]">
                                  <span className="text-[#65E7DA] font-mono font-semibold block text-[10px] uppercase mb-0.5">
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
