import { executeTask } from '../orchestrator';
import type { AIResponse, StreamCallbacks } from '../types';
import type { LegalAnalysis } from './legal-agent';

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------

function buildLBASystemPrompt(jurisdiction: string): string {
  return `You are a senior litigation solicitor drafting a formal Letter Before Action (LBA) / Pre-Action Protocol letter for the ${jurisdiction} jurisdiction.

YOUR TASK:
Draft a professional, authoritative Letter Before Action that complies with the pre-action protocol requirements of ${jurisdiction}. The letter must be ready to send on law firm letterhead.

DRAFTING REQUIREMENTS:

1. FORMAT:
   - Use proper legal letter formatting for ${jurisdiction}
   - Include placeholders for law firm details: [FIRM NAME], [FIRM ADDRESS], [REFERENCE]
   - Date the letter appropriately
   - Address the defendant correctly with full name and address
   - Use formal salutation

2. CONTENT STRUCTURE:
   a) Introduction: State who you act for and the purpose of the letter
   b) Background Facts: Set out the relevant facts chronologically and precisely
   c) Legal Basis: State the causes of action clearly, referencing relevant law
   d) Evidence: Reference specific evidence held (without disclosing privileged material)
   e) Case Law: Cite relevant case authorities that support the claim
   f) Losses and Remedies: Itemise the losses suffered and remedies sought, with specific amounts where possible
   g) Deadline: Set a clear 14-day deadline for response
   h) Consequences: Make clear the cost implications of proceeding to court
   i) Pre-Action Protocol Compliance: Reference the applicable protocol
   j) Close: Professional sign-off with partner name placeholder

3. TONE:
   - Professionally authoritative but fair
   - Firm without being aggressive
   - Make the strength of the case apparent
   - The letter should motivate settlement while making clear you are prepared to litigate
   - Every statement must be supportable by the evidence

4. LEGAL PRECISION:
   - Use correct legal terminology for ${jurisdiction}
   - Reference specific statutory provisions where applicable
   - Cite case law properly using the correct citation format
   - Ensure all claims are legally sound

Do NOT wrap the letter in markdown code blocks. Output the letter text directly, ready to be placed on letterhead.`;
}

function buildEvidencePackSystemPrompt(jurisdiction: string): string {
  return `You are a senior litigation solicitor preparing a formal Evidence Pack / Schedule of Evidence for the ${jurisdiction} jurisdiction.

YOUR TASK:
Compile a professional evidence pack document that organises and presents all evidence in support of the claim. This document will accompany the Letter Before Action or court filing.

STRUCTURE:
1. Cover page with claim reference, parties, and date
2. Table of contents
3. Executive summary of the evidence
4. For each piece of evidence:
   - Evidence reference number
   - Document description and type
   - Date of document
   - Relevance to the claim
   - Key excerpts with page/paragraph references
   - Authentication status
5. Chronological timeline derived from the evidence
6. Evidence matrix: mapping each cause of action element to supporting evidence
7. List of any outstanding evidence to be obtained

Format this as a clean, professional document suitable for legal proceedings.
Do NOT wrap in markdown code blocks. Output the document text directly.`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function draftLBA(
  legalAnalysis: LegalAnalysis,
  factsSummary: string,
  evidenceList: { fileName: string; summary: string }[],
  caseLawReferences: { caseName: string; citation: string; keyPrinciple: string }[],
  jurisdiction: string,
  claimantName: string,
  defendantName: string,
  callbacks?: StreamCallbacks
): Promise<AIResponse | void> {
  const systemPrompt = buildLBASystemPrompt(jurisdiction);

  const causesOfActionSummary = legalAnalysis.causesOfAction
    .map(
      (c) =>
        `- ${c.name} (viability: ${c.viability})\n  Elements: ${c.elements.map((e) => `${e.element}: ${e.satisfied ? 'satisfied' : 'NOT satisfied'}`).join('; ')}`
    )
    .join('\n');

  const remediesSummary = legalAnalysis.remedies
    .map((r) => `- ${r.remedy}: ${r.description} (est. ${r.estimatedValue ?? 'TBD'}, likelihood: ${r.likelihood})`)
    .join('\n');

  const evidenceListText = evidenceList
    .map((e, i) => `${i + 1}. ${e.fileName}: ${e.summary}`)
    .join('\n');

  const caseLawText = caseLawReferences
    .map((c) => `- ${c.caseName} [${c.citation}]: ${c.keyPrinciple}`)
    .join('\n');

  const defencesSummary = legalAnalysis.defensesToAnticipate
    .map((d) => `- ${d.defense} (likelihood: ${d.likelihood})`)
    .join('\n');

  const userMessage = `Draft a Letter Before Action with the following details:

CLAIMANT: ${claimantName}
DEFENDANT: ${defendantName}
JURISDICTION: ${jurisdiction}

FACTS:
${factsSummary}

CAUSES OF ACTION:
${causesOfActionSummary}

REMEDIES SOUGHT:
${remediesSummary}

LIMITATION PERIOD: ${legalAnalysis.limitationPeriod.applicablePeriod} (expires: ${legalAnalysis.limitationPeriod.expires}, risk: ${legalAnalysis.limitationPeriod.risk})

EVIDENCE HELD:
${evidenceListText}

SUPPORTING CASE LAW:
${caseLawText}

ANTICIPATED DEFENCES:
${defencesSummary}

COST-BENEFIT:
Estimated Legal Costs: ${legalAnalysis.costBenefit.estimatedLegalCosts}
Estimated Recovery: ${legalAnalysis.costBenefit.estimatedRecovery}

Please draft the Letter Before Action now.`;

  const messages = [{ role: 'user', content: userMessage }];

  return executeTask('claim_drafting', systemPrompt, messages, callbacks);
}

export async function draftEvidencePack(
  factsSummary: string,
  evidenceList: {
    fileName: string;
    summary: string;
    documentType: string;
    keyDates: { date: string; event: string }[];
    keyExcerpts: { text: string; relevance: string }[];
    relevanceScore: number;
    authenticityNotes: string;
  }[],
  causesOfAction: { name: string; elements: { element: string; evidence: string[] }[] }[],
  jurisdiction: string,
  claimantName: string,
  defendantName: string,
  callbacks?: StreamCallbacks
): Promise<AIResponse | void> {
  const systemPrompt = buildEvidencePackSystemPrompt(jurisdiction);

  const evidenceDetailText = evidenceList
    .map(
      (e, i) =>
        `EVIDENCE ${i + 1}: ${e.fileName}
Type: ${e.documentType}
Summary: ${e.summary}
Relevance Score: ${e.relevanceScore}/100
Key Dates: ${e.keyDates.map((d) => `${d.date} — ${d.event}`).join('; ')}
Key Excerpts: ${e.keyExcerpts.map((ex) => `"${ex.text}" (${ex.relevance})`).join('\n  ')}
Authenticity: ${e.authenticityNotes}`
    )
    .join('\n\n');

  const evidenceMatrixText = causesOfAction
    .map(
      (c) =>
        `${c.name}:\n${c.elements.map((el) => `  - ${el.element}: ${el.evidence.join(', ') || 'No evidence'}`).join('\n')}`
    )
    .join('\n\n');

  const userMessage = `Prepare an evidence pack with the following details:

CLAIMANT: ${claimantName}
DEFENDANT: ${defendantName}
JURISDICTION: ${jurisdiction}

FACTS SUMMARY:
${factsSummary}

EVIDENCE:
${evidenceDetailText}

EVIDENCE MATRIX (causes of action mapped to evidence):
${evidenceMatrixText}

Please compile the evidence pack now.`;

  const messages = [{ role: 'user', content: userMessage }];

  return executeTask('claim_drafting', systemPrompt, messages, callbacks);
}
