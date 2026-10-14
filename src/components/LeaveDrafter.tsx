import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Mail,
  Download,
  ShieldCheck,
  Calendar,
  User,
  Clock,
  ArrowRight,
  ListChecks,
  MessageSquare,
  Palmtree,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { LEAVE_CATEGORIES } from '../data/leaveData';
import { CompanyPolicy, GeneratedLeavePackage, LeaveDraft, LeaveType, Tone, UserProfile } from '../types';
import { calculateBusinessDays, calculateNoticeDays, formatDatePretty, generateMailtoUrl, getNextBusinessDay } from '../utils/dateUtils';

interface LeaveDrafterProps {
  userProfile: UserProfile;
  activePolicy: CompanyPolicy;
  draft: LeaveDraft;
  setDraft: React.Dispatch<React.SetStateAction<LeaveDraft>>;
  onAuditRequest: (letterText: string, leaveType: string, noticeDays: number) => void;
}

export const LeaveDrafter: React.FC<LeaveDrafterProps> = ({
  userProfile,
  activePolicy,
  draft,
  setDraft,
  onAuditRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'letter' | 'slack' | 'ooo' | 'checklist'>('email');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [generatedPackage, setGeneratedPackage] = useState<GeneratedLeavePackage | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  // Update working days calculation automatically
  const dayStats = calculateBusinessDays(draft.startDate, draft.endDate, true, draft.isHalfDay);
  const noticeDays = calculateNoticeDays(draft.startDate);

  // Auto-fill return date if not set or on date change
  useEffect(() => {
    if (draft.endDate && !draft.returnDate) {
      setDraft((prev) => ({
        ...prev,
        returnDate: getNextBusinessDay(draft.endDate),
        totalDays: dayStats.workingDays,
      }));
    } else {
      setDraft((prev) => ({
        ...prev,
        totalDays: dayStats.workingDays,
      }));
    }
  }, [draft.startDate, draft.endDate, draft.isHalfDay]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-leave-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaveType: draft.leaveType,
          startDate: formatDatePretty(draft.startDate),
          endDate: formatDatePretty(draft.endDate),
          totalDays: draft.totalDays,
          reason: draft.reason,
          employeeName: userProfile.name,
          employeeTitle: userProfile.title,
          department: userProfile.department,
          managerName: userProfile.managerName,
          managerTitle: userProfile.managerTitle,
          coverageColleague: draft.coverageColleague || userProfile.backupColleague,
          handoverDetails: draft.handoverDetails,
          emergencyContact: draft.emergencyContact || userProfile.emergencyPhone,
          tone: draft.tone,
          companyPolicy: activePolicy.fullText,
          additionalNotes: draft.additionalNotes,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate');
      }

      const data: GeneratedLeavePackage = await response.json();
      setGeneratedPackage(data);
      setSelectedSubject(data.emailSubject || (data.subjectOptions && data.subjectOptions[0]) || '');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with generation engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Tone options
  const toneOptions: { id: Tone; label: string; desc: string }[] = [
    { id: 'formal', label: 'Formal & Corporate', desc: 'Respectful, compliant, standard executive structure' },
    { id: 'cordial', label: 'Cordial & Warm', desc: 'Friendly, team-oriented, collaborative tone' },
    { id: 'concise', label: 'Crisp & Direct', desc: 'Direct, brief, suitable for fast-moving startups' },
    { id: 'urgent', label: 'Urgent & Immediate', desc: 'For sudden morning illnesses or family emergencies' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Smart Leave Application & Email Builder</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill your details, select tone, and let AI generate an airtight, ready-to-send application package.
          </p>
        </div>

        {/* Quick calculation pills */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs">
          <div>
            <span className="text-slate-500">Working Days:</span>{' '}
            <strong className="text-slate-900 font-bold">{dayStats.workingDays}d</strong>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span className="text-slate-500">Notice:</span>{' '}
            <strong className={`font-bold ${noticeDays >= activePolicy.noticeAnnualDays ? 'text-emerald-700' : 'text-amber-700'}`}>
              {noticeDays}d advance
            </strong>
          </div>
          {dayStats.holidaysCount > 0 && (
            <>
              <span className="text-slate-300">|</span>
              <span className="text-indigo-600 font-medium">({dayStats.holidaysCount} holiday excluded)</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
              1
            </span>
            Leave Application Details
          </h3>

          {/* Leave Type Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Leave Category</label>
            <select
              value={draft.leaveType}
              onChange={(e) => setDraft({ ...draft, leaveType: e.target.value as LeaveType })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-hidden font-medium text-slate-900"
            >
              {LEAVE_CATEGORIES.map((cat) => (
                <option key={cat.type} value={cat.type}>
                  {cat.label} ({cat.typicalNotice})
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-hidden font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date</label>
              <input
                type="date"
                value={draft.endDate}
                onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-hidden font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Half day checkbox & return date */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={draft.isHalfDay}
                onChange={(e) => setDraft({ ...draft, isHalfDay: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span>Half-Day Leave</span>
            </label>

            <div className="text-xs text-slate-500 flex items-center gap-1">
              <span>Return:</span>
              <input
                type="date"
                value={draft.returnDate}
                onChange={(e) => setDraft({ ...draft, returnDate: e.target.value })}
                className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-800"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason / Core Context
            </label>
            <textarea
              rows={2}
              value={draft.reason}
              onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
              placeholder="e.g. Taking annual leave for family trip / Woke up with fever / Scheduled dental surgery..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-hidden text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Handover & Peer Backup */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Designated Backup Colleague</span>
              <span className="text-[11px] text-slate-400 font-normal">Crucial for manager approval</span>
            </label>
            <input
              type="text"
              value={draft.coverageColleague}
              onChange={(e) => setDraft({ ...draft, coverageColleague: e.target.value })}
              placeholder={`e.g. ${userProfile.backupColleague || 'David Chen'}`}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-hidden text-slate-900"
            />
          </div>

          {/* Handover Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Handover & Ongoing Task Plan
            </label>
            <textarea
              rows={2}
              value={draft.handoverDetails}
              onChange={(e) => setDraft({ ...draft, handoverDetails: e.target.value })}
              placeholder="e.g. Active tickets reassigned; client sync handed over; Notion handover doc linked..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-hidden text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Communication Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {toneOptions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDraft({ ...draft, tone: t.id })}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    draft.tone === t.id
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-semibold">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                isGenerating
                  ? 'bg-indigo-400 text-white cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 cursor-pointer active:scale-[0.99]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{isGenerating ? 'AI Generating Leave Package...' : 'Generate Leave Application with AI'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Output & Preview Tabs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('email')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'email' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Draft</span>
              </button>
              <button
                onClick={() => setActiveTab('letter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'letter' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Formal Letter</span>
              </button>
              <button
                onClick={() => setActiveTab('slack')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'slack' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Slack / Teams</span>
              </button>
              <button
                onClick={() => setActiveTab('ooo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'ooo' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Palmtree className="w-3.5 h-3.5" />
                <span>Out of Office (OOO)</span>
              </button>
              <button
                onClick={() => setActiveTab('checklist')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'checklist' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Checklist</span>
              </button>
            </div>

            {/* Audit with AI Quick Trigger */}
            {generatedPackage && (
              <button
                onClick={() =>
                  onAuditRequest(
                    activeTab === 'letter' ? generatedPackage.formalLetter : generatedPackage.emailBody,
                    draft.leaveType,
                    noticeDays
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
                title="Test approval probability score"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audit with AI</span>
              </button>
            )}
          </div>

          {/* Main preview window */}
          {generatedPackage ? (
            <div className="flex-1 flex flex-col space-y-4">
              {/* If tab is Email, show Subject picker */}
              {activeTab === 'email' && generatedPackage.subjectOptions && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Select Subject Line:
                  </span>
                  <div className="space-y-1.5">
                    {generatedPackage.subjectOptions.map((subj, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                          selectedSubject === subj
                            ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="subjectSelect"
                          checked={selectedSubject === subj}
                          onChange={() => setSelectedSubject(subj)}
                          className="w-3.5 h-3.5 text-indigo-600"
                        />
                        <span className="flex-1 truncate">{subj}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Text content area */}
              <div className="flex-1 bg-slate-50/80 rounded-xl border border-slate-200/90 p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap overflow-y-auto max-h-[460px] leading-relaxed select-text shadow-inner">
                {activeTab === 'email' && generatedPackage.emailBody}
                {activeTab === 'letter' && generatedPackage.formalLetter}
                {activeTab === 'slack' && generatedPackage.slackSummary}
                {activeTab === 'ooo' && generatedPackage.outOfOfficeMessage}
                {activeTab === 'checklist' && (
                  <div className="font-sans space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        <span>Pre-Submission Approval Checklist:</span>
                      </h4>
                      <ul className="space-y-2">
                        {generatedPackage.approvalChecklist.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {generatedPackage.handoverBullets && (
                      <div className="pt-3 border-t border-slate-200">
                        <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-600" />
                          <span>Recommended Handover Tasks:</span>
                        </h4>
                        <ul className="space-y-2">
                          {generatedPackage.handoverBullets.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text =
                        activeTab === 'email'
                          ? `Subject: ${selectedSubject}\n\n${generatedPackage.emailBody}`
                          : activeTab === 'letter'
                          ? generatedPackage.formalLetter
                          : activeTab === 'slack'
                          ? generatedPackage.slackSummary
                          : generatedPackage.outOfOfficeMessage;
                      copyToClipboard(text, 'copy-btn');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    {copiedKey === 'copy-btn' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>1-Click Copy</span>
                      </>
                    )}
                  </button>

                  {/* Mailto button */}
                  {activeTab === 'email' && (
                    <a
                      href={generateMailtoUrl(
                        userProfile.managerEmail,
                        selectedSubject,
                        generatedPackage.emailBody,
                        draft.coverageColleague ? userProfile.backupEmail : undefined
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Open in Email App</span>
                    </a>
                  )}

                  {/* Download as .txt */}
                  <button
                    onClick={() =>
                      downloadTextFile(
                        activeTab === 'letter'
                          ? generatedPackage.formalLetter
                          : `Subject: ${selectedSubject}\n\n${generatedPackage.emailBody}`,
                        `leave_request_${draft.leaveType.toLowerCase().replace(/\s+/g, '_')}.txt`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download (.txt)</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400">
                  Ready to send to <span className="font-semibold text-slate-700">{userProfile.managerName}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state before generation */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-500" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">Your Leave Package will appear here</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Configure your dates and reason on the left, then click{' '}
                <strong className="text-indigo-600">&quot;Generate Leave Application with AI&quot;</strong> to receive
                email drafts, formal letters, Slack notices, and an approval checklist.
              </p>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Quick Generate Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
