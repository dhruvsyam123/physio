"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppointmentStore } from "@/stores/appointment-store";
import { usePatientStore } from "@/stores/patient-store";
import { toast } from "sonner";
import type { Appointment } from "@/types";

const appointmentTypes: { value: Appointment["type"]; label: string }[] = [
  { value: "initial-assessment", label: "Initial Assessment" },
  { value: "follow-up", label: "Follow-up" },
  { value: "treatment", label: "Treatment" },
  { value: "review", label: "Review" },
  { value: "discharge", label: "Discharge" },
];

export function NewAppointmentDialog() {
  const patients = usePatientStore((state) => state.patients);
  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  const [open, setOpen] = useState(false);

  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState<Appointment["type"]>("follow-up");
  const [notes, setNotes] = useState("");

  function resetForm() {
    setPatientId("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setType("follow-up");
    setNotes("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientId || !date || !startTime || !endTime) return;

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      date,
      startTime,
      endTime,
      type,
      status: "scheduled",
      notes: notes || undefined,
    };

    addAppointment(appointment);
    toast.success("Appointment scheduled successfully");
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
          <DialogDescription>
            Schedule a new appointment for a patient.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Patient Select */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="patient">Patient</Label>
            <Select value={patientId} onValueChange={(v) => setPatientId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type">Appointment Type</Label>
            <Select value={type} onValueChange={(val) => { if (val) setType(val as Appointment["type"]); }}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes for this appointment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Schedule Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
