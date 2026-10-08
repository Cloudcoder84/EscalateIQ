import React, { useState, useEffect } from 'react';
import { JdAnalysisBlueprint, Scenario, InterviewStage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { saveJobBlueprint, loadUserBlueprints } from '../firebase';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Terminal,
  AlertTriangle,
  BookOpen,
  Briefcase,
  Play,
  RotateCw,
  Copy,
  Check,
  Globe,
  ExternalLink,
  Save,
  Search,
  Database
} from 'lucide-react';

interface JdReverseEngineerProps {
  onLaunchCustomScenario: (scenario: Scenario) => void;
}

export const JdReverseEngineer: React.FC<JdReverseEngineerProps> = ({
  onLaunchCustomScenario
}) => {
  const { currentUser } = useAuth();
  const [jobDescription, setJobDescription] = useState(`Role: Senior Technical Support Engineer (Tier 3 / Escalations)
Company: Enterprise Cloud Observability & Telemetry SaaS
Requirements:
- 5+ years supporting complex enterprise distributed systems and cloud platforms (AWS/GCP/Kubernetes).
- Deep proficiency in Linux internals, system performance troubleshooting, and networking (TCP/IP, DNS, TLS, HTTP/2).
- Strong relational database diagnostic skills (PostgreSQL query performance, deadlocks, connection pooling).
- Experience leading critical SEV-1 incident calls and communicating with C-level stakeholders.
- Advanced analytical mindset; degree in Computer Science, Engineering, or equivalent advanced background preferred.
- Comfortable interfacing directly with core engineering to reproduce, file, and patch product defects.`);

  const [candidateProfile, setCandidateProfile] = useState(
    'Seasoned Technical Support / Escalation Engineer with an advanced degree (M.S. in Computer Science). 8+ years experience troubleshooting Linux servers, microservice APIs, database bottlenecks, and handling irate Fortune 500 VP escalations.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<JdAnalysisBlueprint | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedBlueprints, setSavedBlueprints] = useState<any[]>([]);

  // Load saved blueprints from Firebase if user is logged in
  useEffect(() => {
    if (currentUser) {
      loadUserBlueprints(currentUser.uid).then(bps => {
        setSavedBlueprints(bps);
      });
    }
  }, [currentUser]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setIsLoading(true);
    setBlueprint(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/interview/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          candidateProfile
        })
      });

      const data = await res.json();
      setBlueprint(data);

      // Auto-save to Firebase if signed in
      if (currentUser && data.roleSummary) {
        try {
          await saveJobBlueprint(currentUser.uid, {
            ...data,
            jobDescriptionSnippet: jobDescription.slice(0, 150),
          });
          setSavedSuccess(true);
          const updated = await loadUserBlueprints(currentUser.uid);
          setSavedBlueprints(updated);
        } catch (saveErr) {
          console.warn('Auto-save to Firebase failed:', saveErr);
        }
      }
    } catch (err) {
      console.error('Error analyzing JD:', err);
      // Fallback blueprint
      setBlueprint({
        roleSummary:
          'High-stakes Tier-3 Escalation role bridging distributed cloud telemetry and C-suite customer de-escalations. Expect intense technical probing on Linux kernel diagnostics and distributed systems bottlenecks.',
        targetTrack: 'principal_tse',
        recruiterScreen: {
          keyRisks: [
            'Skepticism over whether an advanced degree holder will stay in support or quickly jump to SWE.',
            'Verifying you are comfortable with direct customer escalations rather than purely backend research.'
          ],
          counterStrategy:
            'Frame your advanced degree as empirical diagnostic horsepower: while software engineers build features, you specialize in live systems reliability and high-speed problem isolation under pressure.',
          likelyQuestions: [
            {
              question: 'With your M.S. in CS, why are you targeting Technical Support instead of Software Engineering or DevOps?',
              underlyingIntent: 'Checking for flight risk and genuine role commitment.',
              suggestedAngle: 'Highlight that you thrive on forensic troubleshooting, root cause analysis, and the adrenaline of live customer incident resolution.'
            }
          ]
        },
        technicalInterview: {
          techStackFocus: ['Linux internals (eBPF, pmap, strace)', 'PostgreSQL performance', 'TCP/IP and TLS handshakes', 'Kubernetes ingress latency'],
          incidentScenarios: [
            {
              title: 'Distributed 504 Timeout on Ingress Gateway',
              context: 'Enterprise customers experiencing intermittent 504s during morning telemetry bursts.',
              diagnosticSteps: ['Inspect upstream connection pools', 'Trace goroutine or thread pool states', 'Check database row lock timeouts'],
              goldenHypothesis: 'Upstream connection pool exhaustion combined with slow database queries holding transactions open.'
            }
          ],
          deepQuestions: [
            'How would you diagnose a process that is steadily consuming resident memory and triggering the Linux OOM killer?',
            'What exact steps do you take when a customer reports intermittent TLS handshake resets over a private VPC link?'
          ]
        },
        managerialEscalation: {
          keyFrictionPoints: ['Handling demanding Fortune 500 VPs', 'Overcoming engineering pushback on low-volume edge-case bugs'],
          highPressureQuestions: [
            {
              scenario: 'An angry VP joins your bridge demanding an immediate rollback during peak trading.',
              winningStrategy: 'Acknowledge financial risk, separate diagnosis from panic, establish a 15-minute operational rhythm, and propose surgical mitigation.'
            }
          ]
        },
        recommendedWarStories: [
          'A complex distributed bug that conventional monitoring missed until you inspected kernel socket tables.',
          'An executive customer de-escalation where you turned a threatening churn into an enterprise contract renewal.'
        ],
        matchedCertifications: [
          'Atlassian Certified Jira Administrator',
          'Certified Dell Boomi Production Administrator',
          'GCP Associate Cloud Engineer',
          'ITIL Foundation'
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyBlueprint = () => {
    if (!blueprint) return;
    const text = `# Tailored Interview Blueprint\n\n## Hiring Assessment\n${blueprint.roleSummary}\n\n## Recruiter Positioning Strategy\n${blueprint.recruiterScreen?.counterStrategy}\n\n## Key Tech Focus\n${blueprint.technicalInterview?.techStackFocus?.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const launchScenarioFromBlueprint = (
    title: string,
    context: string,
    stage: InterviewStage
  ) => {
    const customScenario: Scenario = {
      id: `custom_${Date.now()}`,
      title,
      stage,
      track: blueprint?.targetTrack || 'principal_tse',
      difficulty: 'Staff',
      category: 'Custom JD Drill',
      context,
      interviewerPersona:
        stage === 'technical'
          ? 'Principal Systems Reliability Bar-Raiser'
          : stage === 'recruiter'
          ? 'Director of Executive Technical Talent'
          : 'Fortune 500 Senior VP of Infrastructure',
      groundTruthState: {
        rootCause: 'Thread pool starvation caused by database lock cascades',
        verifiedSymptoms: ['Elevated HTTP 504 status rates', 'Connection pool saturation', 'High socket backlog'],
        logSnippets: {
          'ss -s': 'TCP: inuse 8421 (estab 7954, closed 120, orphaned 0, timewait 420)',
          'dmesg | tail': 'TCP: request_sock_TCP: Possible SYN flooding on port 443. Sending cookies.',
          'processlist': 'SHOW FULL PROCESSLIST; -> 145 threads in state: Waiting for table metadata lock'
        }
      }
    };

    onLaunchCustomScenario(customScenario);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Search Grounding &amp; Live Real-Time Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Job Description Reverse-Engineer Studio
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Paste any job description from any company. EscalateIQ utilizes Google Search Grounding to verify recent architecture trends, company outages, or hiring bar expectations, then generates an actionable interview blueprint and 1-click drill scenarios.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Description Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Target Job Description (Paste Here)</span>
              <span className="text-[11px] font-normal text-slate-500 lowercase">
                paste raw posting
              </span>
            </label>
            <textarea
              rows={9}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 bg-slate-50/50"
              placeholder="Paste job title, responsibilities, and requirements here..."
            />
          </div>

          {/* Candidate Profile / Background */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Your Candidate Background &amp; Credentials</span>
                <span className="text-[11px] font-normal text-slate-500 lowercase">
                  credentials &amp; tech stack
                </span>
              </label>
              <textarea
                rows={4}
                value={candidateProfile}
                onChange={(e) => setCandidateProfile(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 bg-slate-50/50"
                placeholder="e.g. Master's in CS, 7 years in L3 support, Linux, PostgreSQL, AWS, incident management..."
              />
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed">
                <strong>Why this matters:</strong> Gemini cross-references your background against the company's real-time tech stack and anticipates recruiter screen skepticism (e.g., flight risk vs. strategic IC).
              </div>
            </div>

            {/* Firebase Sync Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                {currentUser ? (
                  <span>Cloud persistence enabled for: <strong>{currentUser.email}</strong></span>
                ) : (
                  <span>Sign in with Google to sync blueprints across devices</span>
                )}
              </span>
              {savedSuccess && (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved to Cloud
                </span>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !jobDescription.trim()}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Grounded Reverse-Engineering in Progress...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Grounded Blueprint with Google Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Blueprint Results */}
      {blueprint && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Executive Summary */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                Hiring Bar Executive Assessment
              </span>
              <button
                onClick={copyBlueprint}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Blueprint'}
              </button>
            </div>
            <p className="text-base text-slate-200 leading-relaxed font-medium">
              {blueprint.roleSummary}
            </p>

            {/* Real-Time Company Intel & Search Grounding Citations */}
            {blueprint.realTimeCompanyIntel && (
              <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Real-Time Search Grounding Intelligence</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {blueprint.realTimeCompanyIntel}
                </p>
                {blueprint.groundingSources && blueprint.groundingSources.length > 0 && (
                  <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Verified Sources:</span>
                    {blueprint.groundingSources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700 truncate max-w-xs transition"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{src.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3 Pillars Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Recruiter Screen Traps */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                Recruiter Screen Positioning
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Anticipated Recruiter Doubts:
                </span>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {blueprint.recruiterScreen?.keyRisks?.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-xs text-blue-950 space-y-1">
                <strong className="block text-blue-900 font-bold">Winning Narrative Angle:</strong>
                <p className="leading-relaxed">{blueprint.recruiterScreen?.counterStrategy}</p>
              </div>

              <button
                onClick={() => {
                  const q = blueprint.recruiterScreen?.likelyQuestions?.[0];
                  launchScenarioFromBlueprint(
                    'Recruiter Screen: Defense & Positioning',
                    q?.question || 'Why are you targeting this role with your advanced background?',
                    'recruiter'
                  );
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <Play className="w-3.5 h-3.5" /> Practice Recruiter Screen
              </button>
            </div>

            {/* 2. Technical Diagnostics */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Terminal className="w-5 h-5" />
                Technical Bar Probes
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Anticipated Incident Scenarios:
                </span>
                <ul className="text-xs text-slate-700 space-y-2">
                  {blueprint.technicalInterview?.incidentScenarios?.map((scen, idx) => (
                    <li key={idx} className="border-l-2 border-indigo-400 pl-2 py-0.5">
                      <span className="font-semibold block text-slate-900">{scen.title}</span>
                      <span className="text-[11px] text-slate-500">{scen.context}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  const s = blueprint.technicalInterview?.incidentScenarios?.[0];
                  launchScenarioFromBlueprint(
                    s?.title || 'SEV-1 Technical Outage',
                    s?.context || 'Critical latency spike on API gateway.',
                    'technical'
                  );
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <Play className="w-3.5 h-3.5" /> Practice Technical Scenario
              </button>
            </div>

            {/* 3. Managerial & Escalation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <Brain className="w-5 h-5" />
                Managerial &amp; Escalation Bridge
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Key Organizational Friction:
                </span>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {blueprint.managerialEscalation?.keyFrictionPoints?.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {blueprint.managerialEscalation?.highPressureQuestions?.[0] && (
                <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-100 text-xs text-purple-950 space-y-1">
                  <strong className="block text-purple-900 font-bold">High-Stakes Scenario:</strong>
                  <p className="italic text-slate-700">
                    "{blueprint.managerialEscalation.highPressureQuestions[0].scenario}"
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  const m = blueprint.managerialEscalation?.highPressureQuestions?.[0];
                  launchScenarioFromBlueprint(
                    'High-Stakes Escalation Roleplay',
                    m?.scenario || 'Handle angry enterprise customer.',
                    'managerial'
                  );
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <Play className="w-3.5 h-3.5" /> Practice Escalation Roleplay
              </button>
            </div>
          </div>

          {/* Recommended War Stories */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Tailored "War Stories" to Prepare for This Specific Role
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {blueprint.recommendedWarStories?.map((story, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{story}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved Blueprints Drawer for logged in user */}
      {currentUser && savedBlueprints.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>Your Cloud Saved Interview Blueprints ({savedBlueprints.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedBlueprints.map((saved) => (
              <div
                key={saved.id}
                onClick={() => setBlueprint(saved)}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-slate-900 line-clamp-1">
                  {saved.roleSummary || 'Custom JD Blueprint'}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">
                  {saved.jobDescriptionSnippet || 'Job description details...'}
                </div>
                <div className="text-[10px] text-indigo-600 font-semibold pt-1 flex items-center gap-1">
                  <span>Click to view blueprint</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
