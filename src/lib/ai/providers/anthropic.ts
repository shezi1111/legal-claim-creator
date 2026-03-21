import Anthropic from '@anthropic-ai/sdk';
import type { AIResponse, StreamCallbacks } from '../types';

const MODEL = 'claude-sonnet-4-20250514';

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  return new Anthropic({ apiKey });
}

export async function chatWithClaude(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens: number,
  temperature: number
): Promise<AIResponse> {
  const client = getClient();
  const startTime = Date.now();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  });

  const latencyMs = Date.now() - startTime;
  const textContent = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');

  return {
    content: textContent,
    model: MODEL,
    provider: 'anthropic',
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    latencyMs,
  };
}

export async function streamWithClaude(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens: number,
  temperature: number,
  callbacks: StreamCallbacks
): Promise<void> {
  const client = getClient();
  const startTime = Date.now();

  let inputTokens = 0;
  let outputTokens = 0;
  let fullContent = '';

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    stream.on('text', (text) => {
      fullContent += text;
      callbacks.onToken(text);
    });

    const finalMessage = await stream.finalMessage();
    inputTokens = finalMessage.usage.input_tokens;
    outputTokens = finalMessage.usage.output_tokens;

    callbacks.onComplete({
      content: fullContent,
      model: MODEL,
      provider: 'anthropic',
      inputTokens,
      outputTokens,
      latencyMs: Date.now() - startTime,
    });
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}
