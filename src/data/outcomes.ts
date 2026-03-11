import type { OutcomeRecord, OutcomeMeasureDefinition } from "@/types/outcomes";

export const outcomeDefinitions: OutcomeMeasureDefinition[] = [
  {
    type: "vas",
    name: "Visual Analogue Scale",
    description: "Pain intensity rating from 0 (no pain) to 10 (worst pain imaginable)",
    minValue: 0,
    maxValue: 10,
    unit: "/10",
    lowerIsBetter: true,
  },
  {
    type: "nprs",
    name: "Numeric Pain Rating Scale",
    description: "Pain intensity rating from 0 to 10",
    minValue: 0,
    maxValue: 10,
    unit: "/10",
    lowerIsBetter: true,
  },
  {
    type: "rom",
    name: "Range of Motion",
    description: "Joint range of motion measured in degrees",
    minValue: 0,
    maxValue: 360,
    unit: "\u00b0",
    lowerIsBetter: false,
  },
  {
    type: "mmt",
    name: "Manual Muscle Testing",
    description: "Muscle strength grading from 0 to 5",
    minValue: 0,
    maxValue: 5,
    unit: "/5",
    lowerIsBetter: false,
  },
  {
    type: "dash",
    name: "DASH Score",
    description: "Disabilities of the Arm, Shoulder and Hand questionnaire (0-100, lower is better)",
    minValue: 0,
    maxValue: 100,
    unit: "/100",
    lowerIsBetter: true,
  },
  {
    type: "oswestry",
    name: "Oswestry Disability Index",
    description: "Low back disability questionnaire (0-100, lower is better)",
    minValue: 0,
    maxValue: 100,
    unit: "/100",
    lowerIsBetter: true,
  },
  {
    type: "custom",
    name: "Custom Measure",
    description: "A custom outcome measure",
    minValue: 0,
    maxValue: 100,
    unit: "",
    lowerIsBetter: false,
  },
];

export const mockOutcomes: OutcomeRecord[] = [
  // --- p1: James Mitchell - ACL Reconstruction Rehab ---
  // VAS Pain
  { id: "oc-p1-1", patientId: "p1", type: "vas", label: "VAS Pain Score", value: 7, unit: "/10", date: "2026-01-28", bodyRegion: "knee", notes: "Initial assessment, moderate post-op pain" },
  { id: "oc-p1-2", patientId: "p1", type: "vas", label: "VAS Pain Score", value: 6, unit: "/10", date: "2026-02-04", bodyRegion: "knee" },
  { id: "oc-p1-3", patientId: "p1", type: "vas", label: "VAS Pain Score", value: 5, unit: "/10", date: "2026-02-14", bodyRegion: "knee" },
  { id: "oc-p1-4", patientId: "p1", type: "vas", label: "VAS Pain Score", value: 4, unit: "/10", date: "2026-02-25", bodyRegion: "knee" },
  { id: "oc-p1-5", patientId: "p1", type: "vas", label: "VAS Pain Score", value: 3, unit: "/10", date: "2026-03-07", bodyRegion: "knee", notes: "Pain mostly with exercises only" },
  // Knee Flexion ROM
  { id: "oc-p1-6", patientId: "p1", type: "rom", label: "Knee Flexion ROM", value: 80, unit: "\u00b0", date: "2026-01-28", bodyRegion: "knee", notes: "Initial assessment" },
  { id: "oc-p1-7", patientId: "p1", type: "rom", label: "Knee Flexion ROM", value: 95, unit: "\u00b0", date: "2026-02-04", bodyRegion: "knee" },
  { id: "oc-p1-8", patientId: "p1", type: "rom", label: "Knee Flexion ROM", value: 105, unit: "\u00b0", date: "2026-02-14", bodyRegion: "knee" },
  { id: "oc-p1-9", patientId: "p1", type: "rom", label: "Knee Flexion ROM", value: 115, unit: "\u00b0", date: "2026-02-25", bodyRegion: "knee" },
  { id: "oc-p1-10", patientId: "p1", type: "rom", label: "Knee Flexion ROM", value: 125, unit: "\u00b0", date: "2026-03-07", bodyRegion: "knee" },
  // Quad Strength MMT
  { id: "oc-p1-11", patientId: "p1", type: "mmt", label: "Quadriceps Strength", value: 3, unit: "/5", date: "2026-01-28", bodyRegion: "knee" },
  { id: "oc-p1-12", patientId: "p1", type: "mmt", label: "Quadriceps Strength", value: 3, unit: "/5", date: "2026-02-14", bodyRegion: "knee" },
  { id: "oc-p1-13", patientId: "p1", type: "mmt", label: "Quadriceps Strength", value: 3.5, unit: "/5", date: "2026-02-25", bodyRegion: "knee" },
  { id: "oc-p1-14", patientId: "p1", type: "mmt", label: "Quadriceps Strength", value: 4, unit: "/5", date: "2026-03-07", bodyRegion: "knee" },

  // --- p2: Margaret Chen - Frozen Shoulder ---
  // VAS Pain
  { id: "oc-p2-1", patientId: "p2", type: "vas", label: "VAS Pain Score", value: 8, unit: "/10", date: "2025-12-15", bodyRegion: "shoulder", notes: "Severe pain with all movements" },
  { id: "oc-p2-2", patientId: "p2", type: "vas", label: "VAS Pain Score", value: 7, unit: "/10", date: "2026-01-05", bodyRegion: "shoulder" },
  { id: "oc-p2-3", patientId: "p2", type: "vas", label: "VAS Pain Score", value: 6, unit: "/10", date: "2026-01-26", bodyRegion: "shoulder" },
  { id: "oc-p2-4", patientId: "p2", type: "vas", label: "VAS Pain Score", value: 5, unit: "/10", date: "2026-02-16", bodyRegion: "shoulder" },
  { id: "oc-p2-5", patientId: "p2", type: "vas", label: "VAS Pain Score", value: 4, unit: "/10", date: "2026-03-06", bodyRegion: "shoulder", notes: "Thawing phase, morning stiffness improving" },
  // Shoulder Flexion ROM
  { id: "oc-p2-6", patientId: "p2", type: "rom", label: "Shoulder Flexion ROM", value: 90, unit: "\u00b0", date: "2025-12-15", bodyRegion: "shoulder" },
  { id: "oc-p2-7", patientId: "p2", type: "rom", label: "Shoulder Flexion ROM", value: 95, unit: "\u00b0", date: "2026-01-05", bodyRegion: "shoulder" },
  { id: "oc-p2-8", patientId: "p2", type: "rom", label: "Shoulder Flexion ROM", value: 110, unit: "\u00b0", date: "2026-01-26", bodyRegion: "shoulder" },
  { id: "oc-p2-9", patientId: "p2", type: "rom", label: "Shoulder Flexion ROM", value: 125, unit: "\u00b0", date: "2026-02-16", bodyRegion: "shoulder" },
  { id: "oc-p2-10", patientId: "p2", type: "rom", label: "Shoulder Flexion ROM", value: 145, unit: "\u00b0", date: "2026-03-06", bodyRegion: "shoulder" },
  // External Rotation ROM
  { id: "oc-p2-11", patientId: "p2", type: "rom", label: "Shoulder ER ROM", value: 20, unit: "\u00b0", date: "2025-12-15", bodyRegion: "shoulder" },
  { id: "oc-p2-12", patientId: "p2", type: "rom", label: "Shoulder ER ROM", value: 25, unit: "\u00b0", date: "2026-01-05", bodyRegion: "shoulder" },
  { id: "oc-p2-13", patientId: "p2", type: "rom", label: "Shoulder ER ROM", value: 35, unit: "\u00b0", date: "2026-01-26", bodyRegion: "shoulder" },
  { id: "oc-p2-14", patientId: "p2", type: "rom", label: "Shoulder ER ROM", value: 45, unit: "\u00b0", date: "2026-02-16", bodyRegion: "shoulder" },
  { id: "oc-p2-15", patientId: "p2", type: "rom", label: "Shoulder ER ROM", value: 55, unit: "\u00b0", date: "2026-03-06", bodyRegion: "shoulder" },

  // --- p3: Robert Nguyen - Chronic Lower Back Pain ---
  // VAS Pain
  { id: "oc-p3-1", patientId: "p3", type: "vas", label: "VAS Pain Score", value: 6, unit: "/10", date: "2026-02-10", bodyRegion: "lower-back", notes: "Central LBP with right buttock referral" },
  { id: "oc-p3-2", patientId: "p3", type: "vas", label: "VAS Pain Score", value: 5, unit: "/10", date: "2026-02-17", bodyRegion: "lower-back" },
  { id: "oc-p3-3", patientId: "p3", type: "vas", label: "VAS Pain Score", value: 4, unit: "/10", date: "2026-02-24", bodyRegion: "lower-back" },
  { id: "oc-p3-4", patientId: "p3", type: "vas", label: "VAS Pain Score", value: 3, unit: "/10", date: "2026-03-04", bodyRegion: "lower-back" },
  { id: "oc-p3-5", patientId: "p3", type: "vas", label: "VAS Pain Score", value: 2, unit: "/10", date: "2026-03-11", bodyRegion: "lower-back", notes: "Peripheralisation resolved" },
  // Oswestry Disability Index
  { id: "oc-p3-6", patientId: "p3", type: "oswestry", label: "Oswestry Disability Index", value: 45, unit: "/100", date: "2026-02-10", bodyRegion: "lower-back" },
  { id: "oc-p3-7", patientId: "p3", type: "oswestry", label: "Oswestry Disability Index", value: 38, unit: "/100", date: "2026-02-17", bodyRegion: "lower-back" },
  { id: "oc-p3-8", patientId: "p3", type: "oswestry", label: "Oswestry Disability Index", value: 30, unit: "/100", date: "2026-02-24", bodyRegion: "lower-back" },
  { id: "oc-p3-9", patientId: "p3", type: "oswestry", label: "Oswestry Disability Index", value: 22, unit: "/100", date: "2026-03-04", bodyRegion: "lower-back" },
  { id: "oc-p3-10", patientId: "p3", type: "oswestry", label: "Oswestry Disability Index", value: 18, unit: "/100", date: "2026-03-11", bodyRegion: "lower-back" },
  // Lumbar Flexion ROM
  { id: "oc-p3-11", patientId: "p3", type: "rom", label: "Lumbar Flexion ROM", value: 30, unit: "\u00b0", date: "2026-02-10", bodyRegion: "lower-back" },
  { id: "oc-p3-12", patientId: "p3", type: "rom", label: "Lumbar Flexion ROM", value: 35, unit: "\u00b0", date: "2026-02-17", bodyRegion: "lower-back" },
  { id: "oc-p3-13", patientId: "p3", type: "rom", label: "Lumbar Flexion ROM", value: 42, unit: "\u00b0", date: "2026-02-24", bodyRegion: "lower-back" },
  { id: "oc-p3-14", patientId: "p3", type: "rom", label: "Lumbar Flexion ROM", value: 48, unit: "\u00b0", date: "2026-03-04", bodyRegion: "lower-back" },
  { id: "oc-p3-15", patientId: "p3", type: "rom", label: "Lumbar Flexion ROM", value: 55, unit: "\u00b0", date: "2026-03-11", bodyRegion: "lower-back" },

  // --- p4: Dorothy Williams - Post Total Hip Replacement ---
  // VAS Pain
  { id: "oc-p4-1", patientId: "p4", type: "vas", label: "VAS Pain Score", value: 5, unit: "/10", date: "2026-02-11", bodyRegion: "hip", notes: "Post-op day 3" },
  { id: "oc-p4-2", patientId: "p4", type: "vas", label: "VAS Pain Score", value: 4, unit: "/10", date: "2026-02-18", bodyRegion: "hip" },
  { id: "oc-p4-3", patientId: "p4", type: "vas", label: "VAS Pain Score", value: 3, unit: "/10", date: "2026-02-25", bodyRegion: "hip" },
  { id: "oc-p4-4", patientId: "p4", type: "vas", label: "VAS Pain Score", value: 2, unit: "/10", date: "2026-03-05", bodyRegion: "hip", notes: "Minimal pain, mostly after exercises" },
  // Hip Flexion ROM
  { id: "oc-p4-5", patientId: "p4", type: "rom", label: "Hip Flexion ROM", value: 85, unit: "\u00b0", date: "2026-02-11", bodyRegion: "hip" },
  { id: "oc-p4-6", patientId: "p4", type: "rom", label: "Hip Flexion ROM", value: 90, unit: "\u00b0", date: "2026-02-18", bodyRegion: "hip" },
  { id: "oc-p4-7", patientId: "p4", type: "rom", label: "Hip Flexion ROM", value: 100, unit: "\u00b0", date: "2026-02-25", bodyRegion: "hip" },
  { id: "oc-p4-8", patientId: "p4", type: "rom", label: "Hip Flexion ROM", value: 115, unit: "\u00b0", date: "2026-03-05", bodyRegion: "hip" },
  // DASH Score
  { id: "oc-p4-9", patientId: "p4", type: "dash", label: "DASH Score", value: 62, unit: "/100", date: "2026-02-11", bodyRegion: "hip" },
  { id: "oc-p4-10", patientId: "p4", type: "dash", label: "DASH Score", value: 50, unit: "/100", date: "2026-02-18", bodyRegion: "hip" },
  { id: "oc-p4-11", patientId: "p4", type: "dash", label: "DASH Score", value: 38, unit: "/100", date: "2026-02-25", bodyRegion: "hip" },
  { id: "oc-p4-12", patientId: "p4", type: "dash", label: "DASH Score", value: 25, unit: "/100", date: "2026-03-05", bodyRegion: "hip" },

  // --- p5: Ahmed Hassan - Rotator Cuff Tendinopathy ---
  // VAS Pain
  { id: "oc-p5-1", patientId: "p5", type: "vas", label: "VAS Pain Score", value: 7, unit: "/10", date: "2026-02-20", bodyRegion: "shoulder", notes: "Pain with bowling and overhead activities" },
  { id: "oc-p5-2", patientId: "p5", type: "vas", label: "VAS Pain Score", value: 6, unit: "/10", date: "2026-02-27", bodyRegion: "shoulder" },
  { id: "oc-p5-3", patientId: "p5", type: "vas", label: "VAS Pain Score", value: 5, unit: "/10", date: "2026-03-03", bodyRegion: "shoulder" },
  { id: "oc-p5-4", patientId: "p5", type: "vas", label: "VAS Pain Score", value: 4, unit: "/10", date: "2026-03-07", bodyRegion: "shoulder" },
  { id: "oc-p5-5", patientId: "p5", type: "vas", label: "VAS Pain Score", value: 3, unit: "/10", date: "2026-03-10", bodyRegion: "shoulder", notes: "Pain improving with load management" },
  // Shoulder Abduction ROM
  { id: "oc-p5-6", patientId: "p5", type: "rom", label: "Shoulder Abduction ROM", value: 70, unit: "\u00b0", date: "2026-02-20", bodyRegion: "shoulder" },
  { id: "oc-p5-7", patientId: "p5", type: "rom", label: "Shoulder Abduction ROM", value: 90, unit: "\u00b0", date: "2026-02-27", bodyRegion: "shoulder" },
  { id: "oc-p5-8", patientId: "p5", type: "rom", label: "Shoulder Abduction ROM", value: 115, unit: "\u00b0", date: "2026-03-03", bodyRegion: "shoulder" },
  { id: "oc-p5-9", patientId: "p5", type: "rom", label: "Shoulder Abduction ROM", value: 135, unit: "\u00b0", date: "2026-03-07", bodyRegion: "shoulder" },
  { id: "oc-p5-10", patientId: "p5", type: "rom", label: "Shoulder Abduction ROM", value: 150, unit: "\u00b0", date: "2026-03-10", bodyRegion: "shoulder" },
  // MMT Supraspinatus
  { id: "oc-p5-11", patientId: "p5", type: "mmt", label: "Supraspinatus Strength", value: 3, unit: "/5", date: "2026-02-20", bodyRegion: "shoulder" },
  { id: "oc-p5-12", patientId: "p5", type: "mmt", label: "Supraspinatus Strength", value: 3, unit: "/5", date: "2026-02-27", bodyRegion: "shoulder" },
  { id: "oc-p5-13", patientId: "p5", type: "mmt", label: "Supraspinatus Strength", value: 3.5, unit: "/5", date: "2026-03-03", bodyRegion: "shoulder" },
  { id: "oc-p5-14", patientId: "p5", type: "mmt", label: "Supraspinatus Strength", value: 4, unit: "/5", date: "2026-03-07", bodyRegion: "shoulder" },
  { id: "oc-p5-15", patientId: "p5", type: "mmt", label: "Supraspinatus Strength", value: 4.5, unit: "/5", date: "2026-03-10", bodyRegion: "shoulder" },

  // --- p6: Lisa O'Brien - Tennis Elbow ---
  // VAS Pain
  { id: "oc-p6-1", patientId: "p6", type: "vas", label: "VAS Pain Score", value: 6, unit: "/10", date: "2026-01-15", bodyRegion: "elbow", notes: "Pain with gripping and typing" },
  { id: "oc-p6-2", patientId: "p6", type: "vas", label: "VAS Pain Score", value: 6, unit: "/10", date: "2026-01-29", bodyRegion: "elbow" },
  { id: "oc-p6-3", patientId: "p6", type: "vas", label: "VAS Pain Score", value: 5, unit: "/10", date: "2026-02-12", bodyRegion: "elbow" },
  { id: "oc-p6-4", patientId: "p6", type: "vas", label: "VAS Pain Score", value: 4, unit: "/10", date: "2026-02-26", bodyRegion: "elbow" },
  { id: "oc-p6-5", patientId: "p6", type: "vas", label: "VAS Pain Score", value: 3, unit: "/10", date: "2026-03-06", bodyRegion: "elbow" },
  { id: "oc-p6-6", patientId: "p6", type: "vas", label: "VAS Pain Score", value: 2, unit: "/10", date: "2026-03-11", bodyRegion: "elbow", notes: "Significant improvement with ergonomic changes" },
  // Grip Strength (custom)
  { id: "oc-p6-7", patientId: "p6", type: "custom", label: "Grip Strength", value: 14, unit: "kg", date: "2026-01-15", bodyRegion: "elbow", notes: "Right hand dynamometry" },
  { id: "oc-p6-8", patientId: "p6", type: "custom", label: "Grip Strength", value: 15, unit: "kg", date: "2026-01-29", bodyRegion: "elbow" },
  { id: "oc-p6-9", patientId: "p6", type: "custom", label: "Grip Strength", value: 16, unit: "kg", date: "2026-02-12", bodyRegion: "elbow" },
  { id: "oc-p6-10", patientId: "p6", type: "custom", label: "Grip Strength", value: 17, unit: "kg", date: "2026-02-26", bodyRegion: "elbow" },
  { id: "oc-p6-11", patientId: "p6", type: "custom", label: "Grip Strength", value: 18, unit: "kg", date: "2026-03-06", bodyRegion: "elbow" },
  { id: "oc-p6-12", patientId: "p6", type: "custom", label: "Grip Strength", value: 20, unit: "kg", date: "2026-03-11", bodyRegion: "elbow" },
  // Pain-free Grip
  { id: "oc-p6-13", patientId: "p6", type: "custom", label: "Pain-free Grip Strength", value: 8, unit: "kg", date: "2026-01-15", bodyRegion: "elbow" },
  { id: "oc-p6-14", patientId: "p6", type: "custom", label: "Pain-free Grip Strength", value: 9, unit: "kg", date: "2026-02-12", bodyRegion: "elbow" },
  { id: "oc-p6-15", patientId: "p6", type: "custom", label: "Pain-free Grip Strength", value: 12, unit: "kg", date: "2026-03-06", bodyRegion: "elbow" },
  { id: "oc-p6-16", patientId: "p6", type: "custom", label: "Pain-free Grip Strength", value: 14, unit: "kg", date: "2026-03-11", bodyRegion: "elbow" },
];
