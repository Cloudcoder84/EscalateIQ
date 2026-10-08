/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StrategicAdvisor } from './components/StrategicAdvisor';
import { ScheduleTracker } from './components/ScheduleTracker';
import { InterviewSimulator } from './components/InterviewSimulator';
import { JdReverseEngineer } from './components/JdReverseEngineer';
import { WarStoryVault } from './components/WarStoryVault';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { InterviewStage, Scenario } from './types';
import { useAuth } from './contexts/AuthContext';
import {
  Compass,
  Cpu,
  FileSearch,
  BookMarked,
  Calendar,
  Sparkles,
  ExternalLink,
  Flame,
  Award,
  ChevronRight,
  Activity,
  LogIn,
  LogOut,
  User as UserIcon,
  Database
} from 'lucide-react';

export default function App() {
  const { currentUser, login, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'advisor' | 'schedule' | 'simulator' | 'reverse-jd' | 'vault' | 'analytics'>('schedule');
  const [simulatorStage, setSimulatorStage] = useState<InterviewStage>('technical');
  const [customScenario, setCustomScenario] = useState<Scenario | null>(null);

  const handleSelectStageFromAdvisor = (stage: InterviewStage) => {
    setSimulatorStage(stage);
    setCustomScenario(null);
    setActiveTab('simulator');
  };

  const handleLaunchScenarioFromSchedule = (scenario: Scenario) => {
    setCustomScenario(scenario);
    setSimulatorStage(scenario.stage);
    setActiveTab('simulator');
  };

  const handleLaunchCustomScenario = (scenario: Scenario) => {
    setCustomScenario(scenario);
    setSimulatorStage(scenario.stage);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 font-black text-xs tracking-wider">
              EIQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-950 flex items-center">
                  Escalate<span className="text-indigo-600">IQ</span>
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                  Interview Readiness &amp; Career Acceleration
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Universal Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Adaptive AI Preparation Studio • Entry-Level to Executive Leadership
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">4-Week Schedule</span>
              <span className="md:hidden">Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Mock Simulator</span>
              <span className="md:hidden">Practice</span>
            </button>

            <button
              onClick={() => setActiveTab('reverse-jd')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'reverse-jd'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">JD Blueprint</span>
              <span className="md:hidden">JD</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">War Stories &amp; Cheat Sheet</span>
              <span className="md:hidden">Stories</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden md:inline">Analytics</span>
              <span className="md:hidden">Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('advisor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'advisor'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Strategy &amp; Fit</span>
              <span className="md:hidden">Strategy</span>
            </button>
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-indigo-200 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {currentUser.displayName || 'Practitioner'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Cloud Synced
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => login()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-8">
        {activeTab === 'schedule' && (
          <ScheduleTracker onLaunchScenario={handleLaunchScenarioFromSchedule} />
        )}

        {activeTab === 'simulator' && (
          <InterviewSimulator
            initialStage={simulatorStage}
            customScenario={customScenario}
          />
        )}

        {activeTab === 'analytics' && <PerformanceAnalytics />}

        {activeTab === 'reverse-jd' && (
          <JdReverseEngineer onLaunchCustomScenario={handleLaunchCustomScenario} />
        )}

        {activeTab === 'vault' && <WarStoryVault />}

        {activeTab === 'advisor' && (
          <StrategicAdvisor
            onSelectStage={handleSelectStageFromAdvisor}
            onOpenJdAnalyzer={() => setActiveTab('reverse-jd')}
          />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>EscalateIQ • Interview Readiness &amp; Career Acceleration Studio • Universal AI Practice Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://atemio-1--atemkuol.replit.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 font-semibold inline-flex items-center gap-1"
            >
              Portfolio: atemio-1--atemkuol.replit.app <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
