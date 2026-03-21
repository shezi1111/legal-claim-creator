/**
 * Clarification Agent
 *
 * Analyzes the current state of a claim and identifies gaps:
 * - Evidence mentioned but not uploaded
 * - Contradictions between testimony and evidence
 * - Missing information needed for specific causes of action
 * - Witnesses mentioned but no statements taken
 *
 * Returns clarification questions that the intake agent should ask.
 */

export interface ClarificationRequest {
  type: 'missing_evidence' | 'contradiction' | 'missing_info' | 'missing_witness' | 'date_gap' | 'unclear_fact';
  priority: 'critical' | 'important' | 'helpful';
  question: string;
  context: string;
  suggestedAction: string;
}

/**
 * System prompt for the clarification agent
 */
export function getClarificationPrompt(
  factsSummary: string,
  evidenceList: { filename: string; type: string; summary: string }[],
  conversationHistory: string,
  jurisdiction: string,
  areaOfLaw: string
): string {
  const evidenceListText = evidenceList
    .map(e => `- ${e.filename} (${e.type}): ${e.summary}`)
    .join('\n');

  return `You are a meticulous legal analyst reviewing a claim in progress. Your job is to identify GAPS — things that are missing, unclear, or contradictory.

JURISDICTION: ${jurisdiction}
AREA OF LAW: ${areaOfLaw}

FACTS GATHERED SO FAR:
${factsSummary}

EVIDENCE UPLOADED:
${evidenceListText || 'No evidence uploaded yet.'}

CONVERSATION SO FAR:
${conversationHistory}

ANALYZE THE ABOVE AND IDENTIFY:

1. **MISSING EVIDENCE**: Documents or communications mentioned in the conversation but NOT in the evidence list.
   Example: "You mentioned a contract was signed — but I don't see it in the uploaded evidence."

2. **CONTRADICTIONS**: Statements that contradict each other or contradict the evidence.
   Example: "You said the meeting was in March, but the email is dated February."

3. **MISSING INFORMATION**: Key facts needed for the legal claim that haven't been discussed.
   Example: "For a breach of contract claim, we need to establish consideration — what did you pay or promise in return?"

4. **MISSING WITNESSES**: People mentioned as present during key events but no witness statement taken.
   Example: "You mentioned your colleague Sarah was in the meeting — would she be willing to provide a witness statement?"

5. **DATE GAPS**: Periods in the timeline where we don't know what happened.
   Example: "What happened between December 2024 and January 2025? There's a 6-week gap in the timeline."

6. **UNCLEAR FACTS**: Statements that are vague and need to be more specific for legal purposes.
   Example: "You said 'they didn't deliver' — can you be more specific about what exactly was missing?"

Return a JSON array of clarification requests. Each must have:
- type: one of [missing_evidence, contradiction, missing_info, missing_witness, date_gap, unclear_fact]
- priority: "critical" (could derail the claim), "important" (significantly strengthens it), or "helpful" (nice to have)
- question: the specific question to ask the claimant
- context: why this matters legally
- suggestedAction: what the claimant should do (e.g., "Upload the contract", "Provide exact dates")

Be thorough but practical. Only flag genuine gaps, not theoretical ones.`;
}

/**
 * Parse clarification response from AI
 */
export function parseClarificationResponse(aiResponse: string): ClarificationRequest[] {
  try {
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((c: Record<string, unknown>) => c.type && c.question)
      .map((c: Record<string, unknown>) => ({
        type: c.type as ClarificationRequest['type'],
        priority: (c.priority as ClarificationRequest['priority']) || 'important',
        question: String(c.question),
        context: String(c.context || ''),
        suggestedAction: String(c.suggestedAction || ''),
      }));
  } catch {
    console.error('Failed to parse clarification response');
    return [];
  }
}

/**
 * Format clarifications as a message for the intake agent to incorporate
 */
export function formatClarificationsForIntake(clarifications: ClarificationRequest[]): string {
  if (clarifications.length === 0) return '';

  const critical = clarifications.filter(c => c.priority === 'critical');
  const important = clarifications.filter(c => c.priority === 'important');

  let message = '';

  if (critical.length > 0) {
    message += '\n\n**Important — I need to clarify a few things before we can proceed:**\n\n';
    critical.forEach((c, i) => {
      message += `${i + 1}. ${c.question}\n`;
    });
  }

  if (important.length > 0) {
    message += '\n\n**Also, to strengthen your claim:**\n\n';
    important.forEach((c, i) => {
      message += `${i + 1}. ${c.question}\n`;
    });
  }

  return message;
}
