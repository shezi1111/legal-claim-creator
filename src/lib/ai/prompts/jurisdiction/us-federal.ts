/**
 * Jurisdiction-specific context for US Federal courts.
 */

export const JURISDICTION_NAME = 'United States (Federal)';
export const JURISDICTION_CODE = 'us-federal';

// ---------------------------------------------------------------------------
// Legal system overview
// ---------------------------------------------------------------------------

export const LEGAL_SYSTEM_OVERVIEW = `The United States Federal court system is established under Article III of the U.S. Constitution. Federal courts have limited jurisdiction and may only hear cases involving:
1. Federal questions — claims arising under the Constitution, federal statutes, or treaties (28 U.S.C. § 1331)
2. Diversity jurisdiction — disputes between citizens of different states where the amount in controversy exceeds $75,000 (28 U.S.C. § 1332)
3. Supplemental jurisdiction — related state-law claims in the same case (28 U.S.C. § 1367)

The system is adversarial. The burden of proof in civil cases is preponderance of the evidence (more likely than not), except in certain fraud cases requiring clear and convincing evidence.`;

// ---------------------------------------------------------------------------
// Court structure
// ---------------------------------------------------------------------------

export const COURT_STRUCTURE = `Federal Court Hierarchy (ascending):
1. U.S. District Courts — Trial courts of general federal jurisdiction. 94 districts across 50 states, D.C., and territories. Each district has at least one judge.
2. U.S. Courts of Appeals (Circuit Courts) — 13 circuits: 11 numbered circuits, the D.C. Circuit, and the Federal Circuit (patent, trade, government contracts). Three-judge panels review district court decisions.
3. U.S. Supreme Court — Final court of appeal. Certiorari jurisdiction (discretionary review). Nine justices.

Specialised Courts: U.S. Bankruptcy Courts, U.S. Tax Court, U.S. Court of Federal Claims, U.S. Court of International Trade.

Note: Many civil claims will be filed in state court rather than federal court unless federal question or diversity jurisdiction applies.`;

// ---------------------------------------------------------------------------
// Federal Rules of Civil Procedure (FRCP) references
// ---------------------------------------------------------------------------

export const FRCP_REFERENCES = {
  complaint: 'FRCP Rule 8(a) — A complaint must contain: (1) a short and plain statement of the grounds for jurisdiction, (2) a short and plain statement of the claim showing the pleader is entitled to relief, and (3) a demand for the relief sought.',
  service: 'FRCP Rule 4 — Summons and complaint must be served on the defendant within 90 days of filing.',
  answer: 'FRCP Rule 12(a) — The defendant must serve an answer within 21 days after being served with the summons and complaint (60 days if the defendant waives service).',
  motionToDismiss: 'FRCP Rule 12(b) — Defenses including lack of jurisdiction, failure to state a claim (12(b)(6)), and others must be raised by motion before the responsive pleading.',
  discovery: 'FRCP Rules 26-37 — Discovery includes mandatory initial disclosures (Rule 26(a)), depositions, interrogatories, requests for production of documents, requests for admission, and physical/mental examinations.',
  summaryJudgment: 'FRCP Rule 56 — A party may move for summary judgment on any claim or defense. The court shall grant summary judgment if there is no genuine dispute as to any material fact and the movant is entitled to judgment as a matter of law.',
  classAction: 'FRCP Rule 23 — Requirements for maintaining a class action: numerosity, commonality, typicality, and adequacy of representation.',
  costs: 'FRCP Rule 54(d) — Costs other than attorney fees shall be allowed to the prevailing party unless the court directs otherwise. Each party typically bears its own attorney fees (the "American Rule") unless a statute or contract provides otherwise.',
  offerOfJudgment: 'FRCP Rule 68 — A party defending against a claim may serve an offer of judgment. If the offeree rejects it and fails to obtain a more favorable judgment, the offeree must pay costs incurred after the offer was made.',
  injunctions: 'FRCP Rule 65 — Temporary restraining orders and preliminary injunctions.',
  defaultJudgment: 'FRCP Rule 55 — Default and default judgment when a party fails to plead or otherwise defend.',
};

// ---------------------------------------------------------------------------
// Statutes of limitation (federal claims)
// ---------------------------------------------------------------------------

export const LIMITATION_PERIODS: Record<string, { period: string; statute: string; notes: string }> = {
  contract: {
    period: 'Varies by state (typically 3-6 years); no general federal statute of limitations for contract',
    statute: 'State law applies unless a federal statute specifies otherwise',
    notes: 'For federal government contracts, the Contract Disputes Act provides a 6-year statute of limitations (41 U.S.C. § 7103).',
  },
  civil_rights_section_1983: {
    period: 'Varies by state (borrows state personal injury statute of limitations, typically 1-3 years)',
    statute: '42 U.S.C. § 1983; Wilson v. Garcia, 471 U.S. 261 (1985)',
    notes: 'Federal law determines when the claim accrues; state law provides the limitations period.',
  },
  employment_discrimination_title_vii: {
    period: '180 days to file charge with EEOC (300 days in states with a state/local agency)',
    statute: 'Title VII of the Civil Rights Act of 1964, 42 U.S.C. § 2000e-5(e)',
    notes: 'After receiving a right-to-sue letter, the plaintiff has 90 days to file suit.',
  },
  employment_discrimination_ada: {
    period: 'Same as Title VII (180/300 days to EEOC)',
    statute: 'Americans with Disabilities Act, 42 U.S.C. § 12117',
    notes: 'Follows Title VII procedures.',
  },
  employment_discrimination_adea: {
    period: '180 days to file charge with EEOC (300 days in deferral states)',
    statute: 'Age Discrimination in Employment Act, 29 U.S.C. § 626(d)',
    notes: 'A right-to-sue letter is not required but may be requested after 60 days.',
  },
  patent_infringement: {
    period: '6 years (damages limited to 6 years before filing)',
    statute: '35 U.S.C. § 286',
    notes: 'No statute of limitations on injunctive relief. Laches defense may apply.',
  },
  antitrust: {
    period: '4 years from the date the cause of action accrued',
    statute: 'Clayton Act, 15 U.S.C. § 15b',
    notes: 'The statute is tolled during pendency of a government enforcement action.',
  },
  securities_fraud: {
    period: '2 years from discovery of the violation, but not more than 5 years from the violation itself',
    statute: '28 U.S.C. § 1658(b); Sarbanes-Oxley Act',
    notes: 'The "inquiry notice" standard applies to determine the discovery date.',
  },
  personal_injury_tort: {
    period: 'Varies by state (typically 1-6 years); federal tort claims: 2 years',
    statute: 'State statutes; Federal Tort Claims Act, 28 U.S.C. § 2401(b)',
    notes: 'FTCA requires an administrative claim before filing suit. 6-month deadline to file suit after administrative denial.',
  },
  admiralty: {
    period: '3 years for personal injury; varies for property damage and other maritime claims',
    statute: '46 U.S.C. § 30106',
    notes: 'Maritime claims have their own procedural rules.',
  },
};

// ---------------------------------------------------------------------------
// Standard legal terminology
// ---------------------------------------------------------------------------

export const LEGAL_TERMINOLOGY: Record<string, string> = {
  plaintiff: 'The party initiating the lawsuit.',
  defendant: 'The party being sued.',
  complaint: 'The initial pleading filed by the plaintiff that sets forth the factual and legal basis for the lawsuit.',
  answer: 'The defendant\'s formal written response to the complaint.',
  counterclaim: 'A claim brought by the defendant against the plaintiff in the same action.',
  crossClaim: 'A claim brought by one defendant against another defendant in the same action.',
  interrogatories: 'Written questions served on a party that must be answered under oath.',
  deposition: 'Oral testimony taken under oath before trial, typically recorded by a court reporter.',
  motionForSummaryJudgment: 'A motion arguing there is no genuine issue of material fact and the movant is entitled to judgment as a matter of law.',
  demandLetter: 'A formal letter sent before litigation demanding specific relief. Not required by federal rules but customary and sometimes required by state pre-suit notice statutes.',
  tripleDamages: 'In certain federal statutes (antitrust, RICO), the court may award three times the actual damages proved.',
  classAction: 'A lawsuit in which one or more plaintiffs bring a claim on behalf of a larger group.',
  remand: 'Sending a case back from federal court to state court or from an appellate court to a lower court.',
};

// ---------------------------------------------------------------------------
// Complaint format requirements
// ---------------------------------------------------------------------------

export const COMPLAINT_FORMAT = {
  title: 'Complaint / Demand Letter',
  description: 'The initial pleading filed in federal court, or a demand letter sent before initiating litigation.',
  complaintRequirements: [
    'Caption with court name, case number, and party names',
    'Statement of jurisdiction (28 U.S.C. § 1331 or § 1332)',
    'Statement of venue (28 U.S.C. § 1391)',
    'Short and plain statement of facts (FRCP Rule 8(a)(2))',
    'Numbered paragraphs (FRCP Rule 10(b))',
    'Each claim in a separate count',
    'Prayer for relief / demand for judgment',
    'Jury demand if applicable (FRCP Rule 38)',
    'Verification (if required by specific statute)',
    'Signature of attorney with bar number, address, phone, and email (FRCP Rule 11)',
  ],
  demandLetterRequirements: [
    'Identify the sender and their client',
    'State the facts giving rise to the claim',
    'Identify the legal theories and applicable statutes',
    'Specify the damages or relief demanded',
    'Set a reasonable deadline for response (typically 30 days)',
    'State the intention to file suit if the matter is not resolved',
    'Reference any mandatory pre-suit notice requirements',
    'Preserve the right to seek attorney fees and costs',
  ],
  responseDeadline: '30 days (demand letter); 21 days to answer after service (60 days with waiver)',
};

// ---------------------------------------------------------------------------
// Composite jurisdiction context for prompts
// ---------------------------------------------------------------------------

export function getJurisdictionContext(): string {
  return `JURISDICTION: United States (Federal)

${LEGAL_SYSTEM_OVERVIEW}

${COURT_STRUCTURE}

KEY PROCEDURAL RULES:
- Complaint: ${FRCP_REFERENCES.complaint}
- Service: ${FRCP_REFERENCES.service}
- Discovery: ${FRCP_REFERENCES.discovery}
- Summary Judgment: ${FRCP_REFERENCES.summaryJudgment}
- Costs: ${FRCP_REFERENCES.costs}

STATUTES OF LIMITATION:
${Object.entries(LIMITATION_PERIODS)
  .map(([type, info]) => `- ${type}: ${info.period} (${info.statute}). ${info.notes}`)
  .join('\n')}

COMPLAINT REQUIREMENTS:
${COMPLAINT_FORMAT.complaintRequirements.map((r) => `- ${r}`).join('\n')}

DEMAND LETTER REQUIREMENTS:
${COMPLAINT_FORMAT.demandLetterRequirements.map((r) => `- ${r}`).join('\n')}
Response deadline: ${COMPLAINT_FORMAT.responseDeadline}`;
}
