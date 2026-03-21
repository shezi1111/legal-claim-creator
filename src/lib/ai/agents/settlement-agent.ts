/**
 * Settlement Negotiation Engine
 *
 * AI-powered settlement analysis and negotiation strategy using
 * BATNA analysis, ZOPA identification, game theory, and concession
 * planning to maximise negotiation outcomes.
 */

import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BATNAAnalysis {
  ourBATNA: {
    description: string;
    value: string;
    strengthRating: number; // 0-100
    costs: string;
    timeframe: string;
    risks: string[];
    improvementActions: string[];
  };
  opponentBATNA: {
    description: string;
    estimatedValue: string;
    strengthRating: number; // 0-100
    estimatedCosts: string;
    timeframe: string;
    likelyRisks: string[];
    weaknesses: string[];
  };
  batnaComparison: string;
  negotiationPowerBalance: 'strongly_ours' | 'slightly_ours' | 'balanced' | 'slightly_theirs' | 'strongly_theirs';
}

export interface ZOPAAnalysis {
  exists: boolean;
  ourReservationPoint: string;
  opponentEstimatedReservationPoint: string;
  zopaRange: { min: string; max: string } | null;
  zopaWidth: string;
  analysis: string;
  confidence: number; // 0-100
}

export interface FirstOfferStrategy {
  recommendedFirstOffer: string;
  anchoringRationale: string;
  psychologicalJustification: string;
  supportingArguments: string[];
  riskOfRejection: 'high' | 'medium' | 'low';
  expectedCounterOffer: string;
  adjustmentIfRejected: string;
}

export interface Concession {
  item: string;
  value: string;
  type: 'monetary' | 'non_monetary' | 'procedural' | 'timing';
  importance_to_us: 'high' | 'medium' | 'low';
  importance_to_opponent: 'high' | 'medium' | 'low';
  concessionOrder: number;
  condition: string;
  reciprocalDemand: string;
}

export interface ConcessionStrategy {
  concessions: Concession[];
  pattern: 'decreasing' | 'reciprocal' | 'package' | 'contingent';
  patternRationale: string;
  neverConcede: string[];
  totalConcessionsAvailable: string;
  fallbackPositions: { trigger: string; position: string }[];
}

export interface WalkAwayAnalysis {
  walkAwayPoint: string;
  calculation: string;
  factors: { factor: string; weight: string; value: string }[];
  signalsToWatch: string[];
  howToWalkAway: string;
  consequencesOfWalkingAway: string[];
  canWeReturn: boolean;
}

export interface SettlementLetter {
  subject: string;
  body: string;
  withoutPrejudice: boolean;
  part36Compliant: boolean;
  expiryPeriod: string;
  tacticalNotes: string;
}

export interface MediatorPerspective {
  claimantView: {
    strongestArguments: string[];
    biggestConcerns: string[];
    emotionalFactors: string[];
    realInterests: string[];
  };
  defendantView: {
    strongestArguments: string[];
    biggestConcerns: string[];
    emotionalFactors: string[];
    realInterests: string[];
  };
  commonGround: string[];
  bridgingProposals: string[];
  mediatorRecommendation: string;
}

export interface GameTheoryAnalysis {
  gameType: string;
  nashEquilibrium: string;
  dominantStrategy: string;
  payoffMatrix: {
    scenario: string;
    ourPayoff: string;
    opponentPayoff: string;
  }[];
  informationAsymmetry: string;
  commitmentDevices: string[];
  signalingStrategies: string[];
  strategicMoves: string[];
}

export interface SettlementStrategy {
  summary: string;
  recommendedAction: 'settle_now' | 'negotiate' | 'delay_then_settle' | 'proceed_to_trial';
  reasoning: string;
  confidence: number; // 0-100

  batnaAnalysis: BATNAAnalysis;
  zopaAnalysis: ZOPAAnalysis;
  firstOfferStrategy: FirstOfferStrategy;
  concessionStrategy: ConcessionStrategy;
  walkAwayAnalysis: WalkAwayAnalysis;
  settlementLetter: SettlementLetter;
  mediatorPerspective: MediatorPerspective;
  gameTheoryAnalysis: GameTheoryAnalysis;

  negotiationTactics: {
    tactic: string;
    description: string;
    whenToUse: string;
    risk: string;
  }[];

  timeline: {
    phase: string;
    action: string;
    timing: string;
    objective: string;
  }[];

  optimalSettlementValue: string;
  expectedNegotiatedValue: string;
  costOfNotSettling: string;
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildSettlementPrompt(jurisdiction: string): string {
  return `You are the world's leading settlement negotiation strategist. You combine deep legal expertise in the ${jurisdiction} jurisdiction with advanced game theory, behavioural economics, and negotiation psychology. You have mediated and negotiated thousands of disputes and are known for achieving outcomes that clients thought impossible.

YOUR TASK:
Produce a comprehensive settlement strategy that gives our client the maximum negotiation advantage. This is not a simple recommendation to settle or not — it is a complete negotiation playbook.

ANALYSIS REQUIREMENTS:

1. BATNA ANALYSIS (Best Alternative to Negotiated Agreement):
For BOTH sides:
- What happens if they don't settle?
- What is the best realistic alternative outcome?
- What will it cost to pursue the alternative?
- How long will the alternative take?
- What risks does the alternative carry?
Rate each BATNA 0-100. The side with the weaker BATNA has less negotiation power.

2. ZOPA IDENTIFICATION (Zone of Possible Agreement):
- What is our reservation point (the worst deal we would accept)?
- What is the opponent's likely reservation point?
- Does a ZOPA exist? If so, what is the range?
- How wide is the ZOPA?
- How confident are we in these estimates?

3. OPTIMAL FIRST OFFER:
- What should our opening offer be?
- How does anchoring psychology inform this number?
- What supporting arguments justify this number?
- What is the risk of rejection?
- What counter-offer should we expect?

4. CONCESSION STRATEGY:
- What can we concede, in what order, and for what in return?
- Rank concessions by importance to us vs importance to the opponent
- Use a decreasing concession pattern (each concession smaller than the last)
- Identify items we must NEVER concede
- For each concession, specify the reciprocal demand

5. WALK-AWAY ANALYSIS:
- At what point should we walk away?
- How do we calculate the walk-away point?
- What signals indicate the opponent is approaching their walk-away?
- How should we communicate walking away?
- Can we return to negotiations after walking away?

6. SETTLEMENT LETTER:
Draft a "without prejudice" settlement letter (or Part 36 offer if appropriate under ${jurisdiction} rules) that:
- Presents our position persuasively
- Anchors the negotiation in our favour
- Is legally compliant
- Creates cost pressure on the opponent
- Has an appropriate expiry period

7. MEDIATOR PERSPECTIVE:
Provide a balanced, mediator-style analysis:
- How does each side genuinely see this dispute?
- What are each side's real interests (not just positions)?
- Where is there common ground?
- What bridging proposals could work?
- What would a mediator recommend?

8. GAME THEORY ANALYSIS:
- What type of game is this negotiation?
- What is the Nash equilibrium?
- What is our dominant strategy?
- Map the payoff matrix for key scenarios
- Where does information asymmetry exist and how can we exploit it?
- What signalling strategies should we use?
- What commitment devices can we employ?

9. NEGOTIATION TACTICS:
Specific tactics to deploy during negotiation sessions.

10. TIMELINE:
Step-by-step timeline for the negotiation process.

RESPONSE FORMAT:
Respond with valid JSON matching the SettlementStrategy structure. All monetary values should use the currency appropriate for ${jurisdiction}.

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

function parseSettlementResponse(content: string): SettlementStrategy {
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed.summary || !parsed.batnaAnalysis || !parsed.zopaAnalysis) {
    throw new Error('Response is missing required fields (summary, batnaAnalysis, zopaAnalysis)');
  }

  return parsed as SettlementStrategy;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function analyseSettlement(
  claimStrength: { score: number; rating: string; analysis: string },
  simulationResults: { winRate: number; averageAward: number; costBenefit: { estimatedLegalCosts: number; expectedRecovery: number } } | null,
  estimatedCosts: { ourCosts: string; opponentCosts: string; trialCosts: string },
  opponentAnalysis: { positionStrength: number; positionAssessment: string; keyWeaknesses: string[]; keyStrengths: string[] } | null,
  claimContext: string,
  jurisdiction: string
): Promise<SettlementStrategy> {
  const systemPrompt = buildSettlementPrompt(jurisdiction);

  const simulationSummary = simulationResults
    ? `Win rate: ${simulationResults.winRate}%
Average award: ${simulationResults.averageAward}
Estimated legal costs: ${simulationResults.costBenefit.estimatedLegalCosts}
Expected recovery: ${simulationResults.costBenefit.expectedRecovery}`
    : 'No simulation data available.';

  const opponentSummary = opponentAnalysis
    ? `Position strength: ${opponentAnalysis.positionStrength}/100
Assessment: ${opponentAnalysis.positionAssessment}
Key weaknesses: ${opponentAnalysis.keyWeaknesses.join('; ')}
Key strengths: ${opponentAnalysis.keyStrengths.join('; ')}`
    : 'No opponent analysis available.';

  const userMessage = `CLAIM CONTEXT:
${claimContext}

CLAIM STRENGTH:
Score: ${claimStrength.score}/100
Rating: ${claimStrength.rating}
Analysis: ${claimStrength.analysis}

SIMULATION RESULTS:
${simulationSummary}

ESTIMATED COSTS:
Our costs: ${estimatedCosts.ourCosts}
Opponent's costs: ${estimatedCosts.opponentCosts}
Trial costs: ${estimatedCosts.trialCosts}

OPPONENT ANALYSIS:
${opponentSummary}

JURISDICTION: ${jurisdiction}

Produce a comprehensive settlement negotiation strategy.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('legal_reasoning', systemPrompt, messages)) as AIResponse;

  try {
    return parseSettlementResponse(response.content);
  } catch (error) {
    throw new Error(
      `Failed to parse settlement strategy response as JSON: ${error instanceof Error ? error.message : String(error)}. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
