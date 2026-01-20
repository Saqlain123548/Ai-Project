import * as React from "react"
import { cn } from "@/lib/utils"  // ye shadcn ka cn helper hai, agar nahi to import mat karna

interface ChatBubbleMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "user" | "ai" | "system"
  isLoading?: boolean
  showAvatar?: boolean
  avatarSrc?: string
  avatarFallback?: string
}

export function ChatBubbleMessage({
  variant = "ai",
  isLoading = false,
  showAvatar = true,
  avatarSrc,
  avatarFallback = variant === "user" ? "You" : "AI",
  children,
  className,
  ...props
}: ChatBubbleMessageProps) {
  const isUser = variant === "user"

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[80%]",
        isUser ? "flex-row-reverse" : "",
        className
      )}
      {...props}
    >
      {showAvatar && (
        <div className="flex-shrink-0 mt-1">
          {/* Avatar yahan daal sakta hai – tere avatar component use kar */}
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {avatarFallback}
          </div>
        </div>
      )}

      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted text-foreground rounded-tl-none",
          isLoading && "animate-pulse"
        )}
      >
        {isLoading ? (
          <div className="flex space-x-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-70" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-70 [animation-delay:0.2s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-70 [animation-delay:0.4s]" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}