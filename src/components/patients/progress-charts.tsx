"use client";

import { useState, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
  Legend,
} from "recharts";
import { Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { useOutcomesByPatient, useCreateOutcome } from "@/hooks/use-outcomes";
import { outcomeDefinitions } from "@/data/outcomes";
import type { MeasureType } from "@/types/outcomes";

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
}

function computeImprovement(
  initial: number,
  latest: number,
  lowerIsBetter: boolean
): number {
  if (initial === 0) return 0;
  if (lowerIsBetter) {
    return Math.round(((initial - latest) / initial) * 100);
  }
  return Math.round(((latest - initial) / initial) * 100);
}

const measureTypeLabels: Record<MeasureType, string> = {
  vas: "VAS Pain Scale",
  nprs: "NPRS Pain Scale",
  rom: "Range of Motion",
  mmt: "Manual Muscle Test",
  dash: "DASH Score",
  oswestry: "Oswestry Disability Index",
  custom: "Custom Measure",
};

const defaultLabels: Record<MeasureType, string> = {
  vas: "VAS Pain Score",
  nprs: "NPRS Pain Score",
  rom: "ROM",
  mmt: "Muscle Strength",
  dash: "DASH Score",
  oswestry: "Oswestry Disability Index",
  custom: "Custom Measure",
};

export function ProgressCharts({ patientId }: { patientId: string }) {
  const { data: outcomes = [] } = useOutcomesByPatient(patientId);
  const createOutcome = useCreateOutcome();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state for new measurement
  const [newType, setNewType] = useState<MeasureType>("vas");
  const [newLabel, setNewLabel] = useState("VAS Pain Score");
  const [newValue, setNewValue] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newNotes, setNewNotes] = useState("");

  // Group outcomes by label
  const grouped = useMemo(() => {
    const map = new Map<string, typeof outcomes>();
    for (const o of outcomes) {
      const key = `${o.type}::${o.label}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    }
    // Sort each group by date
    for (const [, records] of map) {
      records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return map;
  }, [outcomes]);

  // Pain scores (VAS / NPRS)
  const painData = useMemo(() => {
    const painRecords = outcomes
      .filter((o) => o.type === "vas" || o.type === "nprs")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return painRecords.map((r) => ({
      date: formatDateShort(r.date),
      value: r.value,
      fullDate: r.date,
    }));
  }, [outcomes]);

  // ROM measurements - initial vs latest
  const romData = useMemo(() => {
    const romLabels = new Set<string>();
    for (const o of outcomes) {
      if (o.type === "rom") romLabels.add(o.label);
    }
    return Array.from(romLabels).map((label) => {
      const records = grouped.get(`rom::${label}`) ?? [];
      const initial = records[0]?.value ?? 0;
      const latest = records[records.length - 1]?.value ?? 0;
      return { label: label.replace(" ROM", ""), initial, latest };
    });
  }, [outcomes, grouped]);

  // Functional scores (DASH / Oswestry)
  const functionalData = useMemo(() => {
    const records = outcomes
      .filter((o) => o.type === "dash" || o.type === "oswestry")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return records.map((r) => ({
      date: formatDateShort(r.date),
      value: r.value,
      label: r.label,
      fullDate: r.date,
    }));
  }, [outcomes]);

  // Compute overall improvement metrics
  const improvements = useMemo(() => {
    const result: { label: string; initial: number; latest: number; percent: number; lowerIsBetter: boolean; trend: string }[] = [];
    for (const [key, records] of grouped) {
      if (records.length < 2) continue;
      const type = key.split("::")[0] as MeasureType;
      const def = outcomeDefinitions.find((d) => d.type === type);
      const lowerIsBetter = def?.lowerIsBetter ?? false;
      const initial = records[0].value;
      const latest = records[records.length - 1].value;
      const pct = computeImprovement(initial, latest, lowerIsBetter);
      let trend = "stable";
      if (pct > 5) trend = "improving";
      else if (pct < -5) trend = "declining";
      result.push({
        label: records[0].label,
        initial,
        latest,
        percent: pct,
        lowerIsBetter,
        trend,
      });
    }
    return result;
  }, [grouped]);

  const handleSave = useCallback(() => {
    if (!newValue) return;
    const record = {
      id: `oc-new-${Date.now()}`,
      patientId,
      type: newType,
      label: newLabel,
      value: parseFloat(newValue),
      unit: outcomeDefinitions.find((d) => d.type === newType)?.unit ?? "",
      date: newDate,
      notes: newNotes || undefined,
    };
    createOutcome.mutate(record, {
      onSuccess: () => {
        setDialogOpen(false);
        setNewValue("");
        setNewNotes("");
      },
    });
  }, [createOutcome, newDate, newLabel, newNotes, newType, newValue, patientId]);

  if (outcomes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">
            No outcome measurements recorded yet.
          </p>
          <RecordMeasurementDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            newType={newType}
            setNewType={setNewType}
            newLabel={newLabel}
            setNewLabel={setNewLabel}
            newValue={newValue}
            setNewValue={setNewValue}
            newDate={newDate}
            setNewDate={setNewDate}
            newNotes={newNotes}
            setNewNotes={setNewNotes}
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Improvement summary cards */}
      {improvements.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {improvements.map((imp) => (
            <Card key={imp.label}>
              <CardContent className="flex items-center gap-3 py-3">
                <div
                  className={`flex size-8 items-center justify-center rounded-full ${
                    imp.trend === "improving"
                      ? "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
                      : imp.trend === "declining"
                        ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                        : "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                  }`}
                >
                  {imp.trend === "improving" ? (
                    <TrendingUp className="size-4" />
                  ) : imp.trend === "declining" ? (
                    <TrendingDown className="size-4" />
                  ) : (
                    <Minus className="size-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{imp.label}</span>
                  <span className="text-sm font-medium">
                    {imp.percent > 0 ? "+" : ""}
                    {imp.percent}% {imp.trend === "improving" ? "improvement" : imp.trend === "declining" ? "decline" : "stable"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {imp.initial}
                    {imp.lowerIsBetter ? " \u2192 " : " \u2192 "}
                    {imp.latest}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pain Score Trend */}
      {painData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pain Score Trend</CardTitle>
            <CardDescription>VAS/NPRS pain scores over time (lower is better)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={painData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <ReferenceLine
                    y={3}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{ value: "Goal (3/10)", position: "right", fill: "#22c55e", fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={(props: Record<string, unknown>) => {
                      const { cx, cy, payload } = props as { cx: number; cy: number; payload: { value: number } };
                      const color = (payload?.value ?? 10) <= 3 ? "#22c55e" : (payload?.value ?? 10) <= 5 ? "#f59e0b" : "#ef4444";
                      return (
                        <circle
                          key={`${cx}-${cy}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={color}
                          stroke="white"
                          strokeWidth={2}
                        />
                      );
                    }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ROM Measurements */}
      {romData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Range of Motion</CardTitle>
            <CardDescription>Initial vs latest ROM measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={romData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="\u00b0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="initial" name="Initial" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="latest" name="Latest" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Functional Scores */}
      {functionalData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Functional Scores</CardTitle>
            <CardDescription>DASH / Oswestry scores over time (lower is better)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={functionalData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  {/* Normal range shaded band */}
                  <Area
                    type="monotone"
                    dataKey={() => 20}
                    fill="#22c55e"
                    fillOpacity={0.1}
                    stroke="none"
                    name="Normal Range"
                  />
                  <ReferenceLine
                    y={20}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{ value: "Normal (\u226420)", position: "right", fill: "#22c55e", fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#8b5cf6" }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Record new measurement button */}
      <RecordMeasurementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        newType={newType}
        setNewType={setNewType}
        newLabel={newLabel}
        setNewLabel={setNewLabel}
        newValue={newValue}
        setNewValue={setNewValue}
        newDate={newDate}
        setNewDate={setNewDate}
        newNotes={newNotes}
        setNewNotes={setNewNotes}
        onSave={handleSave}
      />
    </div>
  );
}

function RecordMeasurementDialog({
  open,
  onOpenChange,
  newType,
  setNewType,
  newLabel,
  setNewLabel,
  newValue,
  setNewValue,
  newDate,
  setNewDate,
  newNotes,
  setNewNotes,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newType: MeasureType;
  setNewType: (t: MeasureType) => void;
  newLabel: string;
  setNewLabel: (l: string) => void;
  newValue: string;
  setNewValue: (v: string) => void;
  newDate: string;
  setNewDate: (d: string) => void;
  newNotes: string;
  setNewNotes: (n: string) => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus className="size-3.5" />
            Record New Measurement
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Outcome Measurement</DialogTitle>
          <DialogDescription>
            Add a new outcome measurement for this patient.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Measure Type</Label>
            <Select
              value={newType}
              onValueChange={(val) => {
                if (!val) return;
                setNewType(val as MeasureType);
                setNewLabel(defaultLabels[val as MeasureType]);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(measureTypeLabels) as MeasureType[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {measureTypeLabels[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Label</Label>
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g., Shoulder Flexion ROM"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Value</Label>
              <Input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Notes (optional)</Label>
            <Textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onSave} disabled={!newValue}>
            Save Measurement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
