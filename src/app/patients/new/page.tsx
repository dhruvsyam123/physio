"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatientStore } from "@/stores/patient-store";
import { toast } from "sonner";
import type { Patient } from "@/types";

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(1, "Address is required"),
  condition: z.string().min(1, "Condition is required"),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export default function NewPatientPage() {
  const router = useRouter();
  const addPatient = usePatientStore((s) => s.addPatient);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      condition: "",
      insuranceProvider: "",
      insuranceNumber: "",
      emergencyContact: "",
      emergencyPhone: "",
    },
  });

  const genderValue = watch("gender");

  function onSubmit(data: PatientFormValues) {
    const id = `p${Date.now()}`;
    const newPatient: Patient = {
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      condition: data.condition,
      status: "new",
      insuranceProvider: data.insuranceProvider || undefined,
      insuranceNumber: data.insuranceNumber || undefined,
      emergencyContact: data.emergencyContact || undefined,
      emergencyPhone: data.emergencyPhone || undefined,
      createdAt: new Date().toISOString(),
      totalSessions: 0,
      completionRate: 0,
    };
    addPatient(newPatient);
    toast.success("Patient created successfully");
    router.push(`/patients/${id}`);
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Back link */}
      <Link
        href="/patients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="size-4" />
        Back to Patients
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">New Patient</h1>
        <p className="text-sm text-muted-foreground">
          Add a new patient to your practice.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup label="First Name" error={errors.firstName?.message}>
              <Input {...register("firstName")} placeholder="John" />
            </FieldGroup>
            <FieldGroup label="Last Name" error={errors.lastName?.message}>
              <Input {...register("lastName")} placeholder="Smith" />
            </FieldGroup>
            <FieldGroup label="Email" error={errors.email?.message}>
              <Input {...register("email")} type="email" placeholder="john@email.com" />
            </FieldGroup>
            <FieldGroup label="Phone" error={errors.phone?.message}>
              <Input {...register("phone")} placeholder="(02) 9123 4567" />
            </FieldGroup>
            <FieldGroup label="Date of Birth" error={errors.dateOfBirth?.message}>
              <Input {...register("dateOfBirth")} type="date" />
            </FieldGroup>
            <FieldGroup label="Gender" error={errors.gender?.message}>
              <Select
                value={genderValue}
                onValueChange={(val) => {
                  if (val) setValue("gender", val as "male" | "female" | "other", { shouldValidate: true });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
            <div className="sm:col-span-2">
              <FieldGroup label="Address" error={errors.address?.message}>
                <Input {...register("address")} placeholder="42 Harbour St, Sydney NSW 2000" />
              </FieldGroup>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldGroup label="Condition" error={errors.condition?.message}>
                <Input
                  {...register("condition")}
                  placeholder="e.g., ACL Reconstruction Rehab (Left Knee)"
                />
              </FieldGroup>
            </div>
            <FieldGroup label="Insurance Provider" error={errors.insuranceProvider?.message}>
              <Input {...register("insuranceProvider")} placeholder="e.g., Medibank Private" />
            </FieldGroup>
            <FieldGroup label="Insurance Number" error={errors.insuranceNumber?.message}>
              <Input {...register("insuranceNumber")} placeholder="e.g., MBP-8834921" />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup label="Contact Name" error={errors.emergencyContact?.message}>
              <Input {...register("emergencyContact")} placeholder="e.g., Jane Smith" />
            </FieldGroup>
            <FieldGroup label="Contact Phone" error={errors.emergencyPhone?.message}>
              <Input {...register("emergencyPhone")} placeholder="(02) 9123 4568" />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/patients">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Patient"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
