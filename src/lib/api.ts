import type { Patient, Appointment, SOAPNote, Exercise, TreatmentPlan, Conversation, Message, Referral } from "@/types";
import type { OutcomeRecord } from "@/types/outcomes";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  patients: {
    list: () => apiFetch<Patient[]>("/api/patients"),
    get: (id: string) => apiFetch<Patient>(`/api/patients/${id}`),
    create: (data: Partial<Patient>) =>
      apiFetch<Patient>("/api/patients", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Patient>) =>
      apiFetch<Patient>(`/api/patients/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiFetch(`/api/patients/${id}`, { method: "DELETE" }),
  },

  appointments: {
    list: (params?: { date?: string; patientId?: string }) => {
      const sp = new URLSearchParams();
      if (params?.date) sp.set("date", params.date);
      if (params?.patientId) sp.set("patientId", params.patientId);
      const qs = sp.toString();
      return apiFetch<Appointment[]>(`/api/appointments${qs ? `?${qs}` : ""}`);
    },
    get: (id: string) => apiFetch<Appointment>(`/api/appointments/${id}`),
    create: (data: Partial<Appointment>) =>
      apiFetch<Appointment>("/api/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Appointment>) =>
      apiFetch<Appointment>(`/api/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiFetch(`/api/appointments/${id}`, { method: "DELETE" }),
  },

  notes: {
    list: (patientId?: string) => {
      const qs = patientId ? `?patientId=${patientId}` : "";
      return apiFetch<SOAPNote[]>(`/api/notes${qs}`);
    },
    get: (id: string) => apiFetch<SOAPNote>(`/api/notes/${id}`),
    create: (data: Partial<SOAPNote> & { billingEntries?: Array<{ cptCode: string; description: string; units: number; timeMinutes: number }> }) =>
      apiFetch<SOAPNote>("/api/notes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<SOAPNote>) =>
      apiFetch<SOAPNote>(`/api/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  exercises: {
    list: (params?: { region?: string; category?: string; difficulty?: string; search?: string }) => {
      const sp = new URLSearchParams();
      if (params?.region) sp.set("region", params.region);
      if (params?.category) sp.set("category", params.category);
      if (params?.difficulty) sp.set("difficulty", params.difficulty);
      if (params?.search) sp.set("search", params.search);
      const qs = sp.toString();
      return apiFetch<Exercise[]>(`/api/exercises${qs ? `?${qs}` : ""}`);
    },
  },

  plans: {
    list: (patientId?: string) => {
      const qs = patientId ? `?patientId=${patientId}` : "";
      return apiFetch<TreatmentPlan[]>(`/api/plans${qs}`);
    },
    get: (id: string) => apiFetch<TreatmentPlan>(`/api/plans/${id}`),
    create: (data: Partial<TreatmentPlan>) =>
      apiFetch<TreatmentPlan>("/api/plans", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<TreatmentPlan>) =>
      apiFetch<TreatmentPlan>(`/api/plans/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiFetch(`/api/plans/${id}`, { method: "DELETE" }),
  },

  conversations: {
    list: () => apiFetch<Conversation[]>("/api/conversations"),
    get: (id: string) => apiFetch<Conversation>(`/api/conversations/${id}`),
    create: (data: { patientId: string; patientName: string; patientAvatar?: string }) =>
      apiFetch<Conversation>("/api/conversations", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    markRead: (id: string) =>
      apiFetch(`/api/conversations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ markRead: true }),
      }),
    getMessages: (id: string) =>
      apiFetch<Message[]>(`/api/conversations/${id}/messages`),
    sendMessage: (id: string, data: { content: string; senderId: string; senderName: string; senderRole: string }) =>
      apiFetch<Message>(`/api/conversations/${id}/messages`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  referrals: {
    list: () => apiFetch<Referral[]>("/api/referrals"),
    get: (id: string) => apiFetch<Referral>(`/api/referrals/${id}`),
    create: (data: Partial<Referral>) =>
      apiFetch<Referral>("/api/referrals", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Referral>) =>
      apiFetch<Referral>(`/api/referrals/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  outcomes: {
    list: (params?: { patientId?: string; type?: string }) => {
      const sp = new URLSearchParams();
      if (params?.patientId) sp.set("patientId", params.patientId);
      if (params?.type) sp.set("type", params.type);
      const qs = sp.toString();
      return apiFetch<OutcomeRecord[]>(`/api/outcomes${qs ? `?${qs}` : ""}`);
    },
    create: (data: Partial<OutcomeRecord>) =>
      apiFetch<OutcomeRecord>("/api/outcomes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiFetch(`/api/outcomes/${id}`, { method: "DELETE" }),
  },
};
