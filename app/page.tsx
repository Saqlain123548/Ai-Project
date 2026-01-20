"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { toast } from "sonner"
import { SendHorizontal, Sparkles, User } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Toaster } from "@/components/ui/sonner"
import { FullSidebar } from "@/components/sidebar/full-sidebar"
import { useConversations } from "@/hooks/use-conversations"
import { NewChat } from "@/components/chat/new-chat"

export default function Home() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    conversations,
    currentConversation,
    createNewChat,
    selectConversation,
    deleteConversation,
    addMessage,
    updateConversationTitle,
  } = useConversations()

  const messages = currentConversation?.messages || []
  const isNewChat = messages.length === 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  useEffect(() => {
    if (textareaRef.current && !isNewChat) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`
    }
  }, [input, isNewChat])

  const sendMessage = (messageText?: string) => {
    const userMessage = messageText || input.trim()
    if (!userMessage || isLoading) return

    addMessage("user", userMessage)
    setInput("")
    setIsLoading(true)

    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          const responses = [
            `That's a great question about "${userMessage}"! Let me help you with that.`,
            `I understand you're asking about "${userMessage}". Here's what I think...`,
            `Interesting! "${userMessage}" is a topic I'd love to discuss.`,
            `"${userMessage}" - that's something I can definitely help you explore!`,
          ]
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          addMessage("ai", randomResponse)
          setIsLoading(false)
          resolve(true)
        }, 2000)
      }),
      {
        loading: "Thinking...",
        success: "Reply received!",
        error: "Something went wrong",
      }
    )
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleNewChat = () => {
    createNewChat()
  }

  const handleSelectConversation = (id: string) => {
    selectConversation(id)
  }

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id)
  }

  const handleEditTitle = (id: string, newTitle: string) => {
    updateConversationTitle(id, newTitle)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex">
      <Toaster />

      {/* Full Sidebar - Fixed on left */}
      <div className="hidden md:flex flex-shrink-0">
        <FullSidebar
          conversations={conversations}
          currentConversationId={currentConversation?.id || null}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onNewChat={handleNewChat}
          onEditTitle={handleEditTitle}
          onClose={() => {}}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages Area */}
        <div 
          className={cn(
            "px-4 overflow-y-auto transition-all duration-300",
            isNewChat ? "flex-1" : "pt-10 pb-36"
          )}
          style={{ 
            paddingBottom: isNewChat ? "40vh" : undefined 
          }}
        >
          <div className={cn(
            "mx-auto space-y-10",
            isNewChat ? "h-full flex flex-col justify-center" : "max-w-3xl"
          )}>
            {isNewChat ? (
              /* New Chat State - Centered Input */
              <NewChat 
                onSubmit={sendMessage}
                isLoading={isLoading}
              />
            ) : messages.length === 0 ? (
              /* Empty Conversation (no messages yet, not new) */
              <div className="text-center py-20">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-[#202123] rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold text-gray-200 mb-2">Welcome to Zehra AI</h1>
                <p className="text-gray-400">Start a conversation by typing a message below.</p>
              </div>
            ) : (
              /* Existing Messages */
              <div className="space-y-10">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-4",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                      <AvatarFallback
                        className={msg.role === "user"
                          ? "bg-[#2563eb] text-white text-sm"
                          : "bg-transparent text-white text-sm"
                        }
                      >
                        {msg.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 max-w-[80%]",
                        msg.role === "user"
                          ? "bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] text-white"
                          : "bg-[#202123] text-gray-200"
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                  <AvatarFallback className="bg-transparent text-white text-sm">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-[#202123] rounded-2xl px-4 py-4">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Fixed Bottom Input Bar - Only for existing chats */}
        {!isNewChat && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f]/95 backdrop-blur-sm border-t border-[#2f2f2f] px-4 py-6 md:left-[260px]">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-end gap-3">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Send a message..."
                  disabled={isLoading}
                  className="min-h-[56px] max-h-[200px] resize-none rounded-2xl bg-[#2f2f2f] text-white placeholder:text-gray-500 border-0 focus-visible:ring-1 focus-visible:ring-gray-600 focus-visible:bg-[#353740] transition-all pr-14"
                  rows={1}
                />
                <Button
                  size="icon"
                  className="absolute right-3 bottom-3 h-8 w-8 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-[#353740] disabled:opacity-50 transition-colors"
                  disabled={isLoading || !input.trim()}
                  onClick={() => sendMessage()}
                >
                  <SendHorizontal className="h-4 w-4 text-white" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

