import { executeTask } from '../orchestrator';
import type { AIResponse } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ForensicFinding {
  type:
    | 'date_mismatch'
    | 'signature_issue'
    | 'address_error'
    | 'technical_defect'
    | 'missing_element'
    | 'inconsistency'
    | 'admissibility_risk';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  courtImpact: string;
  recommendation: string;
}

export interface ForensicReport {
  findings: ForensicFinding[];
  overallIntegrity: 'strong' | 'moderate' | 'weak';
  admissibilityRisks: string[];
}

export interface EvidenceItem {
  id: string;
  fileName: string;
  evidenceType: string;
  extractedText: string;
  analysisSummary?: string;
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildForensicSystemPrompt(): string {
  return `You are a forensic document examiner with 20+ years of experience in litigation support. Your analyses are used by barristers and solicitors to assess the strength and admissibility of evidence before court proceedings.

YOUR TASK:
Cross-reference the TARGET DOCUMENT against ALL OTHER EVIDENCE in the claim. Identify any inconsistencies, defects, or risks that could affect admissibility or be exploited by opposing counsel.

CHECK THE FOLLOWING:

1. DATE CONSISTENCY:
   - Do dates in the target document align with dates in other evidence?
   - Are there any impossible date sequences (e.g., a response dated before the letter it responds to)?
   - Are there gaps in the timeline that are unexplained?

2. SIGNATURE AND AUTHENTICATION:
   - Is the document signed where it should be?
   - Are signatures consistent with the purported author across documents?
   - Is there anything suggesting the document may not be authentic?

3. ADDRESS AND IDENTITY MATCHING:
   - Do names, addresses, and identifiers match across documents?
   - Are there discrepancies in how parties are named or identified?

4. TECHNICAL AND FORMATTING REQUIREMENTS:
   - Does the document meet the technical requirements for its type (e.g., proper execution of a deed, witness requirements)?
   - Are there formatting issues that could affect validity?

5. COMPLETENESS:
   - Is the document complete? Are there missing pages, clauses, or schedules referenced but not present?
   - Are there references to other documents that have not been provided?

6. INTERNAL CONSISTENCY:
   - Are there contradictions within the target document itself?
   - Do the numbers add up (financial calculations, dates, quantities)?

7. ADMISSIBILITY RISKS:
   - Could the document be challenged as hearsay?
   - Is there a proper chain of custody/provenance?
   - Would a court accept this document as evidence?

For each finding, assess:
- SEVERITY: "critical" (could sink the claim), "warning" (needs attention), "info" (minor note)
- COURT IMPACT: How would this affect proceedings if raised by the other side?
- RECOMMENDATION: What should the claimant do about it?

RESPONSE FORMAT:
Respond with valid JSON matching this exact structure:
{
  "findings": [
    {
      "type": "date_mismatch|signature_issue|address_error|technical_defect|missing_element|inconsistency|admissibility_risk",
      "severity": "critical|warning|info",
      "title": "...",
      "detail": "...",
      "courtImpact": "...",
      "recommendation": "..."
    }
  ],
  "overallIntegrity": "strong|moderate|weak",
  "admissibilityRisks": ["..."]
}

Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function forensicAnalyze(
  evidence: EvidenceItem,
  allEvidenceInClaim: EvidenceItem[]
): Promise<ForensicReport> {
  const systemPrompt = buildForensicSystemPrompt();

  const otherEvidence = allEvidenceInClaim
    .filter((e) => e.id !== evidence.id)
    .map(
      (e, i) =>
        `--- OTHER EVIDENCE ${i + 1}: ${e.fileName} (${e.evidenceType}) ---\n${e.analysisSummary ?? e.extractedText.slice(0, 2000)}\n`
    )
    .join('\n');

  const userMessage = `TARGET DOCUMENT: ${evidence.fileName} (${evidence.evidenceType})

--- TARGET DOCUMENT TEXT ---
${evidence.extractedText}
--- END TARGET DOCUMENT ---

${otherEvidence ? `ALL OTHER EVIDENCE IN THIS CLAIM:\n${otherEvidence}` : 'No other evidence has been submitted for this claim yet.'}

Perform your forensic analysis now.`;

  const messages = [{ role: 'user', content: userMessage }];

  const response = (await executeTask('forensic_analysis', systemPrompt, messages)) as AIResponse;

  try {
    const cleaned = response.content
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned) as ForensicReport;
  } catch {
    throw new Error(
      `Failed to parse forensic analysis response as JSON. Raw content: ${response.content.slice(0, 500)}`
    );
  }
}
