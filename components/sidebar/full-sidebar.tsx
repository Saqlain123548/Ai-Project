"use client";

import { useState } from "react";
import { Plus, Trash2, MessageSquare, Edit2, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Conversation {
  id: string;
  title: string;
  messages: { id: string; role: string; content: string; timestamp: Date }[];
  createdAt: Date;
}

interface FullSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
  onEditTitle: (id: string, newTitle: string) => void;
  onClose: () => void;
}

export function FullSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  onEditTitle,
  onClose,
}: FullSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEditing = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveTitle = (id: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (editingTitle.trim()) {
        onEditTitle(id, editingTitle.trim());
      }
      setEditingId(null);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditingTitle("");
    }
  };

  const handleBlurTitle = (id: string) => {
    if (editingTitle.trim()) {
      onEditTitle(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full z-40 flex flex-col"
      style={{
        width: "260px",
        backgroundColor: "#202123",
        borderRight: "1px solid #2F2F2F",
      }}
    >
      {/* Top Section */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="w-full justify-between h-10 px-3 rounded-lg text-sm font-normal transition-all duration-150 ease-in-out"
          style={{
            backgroundColor: "transparent",
            borderColor: "#4B4B4F",
            color: "#ECECF1",
          }}
        >
          <span>New chat</span>
          <Plus size={16} />
        </Button>
      </div>

      {/* Middle Section - Chat History */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-sm" style={{ color: "#A1A1AA" }}>
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-1 pb-2">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => onSelectConversation(conv.id)}
                    onMouseEnter={() => setHoveredId(conv.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out"
                    style={{
                      backgroundColor:
                        currentConversationId === conv.id
                          ? "#2A2B32"
                          : hoveredId === conv.id
                          ? "#2A2B32"
                          : "transparent",
                      fontWeight: currentConversationId === conv.id ? 500 : 400,
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <MessageSquare
                        size={16}
                        style={{
                          color:
                            currentConversationId === conv.id
                              ? "#ECECF1"
                              : "#A1A1AA",
                          flexShrink: 0,
                        }}
                      />
                      {editingId === conv.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => handleSaveTitle(conv.id, e)}
                          onBlur={() => handleBlurTitle(conv.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 bg-transparent border-none outline-none text-sm"
                          style={{
                            color: "#ECECF1",
                          }}
                          autoFocus
                        />
                      ) : (
                        <p
                          className="text-sm truncate"
                          style={{
                            color: "#ECECF1",
                          }}
                        >
                          {conv.title}
                        </p>
                      )}
                    </div>

                    {/* Action buttons - appear on hover */}
                    <div
                      className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={{
                        opacity: hoveredId === conv.id ? 100 : 0,
                      }}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7 rounded-lg hover:bg-[#3A3B3F]"
                            style={{ color: "#A1A1AA" }}
                          >
                            <Edit2 size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40"
                          style={{
                            backgroundColor: "#202123",
                            borderColor: "#4B4B4F",
                          }}
                        >
                          <DropdownMenuItem
                            onClick={(e) => handleStartEditing(conv, e)}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                            style={{
                              color: "#ECECF1",
                            }}
                          >
                            <Edit2 size={14} />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conv.id);
                            }}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                            style={{
                              color: "#EF4444",
                            }}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                     </div> 
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Bottom Section - User Profile / Settings */}
      <div
        className="p-3 border-t flex-shrink-0"
        style={{
          borderColor: "#2F2F2F",
        }}
      >
        <TooltipProvider>
          <div className="flex items-center justify-around">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg hover:bg-[#2A2B32] transition-all duration-150"
                  style={{ color: "#A1A1AA" }}
                >
                  <User size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="text-sm"
                style={{
                  backgroundColor: "#2A2B32",
                  color: "#ECECF1",
                }}
              >
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg hover:bg-[#2A2B32] transition-all duration-150"
                  style={{ color: "#A1A1AA" }}
                >
                  <Settings size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="text-sm"
                style={{
                  backgroundColor: "#2A2B32",
                  color: "#ECECF1",
                }}
              >
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </aside>
  );
}
