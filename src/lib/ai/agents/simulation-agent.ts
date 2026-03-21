/**
 * Trial Simulation Agent
 *
 * The paid feature of Atticus. Takes a claim (or defence), builds the
 * strongest possible opposition, then runs multiple simulated trials
 * using different AI models as judges.
 *
 * Produces:
 * - Win/loss percentage across simulations
 * - Average award amount
 * - Settlement recommendation
 * - Confidence score
 * - Key factors that swing the outcome
 */

export interface SimulationConfig {
  claimId: string;
  side: 'claimant' | 'defendant';
  numberOfSimulations: number; // default 30, max 50
  models: SimulationModel[];
}

export interface SimulationModel {
  provider: 'anthropic' | 'openai' | 'google';
  model: string;
  label: string; // e.g., "Judge A", "Judge B"
}

export interface SimulationResult {
  claimId: string;
  side: 'claimant' | 'defendant';
  totalSimulations: number;
  completedAt: string;

  // Core outcomes
  winRate: number;            // 0-100 percentage
  lossRate: number;
  partialWinRate: number;     // some claims succeed, some don't

  // Financial
  averageAward: number;
  minAward: number;
  maxAward: number;
  medianAward: number;

  // Confidence
  confidenceScore: number;    // 0-100, how reliable the prediction is
  confidenceLevel: 'very_high' | 'high' | 'moderate' | 'low';

  // Settlement
  settlementRecommendation: {
    shouldSettle: boolean;
    recommendedRange: { min: number; max: number };
    reasoning: string;
  };

  // Detailed breakdown
  simulationDetails: SingleSimulation[];

  // Key factors
  swingFactors: {
    factor: string;
    impact: 'strongly_favours_claimant' | 'favours_claimant' | 'neutral' | 'favours_defendant' | 'strongly_favours_defendant';
    explanation: string;
  }[];

  // Cost-benefit
  costBenefit: {
    estimatedLegalCosts: number;
    expectedRecovery: number; // winRate * averageAward
    netExpectedValue: number;
    recommendation: string;
  };
}

export interface SingleSimulation {
  simulationNumber: number;
  model: string;
  judgePersona: string;
  outcome: 'claimant_wins' | 'defendant_wins' | 'partial' | 'dismissed';
  awardAmount: number;
  reasoning: string;
  keyFactors: string[];
  claimsSucceeded: string[];
  claimsFailed: string[];
}

/**
 * Default model rotation for simulations.
 * Using different models creates genuine diversity in judicial reasoning.
 */
export const DEFAULT_SIMULATION_MODELS: SimulationModel[] = [
  { provider: 'anthropic', model: 'claude-sonnet-4-20250514', label: 'Judge Alpha' },
  { provider: 'openai', model: 'gpt-4-turbo', label: 'Judge Bravo' },
  { provider: 'google', model: 'gemini-1.5-pro', label: 'Judge Charlie' },
];

/**
 * Judge personas to create realistic variation in judicial temperament.
 * Each simulation randomly selects a persona.
 */
export const JUDGE_PERSONAS = [
  {
    name: 'Strict Constructionist',
    description: 'Interprets law narrowly. Requires strong evidence. Sceptical of emotional arguments. Favours procedural compliance.',
    temperament: 'conservative',
  },
  {
    name: 'Pragmatic Realist',
    description: 'Focuses on practical outcomes. Weighs commercial reality. Considers proportionality. Balanced approach to evidence.',
    temperament: 'moderate',
  },
  {
    name: 'Rights-Focused',
    description: 'Strong emphasis on individual rights and fairness. More sympathetic to vulnerable parties. Willing to interpret law purposively.',
    temperament: 'liberal',
  },
  {
    name: 'Evidence-Driven',
    description: 'Outcome determined almost entirely by quality and weight of evidence. Less interested in legal technicalities. Very thorough on facts.',
    temperament: 'analytical',
  },
  {
    name: 'Procedural Purist',
    description: 'Strict on procedural requirements. Will penalise parties for non-compliance with rules. Values proper process over outcome.',
    temperament: 'procedural',
  },
];

/**
 * System prompt for running a single trial simulation
 */
export function getSimulationPrompt(
  claimSummary: string,
  claimantArguments: string,
  defendantArguments: string,
  evidenceSummary: string,
  caseLawReferences: string,
  jurisdiction: string,
  judgePersona: typeof JUDGE_PERSONAS[number]
): string {
  return `You are a ${judgePersona.name} judge presiding over a civil trial in ${jurisdiction}.

YOUR JUDICIAL TEMPERAMENT:
${judgePersona.description}

You must now deliver judgment on the following matter. Consider all evidence, arguments, and applicable law before reaching your decision.

CLAIMANT'S CASE:
${claimantArguments}

DEFENDANT'S CASE:
${defendantArguments}

EVIDENCE BEFORE THE COURT:
${evidenceSummary}

RELEVANT CASE LAW:
${caseLawReferences}

DELIVER YOUR JUDGMENT:

You must provide:
1. A summary of the key findings of fact
2. Your analysis of the law as applied to the facts
3. Your finding on each cause of action (succeeded or failed, and why)
4. If the claimant succeeds, the quantum of damages awarded with reasoning
5. Any costs order

Return your judgment as JSON:
{
  "outcome": "claimant_wins" | "defendant_wins" | "partial" | "dismissed",
  "awardAmount": <number in GBP, 0 if defendant wins>,
  "reasoning": "<2-3 paragraph summary of your reasoning>",
  "keyFactors": ["<factor 1>", "<factor 2>", ...],
  "claimsSucceeded": ["<cause of action 1>", ...],
  "claimsFailed": ["<cause of action 1>", ...],
  "costsOrder": "<description of costs order>"
}

Judge impartially based on the evidence and law before you. Do not be swayed by sympathy alone.`;
}

/**
 * System prompt for building the opposition's case.
 * When a claimant submits, Atticus builds the strongest defence.
 * When a defendant submits, Atticus builds the strongest claim.
 */
export function getOppositionPrompt(
  side: 'claimant' | 'defendant',
  caseDetails: string,
  evidenceSummary: string,
  jurisdiction: string
): string {
  const opposingSide = side === 'claimant' ? 'defendant' : 'claimant';
  const task = side === 'claimant'
    ? 'build the strongest possible DEFENCE against this claim'
    : 'build the strongest possible CLAIM against this defence';

  return `You are an elite litigation barrister retained by the ${opposingSide}. Your job is to ${task}.

JURISDICTION: ${jurisdiction}

THE ${side.toUpperCase()}'S CASE:
${caseDetails}

EVIDENCE AVAILABLE:
${evidenceSummary}

Build the strongest possible case for the ${opposingSide}. Include:

1. **Key arguments**: What are the strongest arguments against the ${side}'s position?
2. **Weaknesses exploited**: Where is the ${side}'s evidence thin, contradictory, or missing?
3. **Legal defences/claims**: What specific legal grounds would you rely on?
4. **Counter-evidence**: What evidence would undermine the ${side}'s case?
5. **Procedural challenges**: Any technical or procedural grounds to challenge?
6. **Case law**: What precedents support the ${opposingSide}'s position?

Be aggressive, thorough, and creative. Leave no stone unturned. The ${opposingSide} is paying top fees for the best possible representation.

Return as a structured legal argument that can be used in the trial simulation.`;
}

/**
 * Calculate aggregate results from individual simulations
 */
export function aggregateResults(
  simulations: SingleSimulation[],
  estimatedLegalCosts: number
): Omit<SimulationResult, 'claimId' | 'side' | 'completedAt'> {
  const total = simulations.length;

  const wins = simulations.filter(s => s.outcome === 'claimant_wins').length;
  const losses = simulations.filter(s => s.outcome === 'defendant_wins' || s.outcome === 'dismissed').length;
  const partials = simulations.filter(s => s.outcome === 'partial').length;

  const awards = simulations.map(s => s.awardAmount).filter(a => a > 0);
  const avgAward = awards.length > 0 ? awards.reduce((a, b) => a + b, 0) / awards.length : 0;
  const sortedAwards = [...awards].sort((a, b) => a - b);
  const medianAward = sortedAwards.length > 0
    ? sortedAwards[Math.floor(sortedAwards.length / 2)]
    : 0;

  const winRate = Math.round((wins / total) * 100);
  const lossRate = Math.round((losses / total) * 100);
  const partialWinRate = Math.round((partials / total) * 100);

  // Confidence based on consistency of outcomes
  const dominantOutcome = Math.max(wins, losses, partials);
  const consistency = dominantOutcome / total;
  const confidenceScore = Math.round(consistency * 100);
  const confidenceLevel = confidenceScore >= 80 ? 'very_high'
    : confidenceScore >= 65 ? 'high'
    : confidenceScore >= 50 ? 'moderate'
    : 'low';

  // Settlement recommendation
  const expectedRecovery = (winRate / 100) * avgAward;
  const shouldSettle = winRate < 70 || expectedRecovery < estimatedLegalCosts * 2;

  const settlementMin = Math.round(avgAward * 0.5);
  const settlementMax = Math.round(avgAward * 0.8);

  // Swing factors — find the most common key factors
  const factorCounts = new Map<string, { claimant: number; defendant: number }>();
  for (const sim of simulations) {
    for (const factor of sim.keyFactors) {
      const existing = factorCounts.get(factor) || { claimant: 0, defendant: 0 };
      if (sim.outcome === 'claimant_wins') {
        existing.claimant++;
      } else {
        existing.defendant++;
      }
      factorCounts.set(factor, existing);
    }
  }

  const swingFactors = Array.from(factorCounts.entries())
    .map(([factor, counts]) => {
      const ratio = counts.claimant / (counts.claimant + counts.defendant);
      const impact = ratio > 0.8 ? 'strongly_favours_claimant' as const
        : ratio > 0.6 ? 'favours_claimant' as const
        : ratio > 0.4 ? 'neutral' as const
        : ratio > 0.2 ? 'favours_defendant' as const
        : 'strongly_favours_defendant' as const;
      return {
        factor,
        impact,
        explanation: `Appeared in ${counts.claimant + counts.defendant} simulations. Favoured claimant in ${Math.round(ratio * 100)}% of cases.`,
      };
    })
    .sort((a, b) => (factorCounts.get(b.factor)!.claimant + factorCounts.get(b.factor)!.defendant) - (factorCounts.get(a.factor)!.claimant + factorCounts.get(a.factor)!.defendant))
    .slice(0, 8);

  return {
    totalSimulations: total,
    winRate,
    lossRate,
    partialWinRate,
    averageAward: Math.round(avgAward),
    minAward: sortedAwards.length > 0 ? sortedAwards[0] : 0,
    maxAward: sortedAwards.length > 0 ? sortedAwards[sortedAwards.length - 1] : 0,
    medianAward: Math.round(medianAward),
    confidenceScore,
    confidenceLevel,
    settlementRecommendation: {
      shouldSettle,
      recommendedRange: { min: settlementMin, max: settlementMax },
      reasoning: shouldSettle
        ? `With a ${winRate}% win rate and expected recovery of £${expectedRecovery.toLocaleString()}, settling in the range of £${settlementMin.toLocaleString()} – £${settlementMax.toLocaleString()} is commercially sensible given the litigation risk and costs.`
        : `With a ${winRate}% win rate and strong expected recovery of £${expectedRecovery.toLocaleString()}, proceeding to trial is commercially justified. However, a settlement above £${settlementMax.toLocaleString()} should be seriously considered.`,
    },
    simulationDetails: simulations,
    swingFactors,
    costBenefit: {
      estimatedLegalCosts,
      expectedRecovery: Math.round(expectedRecovery),
      netExpectedValue: Math.round(expectedRecovery - estimatedLegalCosts),
      recommendation: expectedRecovery > estimatedLegalCosts * 1.5
        ? 'Proceeding is commercially viable. Expected recovery significantly exceeds estimated costs.'
        : expectedRecovery > estimatedLegalCosts
        ? 'Marginal case. Consider settlement to avoid litigation risk.'
        : 'Costs likely to exceed recovery. Settlement strongly recommended.',
    },
  };
}
