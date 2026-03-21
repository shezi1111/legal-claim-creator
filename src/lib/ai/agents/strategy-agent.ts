/**
 * Legal Strategy Engine
 *
 * Creates comprehensive attack and defence battle plans for litigation.
 * Goes beyond legal arguments to produce a full litigation strategy:
 * optimal timing, pressure points, escalation ladder, cost pressure
 * analysis, settlement windows, negotiation positions, counter-strategy,
 * and a risk register with contingency plans.
 */

import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StrategicAction {
  action: string;
  description: string;
  timing: string;
  deadline: string | null;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedCost: string;
  responsibleParty: string;
  dependencies: string[];
  successCriteria: string;
}

export interface EscalationStage {
  stage: number;
  name: string;
  description: string;
  timing: string;
  estimatedDuration: string;
  estimatedCost: string;
  costToOpponent: string;
  objectives: string[];
  actions: StrategicAction[];
  exitCriteria: string;
  settlementWindow: boolean;
}

export interface PressurePoint {
  target: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timing: string;
  mechanism: string;
  ethicalConsiderations: string;
}

export interface NegotiationPosition {
  stage: string;
  openingPosition: string;
  targetOutcome: string;
  walkAwayPoint: string;
  concessions: string[];
  nonNegotiables: string[];
  anchors: string[];
}

export interface CounterMove {
  opponentAction: string;
  likelihood: 'very_likely' | 'likely' | 'possible' | 'unlikely';
  response: string;
  preparation: string;
  timing: string;
}

export interface RiskRegisterEntry {
  risk: string;
  category: 'legal' | 'evidential' | 'procedural' | 'commercial' | 'reputational' | 'enforcement';
  likelihood: 'very_likely' | 'likely' | 'possible' | 'unlikely' | 'rare';
  impact: 'catastrophic' | 'major' | 'moderate' | 'minor' | 'negligible';
  riskScore: number;
  mitigation: string;
  contingencyPlan: string;
  owner: string;
}

export interface SettlementWindowAnalysis {
  stage: string;
  timing: string;
  opponentPressure: 'high' | 'medium' | 'low';
  likelyReceptivity: 'high' | 'medium' | 'low';
  recommendedApproach: string;
  targetRange: { min: string; max: string };
}

export interface LitigationPhase {
  phase: number;
  name: string;
  description: string;
  startTrigger: string;
  estimatedDuration: string;
  objectives: string[];
  actions: StrategicAction[];
  keyRisks: string[];
  milestones: string[];
}

export interface LitigationStrategy {
  strategyType: 'attack' | 'defence';
  summary: string;
  overallObjective: string;
  recommendedApproach: 'aggressive' | 'measured' | 'defensive' | 'conciliatory';
  estimatedTotalCost: string;
  estimatedDuration: string;
  successProbability: number;

  phases: LitigationPhase[];
  escalationLadder: EscalationStage[];
  pressurePoints: PressurePoint[];
  negotiationPositions: NegotiationPosition[];
  counterStrategy: CounterMove[];
  riskRegister: RiskRegisterEntry[];
  settlementWindows: SettlementWindowAnalysis[];

  costPressureAnalysis: {
    ourCostsPerStage: { stage: string; cost: string }[];
    opponentCostsPerStage: { stage: string; cost: string }[];
    breakEvenPoint: string;
    costAsymmetry: string;
  };

  immediateActions: StrategicAction[];
  criticalDeadlines: { deadline: string; description: string; consequence: string }[];
  keyAssumptions: string[];
  alternativeStrategies: { name: string; description: string; pros: string[]; cons: string[] }[];
}

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------

function buildAttackStrategyPrompt(jurisdiction: string, areaOfLaw: string): string {
  return `You are a senior litigation partner at a top-tier law firm, renowned for your strategic brilliance in ${areaOfLaw} disputes within the ${jurisdiction} jurisdiction. You have won hundreds of cases and are known for your ability to construct devastating litigation strategies that maximise pressure on opponents whilst managing client costs.

YOUR TASK:
Create a comprehensive ATTACK (claimant) litigation strategy. This is not merely a legal analysis — it is a full battle plan covering every dimension of the litigation from pre-action through to enforcement.

STRATEGY REQUIREMENTS:

1. PHASES:
Break the litigation into distinct phases (Pre-Action, Proceedings, Trial Preparation, Trial, Post-Trial/Enforcement). For each phase provide:
- Objectives, actions, timing, key risks, and milestones
- Each action must have a priority, estimated cost, responsible party, dependencies, and success criteria

2. ESCALATION LADDER:
Map out the escalation path: Letter Before Action → Pre-Action Protocol → Mediation → Issue Proceedings → Case Management → Disclosure → Witness Statements → Expert Reports → Pre-Trial Review → Trial → Appeal
- For each stage, estimate cost to both sides and identify settlement windows
- Identify the optimal point to apply maximum pressure

3. PRESSURE POINTS:
Identify what hurts the opponent most commercially, reputationally, and personally. Consider:
- Cash flow pressure from litigation costs
- Disclosure obligations that may reveal embarrassing information
- Witness requirements that disrupt their business
- Publicity risks
- Regulatory implications
- Knock-on effects on their other contracts or relationships

4. COST PRESSURE ANALYSIS:
For each stage, estimate:
- Our client's costs
- The opponent's costs
- Where cost asymmetry can be exploited
- When the opponent will feel the most financial pressure

5. SETTLEMENT WINDOWS:
Identify the optimal moments when the opponent is most likely to settle, considering:
- After receiving the Letter Before Action (shock value)
- After disclosure (when their weaknesses are exposed)
- Before trial (when costs escalate dramatically)
- During trial (when things are not going well for them)

6. NEGOTIATION POSITIONS:
For each settlement window, specify:
- Opening position
- Target outcome
- Walk-away point
- Concessions we can make
- Non-negotiables

7. COUNTER-STRATEGY:
Predict the opponent's most likely moves and prepare responses:
- What defences will they raise?
- Will they try to delay?
- Will they bring a counterclaim?
- Will they make a Part 36 offer?
- Will they challenge jurisdiction or seek a strike-out?

8. RISK REGISTER:
Every risk that could derail the strategy, with likelihood, impact, mitigation, and contingency plans.

9. IMMEDIATE ACTIONS:
The first 5-10 things the client must do RIGHT NOW.

10. CRITICAL DEADLINES:
Every deadline that, if missed, could prejudice the case.

RESPONSE FORMAT:
Respond with valid JSON matching the LitigationStrategy structure. Ensure all fields are populated with substantive, actionable content. Monetary values should use the currency appropriate for ${jurisdiction}.

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

function buildDefenceStrategyPrompt(jurisdiction: string, areaOfLaw: string): string {
  return `You are a senior litigation partner at a top-tier law firm, renowned for your strategic brilliance in defending ${areaOfLaw} disputes within the ${jurisdiction} jurisdiction. You are the lawyer opponents dread facing because of your ability to dismantle claims systematically whilst keeping defence costs proportionate.

YOUR TASK:
Create a comprehensive DEFENCE litigation strategy. This is a full battle plan for defeating or minimising the claim against your client.

STRATEGY REQUIREMENTS:

1. PHASES:
Break the defence into distinct phases (Immediate Response, Pre-Action Response, Defence/Counterclaim, Disclosure, Witness Preparation, Trial, Post-Trial). For each phase provide:
- Objectives, actions, timing, key risks, and milestones
- Each action must have a priority, estimated cost, responsible party, dependencies, and success criteria

2. ESCALATION LADDER (DEFENCE PERSPECTIVE):
Map the response at each stage of the claimant's escalation:
- How to respond to the Letter Before Action (buy time, challenge, or negotiate?)
- Pre-Action Protocol response strategy
- Defence and potential Counterclaim
- When to propose mediation (to show willingness without conceding weakness)
- Disclosure strategy (what to disclose, how to protect privileged material)
- Witness strategy

3. PRESSURE POINTS ON THE CLAIMANT:
Identify the claimant's vulnerabilities:
- Are their costs proportionate to the claim value?
- Do they have litigation funding or ATE insurance?
- Will their witnesses withstand cross-examination?
- Are there gaps in their evidence?
- Could a robust Part 36 offer shift the costs risk?
- Would a counterclaim change the dynamic entirely?

4. COST PRESSURE ANALYSIS:
- How to keep defence costs lower than the claimant's attack costs
- Strategic use of procedural applications to increase claimant's costs
- Part 36 offer strategy to shift cost risk

5. SETTLEMENT WINDOWS:
When it might be advantageous to settle:
- Early (before incurring significant costs)
- After disclosure (if our position strengthens)
- Pre-trial (if the risks become clearer)

6. NEGOTIATION POSITIONS:
For each settlement window:
- Opening position (start low)
- Target outcome
- Walk-away point (what amount would we pay to make this go away?)
- Strategic concessions

7. COUNTER-STRATEGY:
Anticipate the claimant's moves:
- Will they seek summary judgement?
- Will they apply for an interim injunction?
- Will they try to amend their claim?
- What applications might they make?

8. RISK REGISTER:
Every risk to the defence, with mitigation and contingency.

9. IMMEDIATE ACTIONS:
The first things the client must do upon receiving the claim.

10. CRITICAL DEADLINES:
Filing deadlines, acknowledgement of service, limitation, etc.

RESPONSE FORMAT:
Respond with valid JSON matching the LitigationStrategy structure (with strategyType: "defence"). Ensure all fields are populated with substantive, actionable content. Monetary values should use the currency appropriate for ${jurisdiction}.

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

function parseStrategyResponse(content: string): LitigationStrategy {
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  // Validate essential fields
  if (!parsed.summary || !parsed.phases || !Array.isArray(parsed.phases)) {
    throw new Error('Response is missing required fields (summary, phases)');
  }

  return parsed as LitigationStrategy;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function createAttackPlan(
  factsSummary: string,
  legalAnalysis: string,
  evidenceSummary: string,
  opponentProfile: string,
  jurisdiction: string,
  areaOfLaw: string,
  claimValue: string
): Promise<LitigationStrategy> {
  const systemPrompt = buildAttackStrategyPrompt(jurisdiction, areaOfLaw);

  const userMessage = `FACTS OF THE CASE:
${factsSummary}

LEGAL ANALYSIS:
${legalAnalysis}

EVIDENCE AVAILABLE:
${evidenceSummary}

OPPONENT PROFILE:
${opponentProfile}

CLAIM VALUE: ${claimValue}
JURISDICTION: ${jurisdiction}
AREA OF LAW: ${areaOfLaw}

Create a comprehensive attack litigation strategy for this matter.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('legal_reasoning', systemPrompt, messages)) as AIResponse;

  try {
    return parseStrategyResponse(response.content);
  } catch (error) {
    throw new Error(
      `Failed to parse attack strategy response as JSON: ${error instanceof Error ? error.message : String(error)}. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}

export async function createDefencePlan(
  claimAgainstUs: string,
  factsSummary: string,
  evidenceSummary: string,
  claimantProfile: string,
  jurisdiction: string,
  areaOfLaw: string,
  claimValue: string
): Promise<LitigationStrategy> {
  const systemPrompt = buildDefenceStrategyPrompt(jurisdiction, areaOfLaw);

  const userMessage = `THE CLAIM AGAINST OUR CLIENT:
${claimAgainstUs}

OUR CLIENT'S VERSION OF EVENTS:
${factsSummary}

EVIDENCE AVAILABLE TO US:
${evidenceSummary}

CLAIMANT PROFILE:
${claimantProfile}

CLAIM VALUE: ${claimValue}
JURISDICTION: ${jurisdiction}
AREA OF LAW: ${areaOfLaw}

Create a comprehensive defence litigation strategy for this matter.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('legal_reasoning', systemPrompt, messages)) as AIResponse;

  try {
    return parseStrategyResponse(response.content);
  } catch (error) {
    throw new Error(
      `Failed to parse defence strategy response as JSON: ${error instanceof Error ? error.message : String(error)}. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
