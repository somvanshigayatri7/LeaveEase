import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  ThumbsUp,
  FileText,
  Mail,
  ExternalLink,
  Send,
  X,
  User,
} from 'lucide-react';
import { AuditResult, CompanyPolicy, UserProfile } from '../types';
import { generateMailtoUrl } from '../utils/dateUtils';

interface ApprovalAuditorProps {
  auditText: string;
  setAuditText: (text: string) => void;
  leaveType: string;
  noticeDays: number;
  activePolicy: CompanyPolicy;
  userProfile?: UserProfile;
  onApplyPolished: (polishedText: string) => void;
}

export const ApprovalAuditor: React.FC<ApprovalAuditorProps> = ({
  auditText,
  setAuditText,
  leaveType,
  noticeDays,
  activePolicy,
  userProfile,
  onApplyPolished,
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email Dispatch Modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');

  // Extract clean subject and body from text
  const extractEmailParts = (rawText: string) => {
    const defaultEmployee = userProfile?.name || 'Employee';
    const match = rawText.match(/^Subject:\s*(.+)$/im);
    let subject = `Leave Application: ${defaultEmployee} - ${leaveType}`;
    let body = rawText;

    if (match) {
      subject = match[1].trim();
      body = rawText.replace(/^Subject:\s*.+\n+/im, '').trim();
    }

    return { subject, body };
  };

  // Sync recipient and subject whenever auditResult or userProfile changes
  useEffect(() => {
    if (userProfile) {
      setRecipientEmail(userProfile.managerEmail || '');
      setCcEmail(userProfile.backupEmail || '');
    }

    const textToParse = auditResult?.polishedDraft || auditText;
    const { subject } = extractEmailParts(textToParse);
    setCustomSubject(subject);
  }, [auditResult?.polishedDraft, auditText, userProfile, leaveType]);

  const handleRunAudit = async () => {
    if (!auditText.trim()) return;
    setIsAuditing(true);
    setError(null);

    try {
      const response = await fetch('/api/audit-leave-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterText: auditText,
          leaveType,
          noticeDays,
          companyPolicy: activePolicy.fullText,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to complete audit');
      }

      const data: AuditResult = await response.json();
      setAuditResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Audit service encountered an issue.');
    } finally {
      setIsAuditing(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) {
      return {
        color: 'emerald',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        ring: 'text-emerald-500',
        label: 'High Likelihood of Swift Approval',
      };
    } else if (score >= 65) {
      return {
        color: 'amber',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        ring: 'text-amber-500',
        label: 'Moderate - Minor Polish Recommended',
      };
    } else {
      return {
        color: 'rose',
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        ring: 'text-rose-500',
        label: 'High Risk of Delay or Rejection',
      };
    }
  };

  // Computed mailto URL for the polished text
  const currentEmailContent = useMemo(() => {
    const raw = auditResult?.polishedDraft || auditText;
    const { body } = extractEmailParts(raw);
    const subject = customSubject || `Leave Application: ${userProfile?.name || 'Employee'} - ${leaveType}`;
    const mailto = generateMailtoUrl(recipientEmail, subject, body, ccEmail);
    return { subject, body, mailto };
  }, [auditResult?.polishedDraft, auditText, customSubject, recipientEmail, ccEmail, userProfile, leaveType]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Leave Compliance & Readiness Auditor</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Audit Your Leave Request Before Sending
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Test your leave application against 5 core manager criteria: notice period compliance, peer handover clarity, date accuracy, professional tone, and emergency availability boundaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Text Box (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Leave Application Text to Audit</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">{auditText.length} chars</span>
          </div>

          <textarea
            rows={14}
            value={auditText}
            onChange={(e) => setAuditText(e.target.value)}
            placeholder="Paste your leave email draft, formal letter, or manager message here to audit its approval score..."
            className="flex-1 w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-hidden text-xs sm:text-sm text-slate-900 font-mono leading-relaxed"
          />

          <div className="pt-2">
            <button
              onClick={handleRunAudit}
              disabled={isAuditing || !auditText.trim()}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                isAuditing
                  ? 'bg-indigo-400 text-white cursor-wait'
                  : auditText.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{isAuditing ? 'Auditing Against Company Policy...' : 'Run AI Approval Audit'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Results Area (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          {auditResult ? (
            <div className="space-y-6">
              {/* Score Display Card */}
              {(() => {
                const badge = getScoreBadge(auditResult.score);
                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900 leading-none">
                          {auditResult.score}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">/ 100</span>
                      </div>
                      <div>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}
                        >
                          {auditResult.rating}
                        </span>
                        <p className="text-xs text-slate-600 mt-1 font-medium">{auditResult.summary}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 5 Pillar Criteria Checklist */}
              {auditResult.criteriaChecks && auditResult.criteriaChecks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Core Compliance Criteria:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {auditResult.criteriaChecks.map((check, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border bg-slate-50/70 border-slate-200 flex items-start gap-2.5 text-xs"
                      >
                        {check.status === 'pass' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {check.status === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        {check.status === 'alert' && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{check.name}</p>
                          <p className="text-slate-600 text-[11px] mt-0.5">{check.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                    Key Strengths:
                  </h5>
                  <ul className="space-y-1">
                    {auditResult.strengths?.map((s, idx) => (
                      <li key={idx} className="text-xs text-emerald-900 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
                  <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    Recommended Refinements:
                  </h5>
                  <ul className="space-y-1">
                    {auditResult.improvements?.map((imp, idx) => (
                      <li key={idx} className="text-xs text-amber-900 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Polished Draft Box with 'Draft in Email' Feature */}
              {auditResult.polishedDraft && (
                <div className="border border-indigo-200 bg-indigo-50/40 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs sm:text-sm font-bold text-indigo-950">
                        AI Enhanced & Polished Version
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Copy Button */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(auditResult.polishedDraft);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1"
                        title="Copy polished text to clipboard"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>

                      {/* Apply to Drafter Button */}
                      <button
                        onClick={() => onApplyPolished(auditResult.polishedDraft)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors flex items-center gap-1"
                        title="Send back to Leave Drafter tab"
                      >
                        <span>Apply to Drafter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Primary 'Draft in Email' Action Button */}
                      <button
                        onClick={() => setIsEmailModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                        title="Configure and draft email to manager"
                      >
                        <Mail className="w-3.5 h-3.5 text-emerald-100" />
                        <span>Draft in Email</span>
                      </button>

                      {/* Direct Mailto Launch Link */}
                      <a
                        href={currentEmailContent.mailto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-colors"
                        title="Launch default email app immediately"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Polished text display */}
                  <div className="bg-white p-4 rounded-xl border border-indigo-100 font-mono text-xs text-slate-800 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed shadow-2xs select-text">
                    {auditResult.polishedDraft}
                  </div>

                  {/* Inline Email Preview Bar */}
                  <div className="pt-2 border-t border-indigo-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ready to send to:</span>
                      <strong className="text-slate-900 font-semibold">
                        {userProfile?.managerEmail || userProfile?.managerName || 'Your Line Manager'}
                      </strong>
                    </div>

                    <a
                      href={currentEmailContent.mailto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                    >
                      <span>Open in Mail App with Pre-filled Subject</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3 min-h-[400px]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-indigo-500" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">Run an Audit to See Your Score</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Paste your drafted email or letter on the left and click &quot;Run AI Approval Audit&quot;. The auditor will verify notice periods, handover completeness, and provide an enhanced version ready to draft in your email client.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 'Draft in Email' Modal / Drawer */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Draft Polished Application in Email</h3>
                  <p className="text-xs text-slate-500">Formats subject and body into a direct mailto link</p>
                </div>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Fields */}
            <div className="space-y-3 text-xs">
              {/* To field */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">To (Manager Email)</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="manager@company.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-hidden font-medium text-slate-900"
                />
              </div>

              {/* CC field */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">CC (Backup Peer / Team)</label>
                <input
                  type="text"
                  value={ccEmail}
                  onChange={(e) => setCcEmail(e.target.value)}
                  placeholder="backup.colleague@company.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-hidden font-medium text-slate-900"
                />
              </div>

              {/* Subject line (pre-filled & editable) */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pre-filled Subject Line</label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Leave Application: [Name] - [Type]"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-hidden font-semibold text-slate-900"
                />
              </div>

              {/* Body preview */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Body (Polished Text)</label>
                <pre className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-mono text-xs whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                  {currentEmailContent.body}
                </pre>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const fullText = `To: ${recipientEmail}\nCC: ${ccEmail}\nSubject: ${customSubject}\n\n${currentEmailContent.body}`;
                  navigator.clipboard.writeText(fullText);
                  setEmailCopied(true);
                  setTimeout(() => setEmailCopied(false), 2000);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
              >
                {emailCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{emailCopied ? 'Copied Full Email!' : 'Copy Subject & Body'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                >
                  Cancel
                </button>

                <a
                  href={currentEmailContent.mailto}
                  onClick={() => setIsEmailModalOpen(false)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Open in Email Client</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
