"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Dumbbell,
  FileText,
  Settings,
  UserPlus,
  CalendarPlus,
  ClipboardPlus,
} from "lucide-react";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { usePatients } from "@/hooks/use-patients";
import { useExercises } from "@/hooks/use-exercises";

const pages = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Patients", icon: Users, href: "/patients" },
  { name: "Schedule", icon: Calendar, href: "/schedule" },
  { name: "Messages", icon: MessageSquare, href: "/messages" },
  { name: "Exercises", icon: Dumbbell, href: "/exercises" },
  { name: "Referrals", icon: FileText, href: "/referrals" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

const quickActions = [
  { name: "New Patient", icon: UserPlus, href: "/patients/new" },
  { name: "New Appointment", icon: CalendarPlus, href: "/schedule" },
  { name: "New SOAP Note", icon: ClipboardPlus, href: "/patients" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: patients = [] } = usePatients();
  const { data: exercises = [] } = useExercises();
  const [search, setSearch] = useState("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelect(href: string) {
    setOpen(false);
    setSearch("");
    router.push(href);
  }

  const filteredPatients = search.length >= 1
    ? patients
        .filter(
          (p) =>
            `${p.firstName} ${p.lastName}`
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            p.condition.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const filteredExercises = search.length >= 1
    ? exercises
        .filter((e) =>
          e.name.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput
          placeholder="Search pages, patients, exercises..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Pages">
            {pages.map((page) => (
              <CommandItem
                key={page.href}
                onSelect={() => handleSelect(page.href)}
              >
                <page.icon className="h-4 w-4 text-muted-foreground" />
                <span>{page.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem
                key={action.name}
                onSelect={() => handleSelect(action.href)}
              >
                <action.icon className="h-4 w-4 text-muted-foreground" />
                <span>{action.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          {filteredPatients.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Patients">
                {filteredPatients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    onSelect={() => handleSelect(`/patients/${patient.id}`)}
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.firstName} {patient.lastName}</span>
                    <span className="ml-auto text-xs text-muted-foreground truncate max-w-[200px]">
                      {patient.condition}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {filteredExercises.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Exercises">
                {filteredExercises.map((exercise) => (
                  <CommandItem
                    key={exercise.id}
                    onSelect={() => handleSelect("/exercises")}
                  >
                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    <span>{exercise.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {exercise.bodyRegion.replace("-", " ")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
