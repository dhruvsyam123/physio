"use client";

import { useState } from "react";
import type { Exercise } from "@/types";

type BodyRegion = Exercise["bodyRegion"];

interface MuscleGroup {
  id: BodyRegion;
  label: string;
  paths: string[];
  labelPos: { x: number; y: number };
}

const FRONT_MUSCLES: MuscleGroup[] = [
  {
    id: "neck",
    label: "Neck",
    paths: [
      // Sternocleidomastoid & front neck muscles
      "M 145,72 C 142,78 140,88 142,98 L 150,100 L 158,98 C 160,88 158,78 155,72 Z",
      "M 155,72 C 152,78 150,88 152,98 L 160,100 L 168,98 C 170,88 168,78 165,72 Z",
    ],
    labelPos: { x: 155, y: 85 },
  },
  {
    id: "shoulder",
    label: "Shoulders",
    paths: [
      // Left deltoid
      "M 120,100 C 110,102 104,110 106,124 L 120,128 L 136,118 C 138,110 134,102 128,100 Z",
      // Right deltoid
      "M 180,100 C 176,102 172,110 174,118 L 190,128 L 204,124 C 206,110 200,102 190,100 Z",
    ],
    labelPos: { x: 155, y: 112 },
  },
  {
    id: "core",
    label: "Core",
    paths: [
      // Rectus abdominis
      "M 142,170 L 142,230 C 142,234 146,238 150,238 L 160,238 C 164,238 168,234 168,230 L 168,170 Z",
      // Obliques left
      "M 130,170 L 126,200 L 128,230 L 140,238 L 142,170 Z",
      // Obliques right
      "M 180,170 L 184,200 L 182,230 L 170,238 L 168,170 Z",
    ],
    labelPos: { x: 155, y: 204 },
  },
  {
    id: "hip",
    label: "Hip",
    paths: [
      // Left hip flexor / quad-hip junction
      "M 126,232 C 122,240 120,248 122,258 L 140,258 L 142,238 Z",
      // Right hip flexor
      "M 184,232 C 188,240 190,248 188,258 L 170,258 L 168,238 Z",
    ],
    labelPos: { x: 155, y: 248 },
  },
  {
    id: "knee",
    label: "Knees",
    paths: [
      // Left quad
      "M 122,260 C 118,280 116,300 118,330 L 120,340 C 124,344 132,344 136,340 L 142,330 C 142,300 140,280 140,260 Z",
      // Right quad
      "M 170,260 C 170,280 168,300 168,330 L 174,340 C 178,344 186,344 190,340 L 192,330 C 194,300 192,280 188,260 Z",
    ],
    labelPos: { x: 155, y: 300 },
  },
  {
    id: "ankle",
    label: "Ankles",
    paths: [
      // Left shin / lower leg
      "M 120,346 C 118,370 118,400 120,420 L 122,432 C 126,436 132,436 136,432 L 138,420 C 140,400 140,370 138,346 Z",
      // Right shin
      "M 172,346 C 170,370 170,400 172,420 L 174,432 C 178,436 184,436 188,432 L 190,420 C 192,400 192,370 190,346 Z",
    ],
    labelPos: { x: 155, y: 390 },
  },
  {
    id: "wrist",
    label: "Wrists",
    paths: [
      // Left forearm
      "M 96,190 C 88,210 82,235 80,260 L 88,264 L 100,260 C 100,235 100,210 104,190 Z",
      // Right forearm
      "M 214,190 C 210,210 210,235 210,260 L 222,264 L 230,260 C 228,235 222,210 216,190 Z",
    ],
    labelPos: { x: 155, y: 240 },
  },
  {
    id: "elbow",
    label: "Elbows",
    paths: [
      // Left bicep/elbow area
      "M 106,128 C 100,145 96,165 96,188 L 104,190 L 116,186 C 118,165 120,145 120,130 Z",
      // Right bicep/elbow area
      "M 204,128 C 210,145 214,165 214,188 L 206,190 L 194,186 C 192,165 190,145 190,130 Z",
    ],
    labelPos: { x: 155, y: 158 },
  },
];

const BACK_MUSCLES: MuscleGroup[] = [
  {
    id: "neck",
    label: "Neck",
    paths: [
      "M 145,72 C 142,78 140,88 142,98 L 155,100 L 168,98 C 170,88 168,78 165,72 Z",
    ],
    labelPos: { x: 155, y: 85 },
  },
  {
    id: "shoulder",
    label: "Shoulders",
    paths: [
      // Left rear delt / rotator cuff
      "M 120,100 C 110,102 104,110 106,124 L 120,128 L 136,118 C 138,110 134,102 128,100 Z",
      // Right rear delt
      "M 180,100 C 176,102 172,110 174,118 L 190,128 L 204,124 C 206,110 200,102 190,100 Z",
    ],
    labelPos: { x: 155, y: 112 },
  },
  {
    id: "upper-back",
    label: "Upper Back",
    paths: [
      // Trapezius / rhomboids
      "M 130,100 L 128,120 L 126,148 L 130,168 L 155,172 L 180,168 L 184,148 L 182,120 L 180,100 L 155,96 Z",
    ],
    labelPos: { x: 155, y: 135 },
  },
  {
    id: "lower-back",
    label: "Lower Back",
    paths: [
      // Erector spinae / lumbar
      "M 132,172 L 128,200 L 130,232 L 155,238 L 180,232 L 182,200 L 178,172 L 155,176 Z",
    ],
    labelPos: { x: 155, y: 205 },
  },
  {
    id: "hip",
    label: "Glutes / Hip",
    paths: [
      // Left glute
      "M 126,234 C 120,244 118,256 122,268 L 142,268 L 150,240 Z",
      // Right glute
      "M 184,234 C 190,244 192,256 188,268 L 168,268 L 160,240 Z",
    ],
    labelPos: { x: 155, y: 254 },
  },
  {
    id: "knee",
    label: "Hamstrings",
    paths: [
      // Left hamstring
      "M 120,270 C 118,290 116,310 118,340 L 138,340 C 140,310 140,290 140,270 Z",
      // Right hamstring
      "M 170,270 C 170,290 170,310 172,340 L 192,340 C 194,310 192,290 190,270 Z",
    ],
    labelPos: { x: 155, y: 306 },
  },
  {
    id: "ankle",
    label: "Calves",
    paths: [
      // Left calf
      "M 118,342 C 116,365 118,395 120,420 L 138,420 C 140,395 142,365 140,342 Z",
      // Right calf
      "M 170,342 C 168,365 170,395 172,420 L 190,420 C 192,395 194,365 192,342 Z",
    ],
    labelPos: { x: 155, y: 382 },
  },
];

interface BodyMapProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  exerciseCounts?: Record<string, number>;
}

export function BodyMap({ selectedRegion, onRegionChange, exerciseCounts }: BodyMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [view, setView] = useState<"front" | "back">("front");

  const muscles = view === "front" ? FRONT_MUSCLES : BACK_MUSCLES;

  const handleClick = (regionId: string) => {
    onRegionChange(selectedRegion === regionId ? "all" : regionId);
  };

  const getRegionColor = (regionId: string) => {
    const isSelected = selectedRegion === regionId;
    const isHovered = hoveredRegion === regionId;

    if (isSelected) return "fill-teal-500 dark:fill-teal-400 opacity-90";
    if (isHovered) return "fill-teal-300 dark:fill-teal-500 opacity-70";
    return "fill-slate-300 dark:fill-slate-600 opacity-60";
  };

  const allRegions: BodyRegion[] = [
    "neck", "shoulder", "upper-back", "lower-back",
    "hip", "knee", "ankle", "wrist", "elbow", "core", "full-body",
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Body Region</h3>
        <div className="flex rounded-lg border bg-muted p-0.5">
          <button
            onClick={() => setView("front")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              view === "front"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setView("back")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              view === "back"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Back
          </button>
        </div>
      </div>

      {/* SVG Body */}
      <div className="relative flex justify-center">
        <svg
          viewBox="60 40 190 420"
          className="h-[420px] w-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body silhouette outline */}
          <path
            d="M 155,44 C 140,44 132,52 132,66 C 132,78 140,88 148,92
               L 142,98 C 134,100 118,100 108,104 C 100,108 96,118 100,130
               C 96,140 88,165 84,190 C 80,215 78,245 78,268
               L 82,272 L 90,268 C 96,250 100,230 106,210
               C 108,205 110,195 112,186
               L 116,188 C 118,200 114,230 118,254
               C 118,260 120,268 122,274
               L 118,290 C 116,310 114,340 116,360
               C 118,380 118,400 120,420
               C 120,432 122,440 128,444
               L 140,444 C 142,440 142,434 140,424
               C 138,406 136,380 136,360
               C 138,340 140,320 140,300
               C 140,285 142,272 142,262
               L 150,258 L 155,256 L 160,258 L 168,262
               C 168,272 170,285 170,300
               C 170,320 172,340 174,360
               C 174,380 172,406 170,424
               C 168,434 168,440 170,444
               L 182,444 C 188,440 190,432 190,420
               C 192,400 192,380 194,360
               C 196,340 194,310 192,290
               L 188,274 C 190,268 192,260 192,254
               C 196,230 192,200 194,188
               L 198,186 C 200,195 202,205 204,210
               C 210,230 214,250 220,268
               L 228,272 L 232,268
               C 232,245 230,215 226,190
               C 222,165 214,140 210,130
               C 214,118 210,108 202,104
               C 192,100 176,100 168,98
               L 162,92 C 170,88 178,78 178,66
               C 178,52 170,44 155,44 Z"
            className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600"
            strokeWidth="1"
          />

          {/* Muscle groups */}
          {muscles.map((muscle) => (
            <g
              key={muscle.id}
              className="cursor-pointer transition-all duration-200"
              onClick={() => handleClick(muscle.id)}
              onMouseEnter={() => setHoveredRegion(muscle.id)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              {muscle.paths.map((path, i) => (
                <path
                  key={i}
                  d={path}
                  className={`${getRegionColor(muscle.id)} stroke-slate-400 dark:stroke-slate-500 transition-all duration-200`}
                  strokeWidth="0.5"
                />
              ))}
              {/* Tooltip on hover */}
              {(hoveredRegion === muscle.id || selectedRegion === muscle.id) && (
                <text
                  x={muscle.labelPos.x}
                  y={muscle.labelPos.y}
                  textAnchor="middle"
                  className="pointer-events-none fill-slate-900 dark:fill-white text-[8px] font-semibold"
                  style={{ fontSize: "8px", fontWeight: 600 }}
                >
                  {muscle.label}
                </text>
              )}
            </g>
          ))}

          {/* Center line reference */}
          <line
            x1="155" y1="92" x2="155" y2="256"
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth="0.3"
            strokeDasharray="2,2"
          />
        </svg>
      </div>

      {/* Region pills below the body */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {allRegions.map((r) => {
          const isSelected = selectedRegion === r;
          const count = exerciseCounts?.[r];
          return (
            <button
              key={r}
              onClick={() => handleClick(r)}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                isSelected
                  ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 ring-1 ring-teal-300 dark:ring-teal-700"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {r.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              {count !== undefined && (
                <span className={`text-[10px] ${isSelected ? "text-teal-600 dark:text-teal-300" : "text-muted-foreground"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedRegion !== "all" && (
        <button
          onClick={() => onRegionChange("all")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
        >
          Clear selection
        </button>
      )}
    </div>
  );
}
