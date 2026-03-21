"use client";

import Link from "next/link";
import { Calendar, MapPin, Scale } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ClaimStatus =
  | "intake"
  | "evidence_gathering"
  | "analyzing"
  | "draft_ready"
  | "finalized";

interface Claim {
  id: string;
  title: string;
  jurisdiction: string;
  areaOfLaw: string;
  status: ClaimStatus;
  strengthScore: number;
  createdAt: string;
}

interface ClaimCardProps {
  claim: Claim;
}

const statusConfig: Record<
  ClaimStatus,
  { label: string; color: string }
> = {
  intake: { label: "Intake", color: "bg-accent/10 text-accent" },
  evidence_gathering: {
    label: "Evidence Gathering",
    color: "bg-warning/10 text-warning",
  },
  analyzing: { label: "Analyzing", color: "bg-primary/10 text-primary" },
  draft_ready: { label: "Draft Ready", color: "bg-success/10 text-success" },
  finalized: { label: "Finalized", color: "bg-primary-dark/10 text-primary-dark" },
};

function getScoreColor(score: number): string {
  if (score >= 67) return "text-success";
  if (score >= 34) return "text-warning";
  return "text-danger";
}

function getScoreBg(score: number): string {
  if (score >= 67) return "bg-success/10";
  if (score >= 34) return "bg-warning/10";
  return "bg-danger/10";
}

export function ClaimCard({ claim }: ClaimCardProps) {
  const status = statusConfig[claim.status];

  return (
    <Link
      href={`/claim/${claim.id}`}
      className="block bg-white rounded-xl border border-border p-5 hover:border-accent/30 hover:shadow-md transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-text leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {claim.title}
        </h3>
        {/* Mini strength gauge */}
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
            getScoreBg(claim.strengthScore)
          )}
        >
          <span
            className={cn(
              "text-sm font-bold",
              getScoreColor(claim.strengthScore)
            )}
          >
            {claim.strengthScore}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
            status.color
          )}
        >
          {status.label}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface rounded-full text-[10px] font-medium text-text-light">
          <MapPin className="h-2.5 w-2.5" />
          {claim.jurisdiction}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface rounded-full text-[10px] font-medium text-text-light">
          <Scale className="h-2.5 w-2.5" />
          {claim.areaOfLaw}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 text-xs text-text-light">
        <Calendar className="h-3 w-3" />
        <span>
          Created{" "}
          {new Date(claim.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}
