import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';
import type { EvidenceAnalysis } from './evidence-agent';
import type { ForensicReport } from './forensic-agent';
import type { CaseLawResearch } from './case-law-agent';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CauseOfAction {
  name: string;
  elements: {
    element: string;
    satisfied: boolean;
    evidence: string[];
    weakness: string | null;
  }[];
  viability: 'strong' | 'moderate' | 'weak';
}

export interface AnticipatedDefense {
  defense: string;
  likelihood: string;
  counterArgument: string;
}

export interface LimitationPeriod {
  applicablePeriod: string;
  expires: string;
  risk: string;
}

export interface Remedy {
  remedy: string;
  description: string;
  estimatedValue: string | null;
  likelihood: 'high' | 'medium' | 'low';
}

export interface CostBenefit {
  estimatedLegalCosts: string;
  estimatedRecovery: string;
  recommendation: string;
}

export interface LegalAnalysis {
  causesOfAction: CauseOfAction[];
  defensesToAnticipate: AnticipatedDefense[];
  limitationPeriod: LimitationPeriod;
  remedies: Remedy[];
  costBenefit: CostBenefit;
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildLegalAnalysisSystemPrompt(jurisdiction: string, areaOfLaw: string): string {
  return `You are a senior litigation counsel with 25+ years of experience in ${areaOfLaw} law within the ${jurisdiction} jurisdiction. You are renowned for your analytical rigour and strategic thinking.

YOUR TASK:
Perform a comprehensive legal analysis of the claim based on the facts, evidence, forensic findings, and case law research provided. This analysis will determine whether to proceed with the claim and shape the litigation strategy.

ANALYSIS REQUIREMENTS:

1. CAUSES OF ACTION:
For each viable cause of action:
- Name the cause of action precisely (using ${jurisdiction} legal terminology)
- List every legal element that must be satisfied
- For each element, state whether it is satisfied based on the evidence
- Identify the specific evidence that supports each element
- Note any weaknesses or gaps
- Rate overall viability: "strong", "moderate", or "weak"

2. DEFENSES TO ANTICIPATE:
For each defence the other side is likely to raise:
- Name the defence
- Assess its likelihood of success
- Propose a counter-argument

3. LIMITATION PERIOD:
- Identify the applicable limitation period for this type of claim in ${jurisdiction}
- Calculate when it expires based on the facts
- Assess the risk level (safe, approaching, urgent, or expired)

4. REMEDIES:
For each remedy that could be sought:
- Name the remedy (damages, injunction, specific performance, etc.)
- Describe what it entails
- Estimate value where applicable
- Assess likelihood of being awarded: "high", "medium", or "low"

5. COST-BENEFIT ANALYSIS:
- Estimate likely legal costs to pursue the claim
- Estimate likely recovery if successful
- Provide a clear recommendation on whether the claim is worth pursuing

RESPONSE FORMAT:
Respond with valid JSON matching this exact structure:
{
  "causesOfAction": [
    {
      "name": "...",
      "elements": [
        { "element": "...", "satisfied": true, "evidence": ["..."], "weakness": null }
      ],
      "viability": "strong|moderate|weak"
    }
  ],
  "defensesToAnticipate": [
    { "defense": "...", "likelihood": "...", "counterArgument": "..." }
  ],
  "limitationPeriod": {
    "applicablePeriod": "...",
    "expires": "...",
    "risk": "..."
  },
  "remedies": [
    { "remedy": "...", "description": "...", "estimatedValue": "...", "likelihood": "high|medium|low" }
  ],
  "costBenefit": {
    "estimatedLegalCosts": "...",
    "estimatedRecovery": "...",
    "recommendation": "..."
  }
}

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function analyzeLegalPosition(
  factsSummary: string,
  evidenceAnalyses: EvidenceAnalysis[],
  forensicFindings: ForensicReport[],
  caseLawResearch: CaseLawResearch,
  jurisdiction: string,
  areaOfLaw: string
): Promise<LegalAnalysis> {
  const systemPrompt = buildLegalAnalysisSystemPrompt(jurisdiction, areaOfLaw);

  const evidenceSummary = evidenceAnalyses
    .map(
      (ea, i) =>
        `Evidence ${i + 1} (${ea.documentType}): ${ea.summary}\n  Supports: ${ea.supports.join('; ')}\n  Undermines: ${ea.undermines.join('; ')}\n  Relevance: ${ea.relevanceScore}/100`
    )
    .join('\n\n');

  const forensicSummary = forensicFindings
    .map(
      (fr, i) =>
        `Forensic Report ${i + 1}:\n  Integrity: ${fr.overallIntegrity}\n  Findings: ${fr.findings.map((f) => `[${f.severity}] ${f.title}: ${f.detail}`).join('\n    ')}\n  Admissibility Risks: ${fr.admissibilityRisks.join('; ')}`
    )
    .join('\n\n');

  const caseLawSummary = `Case Law Research:
Legal Landscape: ${caseLawResearch.legalLandscape}
Strength Implications: ${caseLawResearch.strengthImplications}
Relevant Cases:
${caseLawResearch.cases
  .map(
    (c) =>
      `  - ${c.caseName} [${c.citation}] (${c.court}, ${c.judgmentDate})\n    ${c.supportsClaim ? 'SUPPORTS' : 'OPPOSES'}: ${c.keyPrinciple}`
  )
  .join('\n')}`;

  const userMessage = `FACTS SUMMARY:
${factsSummary}

EVIDENCE ANALYSIS:
${evidenceSummary}

FORENSIC FINDINGS:
${forensicSummary}

${caseLawSummary}

Please provide your comprehensive legal analysis.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('legal_reasoning', systemPrompt, messages)) as AIResponse;

  try {
    const cleaned = response.content
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned) as LegalAnalysis;
  } catch {
    throw new Error(
      `Failed to parse legal analysis response as JSON. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
