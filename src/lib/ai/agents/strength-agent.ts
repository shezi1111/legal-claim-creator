import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StrengthBreakdown {
  factsStrength: number;
  evidenceStrength: number;
  legalBasisStrength: number;
  remedyLikelihood: number;
}

export interface StrengthAssessment {
  overallScore: number;
  overallRating: 'weak' | 'moderate' | 'strong';
  breakdown: StrengthBreakdown;
  keyStrengths: string[];
  keyWeaknesses: string[];
  recommendations: string[];
  detailedAnalysis: string;
}

export interface CaseFile {
  factsSummary: string;
  jurisdiction: string;
  areaOfLaw: string;
  evidenceAnalyses: {
    documentType: string;
    summary: string;
    supports: string[];
    undermines: string[];
    relevanceScore: number;
  }[];
  forensicFindings: {
    overallIntegrity: string;
    findings: { severity: string; title: string; detail: string }[];
    admissibilityRisks: string[];
  }[];
  legalAnalysis: {
    causesOfAction: { name: string; viability: string }[];
    defensesToAnticipate: { defense: string; likelihood: string }[];
    limitationPeriod: { risk: string };
    remedies: { remedy: string; likelihood: string; estimatedValue: string | null }[];
    costBenefit: { estimatedLegalCosts: string; estimatedRecovery: string; recommendation: string };
  };
  caseLawResearch: {
    legalLandscape: string;
    strengthImplications: string;
    cases: { caseName: string; supportsClaim: boolean; keyPrinciple: string }[];
  };
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildStrengthSystemPrompt(): string {
  return `You are an independent legal assessor providing an objective strength rating for a legal claim. You have NO allegiance to either party. Your assessment must be brutally honest and data-driven.

YOUR TASK:
Review the entire case file and provide an independent strength assessment. You must be objective — neither optimistic nor pessimistic. Base your scores strictly on the evidence and legal analysis provided.

SCORING CRITERIA (each scored 0-100):

1. FACTS STRENGTH (25% of overall):
   - Are the facts clear, consistent, and well-documented?
   - Is the narrative coherent and credible?
   - Are there gaps or contradictions in the factual account?

2. EVIDENCE STRENGTH (30% of overall):
   - Is the evidence sufficient to prove each element of the claim?
   - Is the evidence admissible and authentic?
   - Are there any forensic concerns?
   - How strong would the evidence be at trial?

3. LEGAL BASIS STRENGTH (30% of overall):
   - Are the causes of action viable?
   - Does the case law support the claim?
   - Are there strong defences the other side can raise?
   - Is the limitation period safe?

4. REMEDY LIKELIHOOD (15% of overall):
   - How likely is the claimant to obtain the remedies sought?
   - Is the estimated recovery proportionate to the costs?
   - Would a reasonable court award what is being claimed?

OVERALL SCORE CALCULATION:
Overall = (Facts * 0.25) + (Evidence * 0.30) + (LegalBasis * 0.30) + (Remedy * 0.15)
Round to nearest integer.

OVERALL RATING:
- 0-39: "weak" — Claim is unlikely to succeed. Advise against proceeding unless significant improvements can be made.
- 40-69: "moderate" — Claim has merit but significant risks. May be worth pursuing with improvements.
- 70-100: "strong" — Claim has good prospects of success. Recommend proceeding.

RESPONSE FORMAT:
Respond with valid JSON matching this exact structure:
{
  "overallScore": 0,
  "overallRating": "weak|moderate|strong",
  "breakdown": {
    "factsStrength": 0,
    "evidenceStrength": 0,
    "legalBasisStrength": 0,
    "remedyLikelihood": 0
  },
  "keyStrengths": ["..."],
  "keyWeaknesses": ["..."],
  "recommendations": ["..."],
  "detailedAnalysis": "..."
}

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function assessStrength(entireCaseFile: CaseFile): Promise<StrengthAssessment> {
  const systemPrompt = buildStrengthSystemPrompt();

  const evidenceSummary = entireCaseFile.evidenceAnalyses
    .map(
      (ea, i) =>
        `Evidence ${i + 1} (${ea.documentType}): ${ea.summary}\n  Supports: ${ea.supports.join('; ')}\n  Undermines: ${ea.undermines.join('; ')}\n  Relevance: ${ea.relevanceScore}/100`
    )
    .join('\n');

  const forensicSummary = entireCaseFile.forensicFindings
    .map(
      (fr, i) =>
        `Forensic Report ${i + 1}: Integrity=${fr.overallIntegrity}\n  Findings: ${fr.findings.map((f) => `[${f.severity}] ${f.title}`).join(', ')}\n  Admissibility Risks: ${fr.admissibilityRisks.join('; ')}`
    )
    .join('\n');

  const legalSummary = `Causes of Action: ${entireCaseFile.legalAnalysis.causesOfAction.map((c) => `${c.name} (${c.viability})`).join(', ')}
Anticipated Defences: ${entireCaseFile.legalAnalysis.defensesToAnticipate.map((d) => `${d.defense} (${d.likelihood})`).join(', ')}
Limitation Risk: ${entireCaseFile.legalAnalysis.limitationPeriod.risk}
Remedies: ${entireCaseFile.legalAnalysis.remedies.map((r) => `${r.remedy} (${r.likelihood}, est. ${r.estimatedValue ?? 'TBD'})`).join(', ')}
Cost-Benefit: Costs=${entireCaseFile.legalAnalysis.costBenefit.estimatedLegalCosts}, Recovery=${entireCaseFile.legalAnalysis.costBenefit.estimatedRecovery}
Recommendation: ${entireCaseFile.legalAnalysis.costBenefit.recommendation}`;

  const caseLawSummary = `Legal Landscape: ${entireCaseFile.caseLawResearch.legalLandscape}
Strength Implications: ${entireCaseFile.caseLawResearch.strengthImplications}
Supporting Cases: ${entireCaseFile.caseLawResearch.cases.filter((c) => c.supportsClaim).length}
Opposing Cases: ${entireCaseFile.caseLawResearch.cases.filter((c) => !c.supportsClaim).length}`;

  const userMessage = `CASE FILE FOR INDEPENDENT STRENGTH ASSESSMENT:

JURISDICTION: ${entireCaseFile.jurisdiction}
AREA OF LAW: ${entireCaseFile.areaOfLaw}

FACTS SUMMARY:
${entireCaseFile.factsSummary}

EVIDENCE:
${evidenceSummary}

FORENSIC FINDINGS:
${forensicSummary}

LEGAL ANALYSIS:
${legalSummary}

CASE LAW:
${caseLawSummary}

Provide your independent, objective strength assessment now.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('strength_rating', systemPrompt, messages)) as AIResponse;

  try {
    const cleaned = response.content
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned) as StrengthAssessment;
  } catch {
    throw new Error(
      `Failed to parse strength assessment response as JSON. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
