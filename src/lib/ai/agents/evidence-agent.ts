import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EvidenceAnalysis {
  summary: string;
  documentType: string;
  keyDates: { date: string; event: string }[];
  parties: { name: string; role: string }[];
  keyExcerpts: { text: string; relevance: string }[];
  supports: string[];
  undermines: string[];
  authenticityNotes: string;
  relevanceScore: number;
  tags: {
    type: string;
    value: string;
    context: string;
    positionStart?: number;
    positionEnd?: number;
  }[];
}

export interface ClaimContext {
  jurisdiction: string;
  areaOfLaw: string;
  factsSummary: string;
  partiesInvolved?: string[];
  claimedLosses?: string[];
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildEvidenceSystemPrompt(evidenceType: string, claimContext: ClaimContext): string {
  return `You are a meticulous legal evidence analyst working on a ${claimContext.areaOfLaw} case in the ${claimContext.jurisdiction} jurisdiction.

YOUR TASK:
Analyse the provided document text (type: ${evidenceType}) and produce a comprehensive structured analysis. You must be exhaustive and precise.

ANALYSIS REQUIREMENTS:

1. SUMMARY: A concise but complete summary of the document (2-4 sentences).

2. DOCUMENT TYPE: Classify the document precisely (e.g., "signed employment contract", "informal email correspondence", "bank statement", "text message screenshot", "invoice").

3. KEY DATES: Extract every date mentioned. For each date, describe the associated event.

4. PARTIES: Identify every person or organisation mentioned. Note their role in the document and their relationship to the dispute.

5. KEY EXCERPTS: Extract the most legally significant passages verbatim. For each excerpt, explain its legal relevance to the claim.

6. SUPPORTS: List specific facts or statements in this document that SUPPORT the claimant's case. Be specific.

7. UNDERMINES: List anything in this document that could UNDERMINE the claimant's case or be used by opposing counsel. Be candid.

8. AUTHENTICITY NOTES: Comment on any indicators of authenticity or potential challenges:
   - Is the document signed/dated?
   - Are there any signs of alteration?
   - Is it an original or a copy?
   - Would it likely be admissible as evidence?

9. RELEVANCE SCORE: Score 0-100 for how relevant this document is to the claim. 0 = completely irrelevant, 100 = directly proves a key element.

10. TAGS: Tag every significant item found in the document. Tag types include:
    - "date" — a date or time reference
    - "party" — a person or organisation
    - "amount" — a monetary value
    - "admission" — a statement that could be construed as an admission
    - "commitment" — a promise or obligation
    - "threat" — threatening language
    - "clause" — a contractual clause
    - "deadline" — a deadline or time limit
    - "reference" — a reference number, case number, etc.

For each tag, provide the value, surrounding context, and approximate character positions if discernible.

CONTEXT ABOUT THE CLAIM:
- Jurisdiction: ${claimContext.jurisdiction}
- Area of Law: ${claimContext.areaOfLaw}
- Facts Summary: ${claimContext.factsSummary}
${claimContext.partiesInvolved ? `- Known Parties: ${claimContext.partiesInvolved.join(', ')}` : ''}
${claimContext.claimedLosses ? `- Claimed Losses: ${claimContext.claimedLosses.join(', ')}` : ''}

RESPONSE FORMAT:
Respond with valid JSON matching this exact structure:
{
  "summary": "...",
  "documentType": "...",
  "keyDates": [{"date": "...", "event": "..."}],
  "parties": [{"name": "...", "role": "..."}],
  "keyExcerpts": [{"text": "...", "relevance": "..."}],
  "supports": ["..."],
  "undermines": ["..."],
  "authenticityNotes": "...",
  "relevanceScore": 0,
  "tags": [{"type": "...", "value": "...", "context": "...", "positionStart": 0, "positionEnd": 0}]
}

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function analyzeEvidence(
  extractedText: string,
  evidenceType: string,
  claimContext: ClaimContext
): Promise<EvidenceAnalysis> {
  const systemPrompt = buildEvidenceSystemPrompt(evidenceType, claimContext);

  const messages = [
    {
      role: 'user',
      content: `Analyse the following document:\n\n---\n${extractedText}\n---`,
    },
  ];

  const response = (await executeTask('evidence_analysis', systemPrompt, messages)) as AIResponse;

  try {
    // Strip any markdown code fences the model might have added
    const cleaned = response.content
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned) as EvidenceAnalysis;
  } catch {
    throw new Error(
      `Failed to parse evidence analysis response as JSON. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
