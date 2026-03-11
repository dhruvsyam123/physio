"use client";

import { useMemo, useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOutcomesByPatient } from "@/hooks/use-outcomes";
import { usePatient } from "@/hooks/use-patients";
import { outcomeDefinitions } from "@/data/outcomes";
import type { MeasureType } from "@/types/outcomes";

function computeTrend(
  initial: number,
  latest: number,
  lowerIsBetter: boolean
): "improving" | "stable" | "declining" {
  const pct = lowerIsBetter
    ? ((initial - latest) / Math.max(initial, 1)) * 100
    : ((latest - initial) / Math.max(initial, 1)) * 100;
  if (pct > 5) return "improving";
  if (pct < -5) return "declining";
  return "stable";
}

export function AIProgressSummary({ patientId }: { patientId: string }) {
  const { data: outcomes = [] } = useOutcomesByPatient(patientId);
  const { data: patient } = usePatient(patientId);
  const [copied, setCopied] = useState(false);

  const summaryText = useMemo(() => {
    if (!patient || outcomes.length === 0) return null;

    const name = patient.firstName;
    const sessions = patient.totalSessions;

    // Group by label
    const labelGroups = new Map<string, typeof outcomes>();
    for (const o of outcomes) {
      const key = `${o.type}::${o.label}`;
      if (!labelGroups.has(key)) labelGroups.set(key, []);
      labelGroups.get(key)!.push(o);
    }

    const lines: string[] = [];

    // Opening line
    lines.push(
      `Over ${sessions} session${sessions !== 1 ? "s" : ""}, ${name} has demonstrated the following progress:`
    );
    lines.push("");

    let improvingCount = 0;
    let totalMeasures = 0;

    for (const [key, records] of labelGroups) {
      if (records.length < 2) continue;
      const sorted = [...records].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const type = key.split("::")[0] as MeasureType;
      const def = outcomeDefinitions.find((d) => d.type === type);
      const lowerIsBetter = def?.lowerIsBetter ?? false;
      const initial = sorted[0].value;
      const latest = sorted[sorted.length - 1].value;
      const trend = computeTrend(initial, latest, lowerIsBetter);
      totalMeasures++;

      if (trend === "improving") improvingCount++;

      const pctRaw = lowerIsBetter
        ? ((initial - latest) / Math.max(initial, 1)) * 100
        : ((latest - initial) / Math.max(initial, 1)) * 100;
      const pct = Math.round(Math.abs(pctRaw));

      if (type === "vas" || type === "nprs") {
        lines.push(
          `- ${sorted[0].label}: ${trend === "improving" ? "Decreased" : trend === "declining" ? "Increased" : "Stable"} from ${initial}/10 to ${latest}/10 (${pct}% ${trend === "improving" ? "improvement" : trend === "declining" ? "worsening" : "change"}).`
        );
      } else if (type === "rom") {
        lines.push(
          `- ${sorted[0].label}: ${trend === "improving" ? "Improved" : trend === "declining" ? "Declined" : "Stable"} from ${initial}\u00b0 to ${latest}\u00b0 (${pct}% improvement).`
        );
      } else if (type === "mmt") {
        lines.push(
          `- ${sorted[0].label}: ${trend === "improving" ? "Strengthened" : "Stable"} from ${initial}/5 to ${latest}/5.`
        );
      } else if (type === "dash" || type === "oswestry") {
        lines.push(
          `- ${sorted[0].label}: ${trend === "improving" ? "Improved" : "Changed"} from ${initial}/100 to ${latest}/100 (${pct}% improvement).`
        );
      } else {
        lines.push(
          `- ${sorted[0].label}: ${initial}${sorted[0].unit} \u2192 ${latest}${sorted[0].unit} (${pct}% ${trend === "improving" ? "improvement" : "change"}).`
        );
      }
    }

    // Overall assessment
    lines.push("");
    const overallPct =
      totalMeasures > 0 ? Math.round((improvingCount / totalMeasures) * 100) : 0;
    lines.push(
      `Overall, ${overallPct}% of tracked measures show meaningful improvement.`
    );

    // Discharge estimate
    const painRecords = outcomes.filter(
      (o) => o.type === "vas" || o.type === "nprs"
    );
    if (painRecords.length >= 2) {
      const sorted = [...painRecords].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const latestPain = sorted[sorted.length - 1].value;
      if (latestPain <= 3) {
        lines.push(
          `Pain levels are at or below the 3/10 target. The patient may be nearing discharge readiness.`
        );
      } else {
        const firstDate = new Date(sorted[0].date);
        const lastDate = new Date(sorted[sorted.length - 1].date);
        const daySpan = Math.max(
          (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24),
          1
        );
        const painDrop = sorted[0].value - latestPain;
        if (painDrop > 0) {
          const ratePerDay = painDrop / daySpan;
          const remaining = latestPain - 3;
          const daysToGoal = Math.ceil(remaining / ratePerDay);
          const sessionsEstimate = Math.ceil(daysToGoal / 7);
          lines.push(
            `Based on current trajectory, estimated discharge readiness in approximately ${sessionsEstimate} session${sessionsEstimate !== 1 ? "s" : ""}.`
          );
        }
      }
    }

    return lines.join("\n");
  }, [outcomes, patient]);

  const handleCopy = () => {
    if (summaryText) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!summaryText) {
    return null;
  }

  return (
    <Card
      className="relative overflow-hidden"
      style={{
        borderImage: "linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981) 1",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.05), rgba(6,182,212,0.05), rgba(16,185,129,0.05))",
        }}
      />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-violet-500" />
            <CardTitle>AI Progress Summary</CardTitle>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {summaryText}
        </div>
      </CardContent>
    </Card>
  );
}
