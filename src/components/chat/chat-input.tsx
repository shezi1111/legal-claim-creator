"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-border">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-xl border border-border px-4 py-2.5 text-sm text-text placeholder:text-text-light",
            "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors"
          )}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl transition-colors flex-shrink-0",
            value.trim() && !disabled
              ? "bg-primary text-white hover:bg-primary-light"
              : "bg-border text-text-light cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
      <p className="text-[10px] text-text-light/60 text-center mt-1.5">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
