import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIResponse } from '../types';

const MODEL = 'gemini-1.5-pro';

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function chatWithGemini(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens: number,
  temperature: number
): Promise<AIResponse> {
  const client = getClient();
  const startTime = Date.now();

  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
    },
  });

  // Convert messages to Gemini format: alternating user/model roles
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    throw new Error('At least one message is required');
  }

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;
  const latencyMs = Date.now() - startTime;
  const content = response.text();

  const usageMetadata = response.usageMetadata;

  return {
    content,
    model: MODEL,
    provider: 'google',
    inputTokens: usageMetadata?.promptTokenCount,
    outputTokens: usageMetadata?.candidatesTokenCount,
    latencyMs,
  };
}
