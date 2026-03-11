"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  conditionFilter: string;
  onConditionChange: (value: string) => void;
  conditions: string[];
}

export function PatientSearch({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  conditionFilter,
  onConditionChange,
  conditions,
}: PatientSearchProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search patients..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Status filter */}
      <Select value={statusFilter} onValueChange={(val) => { if (val) onStatusChange(val); }}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="on-hold">On Hold</SelectItem>
          <SelectItem value="discharged">Discharged</SelectItem>
        </SelectContent>
      </Select>

      {/* Condition filter */}
      <Select value={conditionFilter} onValueChange={(val) => { if (val) onConditionChange(val); }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Conditions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Conditions</SelectItem>
          {conditions.map((condition) => (
            <SelectItem key={condition} value={condition}>
              {condition.length > 30 ? `${condition.slice(0, 30)}...` : condition}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
