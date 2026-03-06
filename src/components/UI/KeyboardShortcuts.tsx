'use client';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export function KeyboardShortcuts({ isOpen, onClose, theme = 'dark' }: KeyboardShortcutsProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'Enter'], description: 'Analyze text' },
    { keys: ['Ctrl', 'S'], description: 'Save draft' },
    { keys: ['Ctrl', 'E'], description: 'Export menu' },
    { keys: ['Ctrl', 'N'], description: 'New chat' },
    { keys: ['Esc'], description: 'Close dialogs' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className={`${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-2xl max-w-md w-full p-6 animate-slide-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Keyboard Shortcuts</h2>
          <button onClick={onClose} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}>
            <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'} rounded-lg`}>
              <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, i) => (
                  <kbd key={i} className={`px-3 py-1 ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'} rounded text-xs font-semibold`}>
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-6 p-4 ${theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'} border rounded-lg`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-900'}`}>
            💡 Tip: Press <kbd className={`px-2 py-0.5 ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-200'} rounded mx-1`}>?</kbd> anytime to view shortcuts
          </p>
        </div>
      </div>
    </div>
  );
}
