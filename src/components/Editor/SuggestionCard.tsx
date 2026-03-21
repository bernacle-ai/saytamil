'use client';

import { Suggestion } from '@/lib/gemini';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onAccept: (suggestion: Suggestion) => void;
  onIgnore: (id: string) => void;
  theme?: 'dark' | 'light';
}

const typeConfig = {
  grammar:  { label: 'Grammar',  bg: 'bg-red-100',    text: 'text-red-600'    },
  spelling: { label: 'Spelling', bg: 'bg-orange-100', text: 'text-orange-600' },
  style:    { label: 'Style',    bg: 'bg-blue-100',   text: 'text-blue-600'   },
  clarity:  { label: 'Clarity',  bg: 'bg-purple-100', text: 'text-purple-600' },
};

export function SuggestionCard({ suggestion, onAccept, onIgnore, theme = 'dark' }: SuggestionCardProps) {
  const cfg = typeConfig[suggestion.type] ?? typeConfig.grammar;
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} shadow-sm`}>
      {/* Type badge */}
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        {cfg.label}
      </span>

      {/* Original */}
      <div>
        <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Original:</p>
        <div className={`px-3 py-2 rounded-xl text-sm ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-gray-800'}`}>
          {suggestion.original}
        </div>
      </div>

      {/* Suggestion */}
      <div>
        <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Suggestion:</p>
        <div className={`px-3 py-2 rounded-xl text-sm font-medium ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-teal-700'}`}>
          {suggestion.suggestion}
        </div>
      </div>

      {/* Reason */}
      <div>
        <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Reason:</p>
        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{suggestion.reason}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onAccept(suggestion)}
          className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
        >
          Accept
        </button>
        <button
          onClick={() => onIgnore(suggestion.id)}
          className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-colors ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
        >
          Ignore
        </button>
      </div>
    </div>
  );
}
