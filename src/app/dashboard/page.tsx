"use client";

import Link from "next/link";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { TodaysSchedule } from "@/components/dashboard/todays-schedule";
import { PendingFollowups } from "@/components/dashboard/pending-followups";
import { RecentNotes } from "@/components/dashboard/recent-notes";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useAppointmentStore } from "@/stores/appointment-store";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function UpcomingPatientsStrip() {
  const appointments = useAppointmentStore((s) => s.appointments);

  const today = "2026-03-11";
  const todaysApts = appointments
    .filter((a) => a.date === today && a.status !== "cancelled")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Find the next upcoming (first that isn't completed/in-progress, or first scheduled/confirmed)
  const now = "09:30"; // Simulate current time for demo
  const nextIdx = todaysApts.findIndex(
    (a) =>
      a.startTime >= now &&
      (a.status === "scheduled" || a.status === "confirmed")
  );

  if (todaysApts.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 flex-nowrap">
      {todaysApts.map((apt, idx) => {
        // Look up patient condition from appointment patientId
        const isNext = idx === nextIdx;
        return (
          <Tooltip key={apt.id}>
            <TooltipTrigger
              render={
                <Link
                  href={`/patients/${apt.patientId}`}
                  className="flex flex-col items-center gap-1.5 shrink-0"
                />
              }
            >
              <Avatar
                size="lg"
                className={
                  isNext
                    ? "ring-2 ring-teal-500 ring-offset-2 ring-offset-background"
                    : ""
                }
              >
                <AvatarFallback className={isNext ? "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 text-xs" : "text-xs"}>
                  {getInitials(apt.patientName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] text-muted-foreground font-medium">
                {apt.startTime}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>{apt.patientName}</span>
              {apt.notes && (
                <span className="block text-[10px] opacity-80">
                  {apt.notes.slice(0, 60)}...
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Good morning, Dr. Thompson. Here&apos;s your overview for today.
        </p>
      </div>

      {/* Upcoming Patients Strip */}
      <UpcomingPatientsStrip />

      {/* KPI Cards */}
      <KPICards />

      {/* Two-column layout: Schedule + Follow-ups */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TodaysSchedule />
        <PendingFollowups />
      </div>

      {/* AI Insights */}
      <AIInsights />

      {/* Recent Notes */}
      <RecentNotes />
    </div>
  );
}
