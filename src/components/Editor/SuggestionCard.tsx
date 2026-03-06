'use client';

import { Suggestion } from '@/lib/gemini';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onAccept: (suggestion: Suggestion) => void;
  onIgnore: (id: string) => void;
  theme?: 'dark' | 'light';
}

const typeColors = {
  grammar: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-500', label: 'Grammar' },
  spelling: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-500', label: 'Spelling' },
  style: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500', label: 'Style' },
  clarity: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-500', label: 'Clarity' },
};

export function SuggestionCard({ suggestion, onAccept, onIgnore, theme = 'dark' }: SuggestionCardProps) {
  const colors = typeColors[suggestion.type];

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} border rounded-lg p-4 space-y-3 hover:shadow-lg transition-all animate-slide-in`}>
      {/* Type Badge */}
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 ${colors.bg} ${colors.text} border ${colors.border} text-xs font-semibold rounded-full`}>
          {colors.label}
        </span>
      </div>

      {/* Original Text */}
      <div>
        <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'} mb-1`}>Original:</p>
        <p className={`text-sm ${theme === 'dark' ? 'text-slate-300 bg-slate-900/50' : 'text-gray-700 bg-gray-50'} px-3 py-2 rounded border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} line-through`}>
          {suggestion.original}
        </p>
      </div>

      {/* Suggestion */}
      <div>
        <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'} mb-1`}>Suggestion:</p>
        <p className={`text-sm ${theme === 'dark' ? 'text-white bg-green-500/10' : 'text-gray-900 bg-green-50'} px-3 py-2 rounded border ${theme === 'dark' ? 'border-green-500/30' : 'border-green-200'} font-medium`}>
          {suggestion.suggestion}
        </p>
      </div>

      {/* Reason */}
      <div className={`${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'} px-3 py-2 rounded`}>
        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
          <span className="font-semibold">Reason:</span> {suggestion.reason}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onAccept(suggestion)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium text-sm transition-all transform hover:scale-105 active:scale-95"
        >
          Accept
        </button>
        <button
          onClick={() => onIgnore(suggestion.id)}
          className={`flex-1 px-4 py-2 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-lg font-medium text-sm transition-all`}
        >
          Ignore
        </button>
      </div>
    </div>
  );
}
