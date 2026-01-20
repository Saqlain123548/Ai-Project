"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/common/code-block";

interface MessageBubbleProps {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp?: Date;
  isLoading?: boolean;
  className?: string;
}

export function MessageBubble({
  role,
  content,
  isLoading = false,
  className,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "w-full mb-4",
        isUser ? "flex justify-end" : "flex justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-gray-700 text-white"
            : "bg-gray-600 text-white"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span className="text-gray-400 text-sm">Thinking...</span>
          </div>
        ) : (
          <div className="text-white leading-relaxed whitespace-pre-wrap">
            <ReactMarkdown
              components={{
                code({ className: codeClassName, children, ...props }) {
                  const match = /language-(\w+)/.exec(codeClassName || "");
                  const language = match ? match[1] : "";
                  const isInline = !codeClassName?.includes('language-');

                  if (!isInline && language) {
                    return (
                      <CodeBlock
                        code={String(children).replace(/\n$/, "")}
                        language={language}
                        className="my-2"
                      />
                    );
                  }

                  return (
                    <code
                      className={cn(
                        "bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono",
                        !isInline && "block p-3 my-2 overflow-x-auto",
                        codeClassName
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
                p({ children }) {
                  return <p className="mb-3 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return (
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      {children}
                    </ul>
                  );
                },
                ol({ children }) {
                  return (
                    <ol className="list-decimal list-inside mb-3 space-y-1">
                      {children}
                    </ol>
                  );
                },
                li({ children }) {
                  return <li className="">{children}</li>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-gray-500 pl-4 my-3 italic text-gray-300">
                      {children}
                    </blockquote>
                  );
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

