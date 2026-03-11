"use client";

import Link from "next/link";
import { Calendar, User, Stethoscope, Building2, UserCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface ReferralCardProps {
  referral: Referral;
}

export function ReferralCard({ referral }: ReferralCardProps) {
  const status = statusConfig[referral.status];

  return (
    <Link href={`/referrals/${referral.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
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
            <span
              className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {/* Patient & Condition */}
          {referral.patientName && (
            <div className="flex items-center gap-1.5 text-xs">
              <User className="h-3 w-3 text-muted-foreground" />
              <span>{referral.patientName}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">{referral.condition}</p>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(referral.date).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
