"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAppointments, useUpdateAppointment } from "@/hooks/use-appointments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Appointment } from "@/types";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});

import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const typeColors: Record<Appointment["type"], { bg: string; border: string; text: string }> = {
  "initial-assessment": {
    bg: "#dbeafe",
    border: "#3b82f6",
    text: "#1e40af",
  },
  "follow-up": {
    bg: "#ccfbf1",
    border: "#14b8a6",
    text: "#0f766e",
  },
  treatment: {
    bg: "#dcfce7",
    border: "#22c55e",
    text: "#15803d",
  },
  review: {
    bg: "#fef3c7",
    border: "#f59e0b",
    text: "#92400e",
  },
  discharge: {
    bg: "#f3e8ff",
    border: "#a855f7",
    text: "#6b21a8",
  },
};

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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CalendarView() {
  const { data: appointments = [], isLoading } = useAppointments();
  const updateAppointment = useUpdateAppointment();
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);

  const events = useMemo(() => {
    return appointments
      .filter((a) => a.status !== "cancelled")
      .map((apt) => {
        const colors = typeColors[apt.type];
        return {
          id: apt.id,
          title: `${apt.patientName} - ${typeLabels[apt.type]}`,
          start: `${apt.date}T${apt.startTime}:00`,
          end: `${apt.date}T${apt.endTime}:00`,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          textColor: colors.text,
          extendedProps: {
            appointment: apt,
          },
        };
      });
  }, [appointments]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleEventClick(info: any) {
    const apt = info.event.extendedProps.appointment as Appointment;
    setSelectedEvent(apt);
  }

  function handleMarkComplete() {
    if (selectedEvent) {
      updateAppointment.mutate(
        { id: selectedEvent.id, data: { status: "completed" } },
        { onSuccess: () => setSelectedEvent(null) }
      );
    }
  }

  function handleCancelAppointment() {
    if (selectedEvent) {
      updateAppointment.mutate(
        { id: selectedEvent.id, data: { status: "cancelled" } },
        { onSuccess: () => setSelectedEvent(null) }
      );
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-4">
      <style jsx global>{`
        .fc {
          --fc-border-color: oklch(0.9 0.01 200);
          --fc-today-bg-color: oklch(0.96 0.02 175 / 0.4);
          --fc-page-bg-color: transparent;
          font-family: inherit;
        }
        .fc .fc-toolbar-title {
          font-size: 1.125rem;
          font-weight: 600;
        }
        .fc .fc-button {
          font-size: 0.8125rem;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        .fc .fc-button-primary {
          background-color: oklch(0.55 0.18 175);
          border-color: oklch(0.55 0.18 175);
          color: white;
        }
        .fc .fc-button-primary:hover {
          background-color: oklch(0.48 0.16 175);
          border-color: oklch(0.48 0.16 175);
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
          background-color: oklch(0.45 0.15 175);
          border-color: oklch(0.45 0.15 175);
        }
        .fc .fc-button-primary:disabled {
          background-color: oklch(0.55 0.18 175 / 0.5);
          border-color: oklch(0.55 0.18 175 / 0.5);
        }
        .fc .fc-button-primary:focus {
          box-shadow: 0 0 0 2px oklch(0.55 0.18 175 / 0.3);
        }
        .fc .fc-timegrid-slot {
          height: 3rem;
        }
        .fc .fc-event {
          border-radius: 0.375rem;
          border-left-width: 3px;
          padding: 2px 4px;
          font-size: 0.75rem;
          cursor: pointer;
        }
        .fc .fc-col-header-cell-cushion {
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 0.5rem;
        }
        .fc .fc-timegrid-axis-cushion {
          font-size: 0.75rem;
        }
        .fc .fc-timegrid-slot-label-cushion {
          font-size: 0.75rem;
        }
        .fc .fc-scrollgrid {
          border-radius: 0.5rem;
          overflow: hidden;
        }
      `}</style>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        initialDate="2026-03-11"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        slotMinTime="07:00:00"
        slotMaxTime="19:00:00"
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5, 6],
          startTime: "08:00",
          endTime: "18:00",
        }}
        allDaySlot={false}
        nowIndicator={true}
        height="auto"
        expandRows={true}
        stickyHeaderDates={true}
        dayMaxEvents={true}
        eventDisplay="block"
      />

      {/* Appointment Detail Dialog */}
      <Dialog
        open={selectedEvent !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="flex flex-col gap-4">
              {/* Patient info */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(selectedEvent.patientName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">
                    {selectedEvent.patientName}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${typeColors[selectedEvent.type].bg === "#dbeafe" ? "bg-blue-50 text-blue-700" : ""}`}
                    style={{
                      backgroundColor: typeColors[selectedEvent.type].bg,
                      color: typeColors[selectedEvent.type].text,
                    }}
                  >
                    {typeLabels[selectedEvent.type]}
                  </Badge>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedEvent.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${statusStyles[selectedEvent.status]}`}
                  >
                    {statusLabels[selectedEvent.status]}
                  </Badge>
                </div>
                {selectedEvent.location && (
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedEvent.location}</p>
                  </div>
                )}
              </div>

              {selectedEvent.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                    {selectedEvent.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedEvent && (
              <div className="flex w-full flex-wrap gap-2">
                <Link href={`/patients/${selectedEvent.patientId}`}>
                  <Button variant="outline" size="sm">
                    View Patient
                  </Button>
                </Link>
                {selectedEvent.status !== "completed" &&
                  selectedEvent.status !== "cancelled" && (
                    <>
                      <Button
                        size="sm"
                        onClick={handleMarkComplete}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Mark Complete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelAppointment}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Cancel Appointment
                      </Button>
                    </>
                  )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
