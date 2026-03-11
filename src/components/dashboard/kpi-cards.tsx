"use client";

import { Users, Calendar, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppointments } from "@/hooks/use-appointments";
import { usePatients } from "@/hooks/use-patients";

interface KPICardProps {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function KPICard({ label, value, change, icon, iconBg, iconColor }: KPICardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight">{value}</span>
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                isPositive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(change)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KPICards() {
  const { data: appointments = [], isLoading: loadingAppointments } = useAppointments();
  const { data: patients = [], isLoading: loadingPatients } = usePatients();

  if (loadingAppointments || loadingPatients) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-muted animate-pulse" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                <div className="h-7 w-16 rounded bg-muted animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const today = "2026-03-11";
  const todaysAppointments = appointments.filter((a) => a.date === today);
  const patientsToday = todaysAppointments.length;

  // Sessions this week (Mon Mar 9 - Sun Mar 15)
  const weekStart = "2026-03-09";
  const weekEnd = "2026-03-15";
  const sessionsThisWeek = appointments.filter(
    (a) => a.date >= weekStart && a.date <= weekEnd && a.status !== "cancelled"
  ).length;

  // Pending follow-ups: active patients whose lastVisit is > 7 days ago
  const sevenDaysAgo = "2026-03-04";
  const pendingFollowups = patients.filter(
    (p) =>
      p.status === "active" &&
      p.lastVisit &&
      p.lastVisit.slice(0, 10) < sevenDaysAgo
  ).length;

  // Average completion rate across active patients
  const activePatients = patients.filter((p) => p.status === "active");
  const avgCompletion =
    activePatients.length > 0
      ? Math.round(
          activePatients.reduce((sum, p) => sum + p.completionRate, 0) /
            activePatients.length
        )
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        label="Patients Today"
        value={String(patientsToday)}
        change={12}
        icon={<Users className="h-5 w-5" />}
        iconBg="bg-blue-50 dark:bg-blue-950"
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <KPICard
        label="Sessions This Week"
        value={String(sessionsThisWeek)}
        change={8}
        icon={<Calendar className="h-5 w-5" />}
        iconBg="bg-teal-50 dark:bg-teal-950"
        iconColor="text-teal-600 dark:text-teal-400"
      />
      <KPICard
        label="Pending Follow-ups"
        value={String(pendingFollowups)}
        change={-5}
        icon={<Clock className="h-5 w-5" />}
        iconBg="bg-amber-50 dark:bg-amber-950"
        iconColor="text-amber-600 dark:text-amber-400"
      />
      <KPICard
        label="Completion Rate"
        value={`${avgCompletion}%`}
        change={3}
        icon={<TrendingUp className="h-5 w-5" />}
        iconBg="bg-emerald-50 dark:bg-emerald-950"
        iconColor="text-emerald-600 dark:text-emerald-400"
      />
    </div>
  );
}
