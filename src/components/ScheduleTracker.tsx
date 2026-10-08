import React, { useState, useEffect } from 'react';
import { MASTER_4_WEEK_SCHEDULE } from '../data/tseScenarios';
import { WeekPlan, Scenario, InterviewStage } from '../types';
import { PRESET_SCENARIOS } from '../data/tseScenarios';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  Target
} from 'lucide-react';

interface ScheduleTrackerProps {
  onLaunchScenario: (scenario: Scenario) => void;
}

export const ScheduleTracker: React.FC<ScheduleTrackerProps> = ({ onLaunchScenario }) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<string[]>(() => {
    const saved = localStorage.getItem('escalate_completed_days');
    return saved ? JSON.parse(saved) : ['w1-Monday'];
  });

  // Daily Timer state
  const [timerSeconds, setTimerSeconds] = useState(60 * 60); // 60 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem('escalate_completed_days', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleDayCompletion = (dayId: string) => {
    if (completedDays.includes(dayId)) {
      setCompletedDays(completedDays.filter((id) => id !== dayId));
    } else {
      setCompletedDays([...completedDays, dayId]);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentWeekPlan =
    MASTER_4_WEEK_SCHEDULE.find((w) => w.weekNumber === selectedWeek) || MASTER_4_WEEK_SCHEDULE[0];

  const handleLaunchDailyDrill = (scenarioId: string, stage: InterviewStage) => {
    const found = PRESET_SCENARIOS.find((s) => s.id === scenarioId) || PRESET_SCENARIOS[0];
    onLaunchScenario(found);
  };

  const totalMilestones = MASTER_4_WEEK_SCHEDULE.reduce((acc, w) => acc + w.milestones.length, 0);
  const totalCompleted = completedDays.length;
  const progressPercent = Math.round((totalCompleted / totalMilestones) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5" />
              4-Week Master Plan • Target Launch: Next Week
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Daily 60-Minute Interview Workout Tracker
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Universal interview workout roadmap for any candidate. Week 1 primes you for opening recruiter rounds (90s elevator pitch, narrative defense, and core triage), progressing into deep functional problem-solving and executive loops over 4 weeks.
            </p>
          </div>

          {/* Daily 60-Minute Live Timer Widget */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shrink-0 text-center space-y-3 shadow-lg">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Daily 60-Min Session
            </div>
            <div className="text-3xl font-black font-mono text-white tracking-wider">
              {formatTimer(timerSeconds)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isTimerRunning ? 'Pause Timer' : 'Start 60-Min Timer'}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(60 * 60);
                }}
                title="Reset timer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="pt-6 border-t border-slate-800/80 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Overall Roadmap Progress</span>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-bold text-white">{progressPercent}%</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Completed Drills</span>
            <span className="text-white font-bold text-sm">
              {totalCompleted} of {totalMilestones} sessions completed
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Target Roles</span>
            <span className="text-indigo-300 font-bold text-sm">
              Principal TSE &amp; Enterprise Escalation TAM
            </span>
          </div>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {MASTER_4_WEEK_SCHEDULE.map((week) => {
          const isSelected = selectedWeek === week.weekNumber;
          const weekDayIds = week.milestones.map((m) => `w${week.weekNumber}-${m.day}`);
          const weekDoneCount = weekDayIds.filter((id) => completedDays.includes(id)).length;

          return (
            <button
              key={week.weekNumber}
              onClick={() => setSelectedWeek(week.weekNumber)}
              className={`p-4 rounded-xl border text-left transition cursor-pointer relative ${
                isSelected
                  ? 'bg-indigo-50/90 border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    week.weekNumber === 1
                      ? 'bg-amber-100 text-amber-800 font-bold'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {week.weekNumber === 1 ? 'Week 1 (Next Week!)' : `Week ${week.weekNumber}`}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {weekDoneCount}/{week.milestones.length} Done
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs line-clamp-1 leading-snug">
                {week.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Selected Week Detail & Daily Milestones */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Week {currentWeekPlan.weekNumber} Focus
              </span>
              <h3 className="text-lg font-bold text-slate-900">{currentWeekPlan.title}</h3>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {currentWeekPlan.focus}
            </p>
          </div>

          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 shrink-0 self-start sm:self-auto flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Goal: {currentWeekPlan.dailyGoalMinutes} min / day
          </div>
        </div>

        {/* Daily Schedule Cards */}
        <div className="space-y-3">
          {currentWeekPlan.milestones.map((m, idx) => {
            const dayId = `w${currentWeekPlan.weekNumber}-${m.day}`;
            const isCompleted = completedDays.includes(dayId);

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-50/70 border-slate-200 text-slate-500'
                    : 'bg-white border-slate-200/90 hover:border-indigo-300 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleDayCompletion(dayId)}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition cursor-pointer shrink-0"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {m.day}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {m.focusArea}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {m.stage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{m.task}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleLaunchDailyDrill(m.suggestedScenarioId, m.stage)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-indigo-600 text-white transition shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Launch Drill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
