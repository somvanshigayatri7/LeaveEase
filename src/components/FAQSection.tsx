import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText,
  Lightbulb,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Clock,
  Layers,
  BookOpen,
} from 'lucide-react';
import { COMPREHENSIVE_FAQS, FAQItem } from '../data/faqData';
import { CompanyPolicy } from '../types';

interface FAQSectionProps {
  activePolicy: CompanyPolicy;
  onAskAI: (question: string) => void;
  onSelectLeaveTypeToDraft: (leaveType: string) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  activePolicy,
  onAskAI,
  onSelectLeaveTypeToDraft,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'faq-types-1': true,
    'faq-deadlines-1': true,
  });

  const categories = [
    { id: 'all', label: 'All Questions', count: COMPREHENSIVE_FAQS.length },
    {
      id: 'types',
      label: 'Types of Leave',
      count: COMPREHENSIVE_FAQS.filter((f) => f.category === 'types').length,
    },
    {
      id: 'eligibility',
      label: 'Eligibility & Accruals',
      count: COMPREHENSIVE_FAQS.filter((f) => f.category === 'eligibility').length,
    },
    {
      id: 'deadlines',
      label: 'Deadlines & Notice',
      count: COMPREHENSIVE_FAQS.filter((f) => f.category === 'deadlines').length,
    },
    {
      id: 'workflow',
      label: 'Approval Workflows',
      count: COMPREHENSIVE_FAQS.filter((f) => f.category === 'workflow').length,
    },
    {
      id: 'documentation',
      label: 'Required Documents',
      count: COMPREHENSIVE_FAQS.filter((f) => f.category === 'documentation').length,
    },
    {
      id: 'sandwich',
      label: 'Sandwich & Holidays',
      count: COMPREHENSIVE_FAQS.filter((f) => f.category === 'sandwich').length,
    },
  ];

  const filteredFaqs = useMemo(() => {
    return COMPREHENSIVE_FAQS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.proTip.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    filteredFaqs.forEach((f) => {
      allExpanded[f.id] = true;
    });
    setExpandedIds(allExpanded);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
            <HelpCircle className="w-4 h-4 text-indigo-300" />
            <span>Leave Policy Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Leave Application & Policy FAQ
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Everything you need to know about leave categories, statutory eligibility, notice deadlines, manager approval workflows, doctor certificates, and weekend sandwich rules under{' '}
            <span className="font-semibold text-amber-300 underline underline-offset-2">
              {activePolicy.name}
            </span>.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-800/60 text-xs">
            <div>
              <p className="text-indigo-300 font-medium">Standard Notice</p>
              <p className="text-base font-bold text-white mt-0.5">{activePolicy.noticeAnnualDays} Days (Annual)</p>
            </div>
            <div>
              <p className="text-indigo-300 font-medium">Doctor Certificate</p>
              <p className="text-base font-bold text-white mt-0.5">After {activePolicy.medicalCertDays}+ Days Sick</p>
            </div>
            <div>
              <p className="text-indigo-300 font-medium">Sandwich Rule</p>
              <p className="text-base font-bold text-white mt-0.5">
                {activePolicy.sandwichRule ? '⚠️ Active' : '✅ Abolished'}
              </p>
            </div>
            <div>
              <p className="text-indigo-300 font-medium">Annual Entitlement</p>
              <p className="text-base font-bold text-white mt-0.5">{activePolicy.annualDays} Days / Year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., 'doctor note', 'probation', 'sandwich', 'rejection', 'maternity')..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-all bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-200/80 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.label}
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={expandAll}
              className="hover:text-indigo-600 font-medium px-2 py-1 rounded hover:bg-slate-100"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              onClick={collapseAll}
              className="hover:text-indigo-600 font-medium px-2 py-1 rounded hover:bg-slate-100"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Items List */}
      <div className="space-y-3.5">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = !!expandedIds[faq.id];
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-hidden"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {faq.categoryLabel}
                      </span>
                      {faq.docRequired && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <FileCheck className="w-3 h-3 text-rose-600" />
                          Certificate Required
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="p-1 rounded-lg bg-slate-100 text-slate-500 shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 text-sm space-y-4">
                    {/* Primary Answer Paragraph */}
                    <p className="text-slate-700 leading-relaxed font-normal whitespace-pre-line text-sm">
                      {faq.answer}
                    </p>

                    {/* Key Highlights Box */}
                    {faq.keyPoints && faq.keyPoints.length > 0 && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          Key Policy Takeaways:
                        </p>
                        <ul className="space-y-1">
                          {faq.keyPoints.map((point, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pro Tip Card */}
                    {faq.proTip && (
                      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-amber-950">Expert Pro-Tip: </strong>
                          <span>{faq.proTip}</span>
                        </div>
                      </div>
                    )}

                    {/* Documentation note if present */}
                    {faq.docRequired && (
                      <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-900">
                        <FileCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-rose-950">Required Verification: </strong>
                          <span>{faq.docRequired}</span>
                        </div>
                      </div>
                    )}

                    {/* Interactive Action Footer */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {faq.relatedLeaveType && (
                          <button
                            onClick={() => onSelectLeaveTypeToDraft(faq.relatedLeaveType!)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Draft {faq.relatedLeaveType} Request</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => onAskAI(`Regarding policy question: "${faq.question}". Can you explain how this applies to my specific situation and help me plan my next steps?`)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Ask AI Agent About This</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Empty search state */
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">No matching FAQ found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              We couldn't find an exact match for &quot;{searchQuery}&quot;. Ask the AI Guide Agent directly to get an instant, tailored answer!
            </p>
            <div className="pt-2">
              <button
                onClick={() => onAskAI(searchQuery)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ask AI Agent &quot;{searchQuery}&quot;</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Still Have Questions CTA Banner */}
      <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-bold text-slate-900 text-base">Have a unique or sensitive situation?</h4>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            The AI Guide Agent can simulate your leave dates, calculate exact working days, and draft a confidential manager notice.
          </p>
        </div>
        <button
          onClick={() => onAskAI('I have a unique leave question that was not covered in the FAQ.')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Consult AI Guide Now</span>
        </button>
      </div>
    </div>
  );
};
