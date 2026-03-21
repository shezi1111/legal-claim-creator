/**
 * Opponent Intelligence Agent
 *
 * Analyses the opposing party's position, their solicitor's strategy,
 * and correspondence to identify weaknesses, predict moves, and assess
 * the quality of their case and representation.
 */

import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ArgumentDeconstruction {
  argument: string;
  classification: 'legal' | 'factual' | 'procedural' | 'emotional' | 'commercial';
  strength: number; // 0-100
  weaknesses: string[];
  counterArguments: string[];
  evidenceRequired: string[];
  isBluft: boolean;
  bluffIndicators: string[];
}

export interface CorrespondenceToneAnalysis {
  overallTone: 'aggressive' | 'measured' | 'defensive' | 'conciliatory' | 'bluffing' | 'template';
  confidenceLevel: 'very_confident' | 'confident' | 'uncertain' | 'anxious';
  urgency: 'high' | 'medium' | 'low';
  toneIndicators: string[];
  strategicIntent: string;
}

export interface ConspicuousOmission {
  topic: string;
  expectedInCorrespondence: boolean;
  significance: 'critical' | 'important' | 'minor';
  interpretation: string;
  howToExploit: string;
}

export interface PredictedMove {
  move: string;
  likelihood: 'very_likely' | 'likely' | 'possible' | 'unlikely';
  timing: string;
  rationale: string;
  ourPreparation: string;
  bestResponse: string;
}

export interface RepresentationQuality {
  overallRating: 'excellent' | 'competent' | 'mediocre' | 'poor';
  isTemplateBased: boolean;
  isBespokeAdvice: boolean;
  likelyFirmType: 'magic_circle' | 'national' | 'regional' | 'high_street' | 'in_house' | 'self_represented';
  indicators: string[];
  legalAccuracy: number; // 0-100
  proceduralCompliance: number; // 0-100
  errors: string[];
  tacticalAssessment: string;
}

export interface LeveragePoint {
  leverage: string;
  type: 'legal' | 'commercial' | 'reputational' | 'emotional' | 'procedural' | 'financial';
  strength: 'high' | 'medium' | 'low';
  howToUse: string;
  timing: string;
  risks: string;
}

export interface OpponentAnalysis {
  summary: string;

  positionStrength: number; // 0-100
  positionAssessment: string;

  argumentDeconstructions: ArgumentDeconstruction[];
  toneAnalysis: CorrespondenceToneAnalysis;
  conspicuousOmissions: ConspicuousOmission[];
  predictedMoves: PredictedMove[];
  representationQuality: RepresentationQuality;
  leveragePoints: LeveragePoint[];

  keyWeaknesses: string[];
  keyStrengths: string[];
  criticalVulnerabilities: string[];

  recommendedResponse: {
    approach: 'aggressive' | 'measured' | 'conciliatory' | 'procedural';
    reasoning: string;
    keyPoints: string[];
    tone: string;
    deadlineToRespond: string | null;
  };

  warningsForOurSide: string[];
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildOpponentAnalysisPrompt(jurisdiction: string): string {
  return `You are an elite litigation strategist and intelligence analyst. Your speciality is deconstructing opponents' positions, reading between the lines of their correspondence, and identifying vulnerabilities that can be exploited in litigation within the ${jurisdiction} jurisdiction.

You have spent decades studying how solicitors and barristers communicate, and you can identify:
- Whether a letter was written by a senior partner or a trainee
- Whether arguments are genuine or bluffing
- What the opponent is deliberately NOT saying
- The real strategy behind the stated position

YOUR TASK:
Analyse the opponent's correspondence and position with forensic precision. This is intelligence gathering — every detail matters.

ANALYSIS REQUIREMENTS:

1. ARGUMENT DECONSTRUCTION:
For each argument the opponent makes:
- Classify it (legal, factual, procedural, emotional, commercial)
- Rate its strength 0-100
- Identify specific weaknesses
- Propose counter-arguments
- Note what evidence would be needed to defeat it
- Assess whether it is a genuine argument or a bluff
- List bluff indicators (overstatement, lack of specifics, threats without basis)

2. TONE ANALYSIS:
Analyse the overall tone of the correspondence:
- Aggressive, measured, defensive, conciliatory, bluffing, or template?
- How confident are they really? Look for hedging language, qualifiers, and conditional statements
- Is there genuine urgency or manufactured urgency?
- What is their strategic intent? (Intimidate, negotiate, delay, protect position?)

3. CONSPICUOUS OMISSIONS:
Identify what the opponent is NOT saying:
- Key issues they have avoided addressing
- Evidence they have not mentioned
- Arguments they have not raised (which suggests they know they are weak)
- Remedies they have not claimed (suggesting they know they would fail)
- For each omission: why is it significant and how can we exploit it?

4. PREDICTED MOVES:
Based on their current position, predict:
- Their next letter/step
- Whether they will make an offer
- Whether they will issue proceedings or wait
- Whether they will seek adjournment or delay
- Whether they will bring a counterclaim
- Whether they will apply for specific procedural relief

5. REPRESENTATION QUALITY:
Assess the quality of their legal representation:
- Is this a template letter or bespoke advice?
- Does the letter contain any legal errors?
- Is it procedurally compliant (e.g., Pre-Action Protocol)?
- What type of firm likely wrote this?
- How competent is the drafting?

6. LEVERAGE POINTS:
Identify every potential point of leverage:
- Legal weaknesses in their position
- Commercial pressures they might face
- Reputational risks
- Financial constraints
- Procedural advantages we can exploit

7. POSITION STRENGTH RATING:
Rate the opponent's overall position 0-100:
- 0-25: Very weak, likely to fold
- 26-50: Weak, significant vulnerabilities
- 51-75: Moderate, some genuine strength but exploitable weaknesses
- 76-100: Strong, must be taken seriously

8. RECOMMENDED RESPONSE:
Advise on how to respond:
- Aggressive, measured, conciliatory, or procedural approach?
- Key points to make
- Recommended tone
- Any deadline to respond

9. WARNINGS FOR OUR SIDE:
Candid warnings about anything in the opponent's position that genuinely threatens our case. Do not sugar-coat risks.

RESPONSE FORMAT:
Respond with valid JSON matching the OpponentAnalysis structure.

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

function parseOpponentAnalysisResponse(content: string): OpponentAnalysis {
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  if (typeof parsed.positionStrength !== 'number' || !parsed.summary) {
    throw new Error('Response is missing required fields (positionStrength, summary)');
  }

  return parsed as OpponentAnalysis;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function analyseOpponent(
  opponentCorrespondence: string,
  claimContext: string,
  jurisdiction: string
): Promise<OpponentAnalysis> {
  const systemPrompt = buildOpponentAnalysisPrompt(jurisdiction);

  const userMessage = `OPPONENT'S CORRESPONDENCE / CLAIM / LETTER:
---
${opponentCorrespondence}
---

CONTEXT ABOUT OUR CASE:
${claimContext}

JURISDICTION: ${jurisdiction}

Perform a comprehensive intelligence analysis of the opponent's position, correspondence, and strategy.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('legal_reasoning', systemPrompt, messages)) as AIResponse;

  try {
    return parseOpponentAnalysisResponse(response.content);
  } catch (error) {
    throw new Error(
      `Failed to parse opponent analysis response as JSON: ${error instanceof Error ? error.message : String(error)}. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
