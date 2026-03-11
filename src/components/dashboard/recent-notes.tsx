"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useNotes } from "@/hooks/use-notes";
import { usePatients } from "@/hooks/use-patients";

export function RecentNotes() {
  const { data: notes = [], isLoading: loadingNotes } = useNotes();
  const { data: patients = [] } = usePatients();
  const getPatientById = (id: string) => patients.find((p) => p.id === id);

  // Sort by createdAt descending and take latest 5
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + "...";
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-teal-600" />
          Recent SOAP Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loadingNotes ? (
          <div className="space-y-3 py-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-muted animate-pulse" />
                <div className="flex flex-col gap-1 flex-1">
                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-full rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : recentNotes.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No notes yet.
          </p>
        ) : (
          <div className="divide-y">
            {recentNotes.map((note) => {
              const patient = getPatientById(note.patientId);
              const patientName = patient
                ? `${patient.firstName} ${patient.lastName}`
                : "Unknown Patient";

              return (
                <Link
                  key={note.id}
                  href={`/patients/${note.patientId}/notes/${note.id}`}
                  className="flex gap-4 py-3 transition-colors hover:bg-muted/50 -mx-4 px-4 first:pt-0 last:pb-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
                    <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">
                        {patientName}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDate(note.date)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {truncate(note.assessment, 120)}
                    </p>
                    <span className="text-xs text-muted-foreground/70">
                      {note.therapistName} {note.signed ? "" : "(Unsigned)"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href="/patients"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          View All Notes
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
