export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  condition: string;
  status: "active" | "discharged" | "on-hold" | "new";
  avatar?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  createdAt: string;
  nextAppointment?: string;
  lastVisit?: string;
  totalSessions: number;
  completionRate: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "initial-assessment" | "follow-up" | "treatment" | "review" | "discharge";
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
  notes?: string;
  location?: string;
}

export interface SOAPNote {
  id: string;
  patientId: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  therapistName: string;
  signed: boolean;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  bodyRegion: "neck" | "shoulder" | "upper-back" | "lower-back" | "hip" | "knee" | "ankle" | "wrist" | "elbow" | "core" | "full-body";
  category: "strengthening" | "stretching" | "mobility" | "balance" | "cardio" | "functional";
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment?: string;
  imageUrl?: string;
  videoUrl?: string;
  instructions: string[];
  sets?: number;
  reps?: number;
  holdSeconds?: number;
  duration?: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  name: string;
  condition: string;
  goals: string[];
  phases: TreatmentPhase[];
  status: "draft" | "active" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentPhase {
  id: string;
  name: string;
  weekStart: number;
  weekEnd: number;
  exercises: PlanExercise[];
  notes?: string;
}

export interface PlanExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  holdSeconds?: number;
  frequency: string;
  notes?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: "therapist" | "patient";
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface Referral {
  id: string;
  patientName?: string;
  referrerName: string;
  referrerType: "GP" | "specialist" | "self" | "hospital";
  date: string;
  condition: string;
  rawText: string;
  status: "pending" | "reviewed" | "accepted" | "converted";
  parsedData?: ParsedReferral;
}

export interface ParsedReferral {
  patientName: string;
  dateOfBirth?: string;
  condition: string;
  history: string;
  goals: string[];
  precautions: string[];
  suggestedFrequency?: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface KPIData {
  patientsToday: number;
  sessionsThisWeek: number;
  pendingFollowups: number;
  completionRate: number;
}
