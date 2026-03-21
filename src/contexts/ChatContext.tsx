'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Chat, Message } from '@/types';

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  currentChat: Chat | null;
  currentMessages: Message[];
  createChat: (title?: string) => string;
  switchChat: (chatId: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteChat: (chatId: string) => void;
  deleteMessage: (messageId: string) => void;
  renameChat: (chatId: string, title: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load chats from DB when user logs in
  useEffect(() => {
    if (!session?.user?.email) return;

    // Clear old localStorage data from before DB integration
    localStorage.removeItem('tamil_chat_chats');
    localStorage.removeItem('tamil_chat_current');

    fetch('/api/chats')
      .then(r => r.json())
      .then(data => {
        if (data.chats?.length > 0) {
          const mapped: Chat[] = data.chats.map((c: any) => ({
            id: c.id,
            title: c.title,
            messages: c.messages || [],
            createdAt: new Date(c.created_at).getTime(),
            updatedAt: new Date(c.updated_at).getTime(),
          }));
          setChats(mapped);
          setCurrentChatId(mapped[0].id);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [session?.user?.email]);

  const syncChat = async (id: string, title: string) => {
    await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title }),
    });
  };

  const syncMessage = async (chatId: string, message: Message) => {
    await fetch('/api/chats/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    });
  };

  const createChat = (title?: string): string => {
    const id = `chat_${Date.now()}`;
    const chatTitle = title || `Chat ${new Date().toLocaleDateString()}`;
    const newChat: Chat = {
      id,
      title: chatTitle,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(id);
    syncChat(id, chatTitle);
    return id;
  };

  const switchChat = (chatId: string) => setCurrentChatId(chatId);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>): Message => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: Date.now(),
    };

    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, newMessage], updatedAt: Date.now() }
          : chat
      )
    );

    if (currentChatId) syncMessage(currentChatId, newMessage);
    return newMessage;
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: chat.messages.map(msg => msg.id === messageId ? { ...msg, ...updates } : msg) }
          : chat
      )
    );
  };

  const deleteChat = async (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(chats.find(c => c.id !== chatId)?.id || null);
    }
    await fetch('/api/chats', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: chatId }),
    });
  };

  const deleteMessage = (messageId: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: chat.messages.filter(m => m.id !== messageId) }
          : chat
      )
    );
  };

  const renameChat = (chatId: string, title: string) => {
    setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, title, updatedAt: Date.now() } : chat));
    syncChat(chatId, title);
  };

  const currentChat = chats.find(c => c.id === currentChatId) || null;

  return (
    <ChatContext.Provider value={{
      chats, currentChatId, currentChat,
      currentMessages: currentChat?.messages || [],
      createChat, switchChat, addMessage, updateMessage,
      deleteChat, deleteMessage, renameChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
