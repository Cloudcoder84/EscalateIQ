import { Scenario, WarStory, WeekPlan } from '../types';

export const COMPARISON_TASKS = [
  {
    id: 'applications',
    title: 'Applying to Roles (ATS & Resumes)',
    leverageScore: 3.5,
    roiDescription: 'Low to Medium Leverage',
    aiFitSummary: 'Useful for basic keyword formatting, but largely commoditized and yields diminishing returns in 2026 due to ATS saturation.',
    pros: [
      'Automates tedious resume tailoring & cover letters',
      'Matches keywords against applicant tracking systems (ATS)'
    ],
    cons: [
      'Commoditized: Mass AI tools flood portals; recruiters rely heavily on referrals and strict vetting',
      'Does not solve the interview conversion cliff (converting 1 interview = $180k+)',
      'Can generate generic bullet points that trigger recruiter suspicion for advanced degree holders'
    ],
    verdict: 'Good utility, but NOT the highest-ROI bottleneck for a 15+ year seasoned engineer.'
  },
  {
    id: 'recruiter',
    title: 'Recruiter Screen & Positioning',
    leverageScore: 8.5,
    roiDescription: 'High Leverage (The MS+MBA Positioning Filter)',
    aiFitSummary: 'Crucial filter where seasoned engineers with dual MS+MBA degrees get rejected for being suspected flight risks or overqualified.',
    pros: [
      'Simulates recruiter pushback: "Why support instead of software engineering or pure people management?"',
      'Trains the 90-second elevator pitch that frames advanced degree as architectural rigor and business value',
      'Salary negotiation and leveling anchor preparation ($185k–$225k+)'
    ],
    cons: [
      'Shorter stage (20-30 mins), but failing it stops the entire pipeline immediately'
    ],
    verdict: 'High strategic fit: Overcomes the single biggest hidden bias against advanced degrees in support.'
  },
  {
    id: 'technical',
    title: 'Technical RCA & Incident Diagnostics',
    leverageScore: 10.0,
    roiDescription: 'Highest Asymmetric Leverage (The Principal Differentiator)',
    aiFitSummary: 'The absolute best fit for AI. Generic LeetCode bots fail here. LLMs excel at simulating live broken systems, streaming error logs, and evaluating diagnostic methodology.',
    pros: [
      'LLM acts as the broken distributed system, returning realistic logs (Splunk, Grafana, Linux ss, dmesg, MySQL locks, Boomi)',
      'Tests systematic root cause analysis (RCA), hypothesis testing, and observability telemetry under pressure',
      'Allows candidate to showcase how deep systems intuition and empirical fault isolation solve outages',
      'Directly correlates to Principal TSE offer generation and compensation ($185k-$230k+)'
    ],
    cons: [
      'Requires domain-specific ground-truth consistency rather than generic coding algorithms'
    ],
    verdict: 'Winner: The most impactful, high-stakes application of AI for technical support engineers.'
  },
  {
    id: 'managerial',
    title: 'Managerial & Enterprise Escalations',
    leverageScore: 9.5,
    roiDescription: 'Very High Leverage (Executive Presence & Cross-Functional Diplomacy)',
    aiFitSummary: 'Unrivaled roleplay medium. LLMs simulate impatient Fortune 500 VPs and stubborn engineering leads refusing to patch customer bugs.',
    pros: [
      'Dynamic emotional roleplay: trains composure when an executive is furious about downtime',
      'Practice mediating between angry clients and defensive core engineering/product teams',
      'Refines post-mortem communication, SLA breach recovery, and MBA-level business value articulation'
    ],
    cons: [
      'Requires candidate to articulate STAR behavioral responses clearly under 90 seconds'
    ],
    verdict: 'Exceptional fit: Builds the executive composure needed to land Principal TAM / Escalation Manager roles.'
  }
];

export const MASTER_4_WEEK_SCHEDULE: WeekPlan[] = [
  {
    weekNumber: 1,
    title: 'Immediate Readiness: Recruiter Screen & MS+MBA Positioning',
    focus: 'Get fully primed for next week’s opening recruiter screens and initial technical screens. Master the 90-second pitch, neutralize the "overqualified" bias, and eliminate defensiveness.',
    dailyGoalMinutes: 60,
    milestones: [
      {
        day: 'Monday',
        focusArea: 'The 90-Second Executive Pitch',
        task: 'Rehearse your narrative: BS in CS -> Network & Virtualization -> Health/Legal Tech -> Atlassian scale -> Dual MS+MBA.',
        suggestedScenarioId: 'rec-john-1',
        stage: 'recruiter'
      },
      {
        day: 'Tuesday',
        focusArea: 'The "Overqualified / Flight Risk" Defense',
        task: 'Practice answering: "Why stay in technical support when you have an MS and MBA?" Frame your degree as empirical systems rigor.',
        suggestedScenarioId: 'rec-john-1',
        stage: 'recruiter'
      },
      {
        day: 'Wednesday',
        focusArea: 'Salary Anchoring & Leveling',
        task: 'Anchor your expectations for Principal TSE ($185k-$225k) and Principal TAM roles without pricing yourself out.',
        suggestedScenarioId: 'rec-john-2',
        stage: 'recruiter'
      },
      {
        day: 'Thursday',
        focusArea: 'Technical Screen Triage Basics',
        task: 'Practice Atlassian Jira Core 504 Gateway Timeout incident with Splunk and Grafana telemetry correlation.',
        suggestedScenarioId: 'tech-jira-1',
        stage: 'technical'
      },
      {
        day: 'Friday',
        focusArea: 'The 90-Second Conciseness Drill',
        task: 'Complete 3 voice simulation rounds enforcing the 90-second timer to eliminate rambling.',
        suggestedScenarioId: 'mgr-john-1',
        stage: 'managerial'
      }
    ]
  },
  {
    weekNumber: 2,
    title: 'Deep Technical Diagnostics & Telemetry Labs',
    focus: 'Command-line and query-level precision: Splunk SPL, Linux kernel sockets, MySQL thread lock inspection, and Boomi REST/SOAP integration debugging.',
    dailyGoalMinutes: 60,
    milestones: [
      {
        day: 'Monday',
        focusArea: 'Splunk SPL & Grafana Latency Tracing',
        task: 'Correlate APM waterfall spikes with microservice HTTP 504 errors in Jira Core.',
        suggestedScenarioId: 'tech-jira-1',
        stage: 'technical'
      },
      {
        day: 'Tuesday',
        focusArea: 'Ubuntu Linux Remote SSH Triage',
        task: 'Diagnose process memory creep, socket buffers (ss -s), and Linux kernel OOM killer events.',
        suggestedScenarioId: 'tech-linux-1',
        stage: 'technical'
      },
      {
        day: 'Wednesday',
        focusArea: 'MySQL Lock Contention & Thread Starvation',
        task: 'Execute SHOW PROCESSLIST, analyze table lock wait states, and tune query indexes.',
        suggestedScenarioId: 'tech-mysql-1',
        stage: 'technical'
      },
      {
        day: 'Thursday',
        focusArea: 'Dell Boomi & Middleware Failures',
        task: 'Debug integration pipeline payload drops, XML/JSON parsing errors, and TLS handshake timeouts.',
        suggestedScenarioId: 'tech-boomi-1',
        stage: 'technical'
      },
      {
        day: 'Friday',
        focusArea: 'End-to-End RCA Documentation',
        task: 'Draft a bulletproof Post-Mortem and runbook for a simulated SEV-1 incident.',
        suggestedScenarioId: 'tech-jira-1',
        stage: 'technical'
      }
    ]
  },
  {
    weekNumber: 3,
    title: 'Enterprise Escalations & Cross-Functional Diplomacy',
    focus: 'De-escalating angry C-suite enterprise clients, negotiating with stubborn engineering tech leads, and tying technical fixes back to MBA business metrics (ARR, SLA, CSAT).',
    dailyGoalMinutes: 60,
    milestones: [
      {
        day: 'Monday',
        focusArea: 'The Furious Fortune 500 VP',
        task: 'De-escalate an executive threatening churn over a billing batch outage without making unrealistic rollback promises.',
        suggestedScenarioId: 'mgr-john-1',
        stage: 'managerial'
      },
      {
        day: 'Tuesday',
        focusArea: 'Engineering Pushback Mediation',
        task: 'Force a core development team to patch an edge-case defect by providing reproducible steps, logs, and business ARR impact.',
        suggestedScenarioId: 'mgr-john-2',
        stage: 'managerial'
      },
      {
        day: 'Wednesday',
        focusArea: 'Tying Fixes to MBA Value',
        task: 'Practice articulating how technical troubleshooting directly drove your Atlassian 20% MTTR reduction and Intapp 100% CSAT.',
        suggestedScenarioId: 'mgr-john-1',
        stage: 'managerial'
      },
      {
        day: 'Thursday',
        focusArea: 'SLA Breach Incident Bridge',
        task: 'Establish an executive 15-minute operational rhythm during a live bridge.',
        suggestedScenarioId: 'mgr-john-1',
        stage: 'managerial'
      },
      {
        day: 'Friday',
        focusArea: 'Customer Retention & QBR Prep',
        task: 'Roleplay a Quarterly Business Review presenting root-cause prevention runbooks.',
        suggestedScenarioId: 'mgr-john-2',
        stage: 'managerial'
      }
    ]
  },
  {
    weekNumber: 4,
    title: 'Full-Loop Simulation Marathon & Bar-Raiser Gauntlets',
    focus: 'Simulate full back-to-back 45-to-60 minute interview loops under Tough Bar-Raiser mode to lock in peak interview condition.',
    dailyGoalMinutes: 60,
    milestones: [
      {
        day: 'Monday',
        focusArea: 'Principal TSE Mock Loop 1',
        task: 'Full 45-minute technical incident triage + RCA probe with voice mode.',
        suggestedScenarioId: 'tech-jira-1',
        stage: 'technical'
      },
      {
        day: 'Tuesday',
        focusArea: 'Principal TAM Mock Loop 1',
        task: 'Full 45-minute customer escalation and cross-functional negotiation loop.',
        suggestedScenarioId: 'mgr-john-1',
        stage: 'managerial'
      },
      {
        day: 'Wednesday',
        focusArea: 'Target Company JD Reverse-Engineering',
        task: 'Paste a live job description into the analyzer and execute its customized mock round.',
        suggestedScenarioId: 'tech-mysql-1',
        stage: 'technical'
      },
      {
        day: 'Thursday',
        focusArea: 'Weak-Spot Drill',
        task: 'Run automated audit on pacing, defensiveness, and command syntax precision.',
        suggestedScenarioId: 'rec-john-1',
        stage: 'recruiter'
      },
      {
        day: 'Friday',
        focusArea: 'Final Readiness Check',
        task: 'Review War Story Vault and cheat sheet before game day.',
        suggestedScenarioId: 'mgr-john-2',
        stage: 'managerial'
      }
    ]
  }
];

export const PRESET_SCENARIOS: Scenario[] = [
  // 1. Recruiter Screen Track
  {
    id: 'rec-john-1',
    stage: 'recruiter',
    track: 'principal_tse',
    title: 'The Dual-Degree (MS+MBA) & Career Trajectory Probe',
    difficulty: 'Staff',
    category: 'Leveling & Motivations',
    context: 'The recruiter sees your BS in Computer Science, MSIT, and MBA, along with 15+ years of experience including Atlassian. They are probing whether you will be satisfied in a hands-on Principal Support Engineer role or if you are looking to pivot into people management or software engineering.',
    interviewerPersona: 'Danielle - Senior Executive Recruiter at top enterprise SaaS firm. Astute, observant, probing for flight risk and cultural fit.',
    advancedDegreeAngle: 'Frame your MS/MBA as the multiplier for Principal Support: while junior engineers fix symptoms, your business acumen allows you to prioritize by ARR at risk, customer retention, and SLA financial penalties, while your CS degree gives you command-line credibility.',
    portfolioConnection: 'Cite your Atlassian triage redesign (20% faster response, 10% automation gain) as evidence of business-driven technical execution.'
  },
  {
    id: 'rec-john-2',
    stage: 'recruiter',
    track: 'escalation_tam',
    title: 'Enterprise Escalation & Executive Presence Screening',
    difficulty: 'Principal',
    category: 'Stakeholder Influence',
    context: 'The hiring manager wants to verify you can command respect on an executive escalation call with a Fortune 500 CTO while maintaining cross-functional trust with engineering.',
    interviewerPersona: 'Robert - VP of Customer Operations. Direct, pragmatic, looking for calm authority and structured de-escalation instincts.',
    advancedDegreeAngle: 'Leverage your ITIL Foundation and MBA training: structure incident communication using SLA management frameworks, clear operational cadences, and business risk isolation.',
    portfolioConnection: 'Cite your 100% CSAT record at Intapp and Mediware STAR of the quarter at WellSky.'
  },

  // 2. Technical RCA & Incident Simulation (With Ground-Truth Consistency)
  {
    id: 'tech-jira-1',
    stage: 'technical',
    track: 'principal_tse',
    title: 'SEV-1: Jira Core REST API 504 Timeouts & Splunk / Grafana Telemetry Correlation',
    difficulty: 'Principal',
    category: 'Enterprise SaaS & API Microservices',
    context: 'At 9:45 AM, enterprise tenants report that Jira Core REST API calls to /rest/api/3/issue are timing out with 504 Gateway Timeout errors. Grafana shows API gateway latency spiked to 28 seconds, while backend CPU is nominal at 22%. Splunk error logs are surging.',
    interviewerPersona: 'Alex - Principal Systems Reliability Architect. Demands exact commands, Splunk queries, and systematic elimination of failure domains.',
    groundTruthState: {
      rootCause: 'Database connection pool starvation caused by unindexed JQL webhook queries holding open connections without releasing sockets.',
      verifiedSymptoms: [
        'Ingress proxy returns 504 Gateway Timeout after 30s',
        'Backend CPU is 22%, but active thread pool is at 98% capacity',
        'Splunk query index=jira_prod sourcetype=jira_access shows 15,000 requests/min from a single misconfigured enterprise webhook integration'
      ],
      logSnippets: {
        'Splunk search': 'index=jira_prod sourcetype=jira_service status=504 | stats count by client_ip, uri_path | sort - count',
        'Grafana p99 latency': 'Spike from 180ms to 29,400ms on /rest/api/3/issue endpoint',
        'Thread dump': 'Found 480 threads in TIMED_WAITING on org.apache.tomcat.jdbc.pool.ConnectionPool.borrowConnection'
      }
    },
    systemLogsOrHints: [
      'Splunk query reveals 15,000 calls/min from a third-party CRM webhook running wild',
      'Thread pool is maxed out waiting for database connections',
      'Chrome DevTools console shows CORS preflight succeeds, but POST payload stalls at pending for 30,000ms'
    ],
    expectedProbes: [
      'Query Splunk for 504 status codes grouped by URI and client IP',
      'Check Tomcat / JVM thread dump for connection pool starvation',
      'Check database active connections and slow query log',
      'Apply rate limiting on the offending webhook and scale connection pool'
    ],
    advancedDegreeAngle: 'Demonstrate Little’s Law and queueing saturation theory to explain why 22% CPU hides thread starvation.',
    portfolioConnection: 'Connect to your Atlassian Jira Core support experience diagnosing configuration failures via Splunk and DevTools.'
  },
  {
    id: 'tech-linux-1',
    stage: 'technical',
    track: 'principal_tse',
    title: 'SEV-1: Ubuntu Linux Kernel OOM Killer & Socket Buffer Churn',
    difficulty: 'Staff',
    category: 'Linux Internals & Systems Forensics',
    context: 'Every 6 hours, production workers on Ubuntu hosts crash with SIGKILL. Monitoring indicates available memory collapses below 150MB, triggering the kernel OOM killer.',
    interviewerPersona: 'Marcus - Director of Infrastructure Support. Strict Unix internals expert expecting precise terminal diagnostic command syntax.',
    groundTruthState: {
      rootCause: 'Anonymous memory leak in ingestion worker caused by circular reference in REST API JSON serializer, paired with TCP socket buffer saturation.',
      verifiedSymptoms: [
        'dmesg shows kernel invoked oom-killer on worker PID 14209',
        'cat /proc/meminfo shows AnonPages taking 56GB out of 64GB total',
        'ss -s shows 42,000 sockets in CLOSE_WAIT'
      ],
      logSnippets: {
        'dmesg': 'Out of memory: Killed process 14209 (worker-ingest) total-vm:62194840kB, anon-rss:58210340kB, file-rss:0kB',
        'ss -s': 'Total: 44210, TCP: 42100 (estab 120, closed 41900, orphaned 80, timewait 0)',
        'pmap': 'pmap -x 14209 shows hundreds of monotonically growing 64MB anonymous allocations'
      }
    },
    systemLogsOrHints: [
      'dmesg: Out of memory: Kill process 14209 (worker-ingest) score 910',
      'ss -tulwn shows thousands of unclosed sockets in CLOSE_WAIT state',
      'cat /proc/net/sockstat confirms TCP inuse: 42100'
    ],
    expectedProbes: [
      'Check dmesg for OOM killer logs and badness score',
      'Inspect socket states with ss -s and ss -tulwn',
      'Inspect process virtual memory mapping with pmap -x',
      'Mitigate with systemd memory limit cgroup and patch socket close in application'
    ],
    advancedDegreeAngle: 'Deep virtual memory allocation and kernel socket descriptor management from your CS degree.',
    portfolioConnection: 'Directly mirrors your Intapp experience using SSH on remote Ubuntu hosts to troubleshoot Linux distribution service failures.'
  },
  {
    id: 'tech-mysql-1',
    stage: 'technical',
    track: 'principal_tse',
    title: 'SEV-1: MySQL Database Row Lock Contention & Transaction Deadlocks',
    difficulty: 'Staff',
    category: 'Database Diagnostics & Query Performance',
    context: 'All enterprise batch sync updates are hanging. Client applications report connection timeouts to MySQL. The application pool is failing to acquire connections.',
    interviewerPersona: 'Elena - Staff Database Reliability Architect. Tests transaction isolation, lock tables, and root-cause query mitigation.',
    groundTruthState: {
      rootCause: 'An uncommitted batch migration script holding an exclusive row lock on the `jira_issues` table, blocking 85 concurrent worker threads.',
      verifiedSymptoms: [
        'SHOW PROCESSLIST shows 85 threads in state "Searching rows for update" or "Waiting for table metadata lock"',
        'SHOW ENGINE INNODB STATUS shows transactions waiting on record lock held by thread 4812',
        'max_connections of 500 reached in MySQL'
      ],
      logSnippets: {
        'SHOW PROCESSLIST': 'Id: 4812 | User: migrator | State: Sleep | Time: 1820s | Info: NULL (uncommitted transaction)',
        'INNODB STATUS': '---TRANSACTION 89124, ACTIVE 1820 sec ... mysql tables in use 1, locked 1 ... LOCK WAIT',
        'Slow query log': 'Query took 32.4s: SELECT * FROM jira_issues WHERE project_id = 1042 FOR UPDATE'
      }
    },
    systemLogsOrHints: [
      'MySQL max_connections reached (500/500)',
      'SHOW PROCESSLIST reveals long-running transaction from migrator script',
      'INNODB STATUS details lock tree with thread 4812 as the blocker'
    ],
    expectedProbes: [
      'Execute SHOW PROCESSLIST to identify long-running sleeping or active transactions',
      'Inspect SHOW ENGINE INNODB STATUS to locate blocking transaction ID',
      'Safely kill the blocking thread with KILL 4812',
      'Set interactive_timeout, wait_timeout, and innodb_lock_wait_timeout in my.cnf'
    ],
    advancedDegreeAngle: 'Formal database concurrency and transaction isolation theory (ACID, MVCC, lock trees).',
    portfolioConnection: 'Matches your Intapp and WellSky experience performing SQL traces and MySQL service troubleshooting.'
  },
  {
    id: 'tech-boomi-1',
    stage: 'technical',
    track: 'principal_tse',
    title: 'SEV-2: Dell Boomi Enterprise Integration Atom Payload Dropping & TLS Reset',
    difficulty: 'Senior',
    category: 'Cloud Middleware & Enterprise Integration',
    context: 'Enterprise customers report silent payload drops when syncing records via Dell Boomi integration processes. The cloud Atom reports intermittent execution failures with Connection Reset.',
    interviewerPersona: 'Vikram - Principal Cloud Integration Architect. Focuses on middleware runtime, certificate keystores, and SOAP/REST payload transformations.',
    groundTruthState: {
      rootCause: 'Expired intermediate TLS CA certificate in the Boomi Atom Java keystore causing sporadic handshake aborts, plus payload XML schema validation failure.',
      verifiedSymptoms: [
        'Boomi Atom execution log: Connection reset by peer during SSL handshake',
        'SOAP response code 500: Invalid XML entity encoding',
        'Heap dump on Atom runner shows 88% memory utilization during large JSON transformations'
      ],
      logSnippets: {
        'Atom log': 'SEVERE [com.boomi.connector.generic.GenericConnector] SSLHandshakeException: PKIX path building failed',
        'Curl verification': 'curl -Iv https://integration.endpoint.internal shows TLS fatal alert: certificate_unknown',
        'Process report': 'Process failed at Step 4: Map XML to JSON payload'
      }
    },
    systemLogsOrHints: [
      'Boomi Atom runner reports SSLHandshakeException: PKIX path building failed',
      'Payload XML parser fails on unescaped ampersand in customer name field'
    ],
    expectedProbes: [
      'Inspect Boomi Atom execution history logs',
      'Verify SSL/TLS certificate chain with openssl s_client',
      'Update Java cacerts keystore with missing root/intermediate certificates',
      'Add payload sanitization map shape in Boomi to handle special XML characters'
    ],
    advancedDegreeAngle: 'Systems integration architecture and cryptographic certificate validation.',
    portfolioConnection: 'Highlights your Certified Dell Boomi Production Administrator and Associate Developer credentials.'
  },

  // 3. Managerial & Escalation War Room
  {
    id: 'mgr-john-1',
    stage: 'managerial',
    track: 'escalation_tam',
    title: 'The Outraged Fortune 500 VP Demanding Immediate Platform Rollback',
    difficulty: 'Principal',
    category: 'High-Stakes C-Suite De-escalation',
    context: 'The VP of Technology at a $2.4M ARR enterprise customer joins your incident bridge furious. Their quarter-end billing sync failed due to an API defect in this morning\'s deployment. They threaten to terminate the contract and demand an immediate complete platform rollback, which would disrupt 500 other enterprise tenants.',
    interviewerPersona: 'David Vance - Furious Fortune 500 VP. High-stress, demanding, questioning company reliability.',
    advancedDegreeAngle: 'Deploy your MBA training: acknowledge the business and financial gravity ($2.4M ARR), establish a strict 15-minute briefing rhythm, separate customer mitigation from engineering root cause, and propose a localized hotfix rather than a multi-tenant disaster rollback.',
    portfolioConnection: 'Directly reinforces your 100% CSAT record at Intapp and Mediware STAR of the quarter at WellSky.'
  },
  {
    id: 'mgr-john-2',
    stage: 'managerial',
    track: 'principal_tse',
    title: 'Negotiating With a Stubborn Engineering Tech Lead on a "Working as Designed" Defect',
    difficulty: 'Staff',
    category: 'Cross-Functional Engineering Influence',
    context: 'A production Jira Core defect causes intermittent sync truncation for 3 of your largest strategic accounts. Core engineering has closed the bug twice as "Working as Designed / Edge Case". Support is spending 18 hours/week manually patching records, and customer patience is exhausted.',
    interviewerPersona: 'Samir - Principal Core Development Tech Lead. Skeptical of support tickets, highly protective of sprint velocity, demands hard technical proof.',
    advancedDegreeAngle: 'Leverage your CS foundation and Atlassian background: present reproducible DevTools logs, Splunk trace correlation, quantify the ARR at risk ($3.8M), and offer to co-author the regression test case.',
    portfolioConnection: 'Reflects your Atlassian experience reducing engineering back-and-forth by scoping incidents with clear repro steps, logs, and impact analysis.'
  }
];

export const JOHN_YAK_WAR_STORIES: WarStory[] = [
  {
    id: 'ws-atlassian-1',
    title: 'Redesigning Enterprise Jira Triage & Slashing Response Times by 20%',
    category: 'Process Deflection',
    companyOrProject: 'Atlassian',
    situation: 'Enterprise support queue for Jira Core faced elevated MTTR and engineer burnout due to unstructured ticket intake and vague customer defect reports.',
    task: 'As Senior Enterprise Support Engineer, redesign the triage workflow and reduce engineering back-and-forth without adding headcount.',
    action: 'Analyzed support metrics, instituted a structured triage template requiring browser DevTools console logs, Splunk correlation, and reproduction steps upfront. Automated routine classification tasks using Jira Service Management automation rules.',
    result: 'Reduced initial response time by 20%, increased team productivity by 10%, accelerated engineering bug fix cycles, and authored deflection knowledge base articles.',
    advancedDegreeReflection: 'My MBA training in operations management and queuing theory allowed me to analyze ticket flow bottlenecks rather than simply telling engineers to work faster.',
    whenToCite: 'When asked about improving team processes, driving operational efficiency, or collaborating with engineering.',
    tags: ['Atlassian', 'Jira Core', 'Automation', 'Process Optimization', 'MTTR']
  },
  {
    id: 'ws-intapp-1',
    title: 'Maintaining 100% CSAT via Remote Linux & MySQL Performance Forensics',
    category: 'Customer Escalation',
    companyOrProject: 'Intapp',
    situation: 'High-profile legal-tech clients experienced intermittent timeouts in their cloud tenants during compliance audit reporting windows.',
    task: 'Diagnose the multi-tenant performance degradation, prevent customer contract churn, and restore client confidence.',
    action: 'Used SSH to access remote Ubuntu production hosts, analyzed MySQL slow query logs, identified lock contention during concurrent batch updates, and tuned query indexes. Examined cloud tenant logs in Kibana/Elasticsearch to confirm resolution.',
    result: 'Achieved recognition for maintaining a 100% CSAT score across all assigned enterprise accounts and published training documentation for Intapp Risk & Compliance.',
    advancedDegreeReflection: 'Combines deep CS systems fundamentals (Linux kernel, MySQL query optimization) with MBA-level customer management and de-escalation composure.',
    whenToCite: 'When asked about handling angry enterprise clients, Linux/MySQL troubleshooting, or maintaining customer satisfaction.',
    tags: ['Intapp', 'Linux', 'Ubuntu', 'MySQL', 'Kibana', '100% CSAT']
  },
  {
    id: 'ws-wellsky-1',
    title: 'Isolating Complex Medicaid Financial Claims Defects via SQL Tracing',
    category: 'Technical RCA',
    companyOrProject: 'WellSky',
    situation: 'Healthcare software clients reported critical financial discrepancies in state and federal Medicaid claims workflow processes.',
    task: 'Differentiate between end-user data entry errors and legitimate software code defects, coordinating with development for a permanent fix.',
    action: 'Executed deep SQL traces to inspect database state transitions during claim submissions, identified a concurrency race condition in the financial calculation engine, and provided engineering with reproduction steps and data-fix scripts.',
    result: 'Achieved 100% resolution for product defects and was awarded Mediware STAR of the Quarter multiple times for customer service and technical rigor.',
    advancedDegreeReflection: 'My computer science degree provided the empirical discipline needed to inspect transaction isolation and SQL data lineage under strict healthcare compliance.',
    whenToCite: 'When asked about deep database troubleshooting, working with developers on defects, or handling high-compliance environments.',
    tags: ['WellSky', 'Healthcare SaaS', 'SQL Tracing', 'RCA', 'STAR of Quarter']
  },
  {
    id: 'ws-boomi-1',
    title: 'Automating Enterprise Integration Workflows with Dell Boomi',
    category: 'Portfolio Project',
    companyOrProject: 'Portfolio / Dell Boomi',
    situation: 'Disparate cloud and on-premise enterprise applications required real-time bi-directional synchronization without data corruption or dropped payloads.',
    task: 'Architect and deploy production-grade integration Atom runners on Linux and Windows platforms.',
    action: 'Designed automated integration workflows using Dell Boomi Associate Developer patterns, configured Atom runtime environments, managed SSL/TLS keystores, and created custom XML/JSON mapping shapes.',
    result: 'Earned Certified Dell Boomi Production Administrator and Associate Developer certifications; ensured zero payload dropouts during enterprise data syncs.',
    advancedDegreeReflection: 'Applied enterprise architecture and systems integration principles from my MS in IT Management.',
    whenToCite: 'When asked about middleware, cloud integration, API endpoints, or automation skills.',
    portfolioUrl: 'https://atemio-1--atemkuol.replit.app',
    tags: ['Dell Boomi', 'Integration', 'Linux', 'REST/SOAP', 'Certifications']
  },
  {
    id: 'ws-mastercard-1',
    title: 'Mastercard Cybersecurity Simulation & Threat Awareness Leadership',
    category: 'Portfolio Project',
    companyOrProject: 'Mastercard / Forage',
    situation: 'Corporate environment vulnerable to sophisticated phishing and social engineering attack vectors targeting enterprise credentials.',
    task: 'Serve as an analyst on Mastercard’s Security Awareness Team to audit security vulnerabilities and train business units.',
    action: 'Analyzed enterprise threat reports, identified high-risk departments needing robust protocols, and authored actionable security training procedures and response checklists.',
    result: 'Demonstrated proactive security posture, recognized in portfolio artifacts, complementing Okta and Cloud certifications.',
    advancedDegreeReflection: 'Bridges technical cybersecurity threat modeling with organizational change management and compliance frameworks.',
    whenToCite: 'When asked about security best practices, Okta identity management, or risk governance.',
    portfolioUrl: 'https://atemio-1--atemkuol.replit.app',
    tags: ['Mastercard', 'Cybersecurity', 'Okta', 'Risk Governance', 'Portfolio']
  }
];
