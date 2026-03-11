"use client";

import { useState } from "react";
import Link from "next/link";
import { FileInput, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReferrals } from "@/hooks/use-referrals";
import { ReferralCard } from "@/components/referrals/referral-card";
import type { Referral } from "@/types";

export default function ReferralsPage() {
  const { data: referrals = [], isLoading } = useReferrals();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered =
    statusFilter === "all"
      ? referrals
      : referrals.filter((r) => r.status === statusFilter);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
            <FileInput className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Referrals</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} referral{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link href="/referrals/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Referral
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Referral List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileInput className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">No referrals found</p>
            <p className="text-xs text-muted-foreground">
              {statusFilter !== "all"
                ? "Try changing the status filter"
                : "New referrals will appear here"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((referral) => (
            <ReferralCard key={referral.id} referral={referral} />
          ))}
        </div>
      )}
    </div>
  );
}
