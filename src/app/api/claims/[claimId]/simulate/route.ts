import { NextRequest, NextResponse } from 'next/server';
import type { SimulationResult, SingleSimulation } from '@/lib/ai/agents/simulation-agent';
import { aggregateResults, JUDGE_PERSONAS } from '@/lib/ai/agents/simulation-agent';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  const { claimId } = await params;
  const body = await request.json();
  const {
    side = 'claimant',
    numberOfSimulations = 30,
  } = body;

  try {
    // In production, this would:
    // 1. Check the user has a paid subscription
    // 2. Load the full claim/defence from the database
    // 3. Build the opposition's case using the opposition agent
    // 4. Run N simulations across different AI models and judge personas
    // 5. Aggregate results and return

    // For V1 demo, generate realistic simulation results
    const simulations = generateDemoSimulations(numberOfSimulations, side);
    const results = aggregateResults(simulations, 8000);

    const fullResult: SimulationResult = {
      claimId,
      side,
      completedAt: new Date().toISOString(),
      ...results,
    };

    return NextResponse.json(fullResult);
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: 'Simulation failed' },
      { status: 500 }
    );
  }
}

/**
 * Generate realistic demo simulation data
 */
function generateDemoSimulations(
  count: number,
  side: string
): SingleSimulation[] {
  const models = ['claude-sonnet-4-20250514', 'gpt-4-turbo', 'gemini-1.5-pro'];
  const simulations: SingleSimulation[] = [];

  // Base win rate depends on side (claimant typically has slight advantage in demo)
  const baseWinRate = side === 'claimant' ? 0.75 : 0.55;

  for (let i = 0; i < count; i++) {
    const persona = JUDGE_PERSONAS[i % JUDGE_PERSONAS.length];
    const model = models[i % models.length];

    // Add some randomness but keep it around the base rate
    const random = seededRandom(i + 42);
    const wins = random < baseWinRate;
    const isPartial = random > baseWinRate - 0.1 && random < baseWinRate + 0.1;

    let outcome: SingleSimulation['outcome'];
    let awardAmount: number;

    if (isPartial) {
      outcome = 'partial';
      awardAmount = Math.round(35000 + seededRandom(i + 100) * 40000);
    } else if (wins) {
      outcome = 'claimant_wins';
      awardAmount = Math.round(45000 + seededRandom(i + 200) * 80000);
    } else {
      outcome = 'defendant_wins';
      awardAmount = 0;
    }

    const keyFactors = getKeyFactors(outcome, persona.temperament);

    simulations.push({
      simulationNumber: i + 1,
      model,
      judgePersona: persona.name,
      outcome,
      awardAmount,
      reasoning: getReasoningSummary(outcome, persona.name, awardAmount),
      keyFactors,
      claimsSucceeded: outcome === 'claimant_wins'
        ? ['Wrongful Dismissal', 'Breach of Contract (Notice Period)', 'Unfair Dismissal']
        : outcome === 'partial'
        ? ['Breach of Contract (Notice Period)']
        : [],
      claimsFailed: outcome === 'defendant_wins'
        ? ['Wrongful Dismissal', 'Whistleblower Retaliation']
        : outcome === 'partial'
        ? ['Wrongful Dismissal', 'Whistleblower Retaliation']
        : [],
    });
  }

  return simulations;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function getKeyFactors(outcome: string, temperament: string): string[] {
  const factors: Record<string, string[]> = {
    claimant_wins: [
      'WhatsApp messages showing management intent to dismiss',
      'Failure to follow ACAS Code of Practice',
      'No prior warnings before summary dismissal',
      'Timing of client complaint relative to grievance',
      'Clear contractual notice period breached',
    ],
    defendant_wins: [
      'Client complaint provided legitimate grounds',
      'Gross misconduct clause in contract was broad',
      'Grievance process was still ongoing',
      'Insufficient evidence of causal link to whistleblowing',
    ],
    partial: [
      'Contract breach clear but misconduct partially established',
      'Notice period damages awarded but unfair dismissal claim dismissed',
      'Procedural failures noted but substantive fairness arguable',
    ],
  };

  const base = factors[outcome] || factors['partial'];
  // Add temperament-specific factor
  if (temperament === 'procedural') {
    base.push('Strict application of procedural requirements');
  } else if (temperament === 'liberal') {
    base.push('Weight given to employee vulnerability and power imbalance');
  }

  return base.slice(0, 4);
}

function getReasoningSummary(outcome: string, persona: string, award: number): string {
  if (outcome === 'claimant_wins') {
    return `The ${persona} found in favour of the claimant. The court determined that the dismissal was both wrongful and unfair. The WhatsApp evidence was particularly compelling in establishing that the decision to dismiss was made before the investigation concluded. An award of £${award.toLocaleString()} was made comprising notice period damages, compensatory award, and ACAS uplift.`;
  } else if (outcome === 'defendant_wins') {
    return `The ${persona} found in favour of the defendant. While procedural irregularities were noted, the court accepted that the client complaint constituted a genuine basis for disciplinary action. The claimant failed to establish on the balance of probabilities that the dismissal was connected to the grievance.`;
  } else {
    return `The ${persona} made a split finding. The breach of contract claim for the notice period succeeded, but the unfair dismissal claim failed on substantive grounds. An award of £${award.toLocaleString()} was limited to contractual damages only.`;
  }
}
