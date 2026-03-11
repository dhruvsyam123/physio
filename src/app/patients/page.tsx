"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientSearch } from "@/components/patients/patient-search";
import { usePatientStore } from "@/stores/patient-store";

export default function PatientsPage() {
  const patients = usePatientStore((s) => s.patients);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");

  const conditions = useMemo(() => {
    const set = new Set(patients.map((p) => p.condition));
    return Array.from(set).sort();
  }, [patients]);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const match =
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Status filter
      if (statusFilter !== "all" && p.status !== statusFilter) return false;

      // Condition filter
      if (conditionFilter !== "all" && p.condition !== conditionFilter) return false;

      return true;
    });
  }, [patients, search, statusFilter, conditionFilter]);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground">
            {patients.length} patient{patients.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/patients/new">
          <Button>
            <Plus className="size-4" />
            Add Patient
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <PatientSearch
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        conditionFilter={conditionFilter}
        onConditionChange={setConditionFilter}
        conditions={conditions}
      />

      {/* Patient Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No patients match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
}
