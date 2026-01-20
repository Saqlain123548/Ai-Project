"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

// Starter message templates - friendly and inviting
const STARTER_MESSAGES = [
  "Good to see you! 👋",
  "How can I help you today?",
  "What are you working on?",
  "Ready when you are!",
  "Ask me anything — planning, coding, ideas, or learning.",
  "Let's build something great together!",
  "What would you like to explore?",
  "Welcome back! What can I do for you?",
];

// Staggered animation variants
const MESSAGE_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

interface NewChatProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function NewChat({ onSubmit, isLoading = false, className }: NewChatProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [starterMessage, setStarterMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Select random starter message on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * STARTER_MESSAGES.length);
    setStarterMessage(STARTER_MESSAGES[randomIndex]);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  // Focus input on mount for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
    setInput("");
  }, [input, isLoading, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  // Determine if we're in "centered" mode or transitioning to "bottom" mode
  const showCenteredMode = !hasInteracted;
  const showStarterMessages = !hasInteracted || isFocused;

  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto px-4",
        "transition-all duration-300 ease-in-out",
        showCenteredMode
          ? "new-chat-container"
          : "new-chat-transitioning",
        className
      )}
      style={{
        position: showCenteredMode ? "fixed" : "relative",
        top: showCenteredMode ? "50%" : "auto",
        left: showCenteredMode ? "50%" : "auto",
        transform: showCenteredMode ? "translate(-50%, -50%)" : "none",
      }}
    >
      {/* Welcome Message - Only shows in centered mode */}
      <div
        className={cn(
          "mb-8 text-center transition-all duration-300 ease-in-out",
          showCenteredMode
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4"
        )}
        style={{
          display: showCenteredMode ? "block" : "none",
        }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#202123] dark:bg-[#2f2f2f] rounded-full flex items-center justify-center animate-float-in">
            <Sparkles className="h-8 w-8 text-[#10a37f]" />
          </div>
        </div>
        <h1
          className={cn(
            "text-3xl font-semibold text-[#ececec] mb-2",
            "animate-float-in stagger-1"
          )}
          style={{ color: "var(--text-primary)" }}
        >
          Welcome to Zehra AI
        </h1>
        <p
          className={cn(
            "text-lg",
            "animate-float-in stagger-2"
          )}
          style={{ color: "var(--text-secondary)" }}
        >
          {starterMessage}
        </p>
      </div>

      {/* Dynamic Starter Suggestions - Shows when focused but not typing */}
      <div
        className={cn(
          "mb-6 transition-all duration-300 ease-in-out",
          showStarterMessages && !input
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[-10px]"
        )}
        style={{
          display: showStarterMessages && !input ? "flex" : "none",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
          {[
            "Plan a project",
            "Explain a concept",
            "Write some code",
            "Brainstorm ideas",
          ].map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => {
                setInput(suggestion);
                textareaRef.current?.focus();
                setHasInteracted(true);
              }}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium",
                "bg-[#2f2f2f] hover:bg-[#3a3b3f]",
                "text-[#ececec] transition-all duration-200",
                "border border-transparent hover:border-[#4b4b4f]",
                "animate-scale-in"
              )}
              style={{
                animationDelay: `${0.3 + index * 0.1}s`,
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Container */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          showCenteredMode
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-100 translate-y-0 scale-100"
        )}
      >
        {/* Input Wrapper */}
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden",
            "bg-[#404040] dark:bg-[#404040]",
            "border border-[#505050]",
            "transition-all duration-200",
            isFocused && "border-[#10a37f] ring-1 ring-[#10a37f]/20"
          )}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={() => setIsFocused(false)}
            placeholder="Send a message..."
            disabled={isLoading}
            rows={1}
            className={cn(
              "w-full resize-none bg-transparent border-0",
              "text-[#ececec] placeholder:text-[#8e8ea0]",
              "focus:ring-0 focus:outline-none",
              "px-4 py-4 pr-14 min-h-[56px] max-h-[200px]",
              "scrollbar-thin transition-all"
            )}
            style={{
              height: "auto",
              minHeight: "56px",
            }}
          />

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "h-9 w-9 rounded-lg flex items-center justify-center",
              "bg-[#10a37f] hover:bg-[#0d8a6a] disabled:bg-[#505050]",
              "disabled:opacity-50",
              "transition-all duration-200",
              !input.trim() && "opacity-50"
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>

        <p
          className={cn(
            "text-xs text-center mt-3",
            "transition-opacity duration-300"
          )}
          style={{ color: "var(--text-muted)" }}
        >
          Zehra AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}

