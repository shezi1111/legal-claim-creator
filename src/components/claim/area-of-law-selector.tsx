"use client";

import {
  FileText,
  AlertTriangle,
  Briefcase,
  Home,
  Heart,
  Building2,
  ShoppingBag,
  UserX,
  HardHat,
  Lightbulb,
  UserCheck,
  Banknote,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface AreaOfLaw {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

const areas: AreaOfLaw[] = [
  {
    id: "contract",
    name: "Contract",
    description: "Breach of contract, disputes over terms and obligations",
    icon: FileText,
  },
  {
    id: "tort",
    name: "Tort / Negligence",
    description: "Personal harm caused by another party's breach of duty",
    icon: AlertTriangle,
  },
  {
    id: "employment",
    name: "Employment",
    description: "Workplace disputes, unfair dismissal, discrimination",
    icon: Briefcase,
  },
  {
    id: "property",
    name: "Property",
    description: "Land disputes, tenancy issues, boundary disagreements",
    icon: Home,
  },
  {
    id: "family",
    name: "Family",
    description: "Divorce, child custody, financial settlements",
    icon: Heart,
  },
  {
    id: "commercial",
    name: "Commercial",
    description: "Business disputes, partnership issues, shareholder claims",
    icon: Building2,
  },
  {
    id: "consumer",
    name: "Consumer",
    description: "Faulty products, misleading services, refund disputes",
    icon: ShoppingBag,
  },
  {
    id: "personal-injury",
    name: "Personal Injury",
    description: "Physical or psychological injury claims",
    icon: UserX,
  },
  {
    id: "construction",
    name: "Construction",
    description: "Building disputes, defects, payment issues",
    icon: HardHat,
  },
  {
    id: "ip",
    name: "Intellectual Property",
    description: "Copyright, trademarks, patents, trade secrets",
    icon: Lightbulb,
  },
  {
    id: "professional-negligence",
    name: "Professional Negligence",
    description: "Claims against professionals who failed their duty",
    icon: UserCheck,
  },
  {
    id: "debt-recovery",
    name: "Debt Recovery",
    description: "Recovering money owed to you by another party",
    icon: Banknote,
  },
];

interface AreaOfLawSelectorProps {
  selected: string | null;
  onSelect: (area: string) => void;
}

export function AreaOfLawSelector({
  selected,
  onSelect,
}: AreaOfLawSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {areas.map((area) => {
        const isSelected = selected === area.name;
        const Icon = area.icon;
        return (
          <button
            key={area.id}
            onClick={() => onSelect(area.name)}
            className={cn(
              "relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-white hover:border-primary/30 hover:shadow-sm"
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                isSelected ? "bg-primary/10" : "bg-surface"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isSelected ? "text-primary" : "text-text-light"
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text">{area.name}</p>
              <p className="text-xs text-text-light mt-0.5">{area.description}</p>
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
