'use client';

import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

interface ChatStore {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setStreaming: (streaming: boolean) => void;
  appendStreamContent: (content: string) => void;
  resetStreamContent: () => void;
  setError: (error: string | null) => void;
  sendMessage: (claimId: string, content: string) => Promise<void>;
  loadMessages: (claimId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isStreaming: false,
  streamingContent: '',
  error: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setMessages: (messages) => set({ messages }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  appendStreamContent: (content) =>
    set((state) => ({ streamingContent: state.streamingContent + content })),

  resetStreamContent: () => set({ streamingContent: '' }),

  setError: (error) => set({ error }),

  loadMessages: async (claimId) => {
    try {
      const res = await fetch(`/api/claims/${claimId}/chat`);
      const data = await res.json();
      set({ messages: data.messages || [] });
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  },

  sendMessage: async (claimId, content) => {
    const { addMessage, setStreaming, appendStreamContent, resetStreamContent, setError } = get();

    // Add user message optimistically
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);
    setStreaming(true);
    resetStreamContent();
    setError(null);

    try {
      const res = await fetch(`/api/claims/${claimId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error(`Chat request failed: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'token') {
              fullContent += data.content;
              appendStreamContent(data.content);
            } else if (data.type === 'done') {
              // Add completed assistant message
              const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: data.content,
                createdAt: new Date().toISOString(),
              };
              addMessage(assistantMessage);
            } else if (data.type === 'error') {
              setError(data.content);
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMsg);
    } finally {
      setStreaming(false);
      resetStreamContent();
    }
  },
}));
