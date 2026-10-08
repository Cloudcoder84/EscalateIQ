import React, { useState } from 'react';
import { COMPARISON_TASKS } from '../data/tseScenarios';
import {
  Trophy,
  Target,
  Brain,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  GraduationCap,
  Users,
  Terminal,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { InterviewStage } from '../types';

interface StrategicAdvisorProps {
  onSelectStage: (stage: InterviewStage) => void;
  onOpenJdAnalyzer: () => void;
}

export const StrategicAdvisor: React.FC<StrategicAdvisorProps> = ({
  onSelectStage,
  onOpenJdAnalyzer
}) => {
  const [selectedTask, setSelectedTask] = useState<string>('technical');

  const activeTask = COMPARISON_TASKS.find((t) => t.id === selectedTask) || COMPARISON_TASKS[2];

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* Hero Executive Verdict Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Executive Strategy Verdict
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Which Task is the Best Fit for an AI Tool?
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            For a seasoned Technical Support Engineer with an advanced degree,{' '}
            <span className="text-indigo-300 font-bold underline decoration-indigo-400 decoration-2 underline-offset-4">
              Multi-Stage Interview Simulation
            </span>{' '}
            (especially Technical Incident RCA &amp; Managerial Escalation) has{' '}
            <strong className="text-white">exponentially higher ROI</strong> than role applications.
          </p>

          {/* Core Reasoning Quick Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-4.5 hover:border-indigo-400/40 transition">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm mb-1.5">
                <TrendingUp className="w-4 h-4" />
                Asymmetric Financial Value
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Submitting 100 more applications yields tiny marginal returns in 2026. But converting a single final round into an offer is worth <strong className="text-white">$140k–$220k+</strong> and senior leveling.
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-4.5 hover:border-indigo-400/40 transition">
              <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm mb-1.5">
                <GraduationCap className="w-4 h-4" />
                The "Advanced Degree" Bias
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Recruiters secretly fear you are "overqualified", will quit for SWE in 3 months, or are too theoretical. AI trains you to flip your degree into an asset of <strong className="text-white">elite systems rigor</strong>.
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-4.5 hover:border-indigo-400/40 transition">
              <div className="flex items-center gap-2.5 text-indigo-400 font-semibold text-sm mb-1.5">
                <Terminal className="w-4 h-4" />
                AI Acts as Live Broken Systems
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generic prep tools only test SWE LeetCode. Only an LLM can simulate live SEV-1 incident triage, emit realistic logs (`dmesg`, `curl`, `pg_stat`), and roleplay angry enterprise VPs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Comparative Matrix */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Task Leverage &amp; AI-Fit Comparison Matrix
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Click on each recurring work-search task to explore its mechanics, pros, pitfalls, and AI synergy.
            </p>
          </div>
          <button
            onClick={onOpenJdAnalyzer}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition self-start sm:self-auto cursor-pointer"
          >
            <Brain className="w-4 h-4" />
            Analyze a Real Job Description
          </button>
        </div>

        {/* Task Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COMPARISON_TASKS.map((task) => {
            const isSelected = selectedTask === task.id;
            return (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      task.leverageScore >= 9
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.leverageScore >= 7
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Leverage: {task.leverageScore} / 10
                  </span>
                  {task.id === 'technical' && (
                    <Trophy className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="font-semibold text-sm text-slate-900 leading-snug">
                  {task.title}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {task.roiDescription}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Task Deep Dive Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-900">{activeTask.title}</h3>
                <span className="text-xs px-2.5 py-1 rounded-md font-semibold bg-indigo-100 text-indigo-800">
                  {activeTask.roiDescription}
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                {activeTask.aiFitSummary}
              </p>
            </div>

            {activeTask.id !== 'applications' && (
              <button
                onClick={() => onSelectStage(activeTask.id as InterviewStage)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-indigo-600 text-white shadow transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                Launch Mock Studio
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Where AI Shines for This Task
              </h4>
              <ul className="space-y-2.5">
                {activeTask.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons / Traps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Limitations &amp; Bottlenecks
              </h4>
              <ul className="space-y-2.5">
                {activeTask.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Verdict callout */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 flex items-center gap-3">
            <Target className="w-5 h-5 text-indigo-600 shrink-0" />
            <div className="text-sm font-medium text-slate-800">
              <strong className="text-indigo-950 font-bold">Strategic Verdict: </strong>
              {activeTask.verdict}
            </div>
          </div>
        </div>
      </div>

      {/* The Advanced Degree Positioning Playbook */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              The "Advanced Degree Advantage" Positioning Blueprint
            </h3>
            <p className="text-slate-400 text-sm">
              How to neutralize recruiter skepticism and turn your Master's/Ph.D. into an elite hiring differentiator.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 space-y-2.5">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              The Recruiter's Unspoken Fear
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              "This candidate has a Master's/Ph.D. in CS/STEM. They'll find Tier-3 customer tickets beneath them, get frustrated, and jump ship to a SWE or Data Science team within 6 months."
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 space-y-2.5">
            <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              The Winning Counter-Framing
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              "I love high-velocity, high-stakes forensics. While SWE builds features for months, Tier-3 Escalation lets me apply scientific hypothesis testing and distributed systems rigor to crack multi-million dollar outages in hours."
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 space-y-2.5">
            <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              The Leveling Multiplier
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Frame your advanced degree not as theoretical detachment, but as the ability to bridge deep engineering internals (kernel, memory, distributed consensus) with executive post-mortems and runbooks.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Practice defending this exact narrative against our AI Recruiter Persona in real-time.
          </span>
          <button
            onClick={() => onSelectStage('recruiter')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 hover:text-white transition cursor-pointer"
          >
            Practice Recruiter Screen <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* The 3 Dedicated Action Studios */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          Ready to Train? Choose an AI Interview Studio
        </h3>
        <p className="text-sm text-slate-600">
          Each studio features full interactive roleplay, realistic prompts, diagnostic telemetry probes, and instant executive scorecards.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Studio 1: Recruiter */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Recruiter Screen Studio</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nail the 90-second pitch, overcome the "overqualified" trap, defend your motivation for technical support, and anchor your compensation.
              </p>
            </div>
            <button
              onClick={() => onSelectStage('recruiter')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition cursor-pointer"
            >
              Start Recruiter Simulation
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Studio 2: Technical RCA */}
          <div className="bg-white rounded-2xl border-2 border-indigo-600 p-6 flex flex-col justify-between shadow-md relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-600 text-white tracking-wider">
              Highest Leverage
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Technical RCA &amp; SEV-1 Lab</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tackle realistic distributed 504 timeouts, Linux OOM killer incidents, Postgres lock contention, and network MTU drops with live terminal command probes.
              </p>
            </div>
            <button
              onClick={() => onSelectStage('technical')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition cursor-pointer"
            >
              Start Technical RCA Simulation
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Studio 3: Managerial */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Managerial Escalation Room</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                De-escalate furious Fortune 500 VPs during production downtime and negotiate with stubborn SWE tech leads who refuse to patch critical edge-case bugs.
              </p>
            </div>
            <button
              onClick={() => onSelectStage('managerial')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 transition cursor-pointer"
            >
              Start Managerial Simulation
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
