"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, SlidersHorizontal, FolderOpen } from "lucide-react";
import { PageHeader } from "@/components/layout/header";
import { ClaimCard } from "@/components/claim/claim-card";

// Placeholder claim data for demonstration
const sampleClaims = [
  {
    id: "claim-1",
    title: "Breach of Employment Contract — Wrongful Termination",
    jurisdiction: "England & Wales",
    areaOfLaw: "Employment",
    status: "analyzing" as const,
    strengthScore: 72,
    createdAt: "2025-03-18",
  },
  {
    id: "claim-2",
    title: "Consumer Rights — Faulty Product Refund",
    jurisdiction: "England & Wales",
    areaOfLaw: "Consumer",
    status: "evidence_gathering" as const,
    strengthScore: 45,
    createdAt: "2025-03-15",
  },
  {
    id: "claim-3",
    title: "Professional Negligence — Accounting Error",
    jurisdiction: "US Federal",
    areaOfLaw: "Professional Negligence",
    status: "draft_ready" as const,
    strengthScore: 88,
    createdAt: "2025-03-10",
  },
];

const statusFilters = [
  { value: "all", label: "All Status" },
  { value: "intake", label: "Intake" },
  { value: "evidence_gathering", label: "Evidence Gathering" },
  { value: "analyzing", label: "Analyzing" },
  { value: "draft_ready", label: "Draft Ready" },
  { value: "finalized", label: "Finalized" },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // In production, claims would come from API
  const claims = sampleClaims;
  const isEmpty = claims.length === 0;

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      searchQuery === "" ||
      claim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.areaOfLaw.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || claim.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Your Claims"
        subtitle="Manage and track all your legal claims in one place."
        actions={
          <Link
            href="/claim/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Claim
          </Link>
        }
      />

      {/* Search & Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
            <input
              type="text"
              placeholder="Search claims by title, jurisdiction, or area of law..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-lg text-sm font-medium text-text-light hover:text-text hover:border-primary/30 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-lg border border-border">
            <label className="text-sm font-medium text-text-light">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              {statusFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Claims Grid / Empty State */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-border">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-text-light" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-1">No claims yet</h3>
          <p className="text-text-light mb-6">
            Start your first claim to see it here.
          </p>
          <Link
            href="/claim/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors"
          >
            <Plus className="h-4 w-4" />
            Start Your First Claim
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  );
}
