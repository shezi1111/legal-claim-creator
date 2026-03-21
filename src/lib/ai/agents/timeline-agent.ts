/**
 * Intelligent Timeline Builder
 *
 * Goes beyond plotting dates to create an analytical, cross-referenced
 * timeline: extracts dates from all sources, identifies gaps, calculates
 * limitation periods, spots suspicious timing patterns, marks legal
 * milestones, generates a narrative chronology, and produces a
 * court-ready chronology document.
 */

import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TimelineEntry {
  date: string;
  datePrecision: 'exact' | 'approximate' | 'month' | 'year' | 'inferred';
  time: string | null;
  title: string;
  description: string;
  category: 'agreement' | 'breach' | 'communication' | 'payment' | 'legal_action' | 'employment' | 'performance' | 'dispute' | 'negotiation' | 'external' | 'other';
  significance: 'critical' | 'important' | 'notable' | 'background';
  source: {
    evidenceId: string | null;
    evidenceFilename: string | null;
    messageIndex: number | null;
    sourceType: 'evidence' | 'conversation' | 'inferred' | 'public_record';
  };
  parties: string[];
  legalRelevance: string;
  isDisputed: boolean;
  disputeNote: string | null;
}

export interface TimelineGap {
  periodStart: string;
  periodEnd: string;
  duration: string;
  description: string;
  significance: 'critical' | 'important' | 'minor';
  expectedEvents: string[];
  possibleExplanations: string[];
  investigationNeeded: string;
  impact: string;
}

export interface LimitationCalculation {
  causeOfAction: string;
  limitationPeriod: string;
  statutoryBasis: string;
  accrualDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'expired' | 'critical' | 'approaching' | 'safe';
  extensionPossible: boolean;
  extensionBasis: string | null;
  notes: string;
}

export interface SuspiciousPattern {
  pattern: string;
  description: string;
  involvedDates: string[];
  significance: 'critical' | 'important' | 'notable';
  possibleInference: string;
  howToInvestigate: string;
  howToArgue: string;
}

export interface CrossReferenceIssue {
  issue: string;
  description: string;
  date1: { date: string; source: string };
  date2: { date: string; source: string };
  discrepancy: string;
  significance: 'critical' | 'important' | 'minor';
  resolution: string;
}

export interface LegalMilestone {
  date: string;
  milestone: string;
  type: 'contract_formation' | 'breach' | 'notification' | 'demand' | 'limitation_trigger' | 'limitation_expiry' | 'pre_action' | 'proceedings' | 'disclosure' | 'trial' | 'other';
  legalSignificance: string;
  actionRequired: string | null;
  deadline: boolean;
}

export interface NarrativeChronology {
  title: string;
  overview: string;
  chapters: {
    title: string;
    periodCovered: string;
    narrative: string;
    keyEvents: string[];
    significance: string;
  }[];
  conclusion: string;
}

export interface CourtChronology {
  title: string;
  parties: string;
  preparedBy: string;
  entries: {
    date: string;
    event: string;
    document: string | null;
    bundleRef: string | null;
    notes: string | null;
  }[];
}

export interface IntelligentTimeline {
  summary: string;
  totalEvents: number;
  dateRange: { earliest: string; latest: string };
  completenessScore: number; // 0-100

  entries: TimelineEntry[];
  gaps: TimelineGap[];
  limitationCalculations: LimitationCalculation[];
  suspiciousPatterns: SuspiciousPattern[];
  crossReferenceIssues: CrossReferenceIssue[];
  legalMilestones: LegalMilestone[];
  narrativeChronology: NarrativeChronology;
  courtChronology: CourtChronology;

  keyDates: {
    date: string;
    event: string;
    whyKey: string;
  }[];

  urgentDeadlines: {
    deadline: string;
    description: string;
    consequence: string;
    daysRemaining: number;
  }[];

  evidenceCoverage: {
    period: string;
    evidenceAvailable: string[];
    gapScore: number; // 0-100, where 0 is fully covered
  }[];

  recommendations: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildTimelinePrompt(jurisdiction: string): string {
  return `You are an elite litigation support specialist and chronologist working within the ${jurisdiction} jurisdiction. You are renowned for your ability to construct timelines that tell the story of a case so clearly that judges and juries immediately understand the narrative.

You do not merely list dates — you build an intelligent, analytical chronology that:
- Identifies what happened and when, with forensic precision
- Spots gaps and inconsistencies that others miss
- Reveals patterns that expose lies, delays, and bad faith
- Calculates every relevant deadline automatically
- Cross-references every date against every piece of evidence
- Produces a court-ready chronology that would satisfy the strictest judge

YOUR TASK:
Build a comprehensive intelligent timeline from all available sources: conversation transcripts, uploaded evidence, emails, WhatsApp messages, contracts, letters, and any other documents.

ANALYSIS REQUIREMENTS:

1. TIMELINE ENTRIES:
Extract EVERY date from ALL sources:
- Explicit dates mentioned in documents
- Dates inferred from context ("last Tuesday", "three weeks later")
- Dates from email headers and message timestamps
- Contractual dates (commencement, expiry, renewal)
- Payment dates from invoices and bank statements
For each entry:
- Exact date and time (if available)
- Date precision (exact, approximate, month, year, or inferred)
- Title and description
- Category (agreement, breach, communication, payment, legal_action, etc.)
- Significance (critical, important, notable, background)
- Source (which evidence or conversation)
- Parties involved
- Legal relevance
- Whether the date is disputed

2. GAP ANALYSIS:
Identify periods where the timeline is thin or silent:
- What period is the gap?
- What events would you expect to have occurred?
- Why is the gap significant?
- What investigation is needed to fill it?
- How does the gap affect the case?

3. LIMITATION CALCULATIONS:
For each potential cause of action:
- What is the limitation period?
- What statutory provision applies?
- When did time start running (accrual date)?
- When does it expire?
- How many days remain from today?
- Is extension possible?

4. SUSPICIOUS TIMING PATTERNS:
Identify timing that seems suspicious:
- Was a complaint filed suspiciously close to a protected act?
- Did the opponent delay responding at key moments?
- Were documents created or modified at suspicious times?
- Is there a pattern of escalation timed to create pressure?
- Were key decisions made unusually quickly or slowly?

5. CROSS-REFERENCE ANALYSIS:
Compare dates between different pieces of evidence:
- Do the dates in the contract match the dates in correspondence?
- Are there contradictions between different accounts of when events occurred?
- Do email timestamps match the claimed timeline?

6. LEGAL MILESTONES:
Mark every legally significant milestone:
- Contract formation / variation / termination
- Breach events
- Notification dates (when parties were informed)
- Demand dates
- Limitation trigger events
- Pre-action protocol dates
- Filing deadlines

7. NARRATIVE CHRONOLOGY:
Write the story of the case as a clear narrative:
- Break it into chapters
- Explain the significance of each period
- Use plain language suitable for a judge

8. COURT CHRONOLOGY:
Generate a formal chronology in the format required for ${jurisdiction} courts:
- Date | Event | Document Reference | Bundle Reference | Notes
- Neutral, factual language
- Every entry sourced to a document

9. KEY DATES:
Highlight the 5-10 most important dates and explain why they matter.

10. URGENT DEADLINES:
Flag any deadlines approaching within the next 6 months that require action.

TODAY'S DATE: ${new Date().toISOString().split('T')[0]}
Use this to calculate days remaining and deadline urgency.

RESPONSE FORMAT:
Respond with valid JSON matching the IntelligentTimeline structure.

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

function parseTimelineResponse(content: string): IntelligentTimeline {
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed.summary || !Array.isArray(parsed.entries)) {
    throw new Error('Response is missing required fields (summary, entries)');
  }

  return parsed as IntelligentTimeline;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function buildTimeline(
  messages: { role: string; content: string; createdAt?: string }[],
  evidence: { id: string; filename: string; text: string; type: string; createdAt?: string }[],
  claimContext: string,
  jurisdiction: string
): Promise<IntelligentTimeline> {
  const systemPrompt = buildTimelinePrompt(jurisdiction);

  const conversationSummary = messages
    .map(
      (m, i) =>
        `[${m.createdAt || `Message ${i + 1}`}] ${m.role.toUpperCase()}: ${m.content.substring(0, 2000)}`
    )
    .join('\n\n');

  const evidenceSummary = evidence
    .map(
      (e) =>
        `--- ${e.filename} (${e.type}, ID: ${e.id}, uploaded: ${e.createdAt || 'unknown'}) ---\n${e.text.substring(0, 5000)}`
    )
    .join('\n\n');

  const userMessage = `CLAIM CONTEXT:
${claimContext}

CONVERSATION TRANSCRIPT:
${conversationSummary || 'No conversation messages available.'}

EVIDENCE DOCUMENTS:
${evidenceSummary || 'No evidence documents available.'}

JURISDICTION: ${jurisdiction}
TODAY'S DATE: ${new Date().toISOString().split('T')[0]}

Build a comprehensive intelligent timeline from all available sources. Extract every date, identify gaps, calculate limitation periods, spot suspicious patterns, and generate both a narrative and court-ready chronology.`;

  const messages_ = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('evidence_analysis', systemPrompt, messages_)) as AIResponse;

  try {
    return parseTimelineResponse(response.content);
  } catch (error) {
    throw new Error(
      `Failed to parse timeline response as JSON: ${error instanceof Error ? error.message : String(error)}. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
