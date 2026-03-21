export const EVIDENCE_TYPES = [
  "pdf",
  "docx",
  "image",
  "whatsapp_export",
  "eml",
  "gmail_email",
  "text",
] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const EVIDENCE_STATUSES = [
  "uploading",
  "parsing",
  "parsed",
  "analyzed",
  "error",
] as const;

export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];

export const EVIDENCE_SOURCES = ["upload", "gmail"] as const;

export type EvidenceSource = (typeof EVIDENCE_SOURCES)[number];

export const TAG_TYPES = [
  "date",
  "party",
  "topic",
  "admission",
  "commitment",
  "threat",
  "contract_term",
  "breach",
  "damage",
] as const;

export type TagType = (typeof TAG_TYPES)[number];

export const FINDING_TYPES = [
  "date_mismatch",
  "signature_issue",
  "address_error",
  "technical_defect",
  "missing_element",
  "inconsistency",
  "admissibility_risk",
] as const;

export type FindingType = (typeof FINDING_TYPES)[number];

export const SEVERITY_LEVELS = ["critical", "warning", "info"] as const;

export type Severity = (typeof SEVERITY_LEVELS)[number];

export const SIGNIFICANCE_LEVELS = [
  "critical",
  "important",
  "normal",
  "minor",
] as const;

export type Significance = (typeof SIGNIFICANCE_LEVELS)[number];

export const DATE_PRECISIONS = [
  "day",
  "month",
  "year",
  "approximate",
] as const;

export type DatePrecision = (typeof DATE_PRECISIONS)[number];

export const TIMELINE_CATEGORIES = [
  "agreement",
  "breach",
  "communication",
  "payment",
  "legal_action",
  "other",
] as const;

export type TimelineCategory = (typeof TIMELINE_CATEGORIES)[number];

export interface EvidenceAnalysis {
  relevance: string;
  supports: string[];
  undermines: string[];
  keyExcerpts: string[];
}

export interface EvidenceItem {
  id: string;
  claimId: string;
  type: EvidenceType;
  originalFilename: string;
  storagePath: string;
  fileSize: number;
  mimeType: string;
  status: EvidenceStatus;
  extractedText: string | null;
  aiSummary: string | null;
  aiAnalysis: EvidenceAnalysis | null;
  source: EvidenceSource;
  gmailMessageId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EvidenceTag {
  id: string;
  evidenceId: string;
  claimId: string;
  tagType: TagType;
  value: string;
  context: string | null;
  positionStart: number | null;
  positionEnd: number | null;
  confidence: number;
  createdAt: Date;
}

export interface ForensicFinding {
  id: string;
  evidenceId: string;
  claimId: string;
  findingType: FindingType;
  severity: Severity;
  title: string;
  detail: string;
  courtImpact: string;
  recommendation: string | null;
  createdAt: Date;
}

export interface TimelineEvent {
  id: string;
  claimId: string;
  date: string;
  datePrecision: DatePrecision;
  title: string;
  description: string;
  sourceEvidenceId: string | null;
  significance: Significance;
  category: TimelineCategory;
  createdAt: Date;
}

export interface CaseLawReference {
  id: string;
  claimId: string;
  caseName: string;
  citation: string;
  court: string;
  judgmentDate: string | null;
  jurisdiction: string;
  relevance: string;
  outcome: string;
  supportsClaim: boolean;
  keyPrinciple: string;
  createdAt: Date;
}
