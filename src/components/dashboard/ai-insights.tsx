"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, RefreshCw, AlertTriangle, ClipboardList, Star, UserPlus, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePatients } from "@/hooks/use-patients";

interface Insight {
  id: string;
  icon: React.ReactNode;
  text: string;
  patientId?: string;
}

export function AIInsights() {
  const { data: patients = [], isLoading } = usePatients();
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0);

  function computeInsights(): Insight[] {
    const insights: Insight[] = [];

    // 1. Patients with completion rate < 50%
    const lowCompletion = patients.filter(
      (p) => p.status === "active" && p.completionRate < 50
    );
    for (const p of lowCompletion) {
      insights.push({
        id: `low-${p.id}`,
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        text: `${p.firstName} ${p.lastName}'s completion rate is ${p.completionRate}% \u2014 consider adjusting treatment intensity`,
        patientId: p.id,
      });
    }

    // 2. Patients with lastVisit > 10 days ago and status 'active'
    const tenDaysAgo = new Date("2026-03-01");
    const overdueFollowup = patients.filter(
      (p) =>
        p.status === "active" &&
        p.lastVisit &&
        new Date(p.lastVisit) < tenDaysAgo
    );
    for (const p of overdueFollowup) {
      const lastVisitDate = new Date(p.lastVisit!);
      const today = new Date("2026-03-11");
      const daysSince = Math.floor(
        (today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      insights.push({
        id: `overdue-${p.id}`,
        icon: <ClipboardList className="h-4 w-4 text-blue-500" />,
        text: `${p.firstName} ${p.lastName} is overdue for follow-up (${daysSince} days since last visit)`,
        patientId: p.id,
      });
    }

    // 3. Patients with completion rate > 80%
    const highCompletion = patients.filter(
      (p) => p.status === "active" && p.completionRate > 80
    );
    for (const p of highCompletion) {
      insights.push({
        id: `progress-${p.id}`,
        icon: <Star className="h-4 w-4 text-emerald-500" />,
        text: `${p.firstName} ${p.lastName} is progressing well (${p.completionRate}% completion) \u2014 may be ready for plan advancement`,
        patientId: p.id,
      });
    }

    // 4. Count patients with status 'new'
    const newPatients = patients.filter((p) => p.status === "new");
    if (newPatients.length > 0) {
      insights.push({
        id: "new-patients",
        icon: <UserPlus className="h-4 w-4 text-purple-500" />,
        text: `${newPatients.length} new patient(s) pending initial assessment`,
      });
    }

    return insights;
  }

  const insights = computeInsights();

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setKey((k) => k + 1);
      setRefreshing(false);
    }, 800);
  }

  return (
    <div className="rounded-xl p-[1px] ai-gradient">
      <Card className="rounded-[11px] border-0" key={key}>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              AI Clinical Insights
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-1.5 text-xs"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3 py-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-4 w-4 shrink-0 rounded bg-muted animate-pulse mt-0.5" />
                  <div className="h-4 w-full rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : insights.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No insights available at this time.
            </p>
          ) : (
            <div className="divide-y">
              {insights.slice(0, 4).map((insight) => (
                <div
                  key={insight.id}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="mt-0.5 shrink-0">{insight.icon}</div>
                  <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
                    {insight.text}
                  </p>
                  {insight.patientId && (
                    <Link
                      href={`/patients/${insight.patientId}`}
                      className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
                    >
                      View
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
