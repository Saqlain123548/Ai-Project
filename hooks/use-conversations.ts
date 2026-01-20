"use client";

import { useState, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface UseConversationsReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  currentConversationId: string | null;
  isLoading: boolean;
  createNewChat: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  addMessage: (role: "user" | "ai", content: string) => void;
  updateLastMessage: (content: string) => void;
  clearCurrentConversation: () => void;
}

const STORAGE_KEY = "zehra-ai-conversations";

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setConversations(conversationsWithDates);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      } catch (error) {
        console.error("Failed to save conversations:", error);
      }
    }
  }, [conversations, isLoading]);

  const getCurrentConversation = useCallback(() => {
    if (!currentConversationId) return null;
    return conversations.find((c) => c.id === currentConversationId) || null;
  }, [conversations, currentConversationId]);

  const createNewChat = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    return newConversation;
  }, []);

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  }, [currentConversationId]);

  const updateConversationTitle = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }, []);

  const addMessage = useCallback((role: "user" | "ai", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };

    if (!currentConversationId) {
      // Create a new conversation with this message
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: role === "user" ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : "New conversation",
        messages: [newMessage],
        createdAt: new Date(),
      };
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
    } else {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversationId
            ? {
                ...c,
                title:
                  role === "user" && c.messages.length === 0
                    ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                    : c.title,
                messages: [...c.messages, newMessage],
              }
            : c
        )
      );
    }
  }, [currentConversationId]);

  const updateLastMessage = useCallback((content: string) => {
    if (!currentConversationId) return;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== currentConversationId) return c;

        const lastMessage = c.messages[c.messages.length - 1];
        if (!lastMessage || lastMessage.role !== "ai") return c;

        return {
          ...c,
          messages: [
            ...c.messages.slice(0, -1),
            { ...lastMessage, content },
          ],
        };
      })
    );
  }, [currentConversationId]);

  const clearCurrentConversation = useCallback(() => {
    setCurrentConversationId(null);
  }, []);

  return {
    conversations,
    currentConversation: getCurrentConversation(),
    currentConversationId,
    isLoading,
    createNewChat,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
    addMessage,
    updateLastMessage,
    clearCurrentConversation,
  };
}

