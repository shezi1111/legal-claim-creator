'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/chat-store';

export function useChat(claimId: string) {
  const {
    messages,
    isStreaming,
    streamingContent,
    error,
    sendMessage,
    loadMessages,
    setError,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages on mount
  useEffect(() => {
    loadMessages(claimId);
  }, [claimId, loadMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;
      await sendMessage(claimId, content);
    },
    [claimId, isStreaming, sendMessage]
  );

  const dismissError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    messages,
    isStreaming,
    streamingContent,
    error,
    sendMessage: handleSend,
    dismissError,
    messagesEndRef,
  };
}
