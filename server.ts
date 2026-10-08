import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Universal Candidate Profile Default Context
const DEFAULT_CANDIDATE_PROFILE = `
Target Track: Technical IC / Systems Forensics & Enterprise Escalation / Management Track.
Core Competencies: Distributed systems triage, cloud architectures, Linux/Unix internals, SQL/database diagnostics, API/middleware integrations, and enterprise customer de-escalation.
Background: Seasoned technical professional with graduate credentials bridging hands-on diagnostic rigor with business acumen (SLA adherence, MTTR reduction, executive reporting, customer retention).
`;

// 1. Analyze Job Description & Reverse-Engineer Interview Blueprint
app.post('/api/interview/analyze-jd', async (req: Request, res: Response) => {
  try {
    const { jobDescription, candidateProfile, targetTrack } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }

    const prompt = `
You are an executive hiring bar-raiser and Principal Systems Director.
Analyze this job description for the candidate. Use real-time web knowledge to cross-reference recent news, architecture, or interview bars about the company or product mentioned if available.
Target Track: ${targetTrack || 'principal_tse'} (Principal Technical Support Engineer or Enterprise Escalation Manager / Principal TAM)

Candidate Background:
${candidateProfile || DEFAULT_CANDIDATE_PROFILE}

Job Description:
${jobDescription}

Provide an interview blueprint in JSON format:
{
  "roleSummary": "Short 2-line strategic assessment of role and where the bar is",
  "targetTrack": "${targetTrack || 'principal_tse'}",
  "realTimeCompanyIntel": "Current company context, recent product launches, outages, or tech stack nuances found via search",
  "recruiterScreen": {
    "keyRisks": ["Why recruiter might doubt: e.g. overqualified due to MS+MBA, flight risk to management or SWE"],
    "counterStrategy": "Exact positioning formula to turn MS+MBA and Atlassian/Linux/MySQL background into a massive hiring asset",
    "likelyQuestions": [
      {
        "question": "Question text",
        "underlyingIntent": "What recruiter is actually looking for",
        "suggestedAngle": "How the candidate should frame the answer based on their technical background and business value"
      }
    ]
  },
  "technicalInterview": {
    "techStackFocus": ["Key technologies to brush up on based on JD requirements (Splunk, Linux, MySQL, Boomi, APIs, Cloud)"],
    "incidentScenarios": [
      {
        "title": "Scenario title (e.g., Jira Core REST API 504 Gateway Timeout or MySQL Thread Pool Exhaustion)",
        "context": "Context description",
        "diagnosticSteps": ["Specific commands expected (e.g. ss -s, Splunk SPL, mysqladmin processlist, DevTools waterfall)"],
        "goldenHypothesis": "Probable root cause and systemic mitigation"
      }
    ],
    "deepQuestions": ["3 deep technical troubleshooting questions"]
  },
  "managerialEscalation": {
    "keyFrictionPoints": ["Cross-functional challenges tested (e.g. engineering pushback on Jira defect, Fortune 500 SLA breach)"],
    "highPressureQuestions": [
      {
        "scenario": "Customer/leadership scenario",
        "winningStrategy": "How candidate balances customer empathy, MBA business value (ARR/SLA), and technical authority"
      }
    ]
  },
  "recommendedWarStories": [
    "3 specific war stories candidate should prepare from their portfolio"
  ],
  "matchedCertifications": ["Relevant certifications from candidate's profile that directly support this role"]
}

Return ONLY valid JSON without markdown wrapping.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let rawText = response.text || '{}';
    // Clean potential markdown wrap
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsed = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // If parsing fails, try substring from first { to last }
      const start = rawText.indexOf('{');
      const end = rawText.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        parsed = JSON.parse(rawText.substring(start, end + 1));
      }
    }

    // Extract Grounding metadata sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: { title: string; uri: string }[] = [];
    if (groundingChunks && Array.isArray(groundingChunks)) {
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          });
        }
      }
    }

    res.json({
      ...parsed,
      groundingSources: sources,
    });
  } catch (error: any) {
    console.error('Error analyzing JD:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze job description.' });
  }
});

// 2. Interactive Interview Turn / Simulation
app.post('/api/interview/chat', async (req: Request, res: Response) => {
  try {
    const {
      stage, // 'recruiter' | 'technical' | 'managerial'
      track, // 'principal_tse' | 'escalation_tam'
      evalMode, // 'tough_bar_raiser' | 'coaching'
      scenario,
      history,
      userMessage,
      candidateProfile
    } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }

    const currentTrack = track || scenario?.track || 'principal_tse';
    const isTough = evalMode !== 'coaching';

    let systemInstruction = `
Candidate Context:
${candidateProfile || DEFAULT_CANDIDATE_PROFILE}
Current Stage: ${stage}
Current Track: ${currentTrack} (${currentTrack === 'principal_tse' ? 'Principal Technical Support Engineer' : 'Enterprise Escalation Manager / Principal TAM'})
Mode: ${isTough ? 'Tough Principal Bar-Raiser' : 'Coaching Mode (Supportive with helpful hints)'}
`;

    // Inject Ground-Truth Consistency for Technical Scenarios to prevent hallucinations
    if (scenario?.groundTruthState) {
      systemInstruction += `
CRITICAL GROUND-TRUTH FACT SHEET (MUST REMAIN 100% CONSISTENT ACROSS ALL TURNS):
- Root Cause: ${scenario.groundTruthState.rootCause}
- Verified Symptoms: ${JSON.stringify(scenario.groundTruthState.verifiedSymptoms)}
- Ground-Truth Telemetry Outputs: ${JSON.stringify(scenario.groundTruthState.logSnippets)}
Rule: Do NOT invent contradictory system outputs. If the candidate asks for telemetry covered in the ground-truth, reflect these exact outputs.
`;
    }

    if (stage === 'recruiter') {
      systemInstruction += `
You are a Lead Executive Technical Recruiter screening for a ${currentTrack === 'principal_tse' ? 'Principal Technical Support Engineer' : 'Enterprise Escalation Manager / Principal TAM'} position at a top-tier enterprise software company (e.g. Atlassian, ServiceNow, Datadog, Snowflake, AWS).
Your Persona:
- Professional, perceptive, looking for red flags.
- You know the candidate has a strong background, advanced training, and proven technical experience.
- Probe specifically:
  1. "Why stay in technical support / escalations with advanced credentials rather than moving into pure people management or software engineering?"
  2. "Are you looking to transition to engineering after a few months?"
  3. "How hands-on are you still with command-line logs vs delegating?"
  4. Salary and leveling expectations ($165k-$220k+).
- Safeguard rule: If the candidate answers defensively or rambles past 90 seconds, challenge them gently in character.
- Keep responses concise (2-4 sentences max), asking ONE focused question at a time.
`;
    } else if (stage === 'technical') {
      systemInstruction += `
You are a Principal Systems Architect & Reliability Bar-Raiser conducting a technical incident triage interview for a ${currentTrack === 'principal_tse' ? 'Principal Technical Support Engineer' : 'Principal Escalation TAM'}.
Scenario: ${scenario?.title || 'SEV-1 Production Incident'}: ${scenario?.context}

Your Persona:
- You are running a live incident investigation.
- If candidate issues diagnostic commands (e.g. \`ss -s\`, \`Splunk index search\`, \`mysqladmin processlist\`, \`curl -Iv\`, \`DevTools network waterfall\`), return realistic, technically accurate log/system output that matches the scenario ground truth.
- Do NOT give away the root cause immediately. Make him hypothesize, isolate failure domains, and prove deduction.
- If the track is Principal TSE, hold him to high technical precision on Linux, MySQL, Splunk, APIs, and microservices.
- If the track is Escalation TAM, test both technical understanding and his ability to synthesize technical reality into customer impact.
- Keep responses realistic, format command outputs like terminal blocks when appropriate.
`;
    } else {
      // Managerial / Escalation
      systemInstruction += `
You are either an irate Fortune 500 Enterprise Executive (VP/CTO) or a protective Principal Software Engineering Lead in a high-stakes escalation interview.
Scenario: ${scenario?.title || 'Executive Escalation'}: ${scenario?.context}

Your Persona:
- High stakes, pressing for accountability, clear SLAs, and measurable timelines.
- Test his ability to:
  1. De-escalate customer panic without making unrealistic promises.
  2. Establish a clear 15-minute briefing rhythm.
  3. Tie technical mitigation back to business value (MBA perspective: churn prevention, ARR at risk, financial penalties).
  4. Negotiate with Engineering with reproducible logs and impact metrics rather than emotional pleas.
- Respond realistically: push back if he is vague, defensive, or overly jargon-heavy without business clarity.
`;
    }

    // Format conversation history
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: userMessage || 'Hello, I am ready to begin.' }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: isTough ? 0.7 : 0.5,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in interview chat:', error);
    res.status(500).json({ error: error.message || 'Failed to generate interview response.' });
  }
});

// 3. Comprehensive Evaluation Rubric with 4 Critical Safeguards
app.post('/api/interview/evaluate', async (req: Request, res: Response) => {
  try {
    const { stage, track, evalMode, scenario, history } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }

    const currentTrack = track || scenario?.track || 'principal_tse';
    const currentMode = evalMode || 'tough_bar_raiser';

    const conversationTranscript = history
      ?.map((m: any) => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.text}`)
      ?.join('\n\n');

    const prompt = `
You are an executive hiring bar-raiser evaluating the candidate's mock interview performance.
Stage: ${stage}
Track: ${currentTrack} (${currentTrack === 'principal_tse' ? 'Principal Technical Support Engineer' : 'Enterprise Escalation Manager / Principal TAM'})
Evaluation Mode: ${currentMode} (${currentMode === 'tough_bar_raiser' ? 'Uncompromising Enterprise Bar' : 'Coaching Mode'})
Scenario: ${scenario?.title || 'General Evaluation'}

Candidate Profile Context:
${DEFAULT_CANDIDATE_PROFILE}

Transcript:
${conversationTranscript}

Evaluate strictly according to the target track:
- If Principal TSE: 60% Technical Deduction & Telemetry (Splunk/Linux/MySQL/DevTools), 20% Root Cause Mitigation, 20% Structured Communication.
- If Enterprise Escalation TAM: 50% Executive Presence & SLA/De-escalation, 30% MBA Business Value & Stakeholder Diplomacy, 20% Technical Credibility.

Audit the 4 Specific Candidate Safeguards:
1. Pacing & Rambling: Did answers stay crisp and focused (<90 seconds / under ~200 words per turn), or did he ramble?
2. Defensiveness Check: Did he show confidence when discussing career history, leaving a company, or having an MS+MBA in Support, or did he sound defensive?
3. MBA Business Value: Did he tie technical fixes back to business metrics (MTTR, SLA compliance, CSAT, revenue retention, engineering toil)?
4. Technical Syntax & Precision: Were command syntaxes (Splunk SPL, Linux ss/dmesg, MySQL queries, REST status codes) accurate?

Return in JSON format:
{
  "overallScore": 88, // out of 100
  "verdict": "Strong Hire" | "Hire" | "Leaning Hire" | "Needs Work",
  "track": "${currentTrack}",
  "evalMode": "${currentMode}",
  "strengths": [
    "Specific strength with evidence from transcript"
  ],
  "areasForImprovement": [
    "Specific improvement or missed opportunity"
  ],
  "rubricBreakdown": [
    {
      "criteria": "Technical Deduction & Systems Rigor",
      "score": 9, // out of 10
      "feedback": "Evaluation commentary"
    },
    {
      "criteria": "Executive Presence & Customer De-escalation",
      "score": 8,
      "feedback": "Evaluation commentary"
    },
    {
      "criteria": "Structured Communication (STAR/RCA Framework)",
      "score": 9,
      "feedback": "Evaluation commentary"
    },
    {
      "criteria": "MS+MBA Leverage & Business Acumen",
      "score": 9,
      "feedback": "Evaluation commentary"
    }
  ],
  "safeguardAudits": {
    "pacingAndRambling": {
      "status": "Crisp" | "Optimal" | "Rambling / Over 90s",
      "feedback": "Detailed feedback on answer conciseness and pacing"
    },
    "defensivenessCheck": {
      "status": "Confident & Proactive" | "Neutral" | "Defensive Trap Detected",
      "feedback": "Assessment of emotional composure and pivot away from defensiveness"
    },
    "mbaBusinessImpact": {
      "score": 8, // 1-10
      "feedback": "How well technical fixes were connected to business value, MTTR, and client retention"
    },
    "technicalSyntaxAccuracy": {
      "score": 9, // 1-10
      "feedback": "Evaluation of command syntax accuracy (Linux, MySQL, Splunk, APIs)"
    }
  },
  "modelAnswerOrNextAction": "How an L4/Staff Support Engineer or Principal TAM would deliver the winning answer",
  "takeawaySummary": "2-line executive summary of performance"
}

Return ONLY valid JSON without markdown wrapping.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error evaluating interview:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate interview.' });
  }
});

// 4. Text-To-Speech (Gemini 3.8 Flash Lite TTS)
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 450),
              speechMetadata: {
                style: 'Professional, calm enterprise interviewer',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Zephyr' }, // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from model.' });
    }

    res.json({ audioBase64: base64Audio });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    res.status(500).json({ error: error.message || 'TTS generation failed' });
  }
});

// Serve Vite in development or static in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
