import type { TaskType, TaskConfig, ModelConfig, AIResponse, StreamCallbacks } from './types';
import { chatWithClaude, streamWithClaude } from './providers/anthropic';
import { chatWithGPT, streamWithGPT } from './providers/openai';
import { chatWithGemini } from './providers/google';

// ---------------------------------------------------------------------------
// Task routing configuration
// ---------------------------------------------------------------------------

const TASK_CONFIGS: Record<TaskType, TaskConfig> = {
  intake_chat: {
    primaryModel: { provider: 'anthropic', model: 'claude-sonnet-4-20250514', maxTokens: 2048, temperature: 0.7 },
    fallbackModel: { provider: 'openai', model: 'gpt-4-turbo', maxTokens: 2048, temperature: 0.7 },
    streaming: true,
  },
  evidence_analysis: {
    primaryModel: { provider: 'openai', model: 'gpt-4-turbo', maxTokens: 4096, temperature: 0.2 },
    fallbackModel: { provider: 'anthropic', model: 'claude-sonnet-4-20250514', maxTokens: 4096, temperature: 0.2 },
    streaming: false,
  },
  forensic_analysis: {
    primaryModel: { provider: 'openai', model: 'gpt-4-turbo', maxTokens: 4096, temperature: 0.1 },
    fallbackModel: { provider: 'anthropic', model: 'claude-sonnet-4-20250514', maxTokens: 4096, temperature: 0.1 },
    streaming: false,
  },
  case_law_search: {
    primaryModel: { provider: 'anthropic', model: 'claude-sonnet-4-20250514', maxTokens: 4096, temperature: 0.2 },
    fallbackModel: { provider: 'openai', model: 'gpt-4-turbo', maxTokens: 4096, temperature: 0.2 },
    streaming: false,
  },
  legal_reasoning: {
    primaryModel: { provider: 'anthropic', model: 'claude-sonnet-4-20250514', maxTokens: 4096, temperature: 0.3 },
    fallbackModel: { provider: 'openai', model: 'gpt-4-turbo', maxTokens: 4096, temperature: 0.3 },
    streaming: false,
  },
  claim_drafting: {
    primaryModel: { provider: 'anthropic', model: 'claude-sonnet-4-20250514', maxTokens: 8192, temperature: 0.4 },
    fallbackModel: { provider: 'openai', model: 'gpt-4-turbo', maxTokens: 8192, temperature: 0.4 },
    streaming: true,
  },
  strength_rating: {
    primaryModel: { provider: 'google', model: 'gemini-1.5-pro', maxTokens: 2048, temperature: 0.2 },
    fallbackModel: { provider: 'anthropic', model: 'claude-sonnet-4-20250514', maxTokens: 2048, temperature: 0.2 },
    streaming: false,
  },
};

// ---------------------------------------------------------------------------
// Provider dispatch helpers
// ---------------------------------------------------------------------------

async function callProvider(
  config: ModelConfig,
  systemPrompt: string,
  messages: { role: string; content: string }[]
): Promise<AIResponse> {
  switch (config.provider) {
    case 'anthropic':
      return chatWithClaude(systemPrompt, messages, config.maxTokens, config.temperature);
    case 'openai':
      return chatWithGPT(systemPrompt, messages, config.maxTokens, config.temperature);
    case 'google':
      return chatWithGemini(systemPrompt, messages, config.maxTokens, config.temperature);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

async function streamProvider(
  config: ModelConfig,
  systemPrompt: string,
  messages: { role: string; content: string }[],
  callbacks: StreamCallbacks
): Promise<void> {
  switch (config.provider) {
    case 'anthropic':
      return streamWithClaude(systemPrompt, messages, config.maxTokens, config.temperature, callbacks);
    case 'openai':
      return streamWithGPT(systemPrompt, messages, config.maxTokens, config.temperature, callbacks);
    case 'google':
      // Gemini does not support streaming in our wrapper; fall back to non-streaming
      try {
        const response = await chatWithGemini(systemPrompt, messages, config.maxTokens, config.temperature);
        callbacks.onToken(response.content);
        callbacks.onComplete(response);
      } catch (error) {
        callbacks.onError(error instanceof Error ? error : new Error(String(error)));
      }
      return;
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Execute a task by routing to the appropriate provider with automatic
 * fallback on failure.
 *
 * If `callbacks` are supplied AND the task config enables streaming, the
 * primary (and fallback) providers will be called in streaming mode.
 */
export async function executeTask(
  taskType: TaskType,
  systemPrompt: string,
  messages: { role: string; content: string }[],
  callbacks?: StreamCallbacks
): Promise<AIResponse | void> {
  const config = TASK_CONFIGS[taskType];
  const useStreaming = config.streaming && !!callbacks;

  // --- streaming path ---
  if (useStreaming && callbacks) {
    try {
      await streamProvider(config.primaryModel, systemPrompt, messages, callbacks);
      return;
    } catch (primaryError) {
      console.error(
        `[orchestrator] Primary provider ${config.primaryModel.provider} failed for ${taskType}, falling back to ${config.fallbackModel.provider}`,
        primaryError
      );
      try {
        await streamProvider(config.fallbackModel, systemPrompt, messages, callbacks);
        return;
      } catch (fallbackError) {
        const error = new Error(
          `Both primary (${config.primaryModel.provider}) and fallback (${config.fallbackModel.provider}) providers failed for task ${taskType}`
        );
        callbacks.onError(error);
        return;
      }
    }
  }

  // --- non-streaming path ---
  try {
    return await callProvider(config.primaryModel, systemPrompt, messages);
  } catch (primaryError) {
    console.error(
      `[orchestrator] Primary provider ${config.primaryModel.provider} failed for ${taskType}, falling back to ${config.fallbackModel.provider}`,
      primaryError
    );
    try {
      return await callProvider(config.fallbackModel, systemPrompt, messages);
    } catch (fallbackError) {
      throw new Error(
        `Both primary (${config.primaryModel.provider}) and fallback (${config.fallbackModel.provider}) providers failed for task ${taskType}`
      );
    }
  }
}

export { TASK_CONFIGS };
