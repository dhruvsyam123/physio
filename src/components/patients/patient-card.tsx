"use client";

import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import type { Patient } from "@/types";

const statusVariant: Record<Patient["status"], "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  new: "secondary",
  "on-hold": "outline",
  discharged: "destructive",
};

const statusLabel: Record<Patient["status"], string> = {
  active: "Active",
  new: "New",
  "on-hold": "On Hold",
  discharged: "Discharged",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PatientCard({ patient }: { patient: Patient }) {
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`;

  return (
    <Link href={`/patients/${patient.id}`} className="block">
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold leading-none">
                  {patient.firstName} {patient.lastName}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {patient.condition}
                </span>
              </div>
            </div>
            <Badge variant={statusVariant[patient.status]}>
              {statusLabel[patient.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              Last: {formatDate(patient.lastVisit)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              Next: {formatDate(patient.nextAppointment)}
            </span>
          </div>
          <Progress value={patient.completionRate}>
            <ProgressLabel className="text-xs">Completion</ProgressLabel>
            <ProgressValue className="text-xs" />
          </Progress>
        </CardContent>
      </Card>
    </Link>
  );
}
