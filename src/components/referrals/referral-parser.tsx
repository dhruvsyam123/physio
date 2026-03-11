"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Loader2,
  UserPlus,
  AlertTriangle,
  Target,
  Clock,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCreatePatient } from "@/hooks/use-patients";
import { useUpdateReferral } from "@/hooks/use-referrals";
import { toast } from "sonner";
import type { ParsedReferral, Referral, Patient } from "@/types";

interface ReferralParserProps {
  referral: Referral;
}

export function ReferralParser({ referral }: ReferralParserProps) {
  const router = useRouter();
  const createPatient = useCreatePatient();
  const updateReferral = useUpdateReferral();

  const [rawText, setRawText] = useState(referral.rawText);
  const [parsedData, setParsedData] = useState<ParsedReferral | null>(
    referral.parsedData || null
  );
  const [parsing, setParsing] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleParse = async () => {
    setParsing(true);
    try {
      const res = await fetch("/api/ai/parse-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      if (res.ok) {
        const data = await res.json();
        setParsedData(data);
        updateReferral.mutate({
          id: referral.id,
          data: {
            parsedData: data,
            status: "reviewed",
          },
        });
        toast.success("Referral parsed successfully");
      }
    } catch {
      // Silently handle - parsing is optional, user can retry
    } finally {
      setParsing(false);
    }
  };

  const handleCreatePatientAndPlan = () => {
    if (!parsedData) return;
    setCreating(true);

    const patientId = `p-${Date.now()}`;
    const newPatient: Patient = {
      id: patientId,
      firstName: parsedData.patientName.split(" ")[0] || "",
      lastName: parsedData.patientName.split(" ").slice(1).join(" ") || "",
      email: "",
      phone: "",
      dateOfBirth: parsedData.dateOfBirth || "",
      gender: "other",
      address: "",
      condition: parsedData.condition,
      status: "new",
      createdAt: new Date().toISOString(),
      totalSessions: 0,
      completionRate: 0,
    };

    createPatient.mutate(newPatient, {
      onSuccess: () => {
        updateReferral.mutate({ id: referral.id, data: { status: "converted" } });
        toast.success("Patient created from referral");
        router.push(`/patients/${patientId}/plans/new`);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Raw Text Input */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Referral Text</Label>
        <Textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste the referral letter text here..."
          className="min-h-48 text-xs font-mono"
        />
        <Button
          onClick={handleParse}
          disabled={parsing || !rawText.trim()}
          variant="outline"
        >
          {parsing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {parsing ? "Parsing..." : "Parse with AI"}
        </Button>
      </div>

      {/* Parsed Results */}
      {parsedData && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Parsed Information</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Patient Name */}
            <Card>
              <CardContent className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Patient
                  </p>
                  <p className="text-sm font-medium">{parsedData.patientName}</p>
                  {parsedData.dateOfBirth && (
                    <p className="text-xs text-muted-foreground">
                      DOB:{" "}
                      {new Date(parsedData.dateOfBirth).toLocaleDateString(
                        "en-AU"
                      )}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Condition */}
            <Card>
              <CardContent className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Condition
                  </p>
                  <p className="text-sm font-medium">{parsedData.condition}</p>
                </div>
              </CardContent>
            </Card>

            {/* History */}
            <Card className="sm:col-span-2">
              <CardContent className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    History
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {parsedData.history}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card>
              <CardContent className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
                  <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Goals
                  </p>
                  <ul className="space-y-1">
                    {parsedData.goals.map((goal, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Precautions */}
            <Card>
              <CardContent className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950">
                  <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Precautions
                  </p>
                  <ul className="space-y-1">
                    {parsedData.precautions.map((precaution, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        {precaution}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Frequency */}
            {parsedData.suggestedFrequency && (
              <Card className="sm:col-span-2">
                <CardContent className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
                    <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                      Suggested Frequency
                    </p>
                    <p className="text-sm">
                      {parsedData.suggestedFrequency}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Create Patient & Plan */}
          <div className="flex justify-end border-t pt-4">
            <Button onClick={handleCreatePatientAndPlan} disabled={creating}>
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Create Patient & Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
