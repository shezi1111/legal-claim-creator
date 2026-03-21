"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/header";
import { cn } from "@/lib/utils/cn";

const jurisdictions = [
  { id: "england_wales", name: "England & Wales", flag: "🇬🇧", description: "Common law with statutory framework" },
  { id: "us_federal", name: "US Federal", flag: "🇺🇸", description: "Federal courts and constitutional law" },
  { id: "us_state", name: "US State", flag: "🇺🇸", description: "State-specific courts and statutes" },
  { id: "pakistan", name: "Pakistan", flag: "🇵🇰", description: "Common law influenced by Islamic jurisprudence" },
  { id: "uae", name: "UAE", flag: "🇦🇪", description: "Civil law with Islamic law influences" },
  { id: "scotland", name: "Scotland", flag: "🏴\u200D", description: "Mixed legal system with civil and common law" },
  { id: "ireland", name: "Ireland", flag: "🇮🇪", description: "Common law system based on Irish constitution" },
];

export default function NewClaimPage() {
  const router = useRouter();
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);

  const handleStartClaim = async () => {
    if (!selectedJurisdiction) return;

    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jurisdiction: selectedJurisdiction,
          areaOfLaw: "pending_ai_classification",
        }),
      });

      if (res.ok) {
        const claim = await res.json();
        router.push(`/claim/${claim.id}`);
      }
    } catch {
      // Fallback for demo
      router.push("/claim/new-claim-id");
    }
  };

  return (
    <div>
      <PageHeader
        title="New Claim"
        subtitle="Just tell us where it happened. We'll figure out the rest."
      />

      <div className="max-w-3xl mx-auto">
        {/* Step 1: Country Only */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text">
              Where did this happen?
            </h2>
          </div>
          <p className="text-text-light text-sm mb-6">
            Select the country where the issue occurred. Don&apos;t worry about
            the legal details — our AI will work that out from your story.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {jurisdictions.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedJurisdiction(j.id)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                  selectedJurisdiction === j.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-white hover:border-primary/30 hover:shadow-sm"
                )}
              >
                <span className="text-2xl">{j.flag}</span>
                <div>
                  <p className="text-sm font-semibold text-text">{j.name}</p>
                  <p className="text-xs text-text-light">{j.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* What happens next */}
        {selectedJurisdiction && (
          <div className="bg-surface rounded-2xl border border-border p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">
              Ready to listen
            </h3>
            <p className="text-text-light text-sm max-w-md mx-auto mb-6">
              Just tell us what happened in your own words. Our AI will ask the
              right questions, identify the legal issues, and build your claim
              as you talk. No legal knowledge needed.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-6 text-xs text-text-light">
              <span className="px-3 py-1.5 bg-white rounded-full border border-border">
                AI identifies the area of law
              </span>
              <span className="px-3 py-1.5 bg-white rounded-full border border-border">
                Claim strength builds in real-time
              </span>
              <span className="px-3 py-1.5 bg-white rounded-full border border-border">
                Upload evidence anytime
              </span>
            </div>

            <button
              onClick={handleStartClaim}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20"
            >
              Start Talking
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
