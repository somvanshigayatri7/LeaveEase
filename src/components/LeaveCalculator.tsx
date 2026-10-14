import React, { useState } from 'react';
import {
  CalendarDays,
  Palmtree,
  Stethoscope,
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { UPCOMING_HOLIDAYS_2026 } from '../data/leaveData';
import { CompanyPolicy, LeaveBalance, LeaveDraft } from '../types';
import { calculateBusinessDays, calculateNoticeDays, formatDatePretty } from '../utils/dateUtils';

interface LeaveCalculatorProps {
  leaveBalance: LeaveBalance;
  setLeaveBalance: React.Dispatch<React.SetStateAction<LeaveBalance>>;
  activePolicy: CompanyPolicy;
  onApplyDatesToDrafter: (startDate: string, endDate: string, totalDays: number) => void;
}

export const LeaveCalculator: React.FC<LeaveCalculatorProps> = ({
  leaveBalance,
  setLeaveBalance,
  activePolicy,
  onApplyDatesToDrafter,
}) => {
  const [calcStart, setCalcStart] = useState('2026-10-19');
  const [calcEnd, setCalcEnd] = useState('2026-10-23');
  const [excludeHolidays, setExcludeHolidays] = useState(true);
  const [isHalfDay, setIsHalfDay] = useState(false);

  const stats = calculateBusinessDays(calcStart, calcEnd, excludeHolidays, isHalfDay);
  const noticeDays = calculateNoticeDays(calcStart);

  // Check for potential sandwich condition
  const sDate = new Date(calcStart);
  const eDate = new Date(calcEnd);
  const spansWeekend = stats.weekendDays > 0;

  // Projected balance calculations
  const projectedAnnualLeft = Math.max(0, leaveBalance.annualTotal - leaveBalance.annualUsed - stats.workingDays);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <CalendarDays className="w-4 h-4 text-emerald-400" />
            <span>Working Days & Balance Estimator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Leave Calculator & Quota Simulator
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Accurately compute business days, filter federal and company holidays, audit sandwich penalties, and project remaining PTO balances.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Date Inputs & Options (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Select Vacation / Leave Range</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
              <input
                type="date"
                value={calcStart}
                onChange={(e) => setCalcStart(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-hidden font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date</label>
              <input
                type="date"
                value={calcEnd}
                onChange={(e) => setCalcEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-hidden font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={excludeHolidays}
                onChange={(e) => setExcludeHolidays(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span>Automatically exclude official Public Holidays</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isHalfDay}
                onChange={(e) => setIsHalfDay(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span>Half-day leave (0.5 day deduction)</span>
            </label>
          </div>

          {/* Quick Push button */}
          <div className="pt-2">
            <button
              onClick={() => onApplyDatesToDrafter(calcStart, calcEnd, stats.workingDays)}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Transfer Dates to Leave Drafter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Holiday List Card */}
          {stats.holidaysList.length > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Holidays Detected in Range (No leave deducted):
              </p>
              <ul className="space-y-0.5 text-emerald-900">
                {stats.holidaysList.map((h, i) => (
                  <li key={i} className="ml-4 list-disc">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Results & Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Charged Working Days
              </span>
              <span className="text-3xl font-black text-indigo-600 mt-1 block">{stats.workingDays}</span>
              <span className="text-[11px] text-slate-500">Deducted from PTO</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Weekend Days
              </span>
              <span className="text-3xl font-black text-slate-800 mt-1 block">{stats.weekendDays}</span>
              <span className="text-[11px] text-slate-500">Saturdays / Sundays</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Excluded Holidays
              </span>
              <span className="text-3xl font-black text-emerald-600 mt-1 block">{stats.holidaysCount}</span>
              <span className="text-[11px] text-slate-500">Paid statutory days</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Advance Notice
              </span>
              <span
                className={`text-3xl font-black mt-1 block ${
                  noticeDays >= activePolicy.noticeAnnualDays ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {noticeDays}d
              </span>
              <span className="text-[11px] text-slate-500">
                {noticeDays >= activePolicy.noticeAnnualDays ? 'Meets policy' : `Requires ${activePolicy.noticeAnnualDays}d`}
              </span>
            </div>
          </div>

          {/* Sandwich Rule Evaluation Card */}
          {spansWeekend && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
                activePolicy.sandwichRule
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              }`}
            >
              {activePolicy.sandwichRule ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {activePolicy.sandwichRule
                    ? '⚠️ Sandwich Rule Attention: Weekend Spanned'
                    : '✅ Safe: No Sandwich Rule Penalties in Active Policy'}
                </p>
                <p className="mt-1 leading-relaxed">
                  {activePolicy.sandwichRule
                    ? `Under ${activePolicy.name}, bridging Friday and Monday off might cause the intermediate weekend to be counted if total leave exceeds the threshold. Confirm with your manager or HR.`
                    : `Under ${activePolicy.name}, you are only charged for the actual ${stats.workingDays} working days. The weekend is not deducted from your balance.`}
                </p>
              </div>
            </div>
          )}

          {/* Projected Leave Balance Simulator */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Projected Annual Vacation Balance Impact</span>
              <span className="text-xs text-indigo-600 font-semibold">
                Current: {leaveBalance.annualTotal - leaveBalance.annualUsed}d remaining
              </span>
            </h4>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{
                    width: `${(leaveBalance.annualUsed / leaveBalance.annualTotal) * 100}%`,
                  }}
                  className="bg-slate-400 h-full"
                  title="Already Used"
                />
                <div
                  style={{
                    width: `${(stats.workingDays / leaveBalance.annualTotal) * 100}%`,
                  }}
                  className="bg-indigo-600 h-full animate-pulse"
                  title="This Request"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Used: {leaveBalance.annualUsed}d
                </span>
                <span className="flex items-center gap-1 font-semibold text-indigo-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  This Request: {stats.workingDays}d
                </span>
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Remaining: {projectedAnnualLeft}d
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
