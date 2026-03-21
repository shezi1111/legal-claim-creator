"use client";

import { useState, useEffect } from "react";
import { User, Scale } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function renderMarkdown(text: string): string {
  // Basic markdown rendering for bold, italic, lists
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-black/5 rounded text-sm font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n/g, "<br />");
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "flex-row-reverse ml-auto max-w-[80%]" : "max-w-[80%]"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-accent/10" : "bg-primary/10"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-accent" />
        ) : (
          <Scale className="h-4 w-4 text-primary" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-white rounded-tr-sm"
            : "bg-white border border-border text-text rounded-tl-sm"
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div
            className="text-sm leading-relaxed prose-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        )}
        <p
          className={cn(
            "text-[10px] mt-1.5",
            isUser ? "text-white/60 text-right" : "text-text-light"
          )}
        >
          {mounted ? formatTime(message.timestamp) : ""}
        </p>
      </div>
    </div>
  );
}
