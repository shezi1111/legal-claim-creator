export const CLAIM_STATUSES = [
  "intake",
  "evidence_gathering",
  "analyzing",
  "draft_ready",
  "finalized",
] as const;

export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export const JURISDICTIONS = [
  "england_wales",
  "us_federal",
  "us_state",
  "pakistan",
  "uae",
  "scotland",
  "ireland",
] as const;

export type Jurisdiction = (typeof JURISDICTIONS)[number];

export const AREAS_OF_LAW = [
  "contract",
  "tort",
  "employment",
  "property",
  "family",
  "commercial",
  "consumer",
  "personal_injury",
  "construction",
  "intellectual_property",
  "professional_negligence",
  "debt_recovery",
] as const;

export type AreaOfLaw = (typeof AREAS_OF_LAW)[number];

export const STRENGTH_RATINGS = ["weak", "moderate", "strong"] as const;

export type StrengthRating = (typeof STRENGTH_RATINGS)[number];

export interface LegalIssue {
  issue: string;
  description: string;
  applicableLaw: string;
  strength: StrengthRating;
}

export interface Remedy {
  type: string;
  description: string;
  estimatedValue?: string;
  likelihood: StrengthRating;
}

export interface OpponentAnalysis {
  likelyDefences: string[];
  weaknesses: string[];
  strengths: string[];
  settlementLikelihood: string;
}

export interface CostBenefit {
  estimatedCosts: string;
  estimatedRecovery: string;
  riskLevel: string;
  recommendation: string;
  timeEstimate: string;
}

export interface Claim {
  id: string;
  userId: string;
  title: string;
  jurisdiction: Jurisdiction;
  subJurisdiction: string | null;
  areaOfLaw: AreaOfLaw;
  status: ClaimStatus;
  factsSummary: string | null;
  legalIssues: LegalIssue[] | null;
  strengthScore: number | null;
  strengthRating: StrengthRating | null;
  strengthAnalysis: string | null;
  remedies: Remedy[] | null;
  generatedLba: string | null;
  generatedEvidencePack: string | null;
  limitationDeadline: Date | null;
  limitationWarning: string | null;
  opponentAnalysis: OpponentAnalysis | null;
  costBenefit: CostBenefit | null;
  createdAt: Date;
  updatedAt: Date;
}
