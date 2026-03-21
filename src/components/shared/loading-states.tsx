"use client";

import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

/* --------------------------------- Spinner -------------------------------- */
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  }[size];

  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeClass, className)}
    />
  );
}

/* ------------------------------ Full Overlay ------------------------------ */
interface FullPageLoadingProps {
  message?: string;
}

export function FullPageLoading({ message = "Loading..." }: FullPageLoadingProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <Spinner size="lg" />
      <p className="mt-4 text-sm font-medium text-text-light">{message}</p>
    </div>
  );
}

/* ----------------------------- Skeleton helpers ---------------------------- */
interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-border/50",
        className
      )}
    />
  );
}

/* ---- Claim Card Skeleton ---- */
export function ClaimCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

/* ---- Message Skeleton ---- */
export function MessageSkeleton({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 max-w-[80%]",
        align === "right" && "flex-row-reverse ml-auto"
      )}
    >
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton
          className={cn(
            "h-16 rounded-2xl",
            align === "right" ? "rounded-tr-sm" : "rounded-tl-sm"
          )}
        />
        <Skeleton className={cn("h-3 w-12", align === "right" && "ml-auto")} />
      </div>
    </div>
  );
}

/* ---- Evidence Item Skeleton ---- */
export function EvidenceItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-lg">
      <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}
