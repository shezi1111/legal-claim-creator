"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isResponding?: boolean;
}

export function ChatContainer({
  messages,
  onSendMessage,
  isResponding = false,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isResponding]);

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {isResponding && (
          <div className="flex items-start gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-text-light/40 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-text-light/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 bg-text-light/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={onSendMessage} disabled={isResponding} />
    </div>
  );
}
