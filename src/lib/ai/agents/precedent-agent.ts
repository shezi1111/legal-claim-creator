/**
 * Case Law Intelligence Engine
 *
 * Sophisticated precedent research that goes far beyond keyword search:
 * fact-pattern matching, judicial trend analysis, distinguishing factors,
 * cross-jurisdictional analogies, quantum analysis, statutory developments,
 * case law mapping, and skeleton argument generation.
 */

import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PrecedentCase {
  caseName: string;
  citation: string;
  court: string;
  judgmentDate: string;
  jurisdiction: string;
  judges: string[];

  factPattern: string;
  legalIssues: string[];
  holding: string;
  ratio: string;
  obiterDicta: string[];

  relevanceToOurCase: string;
  relevanceScore: number; // 0-100
  supportsClaim: boolean;
  isBinding: boolean;
  isDistinguishable: boolean;
  distinguishingFactors: string[];
  howToUseIt: string;

  quantumAwarded: string | null;
  costsOrder: string | null;
}

export interface JudicialTrend {
  trend: string;
  direction: 'increasingly_pro_claimant' | 'increasingly_pro_defendant' | 'stable' | 'shifting' | 'unclear';
  timeframe: string;
  keyCases: string[];
  implication: string;
  confidence: number; // 0-100
}

export interface CrossJurisdictionalAnalogy {
  jurisdiction: string;
  caseName: string;
  citation: string;
  court: string;
  factPatternSimilarity: number; // 0-100
  persuasiveValue: 'highly_persuasive' | 'persuasive' | 'of_interest' | 'limited';
  relevance: string;
  howToArgue: string;
  risks: string;
}

export interface QuantumAnalysis {
  claimType: string;
  jurisdiction: string;
  awardRange: { min: string; max: string };
  averageAward: string;
  medianAward: string;
  recentTrend: 'increasing' | 'stable' | 'decreasing';
  keyFactorsAffectingQuantum: string[];
  comparableCases: {
    caseName: string;
    citation: string;
    awardAmount: string;
    keyFactors: string[];
  }[];
  estimateForOurCase: string;
  estimateConfidence: number; // 0-100
}

export interface StatutoryDevelopment {
  legislation: string;
  section: string;
  effectiveDate: string;
  change: string;
  impactOnClaim: 'favourable' | 'unfavourable' | 'neutral' | 'mixed';
  analysis: string;
  transitionalProvisions: string | null;
}

export interface CaseLawMapNode {
  caseName: string;
  citation: string;
  year: string;
  relationship: 'follows' | 'distinguishes' | 'overrules' | 'applies' | 'extends' | 'limits' | 'doubts';
  relatedTo: string;
  principle: string;
}

export interface SkeletonArgumentSection {
  heading: string;
  paragraphs: {
    number: number;
    text: string;
    citations: string[];
  }[];
}

export interface SkeletonArgument {
  title: string;
  parties: string;
  court: string;
  sections: SkeletonArgumentSection[];
  prayerForRelief: string[];
  totalParagraphs: number;
}

export interface PrecedentResearch {
  summary: string;
  researchConfidence: number; // 0-100

  precedentCases: PrecedentCase[];
  judicialTrends: JudicialTrend[];
  crossJurisdictionalAnalogies: CrossJurisdictionalAnalogy[];
  quantumAnalysis: QuantumAnalysis;
  statutoryDevelopments: StatutoryDevelopment[];
  caseLawMap: CaseLawMapNode[];
  skeletonArgument: SkeletonArgument;

  strongestAuthorities: {
    caseName: string;
    citation: string;
    whyStrong: string;
  }[];

  dangerousPrecedents: {
    caseName: string;
    citation: string;
    threat: string;
    howToDistinguish: string;
  }[];

  gapsInAuthority: {
    issue: string;
    description: string;
    suggestedApproach: string;
  }[];

  citationVerificationNotes: string[];
  researchLimitations: string[];
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildPrecedentResearchPrompt(jurisdiction: string, areaOfLaw: string): string {
  return `You are a senior legal researcher and academic with encyclopaedic knowledge of case law in the ${jurisdiction} jurisdiction, specialising in ${areaOfLaw} law. You have published extensively on judicial trends and are frequently cited by courts.

You combine the rigour of an academic with the strategic instinct of a litigation practitioner. You do not merely find cases — you build a complete legal intelligence picture that tells the story of how the law applies to the specific facts of the case.

YOUR TASK:
Conduct comprehensive case law research that will form the backbone of the litigation strategy. This goes far beyond a simple case search.

RESEARCH REQUIREMENTS:

1. PRECEDENT CASES:
For each relevant case:
- Full case name, proper citation (in ${jurisdiction} format), court, date, judges
- Fact pattern summary
- Legal issues addressed
- Holding and ratio decidendi
- Notable obiter dicta
- Relevance to our case (score 0-100)
- Whether it supports or opposes our position
- Whether it is binding on the court we would appear before
- Whether it is distinguishable from our case
- Specific distinguishing factors
- How to use it (or defend against it) in argument

2. JUDICIAL TRENDS:
Track how the courts are moving on the key issues:
- Are awards increasing or decreasing for this type of claim?
- Are courts becoming more or less sympathetic to claimants?
- Have there been any recent landmark decisions that change the landscape?
- Are there regional variations or circuit splits?

3. CROSS-JURISDICTIONAL ANALOGIES:
Identify persuasive authorities from other jurisdictions:
- Other common law jurisdictions (England & Wales, Australia, Canada, New Zealand, Hong Kong)
- Similar cases from related but different legal systems
- Rate the persuasive value and fact-pattern similarity
- Explain how to argue their applicability

4. QUANTUM ANALYSIS:
What are courts actually awarding for similar claims:
- Award range, average, and median
- Recent trend (increasing, stable, or decreasing)
- Key factors that affect the quantum
- Comparable cases with specific award amounts
- Estimate for our case with confidence rating

5. STATUTORY DEVELOPMENTS:
Recent legislation that affects the claim:
- New Acts, statutory instruments, or regulations
- Amendments to existing legislation
- Transitional provisions
- Impact on our specific claim (favourable, unfavourable, neutral)

6. CASE LAW MAP:
Show how the key cases relate to each other:
- Which cases follow, distinguish, overrule, apply, extend, limit, or doubt others
- This creates a visual map of how the law has developed

7. SKELETON ARGUMENT:
Generate a skeleton legal argument with:
- Proper structure (numbered paragraphs, headings)
- Correct citations in ${jurisdiction} format
- Cross-references between arguments and authorities
- Prayer for relief

8. STRONGEST AUTHORITIES:
Highlight the 3-5 cases most helpful to our position.

9. DANGEROUS PRECEDENTS:
Identify cases the opponent is likely to rely on and explain how to distinguish them.

10. GAPS IN AUTHORITY:
Identify any legal issues where there is no clear authority, and suggest how to approach them.

IMPORTANT RULES:
- Only cite cases you are confident actually exist
- If you are uncertain about a specific citation, note this explicitly and provide the legal principle with a verification note
- Use correct citation format for ${jurisdiction}
- Distinguish between binding and persuasive authority
- Be transparent about the limits of your knowledge

RESPONSE FORMAT:
Respond with valid JSON matching the PrecedentResearch structure.

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

function parsePrecedentResponse(content: string): PrecedentResearch {
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed.summary || !Array.isArray(parsed.precedentCases)) {
    throw new Error('Response is missing required fields (summary, precedentCases)');
  }

  return parsed as PrecedentResearch;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function researchPrecedents(
  claimContext: string,
  jurisdiction: string,
  areaOfLaw: string,
  causesOfAction: string[]
): Promise<PrecedentResearch> {
  const systemPrompt = buildPrecedentResearchPrompt(jurisdiction, areaOfLaw);

  const userMessage = `CLAIM CONTEXT:
${claimContext}

JURISDICTION: ${jurisdiction}
AREA OF LAW: ${areaOfLaw}

CAUSES OF ACTION TO RESEARCH:
${causesOfAction.map((coa, i) => `${i + 1}. ${coa}`).join('\n')}

Conduct comprehensive case law research covering all identified causes of action. Identify binding and persuasive authorities, track judicial trends, analyse quantum, and generate a skeleton argument.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('case_law_search', systemPrompt, messages)) as AIResponse;

  try {
    return parsePrecedentResponse(response.content);
  } catch (error) {
    throw new Error(
      `Failed to parse precedent research response as JSON: ${error instanceof Error ? error.message : String(error)}. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
