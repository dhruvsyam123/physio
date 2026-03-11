"use client";

import Link from "next/link";
import { Brain, Clock, AlertTriangle, ClipboardList, CalendarPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppointments } from "@/hooks/use-appointments";
import { usePatients } from "@/hooks/use-patients";

interface Suggestion {
  id: string;
  icon: React.ReactNode;
  text: string;
  actions: { label: string; href?: string }[];
}

export function SmartSuggestions() {
  const { data: appointments = [] } = useAppointments();
  const { data: patients = [] } = usePatients();

  function computeSuggestions(): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const today = "2026-03-11";

    // 1. Find gaps in today's schedule (>1 hour between appointments)
    const todaysApts = appointments
      .filter((a) => a.date === today && a.status !== "cancelled")
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (let i = 0; i < todaysApts.length - 1; i++) {
      const endCurrent = todaysApts[i].endTime;
      const startNext = todaysApts[i + 1].startTime;
      const [endH, endM] = endCurrent.split(":").map(Number);
      const [startH, startM] = startNext.split(":").map(Number);
      const gapMinutes = (startH * 60 + startM) - (endH * 60 + endM);
      if (gapMinutes > 60) {
        const overdueCount = patients.filter(
          (p) =>
            p.status === "active" &&
            p.lastVisit &&
            p.lastVisit.slice(0, 10) < "2026-03-04"
        ).length;
        suggestions.push({
          id: `gap-${i}`,
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          text: `${endCurrent}\u2013${startNext} gap available \u2014 ${overdueCount} patients need follow-ups`,
          actions: [{ label: "Schedule", href: "/schedule" }],
        });
        break; // Only show first gap
      }
    }

    // 2. Find patients with most cancelled/no-show appointments
    const cancelledCounts: Record<string, { name: string; count: number; id: string }> = {};
    for (const apt of appointments) {
      if (apt.status === "cancelled" || apt.status === "no-show") {
        if (!cancelledCounts[apt.patientId]) {
          cancelledCounts[apt.patientId] = {
            name: apt.patientName,
            count: 0,
            id: apt.patientId,
          };
        }
        cancelledCounts[apt.patientId].count++;
      }
    }
    const topCancelled = Object.values(cancelledCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 1);
    for (const p of topCancelled) {
      if (p.count > 0) {
        suggestions.push({
          id: `missed-${p.id}`,
          icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
          text: `${p.name} has missed ${p.count} recent appointment(s) \u2014 consider alternative scheduling`,
          actions: [{ label: "View Patient", href: `/patients/${p.id}` }],
        });
      }
    }

    // 3. Count overdue patients (active, last visit > 7 days)
    const sevenDaysAgo = "2026-03-04";
    const overduePatients = patients.filter(
      (p) =>
        p.status === "active" &&
        p.lastVisit &&
        p.lastVisit.slice(0, 10) < sevenDaysAgo
    );
    if (overduePatients.length > 0) {
      suggestions.push({
        id: "overdue",
        icon: <ClipboardList className="h-4 w-4 text-red-500" />,
        text: `${overduePatients.length} patient(s) overdue for appointment`,
        actions: [{ label: "View Patients", href: "/patients" }],
      });
    }

    return suggestions;
  }

  const suggestions = computeSuggestions();

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-teal-600" />
          AI Schedule Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No suggestions at this time. Your schedule looks great!
          </p>
        ) : (
          <div className="divide-y">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="mt-0.5 shrink-0">{suggestion.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {suggestion.text}
                  </p>
                  <div className="mt-2 flex gap-2">
                    {suggestion.actions.map((action) =>
                      action.href ? (
                        <Link key={action.label} href={action.href}>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <CalendarPlus className="h-3 w-3" />
                            {action.label}
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          key={action.label}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                        >
                          {action.label}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
