"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const jurisdictions = [
  {
    id: "england-wales",
    name: "England & Wales",
    description: "Common law system with statutory law framework",
    flag: "\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F",
  },
  {
    id: "us-federal",
    name: "US Federal",
    description: "Federal courts and constitutional law",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
  },
  {
    id: "us-state",
    name: "US State",
    description: "State-specific courts and statutes",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
  },
  {
    id: "pakistan",
    name: "Pakistan",
    description: "Common law influenced by Islamic jurisprudence",
    flag: "\uD83C\uDDF5\uD83C\uDDF0",
  },
  {
    id: "uae",
    name: "UAE",
    description: "Civil law with Islamic law influences",
    flag: "\uD83C\uDDE6\uD83C\uDDEA",
  },
  {
    id: "scotland",
    name: "Scotland",
    description: "Mixed legal system with civil and common law",
    flag: "\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F",
  },
  {
    id: "ireland",
    name: "Ireland",
    description: "Common law system based on Irish constitution",
    flag: "\uD83C\uDDEE\uD83C\uDDEA",
  },
];

interface JurisdictionSelectorProps {
  selected: string | null;
  onSelect: (jurisdiction: string) => void;
}

export function JurisdictionSelector({
  selected,
  onSelect,
}: JurisdictionSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {jurisdictions.map((j) => {
        const isSelected = selected === j.name;
        return (
          <button
            key={j.id}
            onClick={() => onSelect(j.name)}
            className={cn(
              "relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-white hover:border-primary/30 hover:shadow-sm"
            )}
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{j.flag}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text">{j.name}</p>
              <p className="text-xs text-text-light mt-0.5">{j.description}</p>
            </div>
            {isSelected && (
              <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}
