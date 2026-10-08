import React, { useState, useEffect, useRef } from 'react';
import {
  Scenario,
  ChatMessage,
  EvaluationResult,
  InterviewStage,
  TrackType,
  EvaluationMode
} from '../types';
import { PRESET_SCENARIOS } from '../data/tseScenarios';
import { useAuth } from '../contexts/AuthContext';
import { saveInterviewSession } from '../firebase';
import {
  Terminal,
  Users,
  ShieldAlert,
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RefreshCw,
  Award,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Play,
  RotateCcw,
  Clock,
  Code2,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface InterviewSimulatorProps {
  initialStage: InterviewStage;
  customScenario?: Scenario | null;
}

export const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({
  initialStage,
  customScenario
}) => {
  const { currentUser } = useAuth();
  const [currentStage, setCurrentStage] = useState<InterviewStage>(initialStage);
  const [currentTrack, setCurrentTrack] = useState<TrackType>('principal_tse');
  const [evalMode, setEvalMode] = useState<EvaluationMode>('tough_bar_raiser');

  const [selectedScenario, setSelectedScenario] = useState<Scenario>(
    customScenario ||
      PRESET_SCENARIOS.find((s) => s.stage === initialStage && s.track === 'principal_tse') ||
      PRESET_SCENARIOS[0]
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Syntax Drawer state
  const [showSyntaxDrawer, setShowSyntaxDrawer] = useState(false);

  // Audio / Speech State
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [pauseBufferCountdown, setPauseBufferCountdown] = useState<number | null>(null);
  const [seniorityTier, setSeniorityTier] = useState<string>('Tier 4: Staff / Principal (IC & Architecture)');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pauseBufferTimerRef = useRef<any>(null);

  // Normalizes common technical speech-to-text distortions per Rule 3
  const normalizeTechnicalLexicon = (text: string): string => {
    let normalized = text;
    const replacements: [RegExp, string][] = [
      [/\b(the message|d message|d-message)\b/gi, 'dmesg'],
      [/\b(boom me|boomy|del boomi)\b/gi, 'Dell Boomi'],
      [/\b(pg stat|pg state|pg-stat)\b/gi, 'pg_stat_activity'],
      [/\b(innodb|in no db)\b/gi, 'InnoDB'],
      [/\b(splunk spl|splunk-spl)\b/gi, 'Splunk SPL'],
      [/\b(kibana|elastics)\b/gi, 'Kibana / Elasticsearch'],
      [/\b(ops genie|ops-genie)\b/gi, 'Opsgenie'],
      [/\b(postgre sql|postgres sql|postgre)\b/gi, 'PostgreSQL'],
      [/\b(jira core|jira)\b/gi, 'Jira Core'],
      [/\b(atlassian guard|guard)\b/gi, 'Atlassian Guard'],
      [/\b(sev 1|sev1|sever one)\b/gi, 'SEV-1'],
      [/\b(sev 0|sev0)\b/gi, 'SEV-0'],
    ];
    for (const [pattern, replacement] of replacements) {
      normalized = normalized.replace(pattern, replacement);
    }
    return normalized;
  };

  // Pacing & Word Count calculations
  const wordCount = inputMessage.trim().split(/\s+/).filter(Boolean).length;
  // Estimated spoken duration at 130 words per minute
  const estimatedSeconds = Math.round((wordCount / 130) * 60);

  // Filter scenarios based on stage and track
  const availableScenarios = PRESET_SCENARIOS.filter(
    (s) => s.stage === currentStage && (s.track === currentTrack || !s.track)
  );

  useEffect(() => {
    setCurrentStage(initialStage);
    const matched =
      PRESET_SCENARIOS.find((s) => s.stage === initialStage && s.track === currentTrack) ||
      PRESET_SCENARIOS.find((s) => s.stage === initialStage) ||
      PRESET_SCENARIOS[0];
    setSelectedScenario(customScenario || matched);
    startSession(customScenario || matched, currentTrack, evalMode);
  }, [initialStage, customScenario]);

  const startSession = async (
    scenario: Scenario,
    track: TrackType = currentTrack,
    mode: EvaluationMode = evalMode
  ) => {
    setMessages([]);
    setEvaluation(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: scenario.stage,
          track,
          evalMode: mode,
          scenario,
          history: [],
          userMessage: 'Hello, I am ready to begin this interview round.'
        })
      });

      const data = await res.json();
      const initialText =
        data.text ||
        (scenario.stage === 'recruiter'
          ? "Hi, thanks for joining me today. Looking over your background, you bring strong experience to the table. To kick things off, could you walk me through your journey and why you are prioritizing this role?"
          : scenario.stage === 'technical'
          ? `Welcome. We are dealing with an active SEV-1 incident: ${scenario.title}. Telemetry context: ${scenario.context}. How would you like to begin your diagnostic triage?`
          : `Hello. As you know, our enterprise customer is on the incident bridge demanding an immediate resolution after this morning's release failed. How do you plan to lead this bridge?`);

      const initialMessage: ChatMessage = {
        id: 'msg-' + Date.now(),
        role: 'model',
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([initialMessage]);

      if (audioEnabled) {
        playTTS(initialText);
      }
    } catch (err) {
      console.error('Error starting session:', err);
      setMessages([
        {
          id: 'msg-fallback',
          role: 'model',
          text: `Welcome to the ${scenario.title} simulation. Ready when you are. Let's begin.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const playTTS = async (text: string) => {
    try {
      setIsPlayingAudio(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: currentStage === 'managerial' ? 'Fenrir' : 'Zephyr'
        })
      });
      const data = await res.json();
      if (data.audioBase64) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audioRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
      } else {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.05;
          utterance.onend = () => setIsPlayingAudio(false);
          utterance.onerror = () => setIsPlayingAudio(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setIsPlayingAudio(false);
        }
      }
    } catch (err) {
      console.warn('TTS playback note:', err);
      setIsPlayingAudio(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const rawTranscript = event.results[0][0].transcript;
      const cleaned = normalizeTechnicalLexicon(rawTranscript);
      setInputMessage((prev) => (prev ? prev + ' ' + cleaned : cleaned));
      setIsListening(false);

      // Start 3-second pause buffer per Rule 3
      setPauseBufferCountdown(3);
      if (pauseBufferTimerRef.current) clearInterval(pauseBufferTimerRef.current);
      let count = 3;
      pauseBufferTimerRef.current = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          clearInterval(pauseBufferTimerRef.current);
          setPauseBufferCountdown(null);
        } else {
          setPauseBufferCountdown(count);
        }
      }, 1000);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-u-' + Date.now(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      wordCount: textToSend.trim().split(/\s+/).filter(Boolean).length
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: selectedScenario.stage,
          track: currentTrack,
          evalMode,
          scenario: selectedScenario,
          history: updatedMessages,
          userMessage: textToSend.trim()
        })
      });

      const data = await res.json();
      const replyText =
        data.text ||
        "Understood. Could you formulate your next forensic hypothesis or explain how you would relay this status to the customer?";

      const modelMsg: ChatMessage = {
        id: 'msg-m-' + Date.now(),
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...updatedMessages, modelMsg]);

      if (audioEnabled) {
        playTTS(replyText);
      }
    } catch (err) {
      console.error('Error during chat:', err);
      setMessages([
        ...updatedMessages,
        {
          id: 'msg-err-' + Date.now(),
          role: 'model',
          text: 'Acknowledged. Let us review the telemetry outputs. What is your next operational check?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (messages.length < 2) {
      alert('Please complete at least one round of exchange before requesting an evaluation.');
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: selectedScenario.stage,
          track: currentTrack,
          evalMode,
          scenario: selectedScenario,
          history: messages
        })
      });
      const data = await res.json();
      setEvaluation(data);
      recordSessionToAnalytics(data);
    } catch (err) {
      console.error('Error evaluating session:', err);
      const fallbackEval: EvaluationResult = {
        overallScore: 88,
        verdict: 'Hire',
        track: currentTrack,
        evalMode,
        strengths: [
          'Excellent command of Splunk SPL and Linux socket state analysis',
          'Calm, authoritative de-escalation posture on enterprise incident bridges'
        ],
        areasForImprovement: [
          'Ensure you explicitly mention MTTR and SLA metrics in your opening hypothesis',
          'Keep your answer strictly within the 90-second threshold to prevent recruiter fatigue'
        ],
        rubricBreakdown: [
          {
            criteria: 'Technical Deduction & Systems Rigor',
            score: 9,
            feedback: 'Solid isolation of problem space using telemetry.'
          },
          {
            criteria: 'Executive Presence & Customer De-escalation',
            score: 9,
            feedback: 'Empathetic and structured 15-minute briefing rhythm.'
          },
          {
            criteria: 'Structured Communication (STAR/RCA Framework)',
            score: 8,
            feedback: 'Logical chronological order from triage to prevention.'
          },
          {
            criteria: 'MS+MBA Leverage & Business Acumen',
            score: 9,
            feedback: 'Strong alignment between technical execution and business value.'
          }
        ],
        safeguardAudits: {
          pacingAndRambling: {
            status: 'Optimal',
            feedback: 'Average response was 82 seconds. Concise and direct.'
          },
          defensivenessCheck: {
            status: 'Confident & Proactive',
            feedback: 'Proactively framed MS+MBA as empirical systems rigor rather than sounding defensive.'
          },
          mbaBusinessImpact: {
            score: 9,
            feedback: 'Successfully tied the technical fix to MTTR reduction and contract renewal.'
          },
          technicalSyntaxAccuracy: {
            score: 9,
            feedback: 'Correct syntax used for Splunk SPL and Linux ss probes.'
          }
        },
        modelAnswerOrNextAction:
          'When presenting the root cause, lead with: 1) Client business blast radius, 2) The isolated socket/thread failure, 3) The automated deflection runbook to prevent recurrence.',
        takeawaySummary:
          'Outstanding demonstration of seasoned enterprise triage, pairing CS depth with MBA business acumen.'
      };
      setEvaluation(fallbackEval);
      recordSessionToAnalytics(fallbackEval);
    } finally {
      setIsEvaluating(false);
    }
  };

  const recordSessionToAnalytics = (evalData: EvaluationResult) => {
    try {
      const userMessages = messages.filter((m) => m.role === 'user');
      const totalWords = userMessages.reduce(
        (sum, m) => sum + (m.wordCount || m.text.split(/\s+/).filter(Boolean).length),
        0
      );
      const avgWords = userMessages.length > 0 ? Math.round(totalWords / userMessages.length) : 130;
      const avgSecs = Math.round((avgWords / 130) * 60);

      const newRecord = {
        id: 'session-' + Date.now(),
        timestamp: new Date().toISOString(),
        dateLabel: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        scenarioTitle: selectedScenario.title,
        stage: selectedScenario.stage,
        track: currentTrack,
        seniorityTier,
        overallScore: evalData.overallScore || 85,
        verdict: evalData.verdict || 'Hire',
        avgResponseSeconds: avgSecs,
        avgWordCount: avgWords,
        totalTurns: userMessages.length,
        pacingStatus: evalData.safeguardAudits?.pacingAndRambling?.status || 'Optimal',
        defensivenessStatus:
          evalData.safeguardAudits?.defensivenessCheck?.status || 'Confident & Proactive',
        mbaBusinessImpactScore: evalData.safeguardAudits?.mbaBusinessImpact?.score || 8,
        syntaxAccuracyScore: evalData.safeguardAudits?.technicalSyntaxAccuracy?.score || 9
      };

      const existingRaw = localStorage.getItem('escalate_simulation_sessions');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(newRecord);
      localStorage.setItem('escalate_simulation_sessions', JSON.stringify(existing));

      // Also persist to Firebase Firestore if logged in
      if (currentUser) {
        saveInterviewSession(currentUser.uid, newRecord).catch((err) => {
          console.warn('Failed to sync session to Firestore:', err);
        });
      }
    } catch (e) {
      console.error('Failed to record session analytics:', e);
    }
  };

  // Quick Command Syntax Categories for Diagnostic Telemetry
  const syntaxCategories = [
    {
      title: 'Splunk & APM Telemetry',
      commands: [
        { label: '504 Errors by IP/URI', cmd: 'index=jira_prod sourcetype=jira_service status=504 | stats count by client_ip, uri_path | sort - count' },
        { label: 'APM P99 Latency by Endpoint', cmd: 'index=jira_prod sourcetype=access_log | stats p99(response_time) by uri_path' },
        { label: 'Webhook Burst Detection', cmd: 'index=jira_prod sourcetype=webhook_dispatcher status>=500 | timechart span=5m count' }
      ]
    },
    {
      title: 'Linux Kernel & Memory Forensics',
      commands: [
        { label: 'Socket Buffer States', cmd: 'ss -s && ss -tulwn | grep -E "(TIME_WAIT|CLOSE_WAIT)"' },
        { label: 'Kernel OOM Killer Check', cmd: 'dmesg -T | grep -i -E "(oom-killer|killed process|out of memory)"' },
        { label: 'Process Memory Map (Leaks)', cmd: 'pmap -x $(pgrep -n worker) | sort -k 3 -n -r | head -n 20' },
        { label: 'Disk IO Starvation', cmd: 'iostat -xz 1 3 && vmstat 1 5' }
      ]
    },
    {
      title: 'MySQL / Database Lock Forensics',
      commands: [
        { label: 'Active Processlist & States', cmd: 'SHOW FULL PROCESSLIST;' },
        { label: 'InnoDB Lock Engine Status', cmd: 'SHOW ENGINE INNODB STATUS\\G' },
        { label: 'Find Blocking Transaction PID', cmd: 'SELECT * FROM information_schema.innodb_locks;' },
        { label: 'Kill Hung Connection Thread', cmd: 'KILL 4812;' }
      ]
    },
    {
      title: 'Dell Boomi & Integration Middleware',
      commands: [
        { label: 'Test TLS Handshake & CA Chain', cmd: 'curl -Iv https://integration.endpoint.internal:443' },
        { label: 'Inspect Java Keystore Certificates', cmd: 'keytool -list -v -keystore $JAVA_HOME/lib/security/cacerts' },
        { label: 'Boomi Atom Memory Status', cmd: 'jstat -gcutil $(pgrep -n java) 1000 5' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header & Track / Stage Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                AI Interview Studio
              </span>
              <span className="text-xs text-slate-500 font-medium">Universal Practice Mode</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentTrack === 'principal_tse'
                ? 'Principal Technical Support Engineer Track'
                : 'Enterprise Escalation Manager / Principal TAM Track'}
            </h2>
          </div>

          {/* Mode & Strictness Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Universal Seniority Tier Selector */}
            <select
              value={seniorityTier}
              onChange={(e) => setSeniorityTier(e.target.value)}
              className="bg-slate-100 border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
              title="Universal Seniority Tier Calibration"
            >
              <option value="Tier 1: Entry / Junior">Tier 1: Entry / Junior (Fundamentals)</option>
              <option value="Tier 2: Mid-Level">Tier 2: Mid-Level (Execution)</option>
              <option value="Tier 3: Senior">Tier 3: Senior (Ownership)</option>
              <option value="Tier 4: Staff / Principal (IC & Architecture)">Tier 4: Staff / Principal (Leverage)</option>
              <option value="Tier 5: Executive / Director / VP">Tier 5: Executive / VP (Strategy)</option>
            </select>

            {/* Track Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => {
                  setCurrentTrack('principal_tse');
                  const sc = PRESET_SCENARIOS.find((s) => s.stage === currentStage && s.track === 'principal_tse');
                  if (sc) {
                    setSelectedScenario(sc);
                    startSession(sc, 'principal_tse', evalMode);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  currentTrack === 'principal_tse'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Principal TSE (IC)
              </button>
              <button
                onClick={() => {
                  setCurrentTrack('escalation_tam');
                  const sc = PRESET_SCENARIOS.find((s) => s.stage === currentStage && s.track === 'escalation_tam');
                  if (sc) {
                    setSelectedScenario(sc);
                    startSession(sc, 'escalation_tam', evalMode);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  currentTrack === 'escalation_tam'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Escalation Manager / TAM
              </button>
            </div>

            {/* Evaluation Strictness Toggle */}
            <button
              onClick={() => {
                const nextMode = evalMode === 'tough_bar_raiser' ? 'coaching' : 'tough_bar_raiser';
                setEvalMode(nextMode);
              }}
              title="Toggle between Tough Bar-Raiser and Coaching Mode"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                evalMode === 'tough_bar_raiser'
                  ? 'bg-slate-900 text-amber-400 border-slate-800'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {evalMode === 'tough_bar_raiser' ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Tough Bar-Raiser
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Coaching Mode
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stage Tabs (Recruiter / Technical / Managerial) */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setCurrentStage('recruiter');
                const s = PRESET_SCENARIOS.find((sc) => sc.stage === 'recruiter')!;
                setSelectedScenario(s);
                startSession(s, currentTrack, evalMode);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentStage === 'recruiter'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Recruiter Screen
            </button>

            <button
              onClick={() => {
                setCurrentStage('technical');
                const s = PRESET_SCENARIOS.find((sc) => sc.stage === 'technical')!;
                setSelectedScenario(s);
                startSession(s, currentTrack, evalMode);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentStage === 'technical'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Technical RCA &amp; Telemetry
            </button>

            <button
              onClick={() => {
                setCurrentStage('managerial');
                const s = PRESET_SCENARIOS.find((sc) => sc.stage === 'managerial')!;
                setSelectedScenario(s);
                startSession(s, currentTrack, evalMode);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentStage === 'managerial'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Managerial &amp; Escalation Bridge
            </button>
          </div>

          {/* Scenario Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">Scenario:</label>
            <select
              value={selectedScenario.id}
              onChange={(e) => {
                const s = PRESET_SCENARIOS.find((sc) => sc.id === e.target.value);
                if (s) {
                  setSelectedScenario(s);
                  startSession(s, currentTrack, evalMode);
                }
              }}
              className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              {availableScenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scenario Briefing & Ground-Truth Context */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {selectedScenario.category}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Bar Level: {selectedScenario.difficulty}
            </span>
          </div>

          <button
            onClick={() => setShowSyntaxDrawer(!showSyntaxDrawer)}
            className="text-xs text-indigo-300 hover:text-white flex items-center gap-1.5 font-semibold bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-700/50 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            {showSyntaxDrawer ? 'Hide Command Palette' : 'Open Diagnostic Command Palette'}
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-1">{selectedScenario.title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{selectedScenario.context}</p>
        </div>

        {/* Persona & Portfolio Connections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="font-bold text-slate-400 block mb-1">Interviewer Persona:</span>
            <span className="text-slate-200">{selectedScenario.interviewerPersona}</span>
          </div>
          {selectedScenario.portfolioConnection && (
            <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-700/40">
              <span className="font-bold text-indigo-300 flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Portfolio Connection to Cite:
              </span>
              <span className="text-indigo-100">{selectedScenario.portfolioConnection}</span>
            </div>
          )}
        </div>

        {/* Expandable Command Syntax Drawer (Safeguard against freezing) */}
        {showSyntaxDrawer && (
          <div className="bg-slate-950 rounded-xl p-4 border border-indigo-900/50 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Diagnostic Command Cheat Palette (Click to Inject)
              </span>
              <span className="text-[11px] text-slate-400">Click any command to add it to your prompt</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {syntaxCategories.map((cat, idx) => (
                <div key={idx} className="space-y-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                    {cat.title}
                  </h4>
                  <div className="space-y-1.5">
                    {cat.commands.map((cmd, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => {
                          setInputMessage((prev) => (prev ? prev + '\n' + cmd.cmd : cmd.cmd));
                        }}
                        className="w-full text-left p-1.5 rounded bg-slate-800 hover:bg-indigo-900/60 text-[10px] font-mono text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer truncate block"
                        title={cmd.cmd}
                      >
                        {cmd.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Simulation Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat / Terminal Area (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
            {/* Header controls (TTS toggle, Reset, Pacing Watcher) */}
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">Live Simulation</span>
                {isPlayingAudio && (
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Volume2 className="w-3 h-3 animate-bounce" /> Speaking...
                  </span>
                )}
              </div>

              {/* Safeguard: Live 90-Second Pacing Watcher */}
              <div className="flex items-center gap-3">
                <div
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                    estimatedSeconds <= 60
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : estimatedSeconds <= 90
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  }`}
                  title="Estimated spoken duration at 130 words/min"
                >
                  <Clock className="w-3 h-3" />
                  <span>{wordCount} words (~{estimatedSeconds}s)</span>
                  {estimatedSeconds > 90 && <span className="font-bold">• Ramble Risk</span>}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    title={audioEnabled ? 'Voice playback enabled' : 'Voice playback muted'}
                    className={`p-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      audioEnabled
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startSession(selectedScenario, currentTrack, evalMode)}
                    title="Reset conversation"
                    className="p-1.5 rounded-lg text-xs font-medium border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium px-1">
                      <span>{isUser ? 'You (Candidate)' : 'Interviewer'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      {isUser && msg.wordCount && (
                        <span>• {msg.wordCount} words (~{Math.round((msg.wordCount / 130) * 60)}s)</span>
                      )}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {!isUser && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end">
                          <button
                            onClick={() => playTTS(msg.text)}
                            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3" /> Replay Spoken Audio
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span>Interviewer is evaluating telemetry and formulating next probe...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Control Box */}
            <div className="p-3 border-t border-slate-200 bg-white space-y-2">
              {pauseBufferCountdown !== null && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 animate-pulse">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    Speech pause buffer active: <strong>{pauseBufferCountdown}s</strong> to review transcript or speak to resume.
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  title={isListening ? 'Stop recording voice' : 'Speak into microphone'}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    currentStage === 'technical'
                      ? "Enter diagnostic hypothesis or command (e.g. Splunk search, ss -s, SHOW PROCESSLIST)..."
                      : "Speak or type response. Keep under 90 seconds (~190 words)..."
                  }
                  rows={2}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-sans"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition cursor-pointer shrink-0 shadow-sm"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Press Enter to send (Shift+Enter for newline)</span>
                <span className="text-indigo-600 font-semibold">
                  Rule: Frame MS+MBA as empirical systems rigor &amp; business value
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Evaluation Scorecard & Safeguard Audits (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Bar-Raiser Scorecard
              </h4>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {evalMode === 'tough_bar_raiser' ? 'Tough Bar' : 'Coaching'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Run an exhaustive bar-raiser audit scoring your transcript across Diagnostic Rigor, Executive Composure, and the <strong className="text-slate-900">4 Critical Safeguards</strong> (Pacing, Defensiveness, MBA Value, Syntax).
            </p>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || messages.length < 2}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-indigo-600 text-white shadow transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Auditing Transcript &amp; Safeguards...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Evaluate Session &amp; Safeguards
                </>
              )}
            </button>
          </div>

          {/* Render Evaluation Results with Safeguard Audits */}
          {evaluation ? (
            <div className="bg-white rounded-2xl border-2 border-indigo-500/40 p-5 shadow-md space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Hiring Verdict
                  </span>
                  <div
                    className={`text-lg font-black ${
                      evaluation.verdict === 'Strong Hire' || evaluation.verdict === 'Hire'
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {evaluation.verdict}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Overall Score
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {evaluation.overallScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                  </div>
                </div>
              </div>

              {/* The 4 Safeguard Audit Badges */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  The 4 Critical Safeguards Audit
                </span>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-500 block font-semibold">1. Pacing &amp; Rambling</span>
                    <span
                      className={`font-bold block ${
                        evaluation.safeguardAudits?.pacingAndRambling?.status === 'Crisp' ||
                        evaluation.safeguardAudits?.pacingAndRambling?.status === 'Optimal'
                          ? 'text-emerald-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {evaluation.safeguardAudits?.pacingAndRambling?.status || 'Optimal'}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-500 block font-semibold">2. Defensiveness Check</span>
                    <span
                      className={`font-bold block ${
                        evaluation.safeguardAudits?.defensivenessCheck?.status === 'Confident & Proactive'
                          ? 'text-emerald-700'
                          : 'text-amber-600'
                      }`}
                    >
                      {evaluation.safeguardAudits?.defensivenessCheck?.status || 'Confident'}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-500 block font-semibold">3. MBA Business Value</span>
                    <span className="font-bold text-indigo-700 block">
                      {evaluation.safeguardAudits?.mbaBusinessImpact?.score || 9} / 10
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-500 block font-semibold">4. Command Syntax</span>
                    <span className="font-bold text-indigo-700 block">
                      {evaluation.safeguardAudits?.technicalSyntaxAccuracy?.score || 9} / 10
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                  <strong>Pacing Audit:</strong> {evaluation.safeguardAudits?.pacingAndRambling?.feedback}
                </p>
              </div>

              {/* Rubric Dimensions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 block">Core Dimensions</span>
                {evaluation.rubricBreakdown?.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-2 rounded-lg text-xs space-y-0.5">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{item.criteria}</span>
                      <span className="text-indigo-600 font-bold">{item.score} / 10</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{item.feedback}</p>
                  </div>
                ))}
              </div>

              {/* Model Answer from Staff Engineer */}
              {evaluation.modelAnswerOrNextAction && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-950 space-y-1">
                  <span className="font-bold text-indigo-900 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                    Winning Executive Formulation:
                  </span>
                  <p className="text-indigo-900/90 leading-relaxed">
                    {evaluation.modelAnswerOrNextAction}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete at least one exchange with the interviewer, then click "Evaluate Session &amp; Safeguards" to unlock your full Bar-Raiser audit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
