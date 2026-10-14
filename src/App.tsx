import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AgentChat } from './components/AgentChat';
import { FAQSection } from './components/FAQSection';
import { LeaveDrafter } from './components/LeaveDrafter';
import { ApprovalAuditor } from './components/ApprovalAuditor';
import { TemplateVault } from './components/TemplateVault';
import { PolicyExplorer } from './components/PolicyExplorer';
import { LeaveCalculator } from './components/LeaveCalculator';
import { ProfileModal } from './components/ProfileModal';
import { PolicyModal } from './components/PolicyModal';
import { COMPANY_POLICIES, DEFAULT_USER_PROFILE } from './data/leaveData';
import { CompanyPolicy, LeaveBalance, LeaveDraft, LeaveType, TemplateItem, UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('agent');

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('leaveease_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Active Company Policy
  const [activePolicy, setActivePolicy] = useState<CompanyPolicy>(() => {
    try {
      const savedId = localStorage.getItem('leaveease_policy_id');
      const found = COMPANY_POLICIES.find((p) => p.id === savedId);
      return found || COMPANY_POLICIES[0];
    } catch {
      return COMPANY_POLICIES[0];
    }
  });

  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  // Leave Balances
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>(() => {
    try {
      const saved = localStorage.getItem('leaveease_balances');
      return saved
        ? JSON.parse(saved)
        : {
            annualTotal: 20,
            annualUsed: 6,
            sickTotal: 10,
            sickUsed: 2,
            casualTotal: 5,
            casualUsed: 1,
            compOffTotal: 2,
            compOffUsed: 0,
          };
    } catch {
      return {
        annualTotal: 20,
        annualUsed: 6,
        sickTotal: 10,
        sickUsed: 2,
        casualTotal: 5,
        casualUsed: 1,
        compOffTotal: 2,
        compOffUsed: 0,
      };
    }
  });

  // Working Leave Draft
  const [draft, setDraft] = useState<LeaveDraft>({
    leaveType: 'Annual Vacation',
    startDate: '2026-10-19',
    endDate: '2026-10-23',
    returnDate: '2026-10-26',
    totalDays: 5,
    isHalfDay: false,
    reason: 'Planned annual vacation to recharge and travel with family.',
    coverageColleague: userProfile.backupColleague,
    handoverDetails: 'Completed upcoming sprint tasks; ongoing client tickets delegated to backup with access links shared.',
    emergencyContact: userProfile.emergencyPhone,
    tone: 'formal',
    additionalNotes: '',
  });

  // Audit text passed between tabs
  const [auditText, setAuditText] = useState<string>(
    `Dear Sarah Jenkins,\n\nI am writing to formally request annual leave from Oct 19, 2026 to Oct 23, 2026 (5 working days). I will resume work on Monday, Oct 26, 2026.\n\nDavid Chen has agreed to act as my backup for urgent operational matters during my absence. All key project deliverables for this cycle have been finalized and documented.\n\nIn the event of an urgent critical emergency, you can reach me at +1 (555) 234-5678.\n\nThank you for your support.\n\nSincerely,\nAlex Morgan`
  );

  // Persist Profile
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem('leaveease_user_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }
  };

  // Persist Policy
  const handleSelectPolicy = (newPolicy: CompanyPolicy) => {
    setActivePolicy(newPolicy);
    try {
      localStorage.setItem('leaveease_policy_id', newPolicy.id);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle cross-tab actions
  const handleAskAI = (promptText: string) => {
    setActiveTab('agent');
    // Let AgentChat handle the prompt
  };

  const handleSelectLeaveTypeToDraft = (leaveType: string) => {
    setDraft((prev) => ({
      ...prev,
      leaveType: leaveType as LeaveType,
    }));
    setActiveTab('drafter');
  };

  const handleSelectTemplate = (template: TemplateItem) => {
    const personalizedBody = template.body
      .replace(/\[Your Name\]/g, userProfile.name)
      .replace(/\[Your Title\]/g, userProfile.title)
      .replace(/\[Department\]/g, userProfile.department)
      .replace(/\[Manager Name\]/g, userProfile.managerName)
      .replace(/\[Colleague Name\]/g, userProfile.backupColleague)
      .replace(/\[Emergency Contact Number\]/g, userProfile.emergencyPhone);

    setDraft((prev) => ({
      ...prev,
      leaveType: template.category,
      reason: template.description,
    }));

    setAuditText(`Subject: ${template.subject}\n\n${personalizedBody}`);
    setActiveTab('drafter');
  };

  const handleAuditRequest = (letterText: string, type: string, notice: number) => {
    setAuditText(letterText);
    setActiveTab('auditor');
  };

  const handleApplyPolishedToDraft = (polishedText: string) => {
    setAuditText(polishedText);
    setActiveTab('drafter');
  };

  const handleApplyDraftFromChat = (partialDraft: Partial<LeaveDraft>) => {
    setDraft((prev) => ({
      ...prev,
      ...partialDraft,
    }));
    setActiveTab('drafter');
  };

  const handleApplyDatesFromCalculator = (sDate: string, eDate: string, total: number) => {
    setDraft((prev) => ({
      ...prev,
      startDate: sDate,
      endDate: eDate,
      totalDays: total,
    }));
    setActiveTab('drafter');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        setIsProfileOpen={setIsProfileOpen}
        activePolicy={activePolicy}
        setIsPolicyOpen={setIsPolicyOpen}
        leaveBalance={leaveBalance}
      />

      {/* Main Content Area */}
      <main className="pb-16">
        {activeTab === 'agent' && (
          <AgentChat
            userProfile={userProfile}
            activePolicy={activePolicy}
            onApplyDraftToEditor={handleApplyDraftFromChat}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'faq' && (
          <FAQSection
            activePolicy={activePolicy}
            onAskAI={handleAskAI}
            onSelectLeaveTypeToDraft={handleSelectLeaveTypeToDraft}
          />
        )}

        {activeTab === 'drafter' && (
          <LeaveDrafter
            userProfile={userProfile}
            activePolicy={activePolicy}
            draft={draft}
            setDraft={setDraft}
            onAuditRequest={handleAuditRequest}
          />
        )}

        {activeTab === 'auditor' && (
          <ApprovalAuditor
            auditText={auditText}
            setAuditText={setAuditText}
            leaveType={draft.leaveType}
            noticeDays={draft.totalDays}
            activePolicy={activePolicy}
            userProfile={userProfile}
            onApplyPolished={handleApplyPolishedToDraft}
          />
        )}

        {activeTab === 'templates' && (
          <TemplateVault
            userProfile={userProfile}
            onSelectTemplate={handleSelectTemplate}
            onAskAIAboutTemplate={handleAskAI}
          />
        )}

        {activeTab === 'policies' && (
          <PolicyExplorer
            activePolicy={activePolicy}
            setActivePolicy={handleSelectPolicy}
            onAskAI={handleAskAI}
          />
        )}

        {activeTab === 'calculator' && (
          <LeaveCalculator
            leaveBalance={leaveBalance}
            setLeaveBalance={setLeaveBalance}
            activePolicy={activePolicy}
            onApplyDatesToDrafter={handleApplyDatesFromCalculator}
          />
        )}
      </main>

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Policy Switcher Modal */}
      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        activePolicy={activePolicy}
        onSelectPolicy={handleSelectPolicy}
      />
    </div>
  );
}
