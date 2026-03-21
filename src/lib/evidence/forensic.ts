/**
 * Forensic Analysis Engine
 * Cross-references evidence for inconsistencies, technical defects,
 * and admissibility risks that could affect the claim in court.
 */

export interface ForensicFinding {
  type: ForensicFindingType;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  courtImpact: string;
  recommendation: string;
  evidenceIds: string[];
}

export type ForensicFindingType =
  | 'date_mismatch'
  | 'signature_issue'
  | 'address_error'
  | 'technical_defect'
  | 'missing_element'
  | 'inconsistency'
  | 'admissibility_risk';

export const FORENSIC_SEVERITY_COLORS = {
  critical: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const FORENSIC_SEVERITY_LABELS = {
  critical: 'Critical Issue',
  warning: 'Warning',
  info: 'Note',
};

/**
 * System prompt for forensic analysis AI
 */
export function getForensicPrompt(
  currentEvidence: { id: string; filename: string; text: string; type: string },
  allEvidence: { id: string; filename: string; text: string; type: string }[],
  claimContext: string
): string {
  const otherEvidence = allEvidence
    .filter(e => e.id !== currentEvidence.id)
    .map(e => `--- ${e.filename} (${e.type}) ---\n${e.text.substring(0, 3000)}`)
    .join('\n\n');

  return `You are a forensic document examiner and legal admissibility specialist. Analyze the following evidence for any issues that could affect its use in court proceedings.

CLAIM CONTEXT:
${claimContext}

DOCUMENT UNDER EXAMINATION:
Filename: ${currentEvidence.filename}
Type: ${currentEvidence.type}
Content:
${currentEvidence.text.substring(0, 5000)}

OTHER EVIDENCE IN THIS CLAIM (for cross-reference):
${otherEvidence || 'No other evidence yet.'}

Perform the following checks:

1. DATE CONSISTENCY: Compare all dates in this document against dates in other evidence. Flag any mismatches, impossible timelines, or suspicious date sequences.

2. SIGNATURE & AUTHENTICATION: Check for mentions of signatures, whether documents appear to be properly executed, and note any concerns about authenticity.

3. ADDRESS & PARTY CONSISTENCY: Verify names, addresses, company names, and references match across all evidence.

4. TECHNICAL DEFECTS: Identify any technical issues that could get this evidence excluded or challenged in court:
   - Missing signatures where required
   - Undated documents
   - Unsigned variations or amendments
   - Incorrect party names or references
   - Format issues that violate document requirements

5. COMPLETENESS: Note if the document appears incomplete, if pages might be missing, or if referenced attachments/schedules are absent.

6. INCONSISTENCIES: Flag any statements in this document that contradict statements in other evidence, or internal contradictions.

7. ADMISSIBILITY RISKS: Identify anything opposing counsel could use to challenge this evidence in court.

Return a JSON array of findings. Each finding must have:
- type: one of [date_mismatch, signature_issue, address_error, technical_defect, missing_element, inconsistency, admissibility_risk]
- severity: "critical" (could invalidate evidence), "warning" (should be addressed), or "info" (worth noting)
- title: short description (5-10 words)
- detail: full explanation of the finding
- courtImpact: how this could affect the case in court
- recommendation: what action to take to address this

Be thorough but fair. Only flag genuine concerns, not speculative issues.`;
}

/**
 * Parse forensic analysis AI response
 */
export function parseForensicResponse(
  aiResponse: string,
  evidenceId: string
): ForensicFinding[] {
  try {
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((f: Record<string, unknown>) => f.type && f.title && f.detail)
      .map((f: Record<string, unknown>) => ({
        type: f.type as ForensicFindingType,
        severity: (f.severity as 'critical' | 'warning' | 'info') || 'info',
        title: String(f.title),
        detail: String(f.detail),
        courtImpact: String(f.courtImpact || 'No specific court impact identified.'),
        recommendation: String(f.recommendation || 'No specific recommendation.'),
        evidenceIds: [evidenceId],
      }));
  } catch {
    console.error('Failed to parse forensic response');
    return [];
  }
}

/**
 * Calculate overall evidence integrity score
 */
export function calculateIntegrity(
  findings: ForensicFinding[]
): 'strong' | 'moderate' | 'weak' {
  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const warningCount = findings.filter(f => f.severity === 'warning').length;

  if (criticalCount >= 2) return 'weak';
  if (criticalCount >= 1 || warningCount >= 3) return 'moderate';
  return 'strong';
}
