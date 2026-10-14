import React from 'react';
import { X, Check, Sliders, CheckCircle2 } from 'lucide-react';
import { COMPANY_POLICIES } from '../data/leaveData';
import { CompanyPolicy } from '../types';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePolicy: CompanyPolicy;
  onSelectPolicy: (policy: CompanyPolicy) => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  activePolicy,
  onSelectPolicy,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Switch Company Policy Guidelines</h3>
              <p className="text-xs text-slate-500">The AI Agent will ground its guidance and audits in this framework</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {COMPANY_POLICIES.map((p) => {
            const isSelected = activePolicy.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPolicy(p);
                  onClose();
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{p.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                      {p.annualDays}d Annual
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                      {p.sickDays}d Sick
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                      {p.noticeAnnualDays}d Notice
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                      Doc after {p.medicalCertDays}d
                    </span>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
