export type InterviewStage = 'recruiter' | 'technical' | 'managerial';
export type TrackType = 'principal_tse' | 'escalation_tam';
export type EvaluationMode = 'tough_bar_raiser' | 'coaching';

export interface Scenario {
  id: string;
  stage: InterviewStage;
  track: TrackType;
  title: string;
  difficulty: 'Senior' | 'Staff' | 'Principal';
  category: string;
  context: string;
  interviewerPersona: string;
  groundTruthState?: {
    rootCause: string;
    verifiedSymptoms: string[];
    logSnippets: Record<string, string>;
  };
  systemLogsOrHints?: string[];
  expectedProbes?: string[];
  advancedDegreeAngle?: string;
  portfolioConnection?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  audioUrl?: string;
  wordCount?: number;
}

export interface RubricItem {
  criteria: string;
  score: number;
  feedback: string;
}

export interface EvaluationResult {
  overallScore: number;
  verdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Work';
  track: TrackType;
  evalMode: EvaluationMode;
  strengths: string[];
  areasForImprovement: string[];
  rubricBreakdown: RubricItem[];
  // The 4 Critical Safeguards
  safeguardAudits: {
    pacingAndRambling: {
      status: 'Crisp' | 'Optimal' | 'Rambling / Over 90s';
      feedback: string;
    };
    defensivenessCheck: {
      status: 'Confident & Proactive' | 'Neutral' | 'Defensive Trap Detected';
      feedback: string;
    };
    mbaBusinessImpact: {
      score: number; // 1-10
      feedback: string;
    };
    technicalSyntaxAccuracy: {
      score: number; // 1-10
      feedback: string;
    };
  };
  modelAnswerOrNextAction: string;
  takeawaySummary: string;
}

export interface JdAnalysisBlueprint {
  roleSummary: string;
  targetTrack: TrackType;
  recruiterScreen: {
    keyRisks: string[];
    counterStrategy: string;
    likelyQuestions: {
      question: string;
      underlyingIntent: string;
      suggestedAngle: string;
    }[];
  };
  technicalInterview: {
    techStackFocus: string[];
    incidentScenarios: {
      title: string;
      context: string;
      diagnosticSteps: string[];
      goldenHypothesis: string;
    }[];
    deepQuestions: string[];
  };
  managerialEscalation: {
    keyFrictionPoints: string[];
    highPressureQuestions: {
      scenario: string;
      winningStrategy: string;
    }[];
  };
  recommendedWarStories: string[];
  matchedCertifications: string[];
  groundingSources?: {
    title: string;
    uri: string;
  }[];
  realTimeCompanyIntel?: string;
}

export interface WarStory {
  id: string;
  title: string;
  category: 'Technical RCA' | 'Customer Escalation' | 'Engineering Negotiation' | 'Process Deflection' | 'Portfolio Project';
  companyOrProject: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  advancedDegreeReflection: string;
  whenToCite: string;
  portfolioUrl?: string;
  tags: string[];
}

export interface WeekPlan {
  weekNumber: number;
  title: string;
  focus: string;
  dailyGoalMinutes: number;
  milestones: {
    day: string;
    focusArea: string;
    task: string;
    suggestedScenarioId: string;
    stage: InterviewStage;
  }[];
}

export interface SimulationSessionRecord {
  id: string;
  timestamp: string;
  dateLabel: string;
  scenarioTitle: string;
  stage: InterviewStage;
  track: TrackType;
  seniorityTier?: string;
  overallScore: number;
  verdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Work';
  avgResponseSeconds: number;
  avgWordCount: number;
  totalTurns: number;
  pacingStatus: 'Crisp' | 'Optimal' | 'Rambling / Over 90s';
  defensivenessStatus: 'Confident & Proactive' | 'Neutral' | 'Defensive Trap Detected';
  mbaBusinessImpactScore: number;
  syntaxAccuracyScore: number;
}

