"use client";

import { CalendarView } from "@/components/schedule/calendar-view";
import { NewAppointmentDialog } from "@/components/schedule/new-appointment-dialog";
import { SmartSuggestions } from "@/components/schedule/smart-suggestions";
import { Calendar } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-teal-100 p-2 dark:bg-teal-950">
            <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>
            <p className="text-sm text-muted-foreground">
              Manage your appointments and availability.
            </p>
          </div>
        </div>
        <NewAppointmentDialog />
      </div>

      {/* Calendar */}
      <CalendarView />

      {/* Smart Suggestions */}
      <SmartSuggestions />
    </div>
  );
}
