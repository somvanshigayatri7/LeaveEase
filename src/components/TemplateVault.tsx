import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  Search,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Clock,
  Eye,
  X,
} from 'lucide-react';
import { SAMPLE_TEMPLATES } from '../data/leaveData';
import { LeaveDraft, TemplateItem, UserProfile } from '../types';

interface TemplateVaultProps {
  userProfile: UserProfile;
  onSelectTemplate: (template: TemplateItem) => void;
  onAskAIAboutTemplate: (title: string) => void;
}

export const TemplateVault: React.FC<TemplateVaultProps> = ({
  userProfile,
  onSelectTemplate,
  onAskAIAboutTemplate,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePreview, setActivePreview] = useState<TemplateItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Annual Vacation', 'Sick & Medical', 'Mental Health Day', 'Bereavement / Compassionate', 'Maternity / Paternity', 'Compensatory Off', 'Study & Exam'];

  const filtered = useMemo(() => {
    return SAMPLE_TEMPLATES.filter((t) => {
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  const copyTemplate = (tmpl: TemplateItem) => {
    const personalized = tmpl.body
      .replace(/\[Your Name\]/g, userProfile.name)
      .replace(/\[Your Title\]/g, userProfile.title)
      .replace(/\[Department\]/g, userProfile.department)
      .replace(/\[Manager Name\]/g, userProfile.managerName)
      .replace(/\[Colleague Name\]/g, userProfile.backupColleague)
      .replace(/\[Emergency Contact Number\]/g, userProfile.emergencyPhone);

    navigator.clipboard.writeText(`Subject: ${tmpl.subject}\n\n${personalized}`);
    setCopiedId(tmpl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <FileCheck2 className="w-4 h-4 text-amber-300" />
            <span>Ready-to-Use Templates</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Battle-Tested Leave Templates
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Choose from professionally drafted leave applications, personalized automatically with your name, reporting manager, and designated backup colleague.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates (e.g. 'surgery', 'fever', 'vacation', 'bereavement')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-slate-50"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {tmpl.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tmpl.urgency === 'High'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : tmpl.urgency === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {tmpl.urgency} Urgency
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug mb-1.5">{tmpl.title}</h3>
              <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-3">
                {tmpl.description}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">Sample: {tmpl.durationExample}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setActivePreview(tmpl)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyTemplate(tmpl)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  title="1-Click Copy with your details"
                >
                  {copiedId === tmpl.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onSelectTemplate(tmpl)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  {activePreview.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{activePreview.title}</h3>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subject:</span>
                <p className="text-xs font-semibold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1">
                  {activePreview.subject}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Body:</span>
                <pre className="text-xs font-mono text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-1 whitespace-pre-wrap leading-relaxed">
                  {activePreview.body}
                </pre>
              </div>

              {activePreview.tips && (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 space-y-1.5">
                  <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    Pro Guidance:
                  </p>
                  <ul className="space-y-1">
                    {activePreview.tips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-amber-900 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => copyTemplate(activePreview)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
              >
                {copiedId === activePreview.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === activePreview.id ? 'Copied with details!' : 'Copy with My Details'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onAskAIAboutTemplate(activePreview.title);
                    setActivePreview(null);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalize with AI</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTemplate(activePreview);
                    setActivePreview(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Load into Drafter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
