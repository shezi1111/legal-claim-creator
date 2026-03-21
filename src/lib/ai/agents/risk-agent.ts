/**
 * Risk Assessment Engine
 *
 * Comprehensive risk analysis covering every dimension a senior
 * litigation partner would consider: costs, evidence, limitation,
 * witnesses, commercial viability, reputation, procedural risks,
 * counterclaim exposure, proportionality, and insurance.
 */

import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RiskCategory =
  | 'costs'
  | 'evidence'
  | 'limitation'
  | 'witness'
  | 'commercial'
  | 'reputational'
  | 'procedural'
  | 'counterclaim'
  | 'proportionality'
  | 'insurance'
  | 'enforcement'
  | 'regulatory';

export type RiskLikelihood = 'almost_certain' | 'likely' | 'possible' | 'unlikely' | 'rare';

export type RiskImpact = 'catastrophic' | 'major' | 'moderate' | 'minor' | 'negligible';

export interface RiskItem {
  id: string;
  category: RiskCategory;
  title: string;
  description: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  riskScore: number; // 1-25 (5x5 matrix)
  rating: 'critical' | 'high' | 'medium' | 'low' | 'negligible';

  triggerEvents: string[];
  earlyWarningSignals: string[];

  mitigation: {
    action: string;
    effectiveness: 'high' | 'medium' | 'low';
    cost: string;
    timing: string;
    owner: string;
  };

  contingencyPlan: {
    trigger: string;
    actions: string[];
    estimatedCost: string;
    timeToImplement: string;
  };

  residualRisk: {
    likelihood: RiskLikelihood;
    impact: RiskImpact;
    score: number;
  };

  relatedRisks: string[];
}

export interface CostsRiskAnalysis {
  ownCostsEstimate: string;
  adverseCostsEstimate: string;
  qualifiedOneSidedCostsShifting: boolean;
  part36Implications: string;
  securityForCosts: {
    applicable: boolean;
    likelihood: string;
    estimatedAmount: string;
    impact: string;
  };
  budgetingRisks: string[];
  disbursementsAtRisk: string[];
  costsCapping: string;
  overallCostsRisk: 'high' | 'medium' | 'low';
}

export interface EvidenceRiskAnalysis {
  weakEvidence: {
    evidence: string;
    weakness: string;
    challengeLikelihood: string;
    impact: string;
    mitigation: string;
  }[];
  missingEvidence: {
    description: string;
    importance: 'critical' | 'important' | 'useful';
    obtainable: boolean;
    howToObtain: string;
  }[];
  admissibilityRisks: {
    evidence: string;
    risk: string;
    legalBasis: string;
    mitigation: string;
  }[];
  disclosureRisks: {
    risk: string;
    description: string;
    impact: string;
  }[];
  privilegeRisks: string[];
  overallEvidenceRisk: 'high' | 'medium' | 'low';
}

export interface LimitationRiskAnalysis {
  primaryLimitation: {
    period: string;
    statutoryBasis: string;
    expiryDate: string;
    daysRemaining: number;
    risk: 'expired' | 'critical' | 'approaching' | 'safe';
  };
  alternativeLimitations: {
    causeOfAction: string;
    period: string;
    expiryDate: string;
    risk: string;
  }[];
  extensionPossibilities: {
    ground: string;
    likelihood: string;
    basis: string;
  }[];
  acknowledgementOrPartPayment: boolean;
  fraudOrConcealment: boolean;
  overallLimitationRisk: 'high' | 'medium' | 'low';
}

export interface WitnessRiskAnalysis {
  witnesses: {
    name: string;
    role: string;
    importance: 'essential' | 'important' | 'useful';
    availability: 'confirmed' | 'likely' | 'uncertain' | 'reluctant' | 'hostile';
    credibilityRisks: string[];
    crossExaminationVulnerabilities: string[];
    reliability: 'high' | 'medium' | 'low';
  }[];
  expertWitnessNeeded: boolean;
  expertAreas: string[];
  overallWitnessRisk: 'high' | 'medium' | 'low';
}

export interface CommercialRiskAnalysis {
  opponentSolvency: 'strong' | 'adequate' | 'questionable' | 'at_risk' | 'unknown';
  enforcementProspects: string;
  practicalRecovery: string;
  opponentAssets: string;
  insolvencyRisk: string;
  businessRelationshipImpact: string;
  commercialContext: string;
  overallCommercialRisk: 'high' | 'medium' | 'low';
}

export interface InsuranceAnalysis {
  claimantInsurance: {
    beforeTheEvent: { exists: boolean; details: string; relevance: string };
    afterTheEvent: { recommended: boolean; estimatedPremium: string; availability: string };
    legalExpensesInsurance: { exists: boolean; details: string; policyLimits: string };
  };
  defendantInsurance: {
    likelyInsured: boolean;
    insuranceType: string;
    implication: string;
  };
  thirdPartyFunding: {
    suitableForFunding: boolean;
    reasoning: string;
    likelyTerms: string;
  };
  overallInsurancePosition: string;
}

export interface RiskAssessment {
  summary: string;
  overallRiskRating: 'critical' | 'high' | 'medium' | 'low';
  overallRiskScore: number; // 0-100
  proceedRecommendation: 'strongly_recommend' | 'recommend' | 'proceed_with_caution' | 'reconsider' | 'do_not_proceed';
  proceedReasoning: string;

  risks: RiskItem[];

  costsRisk: CostsRiskAnalysis;
  evidenceRisk: EvidenceRiskAnalysis;
  limitationRisk: LimitationRiskAnalysis;
  witnessRisk: WitnessRiskAnalysis;
  commercialRisk: CommercialRiskAnalysis;
  insuranceAnalysis: InsuranceAnalysis;

  riskHeatmap: {
    category: RiskCategory;
    score: number;
    rating: 'critical' | 'high' | 'medium' | 'low' | 'negligible';
  }[];

  topThreeRisks: {
    risk: string;
    whyTopRisk: string;
    immediateAction: string;
  }[];

  dealBreakers: {
    issue: string;
    description: string;
    canBeMitigated: boolean;
    mitigation: string | null;
  }[];

  immediateActions: {
    action: string;
    priority: 'critical' | 'high' | 'medium';
    deadline: string;
    owner: string;
  }[];
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildRiskAssessmentPrompt(jurisdiction: string, areaOfLaw: string): string {
  return `You are a senior litigation partner conducting a comprehensive risk assessment for a ${areaOfLaw} matter in the ${jurisdiction} jurisdiction. You are known for your unflinching candour — you tell clients the truth about risks, even when it is uncomfortable.

You have managed thousands of cases and have seen every possible way a case can go wrong. Your risk assessments are renowned for their thoroughness and have saved clients millions in avoidable losses.

YOUR TASK:
Produce a comprehensive risk assessment covering every dimension of risk in this litigation. This must be brutally honest — the client's financial exposure depends on the accuracy of this assessment.

RISK CATEGORIES TO ASSESS:

1. COSTS RISK:
- What are the likely costs to pursue/defend this claim?
- What adverse costs would be payable if we lose?
- Is there qualified one-sided costs shifting (e.g., Employment Tribunal)?
- What are the Part 36 / Calderbank implications?
- Is there a risk of security for costs?
- Are there budget risks or disbursements at risk?
- Could costs be capped?

2. EVIDENCE RISK:
- Which pieces of evidence might be excluded or challenged?
- What evidence is missing that we need?
- Are there admissibility risks?
- What disclosure risks exist (adverse documents)?
- Are there privilege issues?

3. LIMITATION RISK:
- What is the applicable limitation period?
- When does it expire?
- How many days remain?
- Are there alternative limitation periods for different causes of action?
- Could limitation be extended (s.33 discretion, fraud, concealment)?
- Has there been any acknowledgement or part payment?

4. WITNESS RISK:
- Will key witnesses cooperate?
- How credible are our witnesses?
- What are their cross-examination vulnerabilities?
- Do we need expert witnesses?
- Are there hostile witnesses?

5. COMMERCIAL RISK:
- Can the opponent actually pay if we win (solvency)?
- Is the judgment enforceable in practice?
- What assets does the opponent have?
- Is there an insolvency risk?
- Will litigation damage an ongoing business relationship?

6. REPUTATIONAL RISK:
- Will this case attract media attention?
- Is there a risk of adverse publicity?
- Could social media amplify any issues?
- Are there regulatory implications?

7. PROCEDURAL RISK:
- Could the case be struck out on technical grounds?
- Are there jurisdictional challenges?
- Is there a risk of summary judgment against us?
- Are there compliance issues with pre-action protocols?

8. COUNTERCLAIM RISK:
- Could the opponent bring a counterclaim?
- What would the counterclaim be for?
- How strong would it be?
- What would be the financial exposure?

9. PROPORTIONALITY RISK:
- Is the claim value proportionate to the litigation costs?
- Would a court consider the costs disproportionate?
- Are there alternative dispute resolution options that should be tried first?

10. INSURANCE ANALYSIS:
- Does the client have legal expenses insurance?
- Is ATE insurance recommended?
- Would the case be suitable for litigation funding?
- Does the opponent likely have insurance?

For each individual risk:
- Rate likelihood: almost_certain, likely, possible, unlikely, rare
- Rate impact: catastrophic, major, moderate, minor, negligible
- Calculate risk score (1-25 on a 5x5 matrix)
- Provide specific mitigation actions with cost and timing
- Provide contingency plans
- Calculate residual risk after mitigation
- Identify early warning signals and trigger events

RESPONSE FORMAT:
Respond with valid JSON matching the RiskAssessment structure. Use currency appropriate for ${jurisdiction}.

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

function parseRiskAssessmentResponse(content: string): RiskAssessment {
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed.summary || typeof parsed.overallRiskScore !== 'number') {
    throw new Error('Response is missing required fields (summary, overallRiskScore)');
  }

  return parsed as RiskAssessment;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function assessRisks(
  claimContext: string,
  evidenceAnalysis: string,
  legalAnalysis: string,
  jurisdiction: string,
  areaOfLaw: string = 'general',
  additionalContext?: {
    opponentProfile?: string;
    claimValue?: string;
    witnesses?: string[];
    timelineGaps?: string[];
    forensicFindings?: string;
  }
): Promise<RiskAssessment> {
  const systemPrompt = buildRiskAssessmentPrompt(jurisdiction, areaOfLaw);

  let additionalInfo = '';
  if (additionalContext) {
    if (additionalContext.opponentProfile) {
      additionalInfo += `\nOPPONENT PROFILE:\n${additionalContext.opponentProfile}`;
    }
    if (additionalContext.claimValue) {
      additionalInfo += `\nCLAIM VALUE: ${additionalContext.claimValue}`;
    }
    if (additionalContext.witnesses?.length) {
      additionalInfo += `\nKNOWN WITNESSES:\n${additionalContext.witnesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}`;
    }
    if (additionalContext.timelineGaps?.length) {
      additionalInfo += `\nTIMELINE GAPS:\n${additionalContext.timelineGaps.map((g, i) => `${i + 1}. ${g}`).join('\n')}`;
    }
    if (additionalContext.forensicFindings) {
      additionalInfo += `\nFORENSIC FINDINGS:\n${additionalContext.forensicFindings}`;
    }
  }

  const userMessage = `CLAIM CONTEXT:
${claimContext}

EVIDENCE ANALYSIS:
${evidenceAnalysis}

LEGAL ANALYSIS:
${legalAnalysis}

JURISDICTION: ${jurisdiction}
AREA OF LAW: ${areaOfLaw}
${additionalInfo}

Produce a comprehensive risk assessment for this litigation.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('legal_reasoning', systemPrompt, messages)) as AIResponse;

  try {
    return parseRiskAssessmentResponse(response.content);
  } catch (error) {
    throw new Error(
      `Failed to parse risk assessment response as JSON: ${error instanceof Error ? error.message : String(error)}. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
