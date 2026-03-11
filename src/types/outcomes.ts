export type MeasureType = "vas" | "nprs" | "rom" | "mmt" | "dash" | "oswestry" | "custom";

export interface OutcomeRecord {
  id: string;
  patientId: string;
  type: MeasureType;
  label: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
  bodyRegion?: string;
}

export interface OutcomeMeasureDefinition {
  type: MeasureType;
  name: string;
  description: string;
  minValue: number;
  maxValue: number;
  unit: string;
  lowerIsBetter: boolean;
}
