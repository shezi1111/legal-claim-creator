/**
 * Jurisdiction-specific context for England & Wales.
 */

export const JURISDICTION_NAME = 'England & Wales';
export const JURISDICTION_CODE = 'england-wales';

// ---------------------------------------------------------------------------
// Legal system overview
// ---------------------------------------------------------------------------

export const LEGAL_SYSTEM_OVERVIEW = `England & Wales operates a common law legal system. The primary sources of law are:
1. Legislation (Acts of Parliament and Statutory Instruments)
2. Case law (judicial precedent under the doctrine of stare decisis)
3. European retained law (post-Brexit, retained EU law continues to apply where not amended)
4. Equity (principles developed by the Court of Chancery)

The adversarial system applies: parties present their cases before an impartial judge (and occasionally a jury in certain civil cases). The burden of proof in civil cases is on the balance of probabilities.`;

// ---------------------------------------------------------------------------
// Court structure
// ---------------------------------------------------------------------------

export const COURT_STRUCTURE = `Civil Court Hierarchy (ascending):
1. County Court — Most civil claims under £100,000. Small claims track (up to £10,000), fast track (£10,001–£25,000), multi-track (over £25,000).
2. High Court — Complex or high-value claims. Divisions: Queen's Bench Division (QBD), Chancery Division, Family Division. Specialist courts include the Technology and Construction Court (TCC) and the Commercial Court.
3. Court of Appeal (Civil Division) — Appeals from the County Court and High Court.
4. Supreme Court of the United Kingdom — Final court of appeal.

Tribunals handle specific areas: Employment Tribunal (unfair dismissal, discrimination), First-tier Tribunal (immigration, tax, social security), Upper Tribunal.

Alternative Dispute Resolution (ADR) is strongly encouraged and courts may impose cost sanctions on parties who unreasonably refuse to engage in ADR.`;

// ---------------------------------------------------------------------------
// Civil Procedure Rules (CPR) references
// ---------------------------------------------------------------------------

export const CPR_REFERENCES = {
  preActionProtocols: 'Practice Direction — Pre-Action Conduct and Protocols. Parties must exchange information, explore settlement, and follow any relevant protocol before issuing proceedings.',
  particularsOfClaim: 'CPR Part 16 — Statements of Case. Particulars of Claim must set out a concise statement of facts, specify the remedy sought, and attach or serve any documents referred to.',
  smallClaimsTrack: 'CPR Part 27 — Claims allocated to the small claims track (up to £10,000). Limited costs recovery. No expert evidence without permission.',
  fastTrack: 'CPR Part 28 — Claims allocated to the fast track (£10,001–£25,000). Trial within 30 weeks of allocation. One expert per party per field.',
  multiTrack: 'CPR Part 29 — Claims over £25,000 or of significant complexity. Case management by the court.',
  disclosure: 'CPR Part 31 — Disclosure and Inspection of Documents. Standard disclosure requires parties to disclose documents on which they rely, documents that adversely affect their case, and documents that support the other party\'s case.',
  witnessStatements: 'CPR Part 32 — Evidence. Witness statements must contain the truth, set out facts within the witness\'s own knowledge, and be verified by a statement of truth.',
  expertEvidence: 'CPR Part 35 — Expert evidence requires court permission. Single joint experts are preferred where possible.',
  costs: 'CPR Parts 44–48 — Costs. The general rule is that the unsuccessful party pays the costs of the successful party (the "loser pays" principle). Qualified One-Way Costs Shifting (QOCS) applies in personal injury claims.',
  offerToSettle: 'CPR Part 36 — Offers to Settle. A Part 36 offer can have significant costs consequences if not beaten at trial.',
  interimApplications: 'CPR Part 23 — General rules about applications for court orders.',
  defaultJudgment: 'CPR Part 12 — Default judgment may be obtained if the defendant fails to file an acknowledgment of service or defence within the prescribed time.',
  summaryJudgment: 'CPR Part 24 — The court may give summary judgment if the claim or defence has no real prospect of success and there is no other compelling reason for trial.',
};

// ---------------------------------------------------------------------------
// Limitation periods
// ---------------------------------------------------------------------------

export const LIMITATION_PERIODS: Record<string, { period: string; statute: string; notes: string }> = {
  contract: {
    period: '6 years from breach',
    statute: 'Limitation Act 1980, s.5',
    notes: 'For contracts executed as a deed, the limitation period is 12 years (s.8).',
  },
  tort_general: {
    period: '6 years from when the damage occurred',
    statute: 'Limitation Act 1980, s.2',
    notes: 'The cause of action accrues when damage occurs, not when the tortious act is committed (if different).',
  },
  personal_injury: {
    period: '3 years from date of injury or date of knowledge',
    statute: 'Limitation Act 1980, s.11',
    notes: 'The court has discretion to disapply the limitation period under s.33 in exceptional circumstances.',
  },
  defamation: {
    period: '1 year from publication',
    statute: 'Limitation Act 1980, s.4A (as amended by the Defamation Act 1996)',
    notes: 'Single publication rule applies under the Defamation Act 2013.',
  },
  consumer_protection: {
    period: '6 years (contract-based claims)',
    statute: 'Limitation Act 1980, s.5; Consumer Rights Act 2015',
    notes: 'Short-term right to reject goods within 30 days of purchase.',
  },
  employment: {
    period: '3 months less 1 day from the act complained of (Employment Tribunal)',
    statute: 'Employment Rights Act 1996, s.111; Equality Act 2010, s.123',
    notes: 'ACAS Early Conciliation must be initiated before a claim can be submitted. Time stops running during conciliation.',
  },
  professional_negligence: {
    period: '6 years from the date of the negligent act or omission (or 3 years from the date of knowledge under the latent damage provisions)',
    statute: 'Limitation Act 1980, ss.2, 14A, 14B',
    notes: 'Latent damage provisions (s.14A) allow a secondary 3-year period from the date of knowledge, subject to a longstop of 15 years.',
  },
  landlord_tenant: {
    period: '6 years for breach of tenancy agreement; various for specific statutory claims',
    statute: 'Limitation Act 1980; Housing Act 1988; Landlord and Tenant Act 1985',
    notes: 'Deposit protection claims: no specific limitation but should be brought promptly.',
  },
  judicial_review: {
    period: 'Promptly and in any event within 3 months of the decision',
    statute: 'CPR Part 54; Senior Courts Act 1981, s.31',
    notes: 'Time limits are strict. Late claims require an extension of time with good reason.',
  },
};

// ---------------------------------------------------------------------------
// Standard legal terminology
// ---------------------------------------------------------------------------

export const LEGAL_TERMINOLOGY: Record<string, string> = {
  claimant: 'The party bringing the claim (formerly known as the "plaintiff").',
  defendant: 'The party against whom the claim is brought.',
  particularsOfClaim: 'The formal document setting out the claimant\'s case, including the facts relied upon and the remedy sought.',
  statementOfTruth: 'A signed statement verifying that the facts stated in a document are true. Required on statements of case and witness statements.',
  partiesAndSuitability: 'All parties must have legal capacity to sue and be sued.',
  withoutPrejudice: 'Communications made in a genuine attempt to settle a dispute are protected from disclosure in court.',
  interlocutoryInjunction: 'A court order to do or refrain from doing something pending the final determination of the case.',
  quantumOfDamages: 'The amount of damages to be awarded.',
  mitigationOfLoss: 'The claimant\'s duty to take reasonable steps to minimise their loss.',
  contributoryNegligence: 'Where the claimant\'s own negligence contributed to the loss, damages may be reduced.',
  costsBudgeting: 'Under CPR Part 3.12, parties in multi-track cases must file and exchange costs budgets.',
};

// ---------------------------------------------------------------------------
// LBA format requirements
// ---------------------------------------------------------------------------

export const LBA_FORMAT = {
  title: 'Letter Before Action / Letter of Claim',
  description: 'A formal letter sent to the prospective defendant before issuing court proceedings, as required by the relevant Pre-Action Protocol.',
  requirements: [
    'Must identify the claimant and defendant clearly',
    'Must set out a concise chronological summary of the facts',
    'Must state the legal basis for the claim',
    'Must specify the remedy sought (including monetary amount if applicable)',
    'Must enclose copies of essential documents (or list them)',
    'Must allow a reasonable time for response (typically 14 days for straightforward claims, up to 3 months for clinical negligence)',
    'Must reference the relevant Pre-Action Protocol',
    'Must warn of the intention to issue proceedings if the matter is not resolved',
    'Must state that costs will be sought',
    'Should propose ADR (e.g., mediation) as an alternative to litigation',
    'Must include a statement of truth where required by the protocol',
  ],
  responseDeadline: '14 days (standard); up to 3 months for clinical negligence claims',
};

// ---------------------------------------------------------------------------
// Composite jurisdiction context for prompts
// ---------------------------------------------------------------------------

export function getJurisdictionContext(): string {
  return `JURISDICTION: England & Wales

${LEGAL_SYSTEM_OVERVIEW}

${COURT_STRUCTURE}

KEY PROCEDURAL RULES:
- Pre-Action Protocols: ${CPR_REFERENCES.preActionProtocols}
- Particulars of Claim: ${CPR_REFERENCES.particularsOfClaim}
- Disclosure: ${CPR_REFERENCES.disclosure}
- Costs: ${CPR_REFERENCES.costs}
- Part 36 Offers: ${CPR_REFERENCES.offerToSettle}

LIMITATION PERIODS:
${Object.entries(LIMITATION_PERIODS)
  .map(([type, info]) => `- ${type}: ${info.period} (${info.statute}). ${info.notes}`)
  .join('\n')}

LBA REQUIREMENTS:
${LBA_FORMAT.requirements.map((r) => `- ${r}`).join('\n')}
Response deadline: ${LBA_FORMAT.responseDeadline}`;
}
