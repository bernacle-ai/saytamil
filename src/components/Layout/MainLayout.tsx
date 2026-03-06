'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Editor } from '../Editor/Editor';
import { useChat } from '@/contexts/ChatContext';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { currentChatId, currentMessages } = useChat();

  useEffect(() => {
    const savedTheme = localStorage.getItem('tamil_chat_theme') as 'dark' | 'light' | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('tamil_chat_theme', newTheme);
  };

  // Determine which view to show
  const showEmpty = !currentChatId;
  const showEditor = currentChatId;

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} theme={theme} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
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
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tamil Chat</h1>
              <span className="px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold rounded-full">AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
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
            <button className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}>
              <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          {showEmpty && <EmptyView theme={theme} />}
          {showEditor && <Editor theme={theme} />}
        </main>
      </div>
    </div>
  );
}

function EmptyView({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6 animate-bounce">👋</div>
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
          Welcome to Tamil Chat
        </h2>
        <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-8`}>
          Select a chat from the sidebar or create a new one to get started with grammar checking, spelling corrections, and writing suggestions.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-lg`}>
            <div className="text-2xl mb-2">✍️</div>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Grammar Check</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'} mt-1`}>Real-time corrections</p>
          </div>
          <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-lg`}>
            <div className="text-2xl mb-2">🎯</div>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Smart Suggestions</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'} mt-1`}>AI-powered tips</p>
          </div>
          <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-lg`}>
            <div className="text-2xl mb-2">🌐</div>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Translation</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'} mt-1`}>Tamil ↔ English</p>
          </div>
          <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-lg`}>
            <div className="text-2xl mb-2">📊</div>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Analytics</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'} mt-1`}>Writing insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeView({ onNewChat }: { onNewChat: () => string }) {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">👋</div>
        <h2 className="text-3xl font-bold text-white mb-4">Welcome to Tamil Chat</h2>
        <p className="text-slate-400 mb-8">
          Your AI-powered Tamil writing assistant. Create a new chat to get started with grammar checking, spelling corrections, and writing suggestions.
        </p>
        <button
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Chat
        </button>
      </div>
    </div>
  );
}

function ChatView() {
  const { currentMessages } = useChat();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {currentMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
