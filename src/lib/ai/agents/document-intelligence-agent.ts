/**
 * Deep Document Intelligence Agent
 *
 * Goes beyond basic parsing to perform deep forensic intelligence
 * on documents: contract clause analysis, sentiment tracking,
 * communication pattern analysis, financial forensics, metadata
 * cross-referencing, redaction detection, language analysis, and
 * witness identification.
 */

import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContractClauseAnalysis {
  clauseNumber: string | null;
  clauseTitle: string;
  clauseText: string;
  classification: 'standard' | 'unusual' | 'unfair' | 'unenforceable' | 'ambiguous' | 'onerous';
  fairnessRating: number; // 0-100, where 100 is perfectly fair
  enforceability: 'enforceable' | 'likely_enforceable' | 'arguable' | 'likely_unenforceable' | 'unenforceable';
  issues: string[];
  legalBasis: string;
  implicationsForClaim: string;
  recommendation: string;
}

export interface SentimentDataPoint {
  date: string;
  source: string;
  sender: string;
  recipient: string;
  sentiment: number; // -100 to +100
  tone: 'friendly' | 'professional' | 'neutral' | 'terse' | 'frustrated' | 'hostile' | 'threatening' | 'desperate';
  keyPhrases: string[];
  significantShift: boolean;
  shiftAnalysis: string | null;
}

export interface CommunicationPattern {
  pattern: string;
  description: string;
  significance: 'critical' | 'important' | 'notable' | 'minor';
  legalRelevance: string;
  timeframe: string;
  participants: string[];
  evidenceOfPattern: string[];
}

export interface FinancialDiscrepancy {
  type: 'amount_mismatch' | 'missing_payment' | 'double_payment' | 'inflated_amount' | 'undisclosed_fee' | 'timing_issue' | 'currency_issue' | 'vat_issue';
  description: string;
  severity: 'critical' | 'significant' | 'minor';
  amount: string | null;
  expectedAmount: string | null;
  discrepancyAmount: string | null;
  sourceDocuments: string[];
  implication: string;
  recommendation: string;
}

export interface MetadataIntelligence {
  creationDate: string | null;
  lastModified: string | null;
  author: string | null;
  lastModifiedBy: string | null;
  company: string | null;
  revisionCount: number | null;
  printDate: string | null;
  suspiciousMetadata: string[];
  crossReferenceIssues: string[];
  timelineConsistency: 'consistent' | 'inconsistent' | 'suspicious';
  analysis: string;
}

export interface RedactionDetection {
  detected: boolean;
  locations: {
    location: string;
    type: 'visual_redaction' | 'content_gap' | 'missing_page' | 'truncated_text' | 'removed_metadata';
    confidence: number;
    significance: string;
  }[];
  overallAssessment: string;
}

export interface LegallySignificantPhrase {
  phrase: string;
  context: string;
  classification: 'admission' | 'denial' | 'promise' | 'threat' | 'condition' | 'waiver' | 'estoppel' | 'misrepresentation' | 'warranty' | 'indemnity' | 'limitation' | 'exclusion';
  speaker: string;
  date: string | null;
  legalSignificance: string;
  howToUse: string;
  strengthAsEvidence: 'very_strong' | 'strong' | 'moderate' | 'weak';
}

export interface PotentialWitness {
  name: string;
  role: string;
  organisation: string | null;
  mentionedIn: string[];
  relevance: string;
  likelyKnowledge: string[];
  assessedReliability: 'high' | 'medium' | 'low' | 'unknown';
  potentialBias: string;
  recommendedAction: string;
  priority: 'essential' | 'important' | 'useful' | 'background';
}

export interface DeepDocumentIntelligence {
  summary: string;
  documentClassification: string;
  intelligenceGrade: 'A' | 'B' | 'C' | 'D' | 'F';

  contractClauses: ContractClauseAnalysis[];
  sentimentTimeline: SentimentDataPoint[];
  communicationPatterns: CommunicationPattern[];
  financialDiscrepancies: FinancialDiscrepancy[];
  metadataIntelligence: MetadataIntelligence;
  redactionDetection: RedactionDetection;
  legallySignificantPhrases: LegallySignificantPhrase[];
  potentialWitnesses: PotentialWitness[];

  keyFindings: {
    finding: string;
    significance: 'critical' | 'important' | 'notable';
    actionRequired: string;
  }[];

  crossReferenceInsights: {
    insight: string;
    documentsInvolved: string[];
    significance: string;
  }[];

  recommendations: string[];
  warningFlags: string[];
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildDeepAnalysisPrompt(evidenceType: string, jurisdiction: string): string {
  return `You are a forensic document intelligence specialist with expertise in litigation support within the ${jurisdiction} jurisdiction. You combine the skills of a forensic accountant, communications analyst, contract lawyer, and digital forensics expert.

You do not merely read documents — you interrogate them. You find things that others miss: hidden patterns, conspicuous absences, subtle shifts in tone, financial irregularities, and legally explosive phrases that could win or lose a case.

YOUR TASK:
Perform deep forensic intelligence analysis on the provided document (type: ${evidenceType}). Cross-reference with all other evidence in the case to build a comprehensive intelligence picture.

ANALYSIS REQUIREMENTS:

1. CONTRACT CLAUSE ANALYSIS (if document contains contractual terms):
For each significant clause:
- Classify it: standard, unusual, unfair, unenforceable, ambiguous, or onerous
- Rate fairness 0-100
- Assess enforceability under ${jurisdiction} law
- Identify specific issues (e.g., unfair terms under the Consumer Rights Act 2015, unreasonable penalty clauses, restraint of trade issues)
- Explain implications for the claim
- Recommend actions

2. SENTIMENT ANALYSIS OVER TIME:
If the document contains communications (emails, messages, letters):
- Track sentiment over time for each participant
- Use a scale of -100 (hostile/threatening) to +100 (warm/friendly)
- Identify tone: friendly, professional, neutral, terse, frustrated, hostile, threatening, desperate
- Flag significant shifts in sentiment
- Identify the trigger for any deterioration in the relationship

3. COMMUNICATION PATTERN ANALYSIS:
Identify patterns in communications:
- Response times (are they slowing down — avoidance?)
- Escalation points (when did the tone shift?)
- CC patterns (who is being brought in and when?)
- Formality shifts (from first names to "Dear Sir" — relationship breakdown indicator)
- Frequency changes (sudden silence followed by aggressive letter)

4. FINANCIAL FORENSICS:
If the document contains financial information:
- Cross-reference amounts between documents
- Identify discrepancies in invoices, payments, or financial claims
- Flag inflated amounts, missing payments, or double-counting
- Check VAT calculations
- Verify payment timelines against contractual terms

5. METADATA INTELLIGENCE:
Analyse any available metadata:
- Creation and modification dates — do they match the claimed timeline?
- Author information — is it who you would expect?
- Revision history — has it been altered?
- Cross-reference metadata across documents for inconsistencies

6. REDACTION DETECTION:
Check for signs that content has been removed or altered:
- Visual redactions in scanned documents
- Content gaps (missing pages, truncated conversations)
- Metadata suggesting removed content
- Formatting inconsistencies suggesting deletion

7. LEGALLY SIGNIFICANT LANGUAGE:
Extract and classify every legally significant phrase:
- Admissions ("I accept that...", "We did fail to...")
- Denials ("We deny any liability for...")
- Promises ("We will ensure that...")
- Threats ("We will have no choice but to...")
- Conditions ("Provided that...", "Subject to...")
- Waivers ("We will not pursue...")
- Estoppel indicators
- Misrepresentations
For each: who said it, when, and how it can be used in litigation.

8. WITNESS IDENTIFICATION:
Identify every person mentioned across the evidence who could be a witness:
- Name, role, and organisation
- What they are likely to know
- Which documents mention them
- Assessed reliability and potential bias
- Priority for the case (essential, important, useful, background)

9. KEY FINDINGS:
Summarise the most important findings with action items.

10. CROSS-REFERENCE INSIGHTS:
Insights that emerge from comparing this document with other evidence.

11. INTELLIGENCE GRADE:
Rate the overall intelligence value of this document:
- A: Contains case-winning/case-losing material
- B: Highly valuable, significantly advances the case
- C: Useful supporting material
- D: Limited value
- F: No useful intelligence

RESPONSE FORMAT:
Respond with valid JSON matching the DeepDocumentIntelligence structure.

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

function parseDeepAnalysisResponse(content: string): DeepDocumentIntelligence {
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed.summary || !parsed.intelligenceGrade) {
    throw new Error('Response is missing required fields (summary, intelligenceGrade)');
  }

  return parsed as DeepDocumentIntelligence;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function deepAnalyse(
  evidenceText: string,
  evidenceType: string,
  allEvidence: { id: string; filename: string; text: string; type: string }[],
  claimContext: string,
  jurisdiction: string = 'england_wales'
): Promise<DeepDocumentIntelligence> {
  const systemPrompt = buildDeepAnalysisPrompt(evidenceType, jurisdiction);

  const otherEvidenceSummary = allEvidence
    .map(
      (e) =>
        `--- ${e.filename} (${e.type}, ID: ${e.id}) ---\n${e.text.substring(0, 4000)}`
    )
    .join('\n\n');

  const userMessage = `DOCUMENT UNDER ANALYSIS (type: ${evidenceType}):
---
${evidenceText}
---

ALL EVIDENCE IN THE CASE (for cross-reference):
${otherEvidenceSummary || 'No other evidence available.'}

CLAIM CONTEXT:
${claimContext}

Perform deep forensic intelligence analysis on this document, cross-referencing with all other evidence.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('forensic_analysis', systemPrompt, messages)) as AIResponse;

  try {
    return parseDeepAnalysisResponse(response.content);
  } catch (error) {
    throw new Error(
      `Failed to parse deep document intelligence response as JSON: ${error instanceof Error ? error.message : String(error)}. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
