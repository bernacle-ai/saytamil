'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tamil_chat_chats');
    const currentId = localStorage.getItem('tamil_chat_current');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (currentId && parsed.some((c: Chat) => c.id === currentId)) {
        setCurrentChatId(currentId);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tamil_chat_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('tamil_chat_current', currentChatId);
    }
  }, [currentChatId]);

  const createChat = (title?: string): string => {
    const id = `chat_${Date.now()}`;
    const newChat: Chat = {
      id,
      title: title || `Chat ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(id);
    return id;
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>): Message => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: Date.now(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, newMessage], updatedAt: Date.now() }
          : chat
      )
    );

    return newMessage;
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              ),
              updatedAt: Date.now(),
            }
          : chat
      )
    );
  };

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(chats.find((c) => c.id !== chatId)?.id || null);
    }
  };

  const deleteMessage = (messageId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: chat.messages.filter((m) => m.id !== messageId),
              updatedAt: Date.now(),
            }
          : chat
      )
    );
  };

  const renameChat = (chatId: string, title: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title, updatedAt: Date.now() } : chat
      )
    );
  };

  const currentChat = chats.find((c) => c.id === currentChatId) || null;

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        currentChat,
        currentMessages: currentChat?.messages || [],
        createChat,
        switchChat,
        addMessage,
        updateMessage,
        deleteChat,
        deleteMessage,
        renameChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
