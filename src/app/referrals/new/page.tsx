"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FileInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReferralParser } from "@/components/referrals/referral-parser";
import { useReferralStore } from "@/stores/referral-store";
import type { Referral } from "@/types";

export default function NewReferralPage() {
  const router = useRouter();
  const addReferral = useReferralStore((s) => s.addReferral);

  const newReferral: Referral = {
    id: `ref-${Date.now()}`,
    referrerName: "",
    referrerType: "GP",
    date: new Date().toISOString().split("T")[0],
    condition: "",
    rawText: "",
    status: "pending",
  };

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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
            <FileInput className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              New Referral
            </h1>
            <p className="text-sm text-muted-foreground">
              Paste a referral letter and parse with AI
            </p>
          </div>
        </div>
      </div>

      {/* Parser */}
      <ReferralParser referral={newReferral} />
    </div>
  );
}
