export type ModelProvider = 'anthropic' | 'openai' | 'google';
export type TaskType = 'intake_chat' | 'evidence_analysis' | 'forensic_analysis' | 'case_law_search' | 'legal_reasoning' | 'claim_drafting' | 'strength_rating';

export interface ModelConfig {
  provider: ModelProvider;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface TaskConfig {
  primaryModel: ModelConfig;
  fallbackModel: ModelConfig;
  streaming: boolean;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: ModelProvider;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs?: number;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (response: AIResponse) => void;
  onError: (error: Error) => void;
}
