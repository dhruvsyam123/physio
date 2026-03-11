"use client";

import Link from "next/link";
import { AlertCircle, MessageSquare, CalendarPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePatientStore } from "@/stores/patient-store";

export function PendingFollowups() {
  const patients = usePatientStore((state) => state.patients);

  // Patients whose lastVisit is more than 7 days ago from today (2026-03-11)
  const sevenDaysAgo = new Date("2026-03-04T00:00:00Z");
  const pendingPatients = patients.filter((p) => {
    if (p.status !== "active" || !p.lastVisit) return false;
    const lastVisitDate = new Date(p.lastVisit);
    return lastVisitDate < sevenDaysAgo;
  });

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getDaysAgo(dateStr: string): number {
    const today = new Date("2026-03-11T00:00:00Z");
    const date = new Date(dateStr);
    return Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          Pending Follow-ups
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {pendingPatients.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No pending follow-ups.
          </p>
        ) : (
          <div className="divide-y">
            {pendingPatients.map((patient) => (
              <div key={patient.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <Link
                    href={`/patients/${patient.id}`}
                    className="text-sm font-medium hover:text-teal-600 truncate"
                  >
                    {patient.firstName} {patient.lastName}
                  </Link>
                  <span className="text-xs text-muted-foreground truncate">
                    {patient.condition}
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    Last visit: {formatDate(patient.lastVisit!)} ({getDaysAgo(patient.lastVisit!)} days ago)
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Link href={`/messages?patient=${patient.id}`}>
                    <Button variant="outline" size="icon-sm" aria-label="Send message">
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/schedule?new=true&patient=${patient.id}`}>
                    <Button variant="outline" size="icon-sm" aria-label="Schedule appointment">
                      <CalendarPlus className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
