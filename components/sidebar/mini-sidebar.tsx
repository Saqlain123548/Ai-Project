"use client";

import { Plus, Search, User, Settings, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MiniSidebarProps {
  onNewChat: () => void;
  onSearchClick: () => void;
  onOpenSidebar: () => void;
  onBottomIconClick?: (icon: string) => void;
  className?: string;
}

export function MiniSidebar({
  onNewChat,
  onSearchClick,
  onOpenSidebar,
  onBottomIconClick,
  className,
}: MiniSidebarProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const handleBottomIconClick = (icon: string) => {
    if (onBottomIconClick) {
      onBottomIconClick(icon);
    }
  };

  return (
    <motion.aside
      initial={{ x: -44, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "fixed left-0 top-0 h-full z-40",
        "flex flex-col items-center py-2 gap-1",
        "bg-[var(--sidebar-bg)]",
        "border-r border-[var(--sidebar-border)]",
        "w-[44px]",
        className
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center gap-1 w-full px-1.5 pt-1">
        {/* Toggle Sidebar Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className={cn(
            "h-9 w-9 rounded-lg",
            "text-[var(--text-secondary)]",
            "hover:bg-[var(--sidebar-hover)]",
            "transition-colors"
          )}
        >
          <Search size={18} />
        </Button>

        {/* New Chat Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          className={cn(
            "h-9 w-9 rounded-lg relative group",
            "text-[var(--text-primary)]",
            "hover:bg-[var(--sidebar-hover)]",
            "transition-colors"
          )}
        >
          <Plus size={18} />
          {/* Tooltip */}
          <span className="absolute left-full ml-2 px-2 py-1 bg-[var(--background)] text-[var(--text-primary)] text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-[var(--border)]">
            New chat
          </span>
        </Button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Section - Bottom Icons */}
      <div className="flex flex-col items-center gap-1 w-full px-1.5 pb-1">
        {/* User/Profile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleBottomIconClick("profile")}
          className={cn(
            "h-9 w-9 rounded-lg relative group",
            "text-[var(--text-secondary)]",
            "hover:bg-[var(--sidebar-hover)]",
            "transition-colors"
          )}
        >
          <User size={18} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-[var(--background)] text-[var(--text-primary)] text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-[var(--border)]">
            Profile
          </span>
        </Button>

        {/* Help */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleBottomIconClick("help")}
          className={cn(
            "h-9 w-9 rounded-lg relative group",
            "text-[var(--text-secondary)]",
            "hover:bg-[var(--sidebar-hover)]",
            "transition-colors"
          )}
        >
          <HelpCircle size={18} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-[var(--background)] text-[var(--text-primary)] text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-[var(--border)]">
            Help
          </span>
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleBottomIconClick("settings")}
          className={cn(
            "h-9 w-9 rounded-lg relative group",
            "text-[var(--text-secondary)]",
            "hover:bg-[var(--sidebar-hover)]",
            "transition-colors"
          )}
        >
          <Settings size={18} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-[var(--background)] text-[var(--text-primary)] text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-[var(--border)]">
            Settings
          </span>
        </Button>
      </div>
    </motion.aside>
  );
}

