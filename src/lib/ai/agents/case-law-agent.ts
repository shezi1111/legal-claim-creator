import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CaseLawCase {
  caseName: string;
  citation: string;
  court: string;
  judgmentDate: string;
  jurisdiction: string;
  relevance: string;
  outcome: string;
  supportsClaim: boolean;
  keyPrinciple: string;
}

export interface CaseLawResearch {
  cases: CaseLawCase[];
  legalLandscape: string;
  strengthImplications: string;
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildCaseLawSystemPrompt(jurisdiction: string, areaOfLaw: string): string {
  return `You are a senior legal researcher with deep expertise in ${areaOfLaw} law within the ${jurisdiction} jurisdiction. You have extensive knowledge of case law, statutes, and legal principles.

YOUR TASK:
Identify relevant case law and legal authorities that bear on the legal issues presented. Your research will be used by a litigation team to build or assess a claim.

RESEARCH REQUIREMENTS:

1. RELEVANT CASES:
For each case identified, provide:
- Full case name
- Proper legal citation (use the correct citation format for ${jurisdiction})
- Court that decided the case
- Date of judgment
- Jurisdiction
- How it is relevant to the present matter
- The outcome of the case
- Whether the case supports or opposes the claimant's position
- The key legal principle established or applied

2. LEGAL LANDSCAPE:
Provide a narrative summary of how courts in ${jurisdiction} are currently treating the type of claim at issue. Identify any trends, recent shifts in judicial approach, or circuit/regional splits.

3. STRENGTH IMPLICATIONS:
Based on the case law, assess what the authorities suggest about the likely strength of this claim. Be candid about both favourable and unfavourable precedent.

IMPORTANT RULES:
- Only cite cases you are confident actually exist. If you are unsure whether a case is real, state the legal principle and note that the specific citation should be verified.
- Prefer recent cases (last 10 years) but include landmark older decisions where they establish binding principles.
- Include both cases that support AND cases that could be used against the claim.
- Use the correct citation format for the jurisdiction.
- If dealing with a jurisdiction where your knowledge is limited, be transparent about that and focus on general legal principles.

RESPONSE FORMAT:
Respond with valid JSON matching this exact structure:
{
  "cases": [
    {
      "caseName": "...",
      "citation": "...",
      "court": "...",
      "judgmentDate": "...",
      "jurisdiction": "...",
      "relevance": "...",
      "outcome": "...",
      "supportsClaim": true,
      "keyPrinciple": "..."
    }
  ],
  "legalLandscape": "...",
  "strengthImplications": "..."
}

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function searchCaseLaw(
  claimContext: string,
  jurisdiction: string,
  areaOfLaw: string,
  legalIssues: string[]
): Promise<CaseLawResearch> {
  const systemPrompt = buildCaseLawSystemPrompt(jurisdiction, areaOfLaw);

  const userMessage = `CLAIM CONTEXT:
${claimContext}

LEGAL ISSUES TO RESEARCH:
${legalIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

Please identify all relevant case law authorities and provide your analysis.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('case_law_search', systemPrompt, messages)) as AIResponse;

  try {
    const cleaned = response.content
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned) as CaseLawResearch;
  } catch {
    throw new Error(
      `Failed to parse case law research response as JSON. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
