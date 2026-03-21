'use client';

import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/contexts/ToastContext';
import { useSession, signOut } from 'next-auth/react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  theme: 'dark' | 'light';
}

export function Sidebar({ isOpen, onToggle, theme }: SidebarProps) {
  const { chats, currentChatId, createChat, switchChat, deleteChat } = useChat();
  const { showToast } = useToast();
  const { data: session } = useSession();

  const handleNewChat = () => {
    createChat();
    showToast('New chat created', 'success');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      signOut({ callbackUrl: '/' });
    }
  };

  // Color scheme: teal/cyan accent, medium-dark sidebar (not pitch black)
  const sidebarBg   = theme === 'dark' ? 'bg-slate-800'        : 'bg-slate-50';
  const borderColor = theme === 'dark' ? 'border-slate-700'    : 'border-slate-200';
  const textMuted   = theme === 'dark' ? 'text-slate-400'      : 'text-slate-500';
  const textFaint   = theme === 'dark' ? 'text-slate-500'      : 'text-slate-400';
  const hoverBg     = theme === 'dark' ? 'hover:bg-slate-700'  : 'hover:bg-slate-100';
  const activeBg    = theme === 'dark'
    ? 'bg-teal-600/20 border border-teal-500/40 text-white'
    : 'bg-teal-50 border border-teal-300 text-teal-900';

  return (
    <>
      <aside className={`${isOpen ? 'w-72' : 'w-0'} ${sidebarBg} border-r ${borderColor} flex flex-col transition-all duration-300 overflow-hidden shadow-lg`}>

        {/* Logo */}
        <div className={`p-4 border-b ${borderColor}`}>
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/saytamil-logo.png" alt="SayTamil" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>SayTamil</h2>
              <p className={`text-xs ${textFaint}`}>AI Writing Assistant</p>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl font-medium text-sm transition-all shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            ✦ New Write
          </button>
        </div>

        {/* History label */}
        <div className={`px-4 pt-4 pb-1`}>
          <p className={`text-xs font-semibold uppercase tracking-wider ${textFaint}`}>History</p>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {chats.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="text-3xl mb-2">💬</div>
              <p className={`text-sm ${textMuted}`}>No chats yet</p>
              <p className={`text-xs ${textFaint} mt-1`}>Create your first chat</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all group relative ${
                  currentChatId === chat.id ? activeBg : `${textMuted} ${hoverBg} border border-transparent`
                }`}
                onClick={() => switchChat(chat.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{chat.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this chat?')) {
                        deleteChat(chat.id);
                        showToast('Chat deleted', 'success');
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-lg transition-all flex-shrink-0"
                  >
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className={`text-xs mt-0.5 ${textFaint}`}>
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* User Info & Logout */}
        <div className={`p-3 border-t ${borderColor} space-y-2`}>
          <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
              {session?.user?.image
                ? <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
                : session?.user?.name?.[0]?.toUpperCase() || 'U'
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {session?.user?.name || 'User'}
              </p>
              <p className={`text-xs truncate ${textFaint}`}>{session?.user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              theme === 'dark'
                ? 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/20'
                : 'bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border-red-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 lg:hidden z-40" onClick={onToggle} />
      )}
    </>
  );
}
