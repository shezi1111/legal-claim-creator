import OpenAI from 'openai';
import type { AIResponse, StreamCallbacks } from '../types';

const MODEL = 'gpt-4-turbo';

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
}

export async function chatWithGPT(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens: number,
  temperature: number
): Promise<AIResponse> {
  const client = getClient();
  const startTime = Date.now();

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    temperature,
    messages: [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ],
  });

  const latencyMs = Date.now() - startTime;
  const content = response.choices[0]?.message?.content ?? '';

  return {
    content,
    model: MODEL,
    provider: 'openai',
    inputTokens: response.usage?.prompt_tokens,
    outputTokens: response.usage?.completion_tokens,
    latencyMs,
  };
}

export async function streamWithGPT(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens: number,
  temperature: number,
  callbacks: StreamCallbacks
): Promise<void> {
  const client = getClient();
  const startTime = Date.now();

  let fullContent = '';

  try {
    const stream = await client.chat.completions.create({
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      stream: true,
      messages: [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullContent += delta;
        callbacks.onToken(delta);
      }
    }

    callbacks.onComplete({
      content: fullContent,
      model: MODEL,
      provider: 'openai',
      latencyMs: Date.now() - startTime,
    });
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}
