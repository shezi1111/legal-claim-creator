import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  real,
  date,
  index,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  passwordHash: text("password_hash"),
  gmailAccessToken: text("gmail_access_token"),
  gmailRefreshToken: text("gmail_refresh_token"),
  gmailTokenExpiry: timestamp("gmail_token_expiry"),
  gmailConnected: boolean("gmail_connected").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Claims ──────────────────────────────────────────────────────────────────

export const claims = pgTable(
  "claims",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    title: text("title").notNull(),
    jurisdiction: text("jurisdiction").notNull(),
    subJurisdiction: text("sub_jurisdiction"),
    areaOfLaw: text("area_of_law").notNull(),
    status: text("status").notNull().default("intake"),
    factsSummary: text("facts_summary"),
    legalIssues: jsonb("legal_issues"),
    strengthScore: integer("strength_score"),
    strengthRating: text("strength_rating"),
    strengthAnalysis: text("strength_analysis"),
    remedies: jsonb("remedies"),
    generatedLba: text("generated_lba"),
    generatedEvidencePack: text("generated_evidence_pack"),
    limitationDeadline: timestamp("limitation_deadline"),
    limitationWarning: text("limitation_warning"),
    opponentAnalysis: jsonb("opponent_analysis"),
    costBenefit: jsonb("cost_benefit"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("claims_user_id_idx").on(table.userId),
    index("claims_status_idx").on(table.status),
  ]
);

// ─── Messages ────────────────────────────────────────────────────────────────

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id")
      .references(() => claims.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role").notNull(),
    content: text("content").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("messages_claim_id_idx").on(table.claimId)]
);

// ─── Evidence ────────────────────────────────────────────────────────────────

export const evidence = pgTable(
  "evidence",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id")
      .references(() => claims.id, { onDelete: "cascade" })
      .notNull(),
    type: text("type").notNull(),
    originalFilename: text("original_filename").notNull(),
    storagePath: text("storage_path").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: text("mime_type").notNull(),
    status: text("status").notNull().default("uploading"),
    extractedText: text("extracted_text"),
    aiSummary: text("ai_summary"),
    aiAnalysis: jsonb("ai_analysis"),
    source: text("source").notNull(),
    gmailMessageId: text("gmail_message_id"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("evidence_claim_id_idx").on(table.claimId)]
);

// ─── Evidence Tags ───────────────────────────────────────────────────────────

export const evidenceTags = pgTable(
  "evidence_tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    evidenceId: uuid("evidence_id")
      .references(() => evidence.id, { onDelete: "cascade" })
      .notNull(),
    claimId: uuid("claim_id")
      .references(() => claims.id)
      .notNull(),
    tagType: text("tag_type").notNull(),
    value: text("value").notNull(),
    context: text("context"),
    positionStart: integer("position_start"),
    positionEnd: integer("position_end"),
    confidence: real("confidence").default(1.0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("evidence_tags_evidence_id_idx").on(table.evidenceId),
    index("evidence_tags_claim_id_idx").on(table.claimId),
  ]
);

// ─── Timeline Events ────────────────────────────────────────────────────────

export const timelineEvents = pgTable(
  "timeline_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id")
      .references(() => claims.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    datePrecision: text("date_precision").notNull().default("day"),
    title: text("title").notNull(),
    description: text("description").notNull(),
    sourceEvidenceId: uuid("source_evidence_id").references(
      () => evidence.id
    ),
    significance: text("significance").notNull().default("normal"),
    category: text("category").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("timeline_events_claim_id_idx").on(table.claimId)]
);

// ─── Forensic Findings ──────────────────────────────────────────────────────

export const forensicFindings = pgTable(
  "forensic_findings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    evidenceId: uuid("evidence_id")
      .references(() => evidence.id, { onDelete: "cascade" })
      .notNull(),
    claimId: uuid("claim_id")
      .references(() => claims.id)
      .notNull(),
    findingType: text("finding_type").notNull(),
    severity: text("severity").notNull(),
    title: text("title").notNull(),
    detail: text("detail").notNull(),
    courtImpact: text("court_impact").notNull(),
    recommendation: text("recommendation"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("forensic_findings_evidence_id_idx").on(table.evidenceId),
    index("forensic_findings_claim_id_idx").on(table.claimId),
  ]
);

// ─── Case Law References ────────────────────────────────────────────────────

export const caseLawReferences = pgTable(
  "case_law_references",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id")
      .references(() => claims.id, { onDelete: "cascade" })
      .notNull(),
    caseName: text("case_name").notNull(),
    citation: text("citation").notNull(),
    court: text("court").notNull(),
    judgmentDate: date("judgment_date"),
    jurisdiction: text("jurisdiction").notNull(),
    relevance: text("relevance").notNull(),
    outcome: text("outcome").notNull(),
    supportsClaim: boolean("supports_claim").notNull(),
    keyPrinciple: text("key_principle").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("case_law_references_claim_id_idx").on(table.claimId)]
);

// ─── AI Tasks ────────────────────────────────────────────────────────────────

export const aiTasks = pgTable(
  "ai_tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id")
      .references(() => claims.id)
      .notNull(),
    taskType: text("task_type").notNull(),
    modelProvider: text("model_provider").notNull(),
    modelName: text("model_name").notNull(),
    status: text("status").notNull().default("pending"),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    latencyMs: integer("latency_ms"),
    costEstimate: text("cost_estimate"),
    error: text("error"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [index("ai_tasks_claim_id_idx").on(table.claimId)]
);
