export const CHAT_ROLES = ["user", "assistant", "system"] as const;

export type ChatRole = (typeof CHAT_ROLES)[number];

export const INTAKE_PHASES = [
  "story",
  "probing",
  "evidence_prompting",
  "confirmation",
] as const;

export type IntakePhase = (typeof INTAKE_PHASES)[number];

export interface MessageMetadata {
  modelUsed?: string;
  tokensIn?: number;
  tokensOut?: number;
}

export interface ChatMessage {
  id: string;
  claimId: string;
  role: ChatRole;
  content: string;
  metadata: MessageMetadata | null;
  createdAt: Date;
}

export interface ChatStreamEvent {
  type: "text_delta" | "tool_use" | "message_start" | "message_stop" | "error";
  content?: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  error?: string;
}
