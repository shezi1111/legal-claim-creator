"use client";

import { EvidenceCard } from "./evidence-card";

interface EvidenceItem {
  id: string;
  filename: string;
  type: string;
  size: number;
  status: "uploading" | "parsing" | "parsed" | "analyzed";
  tags: string[];
  forensicIssues?: boolean;
}

interface EvidenceListProps {
  evidence: EvidenceItem[];
  onDelete: (id: string) => void;
}

export function EvidenceList({ evidence, onDelete }: EvidenceListProps) {
  if (evidence.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-text-light">
          No evidence uploaded yet. Upload files to strengthen your claim.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">
        Uploaded Evidence ({evidence.length})
      </h4>
      {evidence.map((item) => (
        <EvidenceCard
          key={item.id}
          evidence={item}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </div>
  );
}
