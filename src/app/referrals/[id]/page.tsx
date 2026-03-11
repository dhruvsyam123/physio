"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileInput,
  Stethoscope,
  UserCircle,
  User,
  Building2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReferrals } from "@/hooks/use-referrals";
import { ReferralParser } from "@/components/referrals/referral-parser";
import type { Referral } from "@/types";

const statusConfig: Record<
  Referral["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  reviewed: {
    label: "Reviewed",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  converted: {
    label: "Converted",
    className: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  },
};

const typeIcons: Record<Referral["referrerType"], React.ReactNode> = {
  GP: <Stethoscope className="h-4 w-4" />,
  specialist: <UserCircle className="h-4 w-4" />,
  self: <User className="h-4 w-4" />,
  hospital: <Building2 className="h-4 w-4" />,
};

export default function ReferralDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: referrals = [], isLoading } = useReferrals();
  const referral = referrals.find((r) => r.id === id);

  if (!referral) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-sm text-muted-foreground">Referral not found</p>
        <Button variant="outline" onClick={() => router.push("/referrals")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Referrals
        </Button>
      </div>
    );
  }

  const status = statusConfig[referral.status];

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push("/referrals")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
            <FileInput className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">
                Referral Detail
              </h1>
              <span
                className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {referral.condition}
            </p>
          </div>
        </div>
      </div>

      {/* Referral Info */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {typeIcons[referral.referrerType]}
          </div>
          <div>
            <p className="text-sm font-medium">{referral.referrerName}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {referral.referrerType}
            </p>
          </div>
        </div>

        {referral.patientName && (
          <div className="flex items-center gap-1.5 text-sm">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            {referral.patientName}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(referral.date).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Parser */}
      <ReferralParser referral={referral} />
    </div>
  );
}
