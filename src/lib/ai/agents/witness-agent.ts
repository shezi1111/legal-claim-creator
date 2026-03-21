/**
 * Witness Statement Agent
 *
 * Records and formats witness statements in the proper legal format.
 * Uses conversational AI to guide the witness through giving their statement,
 * then compiles it into a court-ready document.
 */

import type { AIResponse } from '../types';

export interface WitnessStatement {
  witnessName: string;
  witnessAddress: string;
  witnessOccupation: string;
  relationship: string;
  statementDate: string;
  paragraphs: string[];
  exhibitReferences: string[];
  jurisdiction: string;
}

/**
 * System prompt for the witness statement intake conversation
 */
export function getWitnessIntakePrompt(
  claimContext: string,
  jurisdiction: string,
  witnessType: 'claimant' | 'third_party'
): string {
  const jurisdictionNote = jurisdiction === 'england_wales'
    ? `Format according to CPR Part 32 and Practice Direction 32.
       The statement must include:
       - Statement of truth: "I believe that the facts stated in this witness statement are true.
         I understand that proceedings for contempt of court may be brought against anyone who makes,
         or causes to be made, a false statement in a document verified by a statement of truth without
         an honest belief in its truth."
       - Numbered paragraphs
       - Exhibit references in format [XX/1], [XX/2]`
    : jurisdiction === 'us_federal'
    ? `Format according to Federal Rules of Civil Procedure.
       Include a declaration under penalty of perjury (28 U.S.C. § 1746).`
    : `Format according to local court rules for ${jurisdiction}.`;

  return `You are an experienced litigation solicitor taking a witness statement for legal proceedings.

CLAIM CONTEXT:
${claimContext}

WITNESS TYPE: ${witnessType === 'claimant' ? 'Claimant (party to the claim)' : 'Third-party witness'}

YOUR TASK:
Guide the witness through providing their statement by asking clear, structured questions.

APPROACH:
1. Start by confirming the witness's full name, address, and occupation
2. Establish their relationship to the matter/parties
3. Ask them to describe events chronologically
4. For each event, ask:
   - When exactly did this happen?
   - Where were you?
   - Who else was present?
   - What was said? (try to get direct quotes where possible)
   - Do you have any documents or evidence related to this? (these become exhibits)
5. Ask about anything they directly saw, heard, or experienced (not hearsay)
6. Clarify any ambiguities or gaps in the chronology
7. When complete, compile the statement

RULES:
- Only include what the witness directly perceived (saw, heard, did)
- Flag any hearsay and explain it cannot go in the statement
- Use the witness's own words as much as possible
- Number every paragraph
- Reference exhibits where the witness mentions documents
- Keep language clear and factual — no opinions, arguments, or legal conclusions
- ${jurisdictionNote}

When you have gathered enough information, output the complete formatted witness statement.`;
}

/**
 * Generate a formatted witness statement document
 */
export function formatWitnessStatement(
  statement: WitnessStatement
): string {
  const { jurisdiction } = statement;

  if (jurisdiction === 'england_wales') {
    return formatEnglandWalesStatement(statement);
  } else if (jurisdiction.startsWith('us')) {
    return formatUSStatement(statement);
  }
  return formatGenericStatement(statement);
}

function formatEnglandWalesStatement(s: WitnessStatement): string {
  const initials = s.witnessName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  let doc = `# WITNESS STATEMENT OF ${s.witnessName.toUpperCase()}\n\n`;
  doc += `**Claim No.:** [To be assigned]\n\n`;
  doc += `---\n\n`;
  doc += `I, **${s.witnessName}**, of ${s.witnessAddress}, ${s.witnessOccupation}, will say as follows:\n\n`;

  s.paragraphs.forEach((para, i) => {
    doc += `${i + 1}. ${para}\n\n`;
  });

  if (s.exhibitReferences.length > 0) {
    doc += `---\n\n`;
    doc += `## Exhibits\n\n`;
    s.exhibitReferences.forEach((exhibit, i) => {
      doc += `- **[${initials}/${i + 1}]** — ${exhibit}\n`;
    });
    doc += `\n`;
  }

  doc += `---\n\n`;
  doc += `## Statement of Truth\n\n`;
  doc += `I believe that the facts stated in this witness statement are true. I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.\n\n`;
  doc += `**Signed:** ________________________\n\n`;
  doc += `**Full name:** ${s.witnessName}\n\n`;
  doc += `**Date:** ${s.statementDate}\n\n`;

  return doc;
}

function formatUSStatement(s: WitnessStatement): string {
  let doc = `# DECLARATION OF ${s.witnessName.toUpperCase()}\n\n`;
  doc += `I, **${s.witnessName}**, declare under penalty of perjury under the laws of the United States of America that the following is true and correct:\n\n`;

  s.paragraphs.forEach((para, i) => {
    doc += `${i + 1}. ${para}\n\n`;
  });

  doc += `---\n\n`;
  doc += `Executed on ${s.statementDate}.\n\n`;
  doc += `**Signature:** ________________________\n\n`;
  doc += `**${s.witnessName}**\n`;
  doc += `${s.witnessAddress}\n`;

  return doc;
}

function formatGenericStatement(s: WitnessStatement): string {
  let doc = `# WITNESS STATEMENT\n\n`;
  doc += `## Statement of ${s.witnessName}\n\n`;
  doc += `**Address:** ${s.witnessAddress}\n`;
  doc += `**Occupation:** ${s.witnessOccupation}\n`;
  doc += `**Date:** ${s.statementDate}\n\n`;
  doc += `---\n\n`;

  s.paragraphs.forEach((para, i) => {
    doc += `${i + 1}. ${para}\n\n`;
  });

  doc += `---\n\n`;
  doc += `I confirm that the contents of this statement are true to the best of my knowledge and belief.\n\n`;
  doc += `**Signed:** ________________________\n\n`;
  doc += `**${s.witnessName}**\n`;
  doc += `**Date:** ${s.statementDate}\n`;

  return doc;
}
