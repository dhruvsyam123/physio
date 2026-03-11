"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppointments } from "@/hooks/use-appointments";
import type { Appointment } from "@/types";

const typeLabels: Record<Appointment["type"], string> = {
  "initial-assessment": "Initial Assessment",
  "follow-up": "Follow-up",
  treatment: "Treatment",
  review: "Review",
  discharge: "Discharge",
};

const statusStyles: Record<Appointment["status"], string> = {
  scheduled: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  confirmed: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  "in-progress": "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  "no-show": "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const statusLabels: Record<Appointment["status"], string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No Show",
};

export function TodaysSchedule() {
  const { data: appointments = [], isLoading } = useAppointments();

  const today = "2026-03-11";
  const todaysAppointments = appointments
    .filter((a) => a.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-teal-600" />
          Today&apos;s Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-3 py-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                <div className="flex flex-col gap-1 flex-1">
                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : todaysAppointments.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No appointments scheduled for today.
          </p>
        ) : (
          <div className="divide-y">
            {todaysAppointments.map((apt) => (
              <Link
                key={apt.id}
                href={`/patients/${apt.patientId}`}
                className="flex items-center gap-3 py-3 transition-colors hover:bg-muted/50 -mx-4 px-4 first:pt-0 last:pb-0"
              >
                <div className="w-16 shrink-0 text-sm font-medium text-muted-foreground">
                  {apt.startTime}
                </div>
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {apt.patientName}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    >
                      {typeLabels[apt.type]}
                    </Badge>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`shrink-0 text-xs ${statusStyles[apt.status]}`}
                >
                  {statusLabels[apt.status]}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href="/schedule"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          View Full Schedule
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
