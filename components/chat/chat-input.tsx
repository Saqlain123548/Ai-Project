"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Plus, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder = "Message Zehra AI...",
  disabled = false,
  isLoading = false,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [value]);

  // Focus input on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !isLoading) {
        onSubmit();
      }
    }
    onKeyDown?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "bg-[var(--input-bg)] dark:bg-[var(--input-bg)] light:bg-[var(--input-bg)]",
        "border border-[var(--border)]",
        "transition-all duration-200",
        isFocused && "border-[var(--text-secondary)]",
        disabled && "opacity-50",
        className
      )}
    >
      {/* Attachment Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "absolute left-2 bottom-2 h-8 w-8 rounded-lg",
          "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
          "hover:bg-[var(--sidebar-hover)]",
          "transition-all"
        )}
        disabled={disabled || isLoading}
      >
        <Plus size={18} />
      </Button>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent border-0",
          "text-[var(--text-primary)]",
          "placeholder:text-[var(--text-secondary)]",
          "focus:ring-0 focus:outline-none",
          "px-4 py-3 pr-14 min-h-[52px] max-h-[200px]",
          "scrollbar-thin"
        )}
        style={{
          height: "auto",
          minHeight: "52px",
        }}
      />

      {/* Send Button */}
      <Button
        type="button"
        size="icon"
        onClick={onSubmit}
        disabled={disabled || isLoading || !value.trim()}
        className={cn(
          "absolute right-2 bottom-2 h-8 w-8 rounded-lg",
          "bg-[var(--primary)] hover:bg-[var(--primary)]/90",
          "disabled:bg-[var(--text-muted)]",
          "text-white transition-all",
          !value.trim() && "opacity-50"
        )}
      >
        <Send size={14} />
      </Button>
    </div>
  );
}

