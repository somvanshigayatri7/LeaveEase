import React, { useState } from 'react';
import {
  BookOpen,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Send,
  MessageSquare,
  Shield,
  Layers,
  FileCheck,
} from 'lucide-react';
import { COMPANY_POLICIES } from '../data/leaveData';
import { CompanyPolicy } from '../types';

interface PolicyExplorerProps {
  activePolicy: CompanyPolicy;
  setActivePolicy: (policy: CompanyPolicy) => void;
  onAskAI: (prompt: string) => void;
}

export const PolicyExplorer: React.FC<PolicyExplorerProps> = ({
  activePolicy,
  setActivePolicy,
  onAskAI,
}) => {
  const [qaQuestion, setQaQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaAnswer, setQaAnswer] = useState<{
    directAnswer: string;
    policyExplanation: string;
    employeeRecommendations: string[];
    managerTalkTrack: string;
  } | null>(null);

  const sampleQuestions = [
    'Does taking leave on Friday and Monday count Saturday & Sunday as leave?',
    'What happens if I fall sick during my approved annual vacation?',
    'Can my manager deny my leave if I provided the required 14 days notice?',
    'Do I need a doctor note if I am sick for only 2 business days?',
    'Can I apply for half-day leave during my 90-day probation period?',
  ];

  const handleAskPolicyAdvisor = async (customQ?: string) => {
    const q = customQ || qaQuestion.trim();
    if (!q || isAsking) return;

    setIsAsking(true);
    setQaAnswer(null);

    try {
      const response = await fetch('/api/policy-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          policyType: activePolicy.name,
          customPolicyText: activePolicy.fullText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to query policy advisor');
      }

      const data = await response.json();
      setQaAnswer(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Policy Guidelines & Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Company Leave Policy Explorer
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Examine your company&apos;s leave rules, notice requirements, medical note thresholds, and sandwich clauses. Ask questions to get clear compliance guidance.
          </p>
        </div>
      </div>

      {/* Policy Selector Cards */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Select Active Policy Framework:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMPANY_POLICIES.map((p) => {
            const isSelected = activePolicy.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePolicy(p)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                </div>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{p.description}</p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>{p.annualDays}d Annual</span>
                  <span>•</span>
                  <span>{p.noticeAnnualDays}d Notice</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Policy Deep-Dive Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Selected Policy Specifications
            </span>
            <h3 className="text-lg font-bold text-slate-900">{activePolicy.name}</h3>
          </div>
          <span className="text-xs font-medium text-slate-500">{activePolicy.description}</span>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Annual Vacation Entitlement
            </span>
            <p className="text-lg font-bold text-slate-900">{activePolicy.annualDays} Business Days</p>
            <p className="text-xs text-slate-500">Accrues ~{(activePolicy.annualDays / 12).toFixed(1)} days / month</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Paid Sick / Medical Leave
            </span>
            <p className="text-lg font-bold text-slate-900">{activePolicy.sickDays} Days / Year</p>
            <p className="text-xs text-slate-500">Doctor note mandated after {activePolicy.medicalCertDays}+ days</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Advance Notice Period
            </span>
            <p className="text-lg font-bold text-slate-900">{activePolicy.noticeAnnualDays} Calendar Days</p>
            <p className="text-xs text-slate-500">Required for leave requests &gt; 3 days</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Weekend Sandwich Rule
            </span>
            <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              {activePolicy.sandwichRule ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-800">Sandwich Clause Applies</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-800">No Sandwich Penalties</span>
                </>
              )}
            </p>
            <p className="text-xs text-slate-500">
              {activePolicy.sandwichRule
                ? 'Fri + Mon leaves may count weekend days unless negotiated'
                : 'Only actual working days missed are charged against quota'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Probation Period Constraint
            </span>
            <p className="text-xs font-semibold text-slate-800">{activePolicy.probationRule}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Handover & Backup Requirement
            </span>
            <p className="text-xs font-semibold text-slate-800">{activePolicy.handoverPolicy}</p>
          </div>
        </div>

        {/* Full text collapsible / view */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
          {activePolicy.fullText}
        </div>
      </div>

      {/* Interactive Policy Q&A Assistant */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>Interactive Policy Advisor (Ask any scenario)</span>
        </div>
        <p className="text-xs text-slate-500">
          Have a scenario like &quot;Can I take 3 days off during sprint freeze?&quot; or &quot;How does medical leave apply to planned dental surgery?&quot; Ask below:
        </p>

        {/* Preset sample pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQaQuestion(sq);
                handleAskPolicyAdvisor(sq);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl whitespace-nowrap transition-colors border border-slate-200 font-medium"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={qaQuestion}
            onChange={(e) => setQaQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskPolicyAdvisor()}
            placeholder="Type your policy question..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-hidden"
          />
          <button
            onClick={() => handleAskPolicyAdvisor()}
            disabled={!qaQuestion.trim() || isAsking}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              qaQuestion.trim() && !isAsking
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isAsking ? 'Analyzing...' : 'Ask AI'}</span>
          </button>
        </div>

        {/* Answer Box */}
        {qaAnswer && (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-4">
            <div>
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                Direct Answer:
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">{qaAnswer.directAnswer}</p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Policy & Industry Explanation:
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">{qaAnswer.policyExplanation}</p>
            </div>

            {qaAnswer.employeeRecommendations && (
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Recommended Action Steps:
                </span>
                <ul className="mt-1 space-y-1">
                  {qaAnswer.employeeRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {qaAnswer.managerTalkTrack && (
              <div className="bg-white p-3 rounded-xl border border-indigo-100 text-xs text-slate-800">
                <span className="font-bold text-indigo-900">Recommended Phrase for Your Manager: </span>
                <span className="italic font-medium">&quot;{qaAnswer.managerTalkTrack}&quot;</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
