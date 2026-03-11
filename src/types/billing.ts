export interface CPTCode {
  code: string;
  description: string;
  category: "evaluation" | "therapeutic" | "modality" | "testing";
  timePerUnit: number;
  defaultRate?: number;
}

export interface BillingEntry {
  cptCode: string;
  description: string;
  units: number;
  timeMinutes: number;
}
