"use client";

import { useState } from "react";
import {
  FileText,
  Image,
  Mail,
  File,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EvidenceItem {
  id: string;
  filename: string;
  type: string;
  size: number;
  status: "uploading" | "parsing" | "parsed" | "analyzed";
  tags: string[];
  forensicIssues?: boolean;
}

interface EvidenceCardProps {
  evidence: EvidenceItem;
  onDelete: () => void;
}

function getFileIcon(type: string) {
  if (type.includes("pdf") || type.includes("word")) return FileText;
  if (type.includes("image")) return Image;
  if (type.includes("rfc822") || type.includes("eml")) return Mail;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const statusConfig = {
  uploading: {
    label: "Uploading",
    color: "bg-accent/10 text-accent",
    icon: Loader2,
    animate: true,
  },
  parsing: {
    label: "Parsing",
    color: "bg-warning/10 text-warning",
    icon: Loader2,
    animate: true,
  },
  parsed: {
    label: "Parsed",
    color: "bg-success/10 text-success",
    icon: CheckCircle2,
    animate: false,
  },
  analyzed: {
    label: "Analyzed",
    color: "bg-primary/10 text-primary",
    icon: CheckCircle2,
    animate: false,
  },
};

export function EvidenceCard({ evidence, onDelete }: EvidenceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const FileIcon = getFileIcon(evidence.type);
  const status = statusConfig[evidence.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden hover:border-accent/20 transition-colors">
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* File icon / thumbnail */}
        <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
          <FileIcon className="h-4 w-4 text-text-light" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text truncate">
            {evidence.filename}
          </p>
          <p className="text-xs text-text-light">{formatFileSize(evidence.size)}</p>
        </div>

        {/* Status badge */}
        <div
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
            status.color
          )}
        >
          <StatusIcon
            className={cn("h-3 w-3", status.animate && "animate-spin")}
          />
          {status.label}
        </div>

        {/* Forensic warning */}
        {evidence.forensicIssues && (
          <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
        )}

        {/* Expand */}
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-text-light" />
        ) : (
          <ChevronDown className="h-4 w-4 text-text-light" />
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-border pt-2">
          {/* Tags */}
          {evidence.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {evidence.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-surface text-text-light rounded text-[10px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {evidence.forensicIssues && (
            <div className="flex items-center gap-1.5 p-2 bg-warning/5 border border-warning/20 rounded-md mb-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warning flex-shrink-0" />
              <span className="text-xs text-warning">
                Forensic issues detected — review recommended
              </span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-danger hover:bg-danger/5 rounded-md transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
