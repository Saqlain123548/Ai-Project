'use client';

import { useState } from 'react';
import { Plus, Trash2, MessageSquare, Sun, Moon, Menu, PanelLeftClose, PanelLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  title: string;
  messages: { id: string; role: string; content: string; timestamp: Date }[];
  createdAt: Date;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  conversations: Conversation[];
  currentConversationId: string;
  onNewChat: () => void;
  onSelectConversation: (conv: Conversation) => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  onOpen,
  isDarkMode,
  onToggleTheme,
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      {/* Mobile menu button - Hidden on desktop when sidebar is open */}
      <button
        onClick={onOpen}
        className={cn(
          "fixed top-3 left-3 z-30 p-2 rounded-lg transition-all duration-200",
          "bg-muted/50 hover:bg-muted text-foreground/70 hover:text-foreground",
          "lg:hidden",
          isOpen && "opacity-0 pointer-events-none"
        )}
      >
        <Menu size={18} />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Overlay for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />

            {/* Sidebar - ChatGPT Style */}
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "fixed lg:relative left-0 top-0 h-full z-50",
                "flex flex-col",
                // ChatGPT-style dark background
                "bg-[#202123] dark:bg-[#202123] light:bg-[#f4f4f5]",
                "w-[280px] lg:w-[260px] lg:translate-x-0 lg:opacity-100 lg:static lg:shadow-none",
                // Mobile styles
                "shadow-2xl lg:shadow-none"
              )}
            >
              {/* Sidebar Header - Close Button and New Chat */}
              <div className="relative p-2">
                {/* Close Button - ChatGPT Style (top-right) */}
                <button
                  onClick={onClose}
                  className={cn(
                    "absolute top-2 right-2 p-2 rounded-lg",
                    "hover:bg-[#2A2B32] dark:hover:bg-[#2A2B32] light:hover:bg-[#e4e4e7]",
                    "transition-all duration-150",
                    "text-[#ECECF1] dark:text-[#ECECF1] light:text-[#1f1f1f]",
                    "opacity-70 hover:opacity-100"
                  )}
                  title="Close sidebar"
                >
                  <X size={18} />
                </button>

                <button
                  onClick={() => {
                    onNewChat();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3",
                    "bg-transparent hover:bg-[#2A2B32] dark:hover:bg-[#2A2B32] light:hover:bg-[#e4e4e7]",
                    "py-3 px-3 rounded-xl transition-all duration-200",
                    "text-left text-sm text-[#ECECF1] dark:text-[#ECECF1] light:text-[#1f1f1f]",
                    "border border-transparent hover:border-[#3e3f42] dark:hover:border-[#3e3f42] light:hover:border-[#d4d4d8]"
                  )}
                >
                  <span className="flex-1 font-medium">New chat</span>
                  <Plus size={16} className="opacity-70" />
                </button>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <MessageSquare size={32} className="mb-3 opacity-30 text-[#ECECF1]" />
                    <p className="text-xs opacity-50">No conversations yet</p>
                    <p className="text-xs opacity-30 mt-1">Start a new chat to begin</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => {
                          onSelectConversation(conv as Conversation);
                          if (window.innerWidth < 1024) onClose();
                        }}
                        onMouseEnter={() => setHoveredId(conv.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={cn(
                          "group flex items-center justify-between p-3 rounded-xl cursor-pointer",
                          "transition-all duration-150",
                          currentConversationId === conv.id
                            ? "bg-[#2A2B32] dark:bg-[#2A2B32] light:bg-[#e4e4e7]"
                            : "hover:bg-[#2A2B32] dark:hover:bg-[#2A2B32] light:hover:bg-[#e4e4e7]"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <MessageSquare
                            size={16}
                            className={cn(
                              "flex-shrink-0 opacity-70",
                              currentConversationId === conv.id
                                ? "text-[#ECECF1]"
                                : "text-[#ECECF1] opacity-50 group-hover:opacity-70"
                            )}
                          />
                          <p className={cn(
                            "text-sm truncate font-medium",
                            currentConversationId === conv.id
                              ? "text-[#ECECF1]"
                              : "text-[#ECECF1] opacity-70 group-hover:opacity-100"
                          )}>
                            {conv.title}
                          </p>
                        </div>

                        {/* Delete button - appears on hover */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conv.id, e);
                          }}
                          className={cn(
                            "opacity-0 group-hover:opacity-100 p-1.5 rounded-lg",
                            "hover:bg-[#40414F] hover:text-[#ECECF1]",
                            "transition-all duration-150",
                            hoveredId === conv.id ? 'opacity-100' : '',
                            "text-[#ECECF1] opacity-50"
                          )}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Footer - Theme Toggle */}
              <div className={cn(
                "p-2 border-t",
                "border-[#353740] dark:border-[#353740] light:border-[#e4e4e7]"
              )}>
                <button
                  onClick={() => {
                    onToggleTheme();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full p-3 rounded-xl",
                    "hover:bg-[#2A2B32] dark:hover:bg-[#2A2B32] light:hover:bg-[#e4e4e7]",
                    "transition-all duration-150",
                    "text-[#ECECF1] dark:text-[#ECECF1] light:text-[#1f1f1f]",
                    "opacity-70 hover:opacity-100"
                  )}
                >
                  {isDarkMode ? (
                    <>
                      <Sun size={18} />
                      <span className="text-sm font-medium">Light mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={18} />
                      <span className="text-sm font-medium">Dark mode</span>
                    </>
                  )}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

