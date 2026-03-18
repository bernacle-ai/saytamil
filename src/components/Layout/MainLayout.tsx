'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Editor } from '../Editor/Editor';
import { useChat } from '@/contexts/ChatContext';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const { currentChatId } = useChat();

  useEffect(() => {
    const savedTheme = localStorage.getItem('tamil_chat_theme') as 'dark' | 'light' | null;
    if (savedTheme) setTheme(savedTheme);
    const savedFont = localStorage.getItem('tamil_chat_font');
    if (savedFont) setFontSize(Number(savedFont));
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('tamil_chat_theme', newTheme);
  };

  const handleFontChange = (size: number) => {
    setFontSize(size);
    localStorage.setItem('tamil_chat_font', String(size));
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} theme={theme} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
            >
              <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>SayTamil</h1>
              <span className="px-2 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-semibold rounded-full">AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
              title="Settings"
            >
              <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {currentChatId
            ? <Editor theme={theme} globalFontSize={fontSize} />
            : <EmptyView theme={theme} />
          }
        </main>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSettings(false)}>
          <div
            className={`w-80 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl shadow-2xl p-6`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
              <button onClick={() => setShowSettings(false)} className={`p-1 ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'} rounded`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* Theme */}
              <div>
                <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>Theme</p>
                <div className="flex gap-2">
                  {(['dark', 'light'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => { setTheme(t); localStorage.setItem('tamil_chat_theme', t); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        theme === t
                          ? 'bg-teal-500 text-white'
                          : theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>Editor Font Size: {fontSize}px</p>
                <input
                  type="range"
                  min={12}
                  max={24}
                  step={2}
                  value={fontSize}
                  onChange={e => handleFontChange(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-xs mt-1 text-slate-500">
                  <span>12px</span><span>24px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyView({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6 animate-bounce">👋</div>
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
          Welcome to SayTamil
        </h2>
        <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-8`}>
          Select a chat from the sidebar or create a new one to get started.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          {[['✍️','Grammar Check','Real-time corrections'],['🎯','Smart Suggestions','AI-powered tips'],['🌐','Transliteration','Type English, get Tamil'],['📊','Usage Tracking','Daily limit insights']].map(([icon, title, desc]) => (
            <div key={title} className={`p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-lg`}>
              <div className="text-2xl mb-2">{icon}</div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'} mt-1`}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
