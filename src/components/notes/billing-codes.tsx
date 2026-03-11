"use client";

import { useState, useMemo } from "react";
import { DollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { CPTCode } from "@/types/billing";

interface CPTCodeWithTriggers extends CPTCode {
  triggerWords: string[];
}

const cptDatabase: CPTCodeWithTriggers[] = [
  { code: "97161", description: "PT Evaluation - Low Complexity", category: "evaluation", timePerUnit: 30, triggerWords: ["initial assessment", "initial evaluation", "new patient"], defaultRate: 120 },
  { code: "97162", description: "PT Evaluation - Moderate Complexity", category: "evaluation", timePerUnit: 45, triggerWords: ["initial assessment", "moderate", "multiple regions"], defaultRate: 150 },
  { code: "97163", description: "PT Evaluation - High Complexity", category: "evaluation", timePerUnit: 60, triggerWords: ["initial assessment", "complex", "multiple comorbidities"], defaultRate: 180 },
  { code: "97110", description: "Therapeutic Exercises", category: "therapeutic", timePerUnit: 15, triggerWords: ["exercise", "strengthening", "stretching", "ROM exercises", "home exercise"], defaultRate: 45 },
  { code: "97112", description: "Neuromuscular Re-education", category: "therapeutic", timePerUnit: 15, triggerWords: ["balance", "proprioception", "coordination", "motor control", "stabilization", "stabilisation"], defaultRate: 50 },
  { code: "97116", description: "Gait Training", category: "therapeutic", timePerUnit: 15, triggerWords: ["gait", "walking", "ambulation", "stairs"], defaultRate: 45 },
  { code: "97140", description: "Manual Therapy", category: "therapeutic", timePerUnit: 15, triggerWords: ["manual therapy", "mobilisation", "mobilization", "manipulation", "soft tissue", "massage", "trigger point"], defaultRate: 55 },
  { code: "97530", description: "Therapeutic Activities", category: "therapeutic", timePerUnit: 15, triggerWords: ["functional", "activity", "task-specific", "work simulation"], defaultRate: 50 },
  { code: "97035", description: "Ultrasound", category: "modality", timePerUnit: 15, triggerWords: ["ultrasound", "US therapy"], defaultRate: 30 },
  { code: "97032", description: "Electrical Stimulation", category: "modality", timePerUnit: 15, triggerWords: ["electrical stimulation", "e-stim", "TENS", "NMES", "IFC"], defaultRate: 30 },
  { code: "97010", description: "Hot/Cold Packs", category: "modality", timePerUnit: 15, triggerWords: ["hot pack", "cold pack", "ice", "heat", "cryotherapy"], defaultRate: 15 },
  { code: "97542", description: "Wheelchair Management", category: "therapeutic", timePerUnit: 15, triggerWords: ["wheelchair", "seating"], defaultRate: 50 },
];

function calculateUnits(minutes: number): number {
  if (minutes < 8) return 0;
  if (minutes <= 22) return 1;
  if (minutes <= 37) return 2;
  if (minutes <= 52) return 3;
  if (minutes <= 67) return 4;
  return Math.round(minutes / 15);
}

interface NoteContent {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export function BillingCodes({ noteContent }: { noteContent: NoteContent }) {
  const [sessionTime, setSessionTime] = useState(45);
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [timeAllocations, setTimeAllocations] = useState<Record<string, number>>({});

  // Scan SOAP sections for trigger words
  const suggestedCodes = useMemo(() => {
    const fullText = [
      noteContent.subjective,
      noteContent.objective,
      noteContent.assessment,
      noteContent.plan,
    ]
      .join(" ")
      .toLowerCase();

    return cptDatabase
      .map((cpt) => {
        const matchedWords = cpt.triggerWords.filter((tw) =>
          fullText.includes(tw.toLowerCase())
        );
        return {
          ...cpt,
          matchedWords,
          isMatch: matchedWords.length > 0,
        };
      })
      .filter((c) => c.isMatch);
  }, [noteContent]);

  const toggleCode = (code: string) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const updateTime = (code: string, minutes: number) => {
    setTimeAllocations((prev) => ({ ...prev, [code]: minutes }));
  };

  // Calculate totals
  const totalAllocated = useMemo(() => {
    return Array.from(selectedCodes).reduce(
      (sum, code) => sum + (timeAllocations[code] || 0),
      0
    );
  }, [selectedCodes, timeAllocations]);

  const billingEntries = useMemo(() => {
    return Array.from(selectedCodes).map((code) => {
      const cpt = cptDatabase.find((c) => c.code === code)!;
      const minutes = timeAllocations[code] || 0;
      const units = calculateUnits(minutes);
      const rate = cpt.defaultRate ?? 0;
      return {
        code: cpt.code,
        description: cpt.description,
        minutes,
        units,
        revenue: units * rate,
        rate,
      };
    });
  }, [selectedCodes, timeAllocations]);

  const totalUnits = billingEntries.reduce((s, e) => s + e.units, 0);
  const totalRevenue = billingEntries.reduce((s, e) => s + e.revenue, 0);

  const categoryColors: Record<string, string> = {
    evaluation: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    therapeutic: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    modality: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    testing: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="size-5 text-green-600" />
          <div>
            <CardTitle>Billing & CPT Codes</CardTitle>
            <CardDescription>Auto-suggested codes based on SOAP note content</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Session Time */}
        <div className="flex items-center gap-3">
          <Label className="whitespace-nowrap">Session Time (min)</Label>
          <Input
            type="number"
            value={sessionTime}
            onChange={(e) => setSessionTime(parseInt(e.target.value) || 0)}
            className="w-24"
          />
        </div>

        {/* Suggested Codes */}
        {suggestedCodes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No matching CPT codes found. Add content to the SOAP note to see suggestions.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Suggested Codes
            </Label>
            {suggestedCodes.map((cpt) => {
              const isSelected = selectedCodes.has(cpt.code);
              const allocatedTime = timeAllocations[cpt.code] || 0;
              const units = isSelected ? calculateUnits(allocatedTime) : 0;

              return (
                <div
                  key={cpt.code}
                  className={`flex flex-col gap-2 rounded-lg border p-3 transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCode(cpt.code)}
                      className="size-4 rounded border-input accent-primary"
                    />
                    <span className="font-mono text-sm font-medium">{cpt.code}</span>
                    <span className="text-sm">{cpt.description}</span>
                    <Badge
                      variant="secondary"
                      className={`ml-auto text-[10px] ${categoryColors[cpt.category] ?? ""}`}
                    >
                      {cpt.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 pl-6">
                    <span className="text-xs text-muted-foreground">Matched:</span>
                    {cpt.matchedWords.map((w) => (
                      <span
                        key={w}
                        className="rounded bg-yellow-100 px-1.5 py-0.5 text-[11px] font-medium text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                      >
                        {w}
                      </span>
                    ))}
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-3 pl-6">
                      <Label className="text-xs">Time (min):</Label>
                      <Input
                        type="number"
                        value={allocatedTime || ""}
                        onChange={(e) =>
                          updateTime(cpt.code, parseInt(e.target.value) || 0)
                        }
                        className="w-20"
                        placeholder="0"
                      />
                      <span className="text-xs text-muted-foreground">
                        = {units} unit{units !== 1 ? "s" : ""}
                      </span>
                      {allocatedTime > 0 && allocatedTime < 8 && (
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertTriangle className="size-3" />
                          Below 8-min threshold
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Warnings */}
        {totalAllocated > sessionTime && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
            <AlertTriangle className="size-4 shrink-0" />
            Total allocated time ({totalAllocated} min) exceeds session time ({sessionTime} min).
          </div>
        )}

        {/* Summary */}
        {selectedCodes.size > 0 && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 text-sm font-medium">Billing Summary</h4>
            <div className="flex flex-col gap-1 text-sm">
              {billingEntries.map((e) => (
                <div key={e.code} className="flex items-center justify-between">
                  <span>
                    {e.code} - {e.description}
                  </span>
                  <span className="font-mono text-xs">
                    {e.units} unit{e.units !== 1 ? "s" : ""} &times; ${e.rate} = $
                    {e.revenue}
                  </span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t pt-2 font-medium">
                <span>Total</span>
                <span className="font-mono">
                  {totalUnits} units &mdash; ${totalRevenue}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
