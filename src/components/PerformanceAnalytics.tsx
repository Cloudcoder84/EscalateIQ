import React, { useState, useEffect } from 'react';
import { SimulationSessionRecord, InterviewStage, TrackType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { loadUserSessions } from '../firebase';
import {
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart2,
  Activity,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  Download,
  Flame,
  ShieldCheck,
  Zap,
  Target,
  Database,
  CloudCheck
} from 'lucide-react';

// High-fidelity initial seed data if candidate hasn't completed simulations yet
const DEFAULT_SAMPLE_SESSIONS: SimulationSessionRecord[] = [
  {
    id: 'sample-1',
    timestamp: '2026-09-28T14:30:00.000Z',
    dateLabel: 'Sep 28',
    scenarioTitle: 'The Recruiter Screen & Career Narrative',
    stage: 'recruiter',
    track: 'principal_tse',
    seniorityTier: 'Tier 4: Staff / Principal',
    overallScore: 74,
    verdict: 'Leaning Hire',
    avgResponseSeconds: 98,
    avgWordCount: 212,
    totalTurns: 3,
    pacingStatus: 'Rambling / Over 90s',
    defensivenessStatus: 'Defensive Trap Detected',
    mbaBusinessImpactScore: 6,
    syntaxAccuracyScore: 7
  },
  {
    id: 'sample-2',
    timestamp: '2026-09-30T10:15:00.000Z',
    dateLabel: 'Sep 30',
    scenarioTitle: 'SEV-1: Linux Kernel OOM Killer Forensics',
    stage: 'technical',
    track: 'principal_tse',
    seniorityTier: 'Tier 4: Staff / Principal',
    overallScore: 81,
    verdict: 'Hire',
    avgResponseSeconds: 84,
    avgWordCount: 182,
    totalTurns: 4,
    pacingStatus: 'Optimal',
    defensivenessStatus: 'Neutral',
    mbaBusinessImpactScore: 7,
    syntaxAccuracyScore: 8
  },
  {
    id: 'sample-3',
    timestamp: '2026-10-02T16:00:00.000Z',
    dateLabel: 'Oct 2',
    scenarioTitle: 'The Outraged Fortune 500 VP Escalation',
    stage: 'managerial',
    track: 'escalation_tam',
    seniorityTier: 'Tier 5: Executive / VP',
    overallScore: 83,
    verdict: 'Hire',
    avgResponseSeconds: 78,
    avgWordCount: 169,
    totalTurns: 3,
    pacingStatus: 'Optimal',
    defensivenessStatus: 'Confident & Proactive',
    mbaBusinessImpactScore: 9,
    syntaxAccuracyScore: 8
  },
  {
    id: 'sample-4',
    timestamp: '2026-10-04T11:45:00.000Z',
    dateLabel: 'Oct 4',
    scenarioTitle: 'SEV-1: Jira Core 504 Timeouts & Splunk Tracing',
    stage: 'technical',
    track: 'principal_tse',
    seniorityTier: 'Tier 4: Staff / Principal',
    overallScore: 88,
    verdict: 'Strong Hire',
    avgResponseSeconds: 71,
    avgWordCount: 154,
    totalTurns: 5,
    pacingStatus: 'Optimal',
    defensivenessStatus: 'Confident & Proactive',
    mbaBusinessImpactScore: 9,
    syntaxAccuracyScore: 10
  },
  {
    id: 'sample-5',
    timestamp: '2026-10-06T15:20:00.000Z',
    dateLabel: 'Oct 6',
    scenarioTitle: 'Engineering Pushback Mediation on Jira Bug',
    stage: 'managerial',
    track: 'principal_tse',
    seniorityTier: 'Tier 4: Staff / Principal',
    overallScore: 92,
    verdict: 'Strong Hire',
    avgResponseSeconds: 64,
    avgWordCount: 139,
    totalTurns: 4,
    pacingStatus: 'Crisp',
    defensivenessStatus: 'Confident & Proactive',
    mbaBusinessImpactScore: 10,
    syntaxAccuracyScore: 9
  },
  {
    id: 'sample-6',
    timestamp: '2026-10-07T14:10:00.000Z',
    dateLabel: 'Oct 7',
    scenarioTitle: 'SEV-1: MySQL Lock Contention & Thread Starvation',
    stage: 'technical',
    track: 'principal_tse',
    seniorityTier: 'Tier 4: Staff / Principal',
    overallScore: 95,
    verdict: 'Strong Hire',
    avgResponseSeconds: 59,
    avgWordCount: 128,
    totalTurns: 4,
    pacingStatus: 'Crisp',
    defensivenessStatus: 'Confident & Proactive',
    mbaBusinessImpactScore: 10,
    syntaxAccuracyScore: 10
  }
];

export const PerformanceAnalytics: React.FC = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<SimulationSessionRecord[]>(() => {
    const saved = localStorage.getItem('escalate_simulation_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse simulation sessions', e);
      }
    }
    return DEFAULT_SAMPLE_SESSIONS;
  });

  const [activeFilter, setActiveFilter] = useState<'all' | InterviewStage>('all');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<SimulationSessionRecord | null>(null);
  const [cloudSynced, setCloudSynced] = useState(false);

  // Sync from Firestore if user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadUserSessions(currentUser.uid).then((cloudSessions: any[]) => {
        if (cloudSessions && cloudSessions.length > 0) {
          // Merge with local sessions, deduplicating by id
          setSessions((prev) => {
            const map = new Map<string, SimulationSessionRecord>();
            // Add cloud sessions first
            cloudSessions.forEach((s) => map.set(s.id, s));
            // Add local sessions
            prev.forEach((s) => {
              if (!map.has(s.id)) map.set(s.id, s);
            });
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            return merged;
          });
          setCloudSynced(true);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('escalate_simulation_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Filtered session records
  const filteredSessions =
    activeFilter === 'all'
      ? sessions
      : sessions.filter((s) => s.stage === activeFilter);

  // Core KPI Calculations
  const totalCount = filteredSessions.length;
  const avgScore =
    totalCount > 0
      ? Math.round(
          filteredSessions.reduce((acc, s) => acc + s.overallScore, 0) / totalCount
        )
      : 0;

  const avgResponseTime =
    totalCount > 0
      ? Math.round(
          filteredSessions.reduce((acc, s) => acc + s.avgResponseSeconds, 0) / totalCount
        )
      : 0;

  const passCount = filteredSessions.filter(
    (s) => s.verdict === 'Strong Hire' || s.verdict === 'Hire'
  ).length;
  const passRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

  // Score improvement calculation (First session vs latest session)
  const scoreImprovement =
    filteredSessions.length >= 2
      ? filteredSessions[filteredSessions.length - 1].overallScore -
        filteredSessions[0].overallScore
      : 0;

  const responseTimeReduction =
    filteredSessions.length >= 2
      ? filteredSessions[0].avgResponseSeconds -
        filteredSessions[filteredSessions.length - 1].avgResponseSeconds
      : 0;

  // Competency Averages
  const avgBusinessImpact =
    totalCount > 0
      ? (
          filteredSessions.reduce((acc, s) => acc + s.mbaBusinessImpactScore, 0) /
          totalCount
        ).toFixed(1)
      : '0.0';

  const avgSyntax =
    totalCount > 0
      ? (
          filteredSessions.reduce((acc, s) => acc + s.syntaxAccuracyScore, 0) /
          totalCount
        ).toFixed(1)
      : '0.0';

  // SVG Chart Geometry Constants
  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 45;
  const paddingY = 30;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  // Map session coordinates for Score trend
  const scorePoints = filteredSessions.map((s, idx) => {
    const x =
      filteredSessions.length <= 1
        ? paddingX + innerWidth / 2
        : paddingX + (idx / (filteredSessions.length - 1)) * innerWidth;
    // Y mapped from score (range 40 to 100)
    const normalizedScore = Math.max(40, Math.min(100, s.overallScore));
    const y = paddingY + innerHeight - ((normalizedScore - 40) / 60) * innerHeight;
    return { x, y, session: s };
  });

  // Build SVG path data for Score Line
  const scorePathD =
    scorePoints.length > 0
      ? scorePoints.reduce((acc, pt, idx) => {
          return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
        }, '')
      : '';

  const scoreAreaD =
    scorePoints.length > 0
      ? `${scorePathD} L ${scorePoints[scorePoints.length - 1].x} ${
          paddingY + innerHeight
        } L ${scorePoints[0].x} ${paddingY + innerHeight} Z`
      : '';

  // Map session coordinates for Response Time trend
  // Target response time range 30s to 120s
  const timePoints = filteredSessions.map((s, idx) => {
    const x =
      filteredSessions.length <= 1
        ? paddingX + innerWidth / 2
        : paddingX + (idx / (filteredSessions.length - 1)) * innerWidth;
    const clampedTime = Math.max(30, Math.min(120, s.avgResponseSeconds));
    const y = paddingY + innerHeight - ((clampedTime - 30) / 90) * innerHeight;
    return { x, y, session: s };
  });

  const timePathD =
    timePoints.length > 0
      ? timePoints.reduce((acc, pt, idx) => {
          return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
        }, '')
      : '';

  const handleResetToSample = () => {
    setSessions(DEFAULT_SAMPLE_SESSIONS);
  };

  const handleClearHistory = () => {
    if (confirm('Clear all performance analytics history?')) {
      setSessions([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <Activity className="w-3.5 h-3.5" />
            Empirical Progress Tracking
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Performance Analytics &amp; Trend Dashboard
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mt-1 leading-relaxed">
            Monitor your interview trajectory over time. Track scoring improvements, response time conciseness towards the 90-second sweet spot, and pass rates across simulations.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleResetToSample}
            title="Load sample simulation dataset"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Sample Dataset
          </button>
          <button
            onClick={handleClearHistory}
            title="Clear all session history"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Overall Average Score */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Average Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {avgScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
            {scoreImprovement >= 0 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +{scoreImprovement} pts
              </span>
            ) : (
              <span className="text-rose-600 font-bold flex items-center gap-0.5">
                {scoreImprovement} pts
              </span>
            )}
            <span className="text-slate-500">since first simulation</span>
          </div>
        </div>

        {/* KPI 2: Average Response Pacing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Avg Response Pacing
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {avgResponseTime} <span className="text-sm font-normal text-slate-400">sec</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                avgResponseTime <= 90
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {avgResponseTime <= 90 ? 'Optimal (Under 90s)' : 'Ramble Alert'}
            </span>
            {responseTimeReduction > 0 && (
              <span className="text-slate-500 text-[11px]">
                -{responseTimeReduction}s faster
              </span>
            )}
          </div>
        </div>

        {/* KPI 3: Offer Readiness / Pass Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Offer Readiness Rate
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {passRate}%
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>{passCount} of {totalCount} passed bar</span>
            <span className="text-emerald-700 font-semibold">Strong Hire / Hire</span>
          </div>
        </div>

        {/* KPI 4: Total Completed Sessions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Simulations Completed
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {totalCount} <span className="text-sm font-normal text-slate-400">rounds</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-800">
              {filteredSessions.reduce((acc, s) => acc + s.totalTurns, 0)} total turns
            </span>
            <span>logged</span>
          </div>
        </div>
      </div>

      {/* Main Charts Arena (2 Trend Visualizers) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Interview Score Trajectory (SVG Trend Line) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Interview Score Trajectory Over Time
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Bar: 85+ (Staff/Principal Threshold)
              </p>
            </div>

            {/* Filter stage pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('technical')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  activeFilter === 'technical'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tech
              </button>
              <button
                onClick={() => setActiveFilter('managerial')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  activeFilter === 'managerial'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Managerial
              </button>
            </div>
          </div>

          {/* SVG Score Chart */}
          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Benchmarks */}
              {/* 100 pt top line */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 8}
                y={paddingY + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                100
              </text>

              {/* 85 pt Staff Benchmark line */}
              <line
                x1={paddingX}
                y1={paddingY + innerHeight * (1 - 45 / 60)}
                x2={chartWidth - paddingX}
                y2={paddingY + innerHeight * (1 - 45 / 60)}
                stroke="#6366f1"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={chartWidth - paddingX}
                y={paddingY + innerHeight * (1 - 45 / 60) - 4}
                textAnchor="end"
                className="text-[9px] fill-indigo-600 font-bold uppercase tracking-wider"
              >
                Bar-Raiser Target (85)
              </text>

              {/* 70 pt Passing line */}
              <line
                x1={paddingX}
                y1={paddingY + innerHeight * (1 - 30 / 60)}
                x2={chartWidth - paddingX}
                y2={paddingY + innerHeight * (1 - 30 / 60)}
                stroke="#cbd5e1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 8}
                y={paddingY + innerHeight * (1 - 30 / 60) + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                70
              </text>

              {/* Base line (40) */}
              <line
                x1={paddingX}
                y1={paddingY + innerHeight}
                x2={chartWidth - paddingX}
                y2={paddingY + innerHeight}
                stroke="#e2e8f0"
              />
              <text
                x={paddingX - 8}
                y={paddingY + innerHeight + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                40
              </text>

              {/* Area fill */}
              {scoreAreaD && <path d={scoreAreaD} fill="url(#scoreAreaGradient)" />}

              {/* Line path */}
              {scorePathD && (
                <path
                  d={scorePathD}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interactive Data Point Dots */}
              {scorePoints.map((pt, idx) => {
                const isHovered = hoveredPointIndex === idx;
                return (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 5}
                      className="transition-all duration-200 cursor-pointer"
                      fill={pt.session.overallScore >= 85 ? '#10b981' : '#4f46e5'}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 3 : 2}
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                      onClick={() => setSelectedSession(pt.session)}
                    />
                    {/* Score value label above dot */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className={`text-[11px] font-bold font-mono transition-all ${
                        isHovered ? 'fill-indigo-950 font-black' : 'fill-slate-600'
                      }`}
                    >
                      {pt.session.overallScore}
                    </text>
                    {/* Date label under base line */}
                    <text
                      x={pt.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-500 font-sans"
                    >
                      {pt.session.dateLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Score ≥ 85 (Staff / Bar-Raiser)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Score &lt; 85
            </span>
          </div>
        </div>

        {/* Chart 2: Average Response Time & Conciseness Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="font-bold text-base text-slate-900">
                  Average Response Pacing Trend
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Zone: 60s – 90s (Eliminating Rambling)
              </p>
            </div>

            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Rule 4 Guard
            </span>
          </div>

          {/* SVG Response Time Chart */}
          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="timeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Optimal Pacing Green Band (60s to 90s) */}
              {/* y for 90s: paddingY + innerHeight - ((90 - 30) / 90) * innerHeight */}
              {/* y for 60s: paddingY + innerHeight - ((60 - 30) / 90) * innerHeight */}
              <rect
                x={paddingX}
                y={paddingY + innerHeight - (60 / 90) * innerHeight}
                width={innerWidth}
                height={(30 / 90) * innerHeight}
                fill="#ecfdf5"
                opacity="0.8"
              />
              <text
                x={chartWidth - paddingX - 4}
                y={paddingY + innerHeight - (60 / 90) * innerHeight + 14}
                textAnchor="end"
                className="text-[9px] fill-emerald-700 font-bold uppercase tracking-wider"
              >
                Optimal Zone (60s - 90s)
              </text>

              {/* 120s upper bound line */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 8}
                y={paddingY + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                120s
              </text>

              {/* 90s ramble threshold line */}
              <line
                x1={paddingX}
                y1={paddingY + innerHeight - (60 / 90) * innerHeight}
                x2={chartWidth - paddingX}
                y2={paddingY + innerHeight - (60 / 90) * innerHeight}
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={paddingX - 8}
                y={paddingY + innerHeight - (60 / 90) * innerHeight + 4}
                textAnchor="end"
                className="text-[10px] fill-rose-500 font-bold font-mono"
              >
                90s
              </text>

              {/* 60s line */}
              <line
                x1={paddingX}
                y1={paddingY + innerHeight - (30 / 90) * innerHeight}
                x2={chartWidth - paddingX}
                y2={paddingY + innerHeight - (30 / 90) * innerHeight}
                stroke="#10b981"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 8}
                y={paddingY + innerHeight - (30 / 90) * innerHeight + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                60s
              </text>

              {/* 30s base line */}
              <line
                x1={paddingX}
                y1={paddingY + innerHeight}
                x2={chartWidth - paddingX}
                y2={paddingY + innerHeight}
                stroke="#e2e8f0"
              />
              <text
                x={paddingX - 8}
                y={paddingY + innerHeight + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                30s
              </text>

              {/* Line path */}
              {timePathD && (
                <path
                  d={timePathD}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {timePoints.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={5}
                    fill={pt.session.avgResponseSeconds <= 90 ? '#10b981' : '#f43f5e'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-7 transition-all"
                    onClick={() => setSelectedSession(pt.session)}
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    className="text-[11px] font-bold font-mono fill-slate-700"
                  >
                    {pt.session.avgResponseSeconds}s
                  </text>
                  <text
                    x={pt.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-500 font-sans"
                  >
                    {pt.session.dateLabel}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal Pacing (≤ 90s)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Over 90s (Ramble Risk)
            </span>
          </div>
        </div>
      </div>

      {/* Competency Mastery Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          Competency &amp; Safeguard Scorecard Averages
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Diagnostic &amp; Systems Rigor
            </span>
            <div className="text-2xl font-black text-slate-900">
              {avgSyntax} <span className="text-xs font-normal text-slate-500">/ 10</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Precision in Splunk SPL, Linux kernel sockets, and database queries.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Business Impact &amp; Value
            </span>
            <div className="text-2xl font-black text-slate-900">
              {avgBusinessImpact} <span className="text-xs font-normal text-slate-500">/ 10</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Connecting technical troubleshooting to MTTR, ARR, and SLA compliance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Conciseness &amp; Pacing
            </span>
            <div className="text-2xl font-black text-emerald-700">
              {filteredSessions.filter((s) => s.pacingStatus === 'Crisp' || s.pacingStatus === 'Optimal').length} / {totalCount}
            </div>
            <p className="text-[11px] text-slate-600">
              Sessions adhering to the 90-second answer limit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Composure &amp; Zero Defensiveness
            </span>
            <div className="text-2xl font-black text-emerald-700">
              {filteredSessions.filter((s) => s.defensivenessStatus === 'Confident & Proactive').length} / {totalCount}
            </div>
            <p className="text-[11px] text-slate-600">
              Sessions with proactive counter-framing on career transitions.
            </p>
          </div>
        </div>
      </div>

      {/* Completed Simulation Sessions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Completed Simulation Session Logs
            </h3>
            <p className="text-xs text-slate-500">
              Click any session to view its comprehensive evaluation details.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
            {filteredSessions.length} Recorded Rounds
          </span>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500">
              No simulation sessions recorded yet. Launch a mock interview in the simulator or load the sample dataset.
            </p>
            <button
              onClick={handleResetToSample}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
            >
              Load Sample Dataset
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider bg-slate-50/50">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Scenario Title</th>
                  <th className="py-3 px-3">Stage &amp; Track</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Verdict</th>
                  <th className="py-3 px-3">Avg Pacing</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSessions.map((session) => (
                  <tr
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <td className="py-3.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {session.dateLabel}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 max-w-[240px] truncate">
                      {session.scenarioTitle}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {session.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-sm">
                      <span
                        className={
                          session.overallScore >= 85
                            ? 'text-emerald-600 font-extrabold'
                            : session.overallScore >= 75
                            ? 'text-indigo-600'
                            : 'text-amber-600'
                        }
                      >
                        {session.overallScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          session.verdict === 'Strong Hire' || session.verdict === 'Hire'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {session.verdict}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {session.avgResponseSeconds}s{' '}
                      <span className="text-[10px] text-slate-400">
                        ({session.avgWordCount}w)
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-indigo-600 hover:text-indigo-800 font-semibold whitespace-nowrap">
                      View Audit &rarr;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Session Detail Modal / Drawer */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {selectedSession.stage.toUpperCase()} • {selectedSession.track.toUpperCase()}
                </span>
                <h3 className="font-bold text-lg text-slate-900">
                  {selectedSession.scenarioTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Overall Score</span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {selectedSession.overallScore} / 100
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Bar-Raiser Verdict</span>
                <span
                  className={`text-lg font-extrabold ${
                    selectedSession.verdict === 'Strong Hire' ||
                    selectedSession.verdict === 'Hire'
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}
                >
                  {selectedSession.verdict}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide">
                Safeguard Audit Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block font-semibold">Response Pacing:</span>
                  <span className="font-bold text-slate-900">
                    {selectedSession.avgResponseSeconds}s ({selectedSession.pacingStatus})
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block font-semibold">Defensiveness Check:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedSession.defensivenessStatus}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block font-semibold">Business Impact Score:</span>
                  <span className="font-bold text-indigo-700">
                    {selectedSession.mbaBusinessImpactScore} / 10
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block font-semibold">Syntax Accuracy:</span>
                  <span className="font-bold text-indigo-700">
                    {selectedSession.syntaxAccuracyScore} / 10
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-indigo-600 transition cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
