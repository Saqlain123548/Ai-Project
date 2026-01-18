'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { format } from 'date-fns';
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Moon,
  Sun,
  Mic,
  Volume2,
  VolumeX,
  Clock,
  Hash,
  MessageSquare,
  Zap,
  Code,
  Sparkles,
  Bot,
  User,
  Settings,
  Menu,
  X,
  MoreVertical,
  Download,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// Quick action prompts
const quickActions = [
  { icon: Code, label: 'Write code', prompt: 'Write a code snippet for' },
  { icon: Zap, label: 'Explain', prompt: 'Explain this concept' },
  { icon: Sparkles, label: 'Summarize', prompt: 'Summarize this text' },
  { icon: MessageSquare, label: 'Chat', prompt: 'Have a conversation about' },
];

export default function ZehraChat() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [showStats, setShowStats] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize conversation
  useEffect(() => {
    const newId = generateId();
    setCurrentConversationId(newId);
  }, []);

  // Theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  // Text-to-speech
  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Voice input toggle
  const toggleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  // Send message
  const sendMessage = useCallback(async (customMessage?: string) => {
    const messageText = customMessage || input.trim();
    if (!messageText.trim() || isTyping) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setResponseTime(null);

    // Add to conversations
    setConversations((prev) => {
      const convIndex = prev.findIndex((c) => c.id === currentConversationId);
      if (convIndex >= 0) {
        const updated = [...prev];
        updated[convIndex].messages = [...updated[convIndex].messages, userMessage];
        if (updated[convIndex].title === 'New Chat') {
          updated[convIndex].title = messageText.slice(0, 30) + (messageText.length > 30 ? '...' : '');
        }
        return updated;
      }
      return [
        ...prev,
        {
          id: currentConversationId,
          title: messageText.slice(0, 30) + (messageText.length > 30 ? '...' : ''),
          messages: [userMessage],
          createdAt: new Date(),
        },
      ];
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationId: currentConversationId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setResponseTime(data.responseTime);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, currentConversationId]);

  // New chat
  const createNewChat = useCallback(() => {
    const newId = generateId();
    setCurrentConversationId(newId);
    setMessages([]);
    setResponseTime(null);
  }, []);

  // Delete conversation
  const deleteConversation = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      createNewChat();
    }
  }, [currentConversationId, createNewChat]);

  // Load conversation
  const loadConversation = useCallback((conv: Conversation) => {
    setCurrentConversationId(conv.id);
    setMessages(conv.messages);
  }, []);

  // Calculate stats
  const totalWords = messages.reduce((acc, msg) => {
    return acc + msg.content.split(/\s+/).filter(Boolean).length;
  }, 0);
  
  const totalCharacters = messages.reduce((acc, msg) => acc + msg.content.length, 0);

  // Export chat
  const exportChat = useCallback(() => {
    const chatText = messages.map((m) => 
      `[${format(m.timestamp, 'HH:mm:ss')}] ${m.role.toUpperCase()}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zehra-chat-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className="w-72 bg-[#1a1a2e] border-r border-gray-800 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Zehra AI
                </h1>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              <button
                onClick={createNewChat}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg transition-all"
              >
                <Plus size={18} />
                New Chat
              </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2">
              {conversations.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Start a new chat!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => loadConversation(conv)}
                      className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        currentConversationId === conv.id
                          ? 'bg-gray-800'
                          : 'hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-gray-200">
                          {conv.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {conv.messages.length} messages
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-800">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#0f0f1a]">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#0f0f1a]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu size={20} className="text-gray-400" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-gray-200">
              {messages.length === 0 ? 'Start Chatting' : 'Zehra AI'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Stats Button */}
            <button
              onClick={() => setShowStats(!showStats)}
              className={`p-2 rounded-lg transition-colors ${
                showStats ? 'bg-purple-600' : 'hover:bg-gray-800'
              }`}
            >
              <Hash size={18} className="text-gray-300" />
            </button>

            {/* Export Button */}
            {messages.length > 0 && (
              <button
                onClick={exportChat}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Download size={18} className="text-gray-400" />
              </button>
            )}

            {/* Toggle Speaking */}
            {isSpeaking ? (
              <button
                onClick={stopSpeaking}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
              >
                <VolumeX size={18} className="text-red-400" />
              </button>
            ) : (
              messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && (
                <button
                  onClick={() => speakText(messages[messages.length - 1].content)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Volume2 size={18} className="text-gray-400" />
                </button>
              )
            )}

            {/* Response Time */}
            {responseTime && (
              <div className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                <Clock size={12} />
                <span>{responseTime}ms</span>
              </div>
            )}
          </div>
        </header>

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-800/50 border-b border-gray-800 overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-purple-400" />
                  <span className="text-gray-400">Words:</span>
                  <span className="text-gray-200 font-mono">{totalWords}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Characters:</span>
                  <span className="text-gray-200 font-mono">{totalCharacters}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-purple-400" />
                  <span className="text-gray-400">Messages:</span>
                  <span className="text-gray-200 font-mono">{messages.length}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Bot size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-200 mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-500 mb-8">
                Ask me anything, and I'll do my best to assist you
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => sendMessage(action.prompt)}
                    className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all text-left"
                  >
                    <action.icon size={20} className="text-purple-400" />
                    <span className="text-sm text-gray-300">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                          : 'bg-gradient-to-br from-purple-500 to-pink-500'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`relative group ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-600'
                          : 'bg-gray-800/80 backdrop-blur-sm'
                      } rounded-2xl px-4 py-3`}
                    >
                      {/* Timestamp */}
                      <div className="text-xs text-gray-500 mb-1">
                        {format(msg.timestamp, 'HH:mm')}
                      </div>

                      {/* Copy Button */}
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-700 rounded-lg transition-all"
                      >
                        {copiedId === msg.id ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-gray-400" />
                        )}
                      </button>

                      {/* Markdown Content */}
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{
                                    margin: '0.5em 0',
                                    borderRadius: '0.5em',
                                    fontSize: '0.875em',
                                  }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 border-t border-gray-800 bg-[#0f0f1a]">
          <div className="max-w-3xl mx-auto">
            {/* Quick Actions (when chat started) */}
            {messages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => sendMessage(action.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 rounded-full text-xs text-gray-400 transition-colors"
                  >
                    <action.icon size={12} />
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Container */}
            <div className="relative">
              <div className="flex items-end gap-2 bg-gray-800/50 rounded-2xl border border-gray-700/50 focus-within:border-purple-500/50 transition-all">
                {/* Voice Input */}
                <button
                  onClick={toggleVoiceInput}
                  className={`p-3 rounded-l-2xl transition-colors ${
                    isListening
                      ? 'bg-red-500/20 text-red-400 animate-pulse'
                      : 'hover:bg-gray-700 text-gray-400'
                  }`}
                >
                  <Mic size={20} />
                </button>

                {/* Text Input */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent py-3 px-2 max-h-32 resize-none focus:outline-none text-gray-200 placeholder-gray-500"
                  rows={1}
                />

                {/* Send Button */}
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className={`p-3 rounded-r-2xl transition-all ${
                    input.trim() && !isTyping
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>

              {/* Character Count */}
              {input.length > 0 && (
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {input.length} characters
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 mt-3">
              Zehra AI can make mistakes. Please verify important information.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

