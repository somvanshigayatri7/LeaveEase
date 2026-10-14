import React from 'react';
import {
  Bot,
  FileText,
  ShieldCheck,
  BookOpen,
  CalendarDays,
  FileCheck2,
  User,
  Sliders,
  Sparkles,
  Palmtree,
  Stethoscope,
} from 'lucide-react';
import { CompanyPolicy, LeaveBalance, UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  setIsProfileOpen: (open: boolean) => void;
  activePolicy: CompanyPolicy;
  setIsPolicyOpen: (open: boolean) => void;
  leaveBalance: LeaveBalance;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  setIsProfileOpen,
  activePolicy,
  setIsPolicyOpen,
  leaveBalance,
}) => {
  const tabs = [
    { id: 'agent', label: 'AI Guide Agent', icon: Bot, badge: 'Smart' },
    { id: 'faq', label: 'Leave FAQs', icon: BookOpen, badge: 'New' },
    { id: 'drafter', label: 'Leave Drafter', icon: FileText },
    { id: 'auditor', label: 'Approval Auditor', icon: ShieldCheck },
    { id: 'templates', label: 'Template Vault', icon: FileCheck2 },
    { id: 'policies', label: 'Policy Explorer', icon: Sliders },
    { id: 'calculator', label: 'Days & Balance', icon: CalendarDays },
  ];

  const annualLeft = leaveBalance.annualTotal - leaveBalance.annualUsed;
  const sickLeft = leaveBalance.sickTotal - leaveBalance.sickUsed;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner / Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">LeaveEase</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Agent Active
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Intelligent Leave Application & HR Policy Copilot</p>
          </div>
        </div>

        {/* Right Controls: Balance Badges & Policy Switcher & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Balance Pills */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-1 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white shadow-2xs text-slate-700 font-medium">
              <Palmtree className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vacation:</span>
              <span className="font-bold text-emerald-700">{annualLeft}d</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white shadow-2xs text-slate-700 font-medium">
              <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
              <span>Sick:</span>
              <span className="font-bold text-rose-700">{sickLeft}d</span>
            </div>
          </div>

          {/* Active Policy Selector Button */}
          <button
            onClick={() => setIsPolicyOpen(true)}
            title="Switch or view Company Policy Rules"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span className="max-w-[110px] sm:max-w-[140px] truncate text-slate-800 font-semibold">{activePolicy.name}</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200/80 transition-colors shadow-2xs"
            title="Edit Employee & Manager Info"
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span className="max-w-[90px] sm:max-w-[110px] truncate">{userProfile.name}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md uppercase tracking-wider font-bold ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
