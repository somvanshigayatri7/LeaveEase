import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';
import { ChatMessage, CompanyPolicy, LeaveDraft, UserProfile } from '../types';

interface AgentChatProps {
  userProfile: UserProfile;
  activePolicy: CompanyPolicy;
  onApplyDraftToEditor: (draft: Partial<LeaveDraft>) => void;
  onNavigateToTab: (tab: string) => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({
  userProfile,
  activePolicy,
  onApplyDraftToEditor,
  onNavigateToTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${userProfile.name}! 👋 I am your **LeaveEase AI Guide**. 

I am here to guide you through applying for any type of leave, calculating your business days, ensuring your request complies with **${activePolicy.name}**, organizing handover coverage, and generating a letter your manager will approve with confidence.

How can I help you today? You can describe your situation in plain words or click one of the quick scenarios below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        '🤒 I woke up sick with a fever and need 2 days off',
        '✈️ Planning a 10-day vacation next month',
        '⏳ What notice do I need for personal leave?',
        '🥪 How does the sandwich leave rule work?',
        '👶 Maternity / Paternity leave checklist',
        '🧠 Need a mental health recharge day',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const userText = textToSend || input.trim();
    if (!userText || isLoading) return;

    setInput('');

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, newMsg];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
          userProfile,
          companyPolicy: activePolicy.fullText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const data = await response.json();

      // Check if response contains an actionable drafted request
      const lower = userText.toLowerCase();
      let extractedDraft: Partial<LeaveDraft> | undefined = undefined;

      if (lower.includes('sick') || lower.includes('fever') || lower.includes('unwell')) {
        extractedDraft = {
          leaveType: 'Sick & Medical',
          reason: 'Severe illness / fever; consulting physician for rest and recovery.',
          tone: 'urgent',
        };
      } else if (lower.includes('vacation') || lower.includes('holiday') || lower.includes('trip')) {
        extractedDraft = {
          leaveType: 'Annual Vacation',
          reason: 'Annual personal vacation to recharge with family.',
          tone: 'formal',
        };
      } else if (lower.includes('mental') || lower.includes('burnout')) {
        extractedDraft = {
          leaveType: 'Mental Health Day',
          reason: 'Personal well-being and rest day.',
          tone: 'cordial',
        };
      } else if (lower.includes('bereavement') || lower.includes('passed away') || lower.includes('funeral')) {
        extractedDraft = {
          leaveType: 'Bereavement / Compassionate',
          reason: 'Bereavement leave due to death in immediate family.',
          tone: 'formal',
        };
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedDraft,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Guidance Note**: Could not reach the AI agent service. (${err.message}). 

You can still use the **Leave Drafter** and **Template Vault** directly from the top tabs to craft your leave email!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to render markdown-like text with bolding, lists, and headings
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-slate-900 text-sm mt-3 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-bold text-slate-900 text-base mt-4 mb-2">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={idx} className="font-extrabold text-slate-900 text-lg mt-4 mb-2">
            {line.replace('# ', '')}
          </h2>
        );
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletContent = line.trim().replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc my-1 text-slate-700 leading-relaxed text-sm">
            {renderInlineMarkdown(bulletContent)}
          </li>
        );
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        const itemContent = line.trim().replace(/^\d+\.\s+/, '');
        return (
          <li key={idx} className="ml-4 list-decimal my-1 text-slate-700 leading-relaxed text-sm">
            {renderInlineMarkdown(itemContent)}
          </li>
        );
      }

      // Empty line
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      // Regular paragraph
      return (
        <p key={idx} className="my-1 text-slate-700 leading-relaxed text-sm">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (str: string) => {
    // Quick regex parser for bold **text** and code `code`
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={pIdx} className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-700 border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-5xl mx-auto">
      {/* Context banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-emerald-50 border-b border-indigo-100/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-indigo-900 font-medium">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Active Context:</span>
          <span className="font-bold text-slate-900">{activePolicy.name}</span>
          <span className="hidden md:inline text-slate-400">•</span>
          <span className="hidden md:inline text-slate-600">
            Notice: {activePolicy.noticeAnnualDays}d for annual, Med Cert after {activePolicy.medicalCertDays}d
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Employee:</span>
          <span className="font-semibold text-slate-800">{userProfile.name}</span>
          <span className="text-slate-400">→</span>
          <span className="text-slate-600 font-medium">{userProfile.managerName}</span>
        </div>
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-tr from-slate-800 to-slate-700 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-xs text-sm ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className={`text-[11px] font-semibold ${isUser ? 'text-slate-300' : 'text-indigo-600'}`}>
                    {isUser ? 'You' : 'LeaveEase Guide AI'}
                  </span>
                  <span className={`text-[10px] ${isUser ? 'text-slate-400' : 'text-slate-400'}`}>
                    {message.timestamp}
                  </span>
                </div>

                <div className={isUser ? 'text-slate-100 whitespace-pre-wrap' : ''}>
                  {isUser ? message.content : renderFormattedText(message.content)}
                </div>

                {/* Extracted draft callout if present */}
                {message.extractedDraft && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ready to turn this into a formal leave request?</span>
                    </div>
                    <button
                      onClick={() => {
                        if (message.extractedDraft) {
                          onApplyDraftToEditor(message.extractedDraft);
                        }
                        onNavigateToTab('drafter');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-all shadow-xs"
                    >
                      <span>Open in Drafter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Suggested Action Chips on the welcome message or subsequent messages */}
                {message.suggestedActions && message.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Suggested Inquiries:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(action)}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-colors text-left"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-500 shadow-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Analyzing leave guidelines & generating guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          {/* Quick chip bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs text-slate-600">
            <span className="font-semibold text-slate-400 shrink-0 text-[11px] flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Prompts:
            </span>
            <button
              onClick={() => handleSend('How many sick leave days can I take before requiring a medical note?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 rounded-md whitespace-nowrap text-slate-700 font-medium transition-colors"
            >
              Doctor Note Rules?
            </button>
            <button
              onClick={() => handleSend('Draft a formal notice for 3 days of personal leave next week')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 rounded-md whitespace-nowrap text-slate-700 font-medium transition-colors"
            >
              Draft 3d Personal Leave
            </button>
            <button
              onClick={() => handleSend('What should be included in a thorough work handover before a 2-week vacation?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 rounded-md whitespace-nowrap text-slate-700 font-medium transition-colors"
            >
              Handover Checklist
            </button>
            <button
              onClick={() => handleSend('Can my manager reject my leave request if I gave full 2 weeks notice?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 rounded-md whitespace-nowrap text-slate-700 font-medium transition-colors"
            >
              Can Manager Reject?
            </button>
          </div>

          <div className="flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Ask for advice, check leave policies, or request a draft (e.g. 'I need 4 days off next month for family event')..."
              className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-900 text-sm placeholder:text-slate-400 resize-none outline-hidden px-2 py-1 max-h-32"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl font-medium transition-all ${
                input.trim() && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>
    </div>
  );
};
