/**
 * Jurisdiction-specific context for Pakistan.
 */

export const JURISDICTION_NAME = 'Pakistan';
export const JURISDICTION_CODE = 'pakistan';

// ---------------------------------------------------------------------------
// Legal system overview
// ---------------------------------------------------------------------------

export const LEGAL_SYSTEM_OVERVIEW = `Pakistan has a mixed legal system combining elements of common law (inherited from British colonial rule), Islamic law (Sharia), and customary law. The primary sources of law are:
1. The Constitution of Pakistan, 1973 — The supreme law of the land
2. Legislation — Acts of Parliament (National Assembly and Senate) and Provincial Assemblies
3. Islamic law — Applied primarily in matters of personal status (marriage, divorce, inheritance) through the Muslim Family Laws Ordinance 1961 and the Federal Shariat Court
4. Case law — Judicial precedent is binding under the doctrine of stare decisis
5. Customary law — Applicable in certain tribal and rural areas

The legal system is adversarial. The burden of proof in civil cases is on the balance of probabilities (preponderance of evidence). Civil proceedings are governed primarily by the Code of Civil Procedure, 1908 (CPC).`;

// ---------------------------------------------------------------------------
// Court structure
// ---------------------------------------------------------------------------

export const COURT_STRUCTURE = `Civil Court Hierarchy (ascending):
1. Civil Judge / Senior Civil Judge — Courts of first instance for civil matters. Pecuniary jurisdiction varies by province.
2. District Judge / Additional District Judge — Appellate jurisdiction over Civil Judges and original jurisdiction for higher-value cases.
3. High Courts — Each province has a High Court (Lahore, Sindh, Peshawar, Balochistan, Islamabad). Original jurisdiction under Article 199 (constitutional petitions/writs), appellate jurisdiction over District Courts.
4. Supreme Court of Pakistan — Apex court. Appellate jurisdiction under Article 185, advisory jurisdiction under Article 186, and original jurisdiction in inter-governmental disputes under Article 184.

Special Courts and Tribunals:
- Federal Shariat Court — Reviews laws for compliance with Islamic injunctions
- Banking Courts — Financial Recovery under the Financial Institutions (Recovery of Finances) Ordinance, 2001
- Consumer Courts — Under the relevant provincial Consumer Protection Acts
- Labour Courts — Employment and industrial disputes
- National Accountability Courts — Anti-corruption matters under NAB Ordinance 1999
- Rent Tribunals — Landlord-tenant disputes under provincial rent restriction laws
- Family Courts — Matters of Muslim family law (dissolution of marriage, maintenance, dower, custody)`;

// ---------------------------------------------------------------------------
// CPC references
// ---------------------------------------------------------------------------

export const CPC_REFERENCES = {
  plaint: 'Order VII CPC — The plaint is the document filed by the plaintiff to institute a civil suit. It must contain: (1) the name and description of the plaintiff, (2) the name and description of the defendant, (3) the facts constituting the cause of action and when it arose, (4) the jurisdiction of the court, (5) the relief claimed, (6) the value of the subject matter for court fee purposes.',
  writtenStatement: 'Order VIII CPC — The defendant must file a written statement within 30 days of service of summons (extendable up to 90 days).',
  discovery: 'Order XI CPC — Discovery and Inspection. Parties may seek discovery of documents by interrogatories. Order XII allows admission of documents.',
  summaryProcedure: 'Order XXXVII CPC — Summary procedure for suits upon bills of exchange, hundis, and promissory notes, and for recovery of debt or liquidated demand.',
  temporaryInjunction: 'Order XXXIX CPC — The court may grant temporary injunctions to restrain a party from doing any act. Three conditions: (1) prima facie case, (2) balance of convenience, (3) irreparable injury.',
  execution: 'Order XXI CPC — Execution of decrees and orders. A decree may be executed by delivery of property, attachment and sale, arrest and detention, or appointment of a receiver.',
  appeal: 'Sections 96-112 CPC — Appeals from original decrees. First appeal lies as of right (s.96). Second appeal to the High Court on substantial questions of law (s.100).',
  revision: 'Section 115 CPC — The High Court may revise any case decided by a subordinate court where the subordinate court has exercised jurisdiction not vested in it, failed to exercise jurisdiction, or acted illegally or with material irregularity.',
  courtFees: 'The Court Fees Act, 1870 — Court fees are calculated based on the value of the subject matter. Ad valorem fees apply to suits for money or movable property.',
  limitation: 'The Limitation Act, 1908 — Prescribes the time within which various civil suits, appeals, and applications must be filed.',
};

// ---------------------------------------------------------------------------
// Limitation periods (Limitation Act 1908)
// ---------------------------------------------------------------------------

export const LIMITATION_PERIODS: Record<string, { period: string; statute: string; notes: string }> = {
  contract: {
    period: '3 years from breach',
    statute: 'Limitation Act 1908, Article 115 (First Schedule)',
    notes: 'For suits for compensation for breach of any contract not specifically provided for. Time runs from when the contract is broken.',
  },
  recovery_of_money: {
    period: '3 years from when the money became due',
    statute: 'Limitation Act 1908, Article 59',
    notes: 'Applies to suits for money payable for money lent or under a contract.',
  },
  tort_general: {
    period: '1 year from the date of the wrongful act',
    statute: 'Limitation Act 1908, Article 36',
    notes: 'For compensation for any malfeasance, misfeasance, or nonfeasance independent of contract.',
  },
  immovable_property: {
    period: '12 years from when the right to sue accrues',
    statute: 'Limitation Act 1908, Article 142',
    notes: 'For suits for possession of immovable property based on title.',
  },
  specific_performance: {
    period: '3 years from the date fixed for performance, or if no date is fixed, from when the plaintiff has notice of refusal',
    statute: 'Limitation Act 1908, Article 113',
    notes: 'Under the Specific Relief Act 1877.',
  },
  rent_recovery: {
    period: '3 years from when the rent becomes due',
    statute: 'Limitation Act 1908, Article 52',
    notes: 'Applicable to suits for arrears of rent.',
  },
  defamation: {
    period: '1 year from the date of defamation',
    statute: 'Limitation Act 1908, Article 36',
    notes: 'Falls under the general tort provision.',
  },
  employment: {
    period: 'Varies: Industrial disputes to be raised within time prescribed under the Industrial Relations Act; otherwise 3 years',
    statute: 'Industrial Relations Act 2012; Limitation Act 1908',
    notes: 'Labour court claims have separate procedural requirements under provincial and federal industrial legislation.',
  },
  cheque_dishonour: {
    period: '30 days to issue legal notice after dishonour; suit within 3 years',
    statute: 'Negotiable Instruments Act 1881, s.138 (where applicable); Limitation Act 1908',
    notes: 'Criminal proceedings under s.489-F PPC must be initiated promptly.',
  },
  family_law: {
    period: 'Varies by specific claim (e.g., suit for dower: 3 years from the date it becomes payable; suit for dissolution: no specific limitation under DMMA)',
    statute: 'Muslim Family Laws Ordinance 1961; Dissolution of Muslim Marriages Act 1939; Limitation Act 1908',
    notes: 'Family Court proceedings are governed by the West Pakistan Family Courts Act 1964.',
  },
  constitutional_petition: {
    period: 'No fixed limitation but must be filed without unreasonable delay (doctrine of laches applies)',
    statute: 'Article 199 of the Constitution of Pakistan',
    notes: 'The High Court may decline relief if there is unexplained delay.',
  },
};

// ---------------------------------------------------------------------------
// Standard legal terminology
// ---------------------------------------------------------------------------

export const LEGAL_TERMINOLOGY: Record<string, string> = {
  plaintiff: 'Muddai — the party bringing the civil suit.',
  defendant: 'Muddaaleh — the party against whom the suit is brought.',
  plaint: 'The written statement of a plaintiff\'s claim filed in court to institute a suit (Order VII CPC).',
  writtenStatement: 'Jawab Dawa — the formal written reply filed by the defendant to the plaint.',
  decree: 'The formal expression of an adjudication by the court, which conclusively determines the rights of the parties (Section 2(2) CPC).',
  judgment: 'The statement given by the judge of the grounds of a decree or order (Section 2(9) CPC).',
  order: 'The formal expression of any decision of a civil court which is not a decree (Section 2(14) CPC).',
  vakaltnama: 'Power of attorney authorising an advocate to appear and act on behalf of a party in court.',
  courtFee: 'The fee payable on the plaint, calculated on the basis of the value of the subject matter.',
  stayOrder: 'An order restraining a party or authority from taking a particular action pending the hearing of the case.',
  writ: 'An order issued by the High Court under Article 199 of the Constitution (habeas corpus, mandamus, certiorari, prohibition, quo warranto).',
  dower: 'Haq Mehr — the amount payable by the husband to the wife under Muslim personal law.',
  khula: 'Dissolution of marriage at the instance of the wife, with return of dower/benefits.',
  talaq: 'Divorce pronounced by the husband under Muslim law.',
  wakf: 'An endowment of property dedicated to religious or charitable purposes.',
};

// ---------------------------------------------------------------------------
// Plaint format requirements
// ---------------------------------------------------------------------------

export const PLAINT_FORMAT = {
  title: 'Plaint / Legal Notice',
  description: 'The formal document filed to institute a civil suit in Pakistan, or a legal notice sent before filing.',
  plaintRequirements: [
    'Name of the court in which the suit is filed',
    'Name, description, and address of the plaintiff',
    'Name, description, and address of the defendant',
    'Facts constituting the cause of action and when it arose',
    'Facts showing the court has jurisdiction',
    'Relief claimed by the plaintiff',
    'Where the plaintiff has allowed a set-off, the amount for which the set-off is claimed',
    'Value of the subject matter for the purposes of jurisdiction and court fees',
    'A verification at the foot of the plaint (Order VI Rule 15 CPC)',
    'Court fee stamps affixed as required',
  ],
  legalNoticeRequirements: [
    'Name and address of the sender (through advocate)',
    'Name and address of the recipient',
    'Clear statement of the facts giving rise to the dispute',
    'Reference to the applicable legal provisions',
    'Specific demand or relief sought',
    'Time period for compliance (typically 15-30 days)',
    'Statement that legal proceedings will be initiated if the demand is not met',
    'Under Section 80 CPC, a notice of at least 2 months is required before suing the government',
  ],
  responseDeadline: '15-30 days (legal notice); 30 days for written statement after service of summons',
};

// ---------------------------------------------------------------------------
// Composite jurisdiction context for prompts
// ---------------------------------------------------------------------------

export function getJurisdictionContext(): string {
  return `JURISDICTION: Pakistan

${LEGAL_SYSTEM_OVERVIEW}

${COURT_STRUCTURE}

KEY PROCEDURAL RULES:
- Plaint: ${CPC_REFERENCES.plaint}
- Written Statement: ${CPC_REFERENCES.writtenStatement}
- Discovery: ${CPC_REFERENCES.discovery}
- Temporary Injunction: ${CPC_REFERENCES.temporaryInjunction}
- Appeals: ${CPC_REFERENCES.appeal}
- Limitation: ${CPC_REFERENCES.limitation}

LIMITATION PERIODS:
${Object.entries(LIMITATION_PERIODS)
  .map(([type, info]) => `- ${type}: ${info.period} (${info.statute}). ${info.notes}`)
  .join('\n')}

PLAINT REQUIREMENTS:
${PLAINT_FORMAT.plaintRequirements.map((r) => `- ${r}`).join('\n')}

LEGAL NOTICE REQUIREMENTS:
${PLAINT_FORMAT.legalNoticeRequirements.map((r) => `- ${r}`).join('\n')}
Response deadline: ${PLAINT_FORMAT.responseDeadline}`;
}
