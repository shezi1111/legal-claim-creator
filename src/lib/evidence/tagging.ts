/**
 * Evidence Tagging Engine
 * Uses AI to automatically tag documents with structured metadata:
 * dates, parties, admissions, commitments, threats, topics, etc.
 */

export interface EvidenceTag {
  type: TagType;
  value: string;
  context: string;
  positionStart?: number;
  positionEnd?: number;
  confidence: number;
}

export type TagType =
  | 'date'
  | 'party'
  | 'topic'
  | 'admission'
  | 'commitment'
  | 'threat'
  | 'contract_term'
  | 'breach'
  | 'damage'
  | 'payment'
  | 'deadline'
  | 'agreement'
  | 'denial'
  | 'legal_reference';

export const TAG_COLORS: Record<TagType, string> = {
  date: '#3B82F6',          // blue
  party: '#8B5CF6',         // purple
  topic: '#6B7280',         // gray
  admission: '#EF4444',     // red (important!)
  commitment: '#F59E0B',    // amber
  threat: '#DC2626',        // dark red
  contract_term: '#1E3A5F', // deep blue
  breach: '#EF4444',        // red
  damage: '#F97316',        // orange
  payment: '#10B981',       // green
  deadline: '#F59E0B',      // amber
  agreement: '#10B981',     // green
  denial: '#EF4444',        // red
  legal_reference: '#6366F1', // indigo
};

export const TAG_LABELS: Record<TagType, string> = {
  date: 'Date',
  party: 'Party',
  topic: 'Topic',
  admission: 'Admission',
  commitment: 'Commitment',
  threat: 'Threat',
  contract_term: 'Contract Term',
  breach: 'Breach',
  damage: 'Damage/Loss',
  payment: 'Payment',
  deadline: 'Deadline',
  agreement: 'Agreement',
  denial: 'Denial',
  legal_reference: 'Legal Reference',
};

/**
 * System prompt for the tagging AI (sent to Evidence Agent)
 */
export function getTaggingPrompt(evidenceType: string, claimContext: string): string {
  return `You are a legal document tagging specialist. Analyze the following ${evidenceType} evidence and extract ALL relevant tags.

CLAIM CONTEXT:
${claimContext}

For each tag found, provide:
- type: one of [date, party, topic, admission, commitment, threat, contract_term, breach, damage, payment, deadline, agreement, denial, legal_reference]
- value: the extracted value (e.g., "15 March 2024" for a date, "John Smith" for a party)
- context: the surrounding text (15-30 words) where this tag was found
- confidence: 0.0 to 1.0 how confident you are this is correctly tagged

BE EXTREMELY THOROUGH. Tag everything that could be relevant to the legal claim:
- Every date mentioned (explicit or implied)
- Every person, company, or entity named
- Any statement that could be an admission of fault or liability
- Any promise, commitment, or guarantee made
- Any threatening language or ultimatums
- Specific contract terms, clauses, or conditions mentioned
- Any description of breach or wrongdoing
- Any mention of financial loss, damage, or harm
- Payment amounts, invoices, or financial figures
- Deadlines set or mentioned
- Points of agreement between parties
- Denials of responsibility or liability
- References to laws, regulations, or legal precedents

Return your analysis as a JSON array of tags. Be meticulous — missing a key admission or date could weaken the legal claim.`;
}

/**
 * Parse the AI response into structured tags
 */
export function parseTagResponse(aiResponse: string): EvidenceTag[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((tag: Record<string, unknown>) => tag.type && tag.value)
      .map((tag: Record<string, unknown>) => ({
        type: tag.type as TagType,
        value: String(tag.value),
        context: String(tag.context || ''),
        positionStart: typeof tag.positionStart === 'number' ? tag.positionStart : undefined,
        positionEnd: typeof tag.positionEnd === 'number' ? tag.positionEnd : undefined,
        confidence: typeof tag.confidence === 'number' ? tag.confidence : 0.8,
      }));
  } catch {
    console.error('Failed to parse tag response');
    return [];
  }
}
