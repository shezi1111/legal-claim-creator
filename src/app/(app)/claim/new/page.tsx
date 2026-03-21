"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/header";
import { JurisdictionSelector } from "@/components/claim/jurisdiction-selector";
import { AreaOfLawSelector } from "@/components/claim/area-of-law-selector";
import { cn } from "@/lib/utils/cn";

const steps = [
  { number: 1, label: "Jurisdiction" },
  { number: 2, label: "Area of Law" },
  { number: 3, label: "Confirm" },
];

export default function NewClaimPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);
  const [selectedAreaOfLaw, setSelectedAreaOfLaw] = useState<string | null>(null);

  const canProceed =
    (currentStep === 1 && selectedJurisdiction !== null) ||
    (currentStep === 2 && selectedAreaOfLaw !== null) ||
    currentStep === 3;

  const handleNext = () => {
    if (currentStep < 3 && canProceed) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBeginIntake = () => {
    // In production, this would create the claim via API and redirect
    router.push("/claim/new-claim-id");
  };

  return (
    <div>
      <PageHeader
        title="New Claim"
        subtitle="Set up your legal claim in a few simple steps."
      />

      {/* Step Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                    currentStep > step.number
                      ? "bg-success text-white"
                      : currentStep === step.number
                      ? "bg-primary text-white"
                      : "bg-border text-text-light"
                  )}
                >
                  {currentStep > step.number ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium hidden sm:inline",
                    currentStep >= step.number ? "text-text" : "text-text-light"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 sm:w-20 h-px mx-3",
                    currentStep > step.number ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-text mb-2">
              Select Jurisdiction
            </h2>
            <p className="text-text-light mb-6">
              Choose the legal jurisdiction that applies to your claim.
            </p>
            <JurisdictionSelector
              selected={selectedJurisdiction}
              onSelect={setSelectedJurisdiction}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-text mb-2">
              Select Area of Law
            </h2>
            <p className="text-text-light mb-6">
              Choose the legal area that best describes your claim.
            </p>
            <AreaOfLawSelector
              selected={selectedAreaOfLaw}
              onSelect={setSelectedAreaOfLaw}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-border p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">
              Ready to Begin
            </h2>
            <p className="text-text-light mb-8 max-w-md mx-auto">
              You&apos;re about to start a{" "}
              <span className="font-medium text-text">{selectedAreaOfLaw}</span> claim
              under{" "}
              <span className="font-medium text-text">{selectedJurisdiction}</span>{" "}
              jurisdiction. Our AI will guide you through the intake process.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="px-4 py-2 bg-surface rounded-lg border border-border">
                <span className="text-xs text-text-light">Jurisdiction</span>
                <p className="text-sm font-medium text-text">{selectedJurisdiction}</p>
              </div>
              <div className="px-4 py-2 bg-surface rounded-lg border border-border">
                <span className="text-xs text-text-light">Area of Law</span>
                <p className="text-sm font-medium text-text">{selectedAreaOfLaw}</p>
              </div>
            </div>
            <button
              onClick={handleBeginIntake}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/20"
            >
              Begin Intake
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors",
              currentStep === 1
                ? "text-text-light/50 cursor-not-allowed"
                : "text-text-light hover:text-text hover:bg-white border border-border"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          {currentStep < 3 && (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors",
                canProceed
                  ? "bg-primary text-white hover:bg-primary-light"
                  : "bg-border text-text-light cursor-not-allowed"
              )}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
