import React, { useState, useEffect } from 'react';
import { WarStory } from '../types';
import { JOHN_YAK_WAR_STORIES } from '../data/tseScenarios';
import {
  BookOpen,
  Plus,
  Trash2,
  Copy,
  Check,
  GraduationCap,
  Terminal,
  ShieldAlert,
  Code,
  Sparkles,
  FileText,
  ExternalLink,
  Briefcase
} from 'lucide-react';

export const WarStoryVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'cheatsheet'>('stories');
  const [stories, setStories] = useState<WarStory[]>(() => {
    const saved = localStorage.getItem('escalate_war_stories_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return JOHN_YAK_WAR_STORIES;
      }
    }
    return JOHN_YAK_WAR_STORIES;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [copied, setCopied] = useState(false);

  // New story form state
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newCategory, setNewCategory] = useState<WarStory['category']>('Technical RCA');
  const [newSituation, setNewSituation] = useState('');
  const [newTask, setNewTask] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newResult, setNewResult] = useState('');
  const [newReflection, setNewReflection] = useState('');
  const [newWhenToCite, setNewWhenToCite] = useState('');
  const [newTags, setNewTags] = useState('Atlassian, Splunk, MTTR');

  useEffect(() => {
    localStorage.setItem('escalate_war_stories_v2', JSON.stringify(stories));
  }, [stories]);

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: WarStory = {
      id: 'ws-' + Date.now(),
      title: newTitle.trim(),
      companyOrProject: newCompany.trim() || 'Enterprise Experience',
      category: newCategory,
      situation: newSituation.trim(),
      task: newTask.trim(),
      action: newAction.trim(),
      result: newResult.trim(),
      advancedDegreeReflection: newReflection.trim(),
      whenToCite: newWhenToCite.trim() || 'When asked about this core competence.',
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    };

    setStories([created, ...stories]);
    setIsAdding(false);
    // Reset form
    setNewTitle('');
    setNewCompany('');
    setNewSituation('');
    setNewTask('');
    setNewAction('');
    setNewResult('');
    setNewReflection('');
    setNewWhenToCite('');
  };

  const handleDeleteStory = (id: string) => {
    setStories(stories.filter((s) => s.id !== id));
  };

  const copyAllStories = () => {
    const text = stories
      .map(
        (s) =>
          `### ${s.title} (${s.companyOrProject} - ${s.category})\n` +
          `**Situation:** ${s.situation}\n` +
          `**Task:** ${s.task}\n` +
          `**Action:** ${s.action}\n` +
          `**Result:** ${s.result}\n` +
          `**When to Cite:** ${s.whenToCite}\n` +
          `**MS+MBA Reflection:** ${s.advancedDegreeReflection}\n` +
          `**Tags:** ${s.tags.join(', ')}\n\n`
      )
      .join('---\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Accomplishment Arsenal &amp; STAR Vault
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            War Story Vault &amp; Telemetry Cheat Sheet
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mt-1">
            Pre-loaded with battle-tested template war stories across enterprise systems, customer escalations, and cross-functional negotiation. Add, customize, and export your own STAR+R stories for any role.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'stories'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            My War Stories ({stories.length})
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'cheatsheet'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            TSE &amp; TAM Cheat Sheet
          </button>
        </div>
      </div>

      {activeTab === 'stories' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {isAdding ? 'Cancel' : 'Add New War Story (STAR+R)'}
            </button>

            <button
              onClick={copyAllStories}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard' : 'Export All Stories'}
            </button>
          </div>

          {/* Add Story Form */}
          {isAdding && (
            <form
              onSubmit={handleAddStory}
              className="bg-white rounded-2xl border-2 border-indigo-500/40 p-6 shadow-md space-y-4 animate-in fade-in duration-200"
            >
              <h3 className="font-bold text-slate-900 text-base">New Structured War Story (STAR + MBA Reflection)</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Story Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Redesigning Triage Queue"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Company / Project</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Atlassian, Intapp, WellSky"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Technical RCA">Technical RCA (SEV-1 / SEV-0)</option>
                    <option value="Customer Escalation">Customer Escalation (100% CSAT)</option>
                    <option value="Engineering Negotiation">Engineering Negotiation (Defect Repro)</option>
                    <option value="Process Deflection">Process Deflection &amp; Automation</option>
                    <option value="Portfolio Project">Portfolio Project</option>
                  </select>
                </div>
              </div>

              {/* STAR Inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Situation (Context, business stakes, customer ARR blast radius)
                  </label>
                  <textarea
                    rows={2}
                    value={newSituation}
                    onChange={(e) => setNewSituation(e.target.value)}
                    placeholder="Describe the initial failure state..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Task (Your specific role as Senior/Principal Lead)
                  </label>
                  <textarea
                    rows={2}
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What did you take ownership of?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Action (Precise diagnostic commands, Splunk/Linux/MySQL probes, de-escalation cadence)
                  </label>
                  <textarea
                    rows={3}
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    placeholder="The exact technical and communication actions you executed..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Result (Quantified metrics: MTTR, CSAT %, deflection, retention)
                  </label>
                  <textarea
                    rows={2}
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value)}
                    placeholder="e.g. 20% response time reduction, 100% CSAT maintained..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
                    <label className="text-xs font-bold text-indigo-950 flex items-center gap-1 mb-1">
                      <GraduationCap className="w-4 h-4 text-indigo-700" />
                      MS+MBA Reflection:
                    </label>
                    <textarea
                      rows={2}
                      value={newReflection}
                      onChange={(e) => setNewReflection(e.target.value)}
                      placeholder="How your dual degrees gave you an edge..."
                      className="w-full bg-white border border-indigo-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                    <label className="text-xs font-bold text-emerald-950 flex items-center gap-1 mb-1">
                      <Briefcase className="w-4 h-4 text-emerald-700" />
                      When to Cite (Interview Triggers):
                    </label>
                    <textarea
                      rows={2}
                      value={newWhenToCite}
                      onChange={(e) => setNewWhenToCite(e.target.value)}
                      placeholder="e.g. When asked about queue triage, developer pushback, or MTTR..."
                      className="w-full bg-white border border-emerald-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Atlassian, Linux, MySQL, Boomi, SEV-1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                >
                  Save War Story
                </button>
              </div>
            </form>
          )}

          {/* Stories List */}
          <div className="space-y-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                        {story.companyOrProject}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {story.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base">{story.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      title="Delete story"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* When to cite badge */}
                <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>When to cite in interviews:</strong> {story.whenToCite}
                  </span>
                </div>

                {/* STAR Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <strong className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                      Situation:
                    </strong>
                    <p className="text-slate-700 leading-relaxed">{story.situation}</p>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                      Task:
                    </strong>
                    <p className="text-slate-700 leading-relaxed">{story.task}</p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <strong className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                      Action (Technical &amp; Operational Execution):
                    </strong>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-[11px]">
                      {story.action}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                      Result:
                    </strong>
                    <p className="text-emerald-800 font-medium leading-relaxed bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
                      {story.result}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-indigo-900 font-bold uppercase tracking-wider flex items-center gap-1 text-[10px]">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      MS+MBA Edge:
                    </strong>
                    <p className="text-indigo-950 leading-relaxed bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100">
                      {story.advancedDegreeReflection}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {story.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TSE & TAM Interview Cheat Sheet Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Splunk & Telemetry Commands */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Terminal className="w-4 h-4" />
                Splunk SPL &amp; Atlassian Telemetry
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl space-y-1.5 overflow-x-auto">
                  <p className="text-slate-400"># Isolate 504 Gateway Timeouts by endpoint</p>
                  <p className="text-emerald-400">index=jira_prod sourcetype=access status=504 | stats count by client_ip, uri_path | sort - count</p>

                  <p className="text-slate-400 pt-1"># APM p99 latency spike correlation</p>
                  <p className="text-emerald-400">index=jira_prod | stats p95(resp_time), p99(resp_time) by endpoint</p>

                  <p className="text-slate-400 pt-1"># Webhook burst detection</p>
                  <p className="text-emerald-400">index=jira_prod sourcetype=webhook_event status&gt;=500 | timechart span=5m count</p>
                </div>
              </div>
            </div>

            {/* 2. Linux Kernel & MySQL Forensics */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <Code className="w-4 h-4" />
                Linux Kernel &amp; MySQL Locks
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl space-y-1.5 overflow-x-auto">
                  <p className="text-slate-400"># Inspect TCP socket exhaustion &amp; TIME_WAIT</p>
                  <p className="text-sky-300">ss -s &amp;&amp; ss -tulwn | grep -E "(TIME_WAIT|CLOSE_WAIT)"</p>

                  <p className="text-slate-400 pt-1"># Identify blocking MySQL thread</p>
                  <p className="text-sky-300">SHOW FULL PROCESSLIST; -- Look for long Sleep or Locked</p>
                  <p className="text-sky-300">SHOW ENGINE INNODB STATUS\G -- Inspect lock wait tree</p>
                  <p className="text-sky-300">KILL &lt;thread_id&gt;;</p>
                </div>
              </div>
            </div>

            {/* 3. The 4-Step Executive De-Escalation Formula */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                The 4-Step Executive De-Escalation Formula
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100">
                  <strong className="text-purple-900 font-bold">1. Acknowledge Business Gravity ($2M+ ARR):</strong> "We understand this halts your quarter-end financial billing."
                </div>
                <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100">
                  <strong className="text-purple-900 font-bold">2. Establish 15-Minute Operational Cadence:</strong> "I am leading this incident bridge. We will provide updates every 15 minutes."
                </div>
                <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100">
                  <strong className="text-purple-900 font-bold">3. Isolate Mitigation from RCA:</strong> "Our primary priority right now is localized hotfix deployment; root cause forensic analysis is running in parallel."
                </div>
                <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100">
                  <strong className="text-purple-900 font-bold">4. Actionable Next Steps:</strong> "We have isolated the offending transaction and are rolling out a surgical patch."
                </div>
              </div>
            </div>

            {/* 4. Dell Boomi & Cloud Integration Keystore */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <FileText className="w-4 h-4" />
                Dell Boomi &amp; Cloud Integration
              </div>
              <div className="space-y-2 text-xs text-slate-700 font-mono">
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl space-y-1.5 overflow-x-auto">
                  <p className="text-slate-400"># Verify SSL Handshake on Boomi Endpoint</p>
                  <p className="text-amber-300">curl -Iv https://integration.endpoint.internal:443</p>

                  <p className="text-slate-400 pt-1"># Import Intermediate CA into Java Cacerts</p>
                  <p className="text-amber-300">keytool -import -alias intermediate_ca -keystore cacerts -file ca.crt</p>

                  <p className="text-slate-400 pt-1"># Atom Runner JVM Garbage Collection</p>
                  <p className="text-amber-300">jstat -gcutil &lt;atom_pid&gt; 1000 5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
