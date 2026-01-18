'use client';

import { useState } from 'react';
import { Plus, Trash2, MessageSquare, Sun, Moon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Conversation {
  id: string;
  title: string;
  messages: { id: string; role: string; content: string; timestamp: Date }[];
  createdAt: Date;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed lg:relative left-0 top-0 h-full w-[280px] bg-[#202123] border-r border-[#353740] flex flex-col z-50"
          >
            <div className="p-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 hover:bg-[#2A2B32] rounded-lg transition-colors"
                >
                  <X size={18} className="text-gray-400" />
                </button>
                <button
                  onClick={onNewChat}
                  className="w-full flex items-center gap-2 bg-[#2A2B32] hover:bg-[#2A2B32]/80 text-white py-3 px-4 rounded-lg transition-colors border border-[#353740]"
                >
                  <Plus size={18} />
                  <span className="text-sm font-medium">New chat</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2">
              {conversations.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageSquare size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No conversations</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => onSelectConversation(conv)}
                      onMouseEnter={() => setHoveredId(conv.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        currentConversationId === conv.id
                          ? 'bg-[#2A2B32]'
                          : 'hover:bg-[#2A2B32]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <MessageSquare size={16} className="text-gray-400 flex-shrink-0" />
                        <p className="text-sm text-gray-200 truncate">{conv.title}</p>
                      </div>
                      <button
                        onClick={(e) => onDeleteConversation(conv.id, e)}
                        className={`opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 hover:text-red-400 rounded transition-all ${
                          hoveredId === conv.id ? 'opacity-100' : ''
                        }`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-[#353740]">
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#2A2B32] transition-colors text-gray-300"
              >
                {isDarkMode ? (
                  <>
                    <Sun size={18} />
                    <span className="text-sm">Light mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                    <span className="text-sm">Dark mode</span>
                  </>
                )}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

