"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// ---- Body Map Regions ----
const bodyRegions = [
  { id: "head-neck", label: "Head/Neck", cx: 150, cy: 55, r: 18 },
  { id: "left-shoulder", label: "Left Shoulder", cx: 105, cy: 105, r: 16 },
  { id: "right-shoulder", label: "Right Shoulder", cx: 195, cy: 105, r: 16 },
  { id: "upper-back", label: "Upper Back", cx: 150, cy: 120, r: 14 },
  { id: "left-elbow", label: "Left Elbow", cx: 80, cy: 170, r: 13 },
  { id: "right-elbow", label: "Right Elbow", cx: 220, cy: 170, r: 13 },
  { id: "left-wrist", label: "Left Wrist", cx: 65, cy: 220, r: 12 },
  { id: "right-wrist", label: "Right Wrist", cx: 235, cy: 220, r: 12 },
  { id: "lower-back", label: "Lower Back", cx: 150, cy: 195, r: 16 },
  { id: "left-hip", label: "Left Hip", cx: 120, cy: 240, r: 15 },
  { id: "right-hip", label: "Right Hip", cx: 180, cy: 240, r: 15 },
  { id: "left-knee", label: "Left Knee", cx: 125, cy: 320, r: 14 },
  { id: "right-knee", label: "Right Knee", cx: 175, cy: 320, r: 14 },
  { id: "left-ankle", label: "Left Ankle", cx: 125, cy: 400, r: 12 },
  { id: "right-ankle", label: "Right Ankle", cx: 175, cy: 400, r: 12 },
];

const painTypes = [
  "Sharp",
  "Dull",
  "Burning",
  "Aching",
  "Throbbing",
  "Stabbing",
  "Radiating",
  "Tingling/Numbness",
];

const painTiming = [
  "Constant",
  "Intermittent",
  "Morning",
  "Evening",
  "With Activity",
  "At Rest",
  "At Night",
];

const aggravatingFactors = [
  "Walking",
  "Sitting",
  "Standing",
  "Bending",
  "Lifting",
  "Stairs",
  "Exercise",
];

const easingFactors = [
  "Rest",
  "Heat",
  "Ice",
  "Medication",
  "Stretching",
  "Position Change",
];

const functionalAreas = [
  "Walking",
  "Stairs",
  "Sitting",
  "Standing",
  "Sleeping",
  "Lifting",
  "Reaching Overhead",
  "Personal Care",
];

const medicalConditions = [
  "Diabetes",
  "Heart Disease",
  "High Blood Pressure",
  "Osteoporosis",
  "Cancer",
  "Arthritis",
  "Previous Surgery",
  "Pregnancy",
];

type Severity = "none" | "mild" | "moderate" | "severe";

export function IntakeForm({
  patientId,
  onSubmit,
}: {
  patientId: string;
  onSubmit?: (subjectiveText: string) => void;
}) {
  // Body map
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // Pain characteristics
  const [selectedPainTypes, setSelectedPainTypes] = useState<string[]>([]);
  const [selectedPainTiming, setSelectedPainTiming] = useState<string[]>([]);

  // Aggravating/Easing
  const [selectedAggravating, setSelectedAggravating] = useState<string[]>([]);
  const [aggravatingOther, setAggravatingOther] = useState("");
  const [selectedEasing, setSelectedEasing] = useState<string[]>([]);
  const [easingOther, setEasingOther] = useState("");

  // Functional limitations
  const [functionalLimitations, setFunctionalLimitations] = useState<
    Record<string, Severity>
  >({});

  // Medical history
  const [medicalHistory, setMedicalHistory] = useState<
    Record<string, { has: boolean; details: string }>
  >({});

  // Medications
  const [medications, setMedications] = useState("");

  // Patient goals
  const [patientGoals, setPatientGoals] = useState("");

  const toggleRegion = (id: string) => {
    setSelectedRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleCheckbox = (
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleSubmit = useCallback(() => {
    // Build subjective text from all sections
    const lines: string[] = [];

    if (selectedRegions.length > 0) {
      const regionLabels = selectedRegions.map(
        (id) => bodyRegions.find((r) => r.id === id)?.label ?? id
      );
      lines.push(`Pain Location: ${regionLabels.join(", ")}.`);
    }

    if (selectedPainTypes.length > 0) {
      lines.push(`Pain Type: ${selectedPainTypes.join(", ")}.`);
    }

    if (selectedPainTiming.length > 0) {
      lines.push(`Pain Timing: ${selectedPainTiming.join(", ")}.`);
    }

    if (selectedAggravating.length > 0 || aggravatingOther) {
      const all = [
        ...selectedAggravating,
        ...(aggravatingOther ? [aggravatingOther] : []),
      ];
      lines.push(`Aggravating Factors: ${all.join(", ")}.`);
    }

    if (selectedEasing.length > 0 || easingOther) {
      const all = [
        ...selectedEasing,
        ...(easingOther ? [easingOther] : []),
      ];
      lines.push(`Easing Factors: ${all.join(", ")}.`);
    }

    const funcEntries = Object.entries(functionalLimitations).filter(
      ([, severity]) => severity !== "none"
    );
    if (funcEntries.length > 0) {
      lines.push(
        `Functional Limitations: ${funcEntries
          .map(([area, sev]) => `${area} (${sev})`)
          .join(", ")}.`
      );
    }

    const medEntries = Object.entries(medicalHistory).filter(
      ([, v]) => v.has
    );
    if (medEntries.length > 0) {
      lines.push(
        `Medical History: ${medEntries
          .map(([cond, v]) => `${cond}${v.details ? ` - ${v.details}` : ""}`)
          .join("; ")}.`
      );
    }

    if (medications.trim()) {
      lines.push(`Current Medications: ${medications.trim()}.`);
    }

    if (patientGoals.trim()) {
      lines.push(`Patient Goals: ${patientGoals.trim()}`);
    }

    const subjectiveText = lines.join("\n");

    if (onSubmit) {
      onSubmit(subjectiveText);
    }

    toast.success("Intake form submitted successfully");
  }, [
    selectedRegions,
    selectedPainTypes,
    selectedPainTiming,
    selectedAggravating,
    aggravatingOther,
    selectedEasing,
    easingOther,
    functionalLimitations,
    medicalHistory,
    medications,
    patientGoals,
    onSubmit,
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Pain Body Map */}
      <Card>
        <CardHeader>
          <CardTitle>Pain Location</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            Click on the body regions where you experience pain.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
            <svg
              viewBox="0 0 300 440"
              className="h-[360px] w-[240px] shrink-0"
              aria-label="Body map"
            >
              {/* Simple body outline */}
              <ellipse
                cx="150"
                cy="40"
                rx="25"
                ry="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground/40"
              />
              {/* Torso */}
              <path
                d="M115 70 L105 100 L90 160 L95 230 L120 250 L150 260 L180 250 L205 230 L210 160 L195 100 L185 70 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground/40"
              />
              {/* Left arm */}
              <path
                d="M105 100 L80 150 L65 210 L55 240"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground/40"
              />
              {/* Right arm */}
              <path
                d="M195 100 L220 150 L235 210 L245 240"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground/40"
              />
              {/* Left leg */}
              <path
                d="M120 250 L125 300 L125 350 L125 400 L120 430"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground/40"
              />
              {/* Right leg */}
              <path
                d="M180 250 L175 300 L175 350 L175 400 L180 430"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground/40"
              />

              {/* Clickable regions */}
              {bodyRegions.map((region) => {
                const isSelected = selectedRegions.includes(region.id);
                return (
                  <g key={region.id}>
                    <circle
                      cx={region.cx}
                      cy={region.cy}
                      r={region.r}
                      fill={isSelected ? "rgba(239,68,68,0.3)" : "rgba(148,163,184,0.15)"}
                      stroke={isSelected ? "#ef4444" : "rgba(148,163,184,0.4)"}
                      strokeWidth={isSelected ? 2 : 1}
                      className="cursor-pointer transition-colors hover:fill-red-200/50"
                      onClick={() => toggleRegion(region.id)}
                    />
                    <text
                      x={region.cx}
                      y={region.cy + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="pointer-events-none select-none fill-current text-muted-foreground"
                      fontSize="7"
                    >
                      {region.label.length > 8
                        ? region.label.slice(0, 8) + "."
                        : region.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Selected regions list */}
            <div className="flex flex-wrap gap-2">
              {selectedRegions.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  No regions selected
                </span>
              ) : (
                selectedRegions.map((id) => {
                  const region = bodyRegions.find((r) => r.id === id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleRegion(id)}
                      className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                    >
                      {region?.label} &times;
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Pain Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle>Pain Characteristics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label className="mb-2">Pain Type</Label>
            <div className="flex flex-wrap gap-2">
              {painTypes.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    toggleCheckbox(selectedPainTypes, setSelectedPainTypes, type)
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    selectedPainTypes.includes(type)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2">Pain Timing</Label>
            <div className="flex flex-wrap gap-2">
              {painTiming.map((timing) => (
                <button
                  key={timing}
                  onClick={() =>
                    toggleCheckbox(
                      selectedPainTiming,
                      setSelectedPainTiming,
                      timing
                    )
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    selectedPainTiming.includes(timing)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {timing}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Aggravating / Easing Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Aggravating & Easing Factors</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label className="mb-2">Aggravating Factors</Label>
            <div className="flex flex-wrap gap-2">
              {aggravatingFactors.map((f) => (
                <button
                  key={f}
                  onClick={() =>
                    toggleCheckbox(
                      selectedAggravating,
                      setSelectedAggravating,
                      f
                    )
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    selectedAggravating.includes(f)
                      ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Input
              className="mt-2"
              placeholder="Other aggravating factors..."
              value={aggravatingOther}
              onChange={(e) => setAggravatingOther(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2">Easing Factors</Label>
            <div className="flex flex-wrap gap-2">
              {easingFactors.map((f) => (
                <button
                  key={f}
                  onClick={() =>
                    toggleCheckbox(selectedEasing, setSelectedEasing, f)
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    selectedEasing.includes(f)
                      ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Input
              className="mt-2"
              placeholder="Other easing factors..."
              value={easingOther}
              onChange={(e) => setEasingOther(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Functional Limitations */}
      <Card>
        <CardHeader>
          <CardTitle>Functional Limitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {functionalAreas.map((area) => {
              const current = functionalLimitations[area] || "none";
              return (
                <div
                  key={area}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <span className="text-sm">{area}</span>
                  <div className="flex gap-1">
                    {(["none", "mild", "moderate", "severe"] as Severity[]).map(
                      (sev) => (
                        <button
                          key={sev}
                          onClick={() =>
                            setFunctionalLimitations((prev) => ({
                              ...prev,
                              [area]: sev,
                            }))
                          }
                          className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                            current === sev
                              ? sev === "none"
                                ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                : sev === "mild"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                                  : sev === "moderate"
                                    ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {sev.charAt(0).toUpperCase() + sev.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 5. Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {medicalConditions.map((cond) => {
              const entry = medicalHistory[cond] || {
                has: false,
                details: "",
              };
              return (
                <div key={cond} className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="w-36 text-sm">{cond}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setMedicalHistory((prev) => ({
                            ...prev,
                            [cond]: { ...entry, has: true },
                          }))
                        }
                        className={`rounded border px-3 py-0.5 text-xs font-medium transition-colors ${
                          entry.has
                            ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() =>
                          setMedicalHistory((prev) => ({
                            ...prev,
                            [cond]: { has: false, details: "" },
                          }))
                        }
                        className={`rounded border px-3 py-0.5 text-xs font-medium transition-colors ${
                          !entry.has
                            ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  {entry.has && (
                    <Input
                      className="ml-0 sm:ml-36"
                      placeholder={`Details about ${cond.toLowerCase()}...`}
                      value={entry.details}
                      onChange={(e) =>
                        setMedicalHistory((prev) => ({
                          ...prev,
                          [cond]: { ...entry, details: e.target.value },
                        }))
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 6. Medications */}
      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            placeholder="List current medications and dosages..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* 7. Patient Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={patientGoals}
            onChange={(e) => setPatientGoals(e.target.value)}
            placeholder="In your own words, what would you like to achieve from physiotherapy?"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSubmit}>
          Submit & Pre-fill SOAP Note
        </Button>
      </div>
    </div>
  );
}
