"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Sparkles,
  Save,
  FileCheck,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateNote } from "@/hooks/use-notes";
import { buildPatientContext } from "@/lib/ai-context";
import { BillingCodes } from "@/components/notes/billing-codes";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SOAPFormData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface SOAPNoteEditorProps {
  patientId: string;
  onSaved?: () => void;
  initialObjective?: string;
}

// ---------------------------------------------------------------------------
// Quick-fill condition templates
// ---------------------------------------------------------------------------

const templates = [
  {
    label: "Lower Back Pain",
    subjective:
      "Patient reports persistent lower back pain, aggravated by prolonged sitting and bending. Pain rated {}/10 on VAS. Sleep disturbed due to pain. Difficulty with daily activities including {}.",
    objective:
      "Posture: Increased lumbar lordosis. ROM: Lumbar flexion {}°, extension {}°, lateral flexion L {}° R {}°. Palpation: Tenderness over L4-L5 paraspinal muscles. SLR: {}. Neurological: Intact sensation, normal reflexes.",
  },
  {
    label: "Frozen Shoulder",
    subjective:
      "Patient reports progressive shoulder stiffness and pain for {} months. Difficulty reaching overhead and behind back. Pain rated {}/10, particularly at night. Unable to {}.",
    objective:
      "Active ROM: Flexion {}°, abduction {}°, ER {}°, IR {}°. Passive ROM: Flexion {}°, abduction {}°, ER {}°, IR {}°. Capsular pattern present. Strength: Difficult to assess due to pain. Special tests: {}.",
  },
  {
    label: "ACL Rehabilitation",
    subjective:
      "Patient is {} weeks post ACL reconstruction. Reports {}. Pain {}/10. Knee stability feeling {}. Goals: return to {}.",
    objective:
      "Observation: {} swelling. ROM: Flexion {}°, extension {}°. Lachman's: {}. Quad activation: {}. Gait: {}. Functional: {}.",
  },
  {
    label: "Post-Op Knee (TKR)",
    subjective:
      "Patient is {} weeks post total knee replacement. Reports {}. Pain {}/10 at rest, {}/10 with activity. Able to {}. Sleep {}.",
    objective:
      "Wound: {}. ROM: Flexion {}°, extension {}°. Strength: Quads {}/5, hamstrings {}/5. Gait: {} with {}. Stairs: {}. Swelling: {}.",
  },
  {
    label: "Rotator Cuff",
    subjective:
      "Patient reports shoulder pain for {} weeks/months. Pain rated {}/10, worse with {}. Difficulty with overhead activities and {}. Night pain: {}.",
    objective:
      "Active ROM: Flexion {}°, abduction {}°, ER {}°, IR {}°. Strength: Supraspinatus {}/5, infraspinatus {}/5, subscapularis {}/5. Special tests: Neer's {}, Hawkins {}, Empty can {}, Drop arm {}. Scapular control: {}.",
  },
];

// ---------------------------------------------------------------------------
// Ghost-text suggestions (client-side, demo)
// ---------------------------------------------------------------------------

const ghostSuggestions: { trigger: string; completion: string }[] = [
  {
    trigger: "Patient reports",
    completion: " increased pain and stiffness since last visit",
  },
  {
    trigger: "Pain rated",
    completion: " X/10 on the Visual Analog Scale",
  },
  {
    trigger: "Difficulty with",
    completion: " activities of daily living including",
  },
  {
    trigger: "Sleep",
    completion: " is disturbed due to pain, particularly when",
  },
  {
    trigger: "Patient complains of",
    completion: " worsening symptoms over the past week",
  },
  {
    trigger: "No significant",
    completion: " changes since last visit",
  },
  {
    trigger: "Symptoms are",
    completion: " aggravated by prolonged sitting and bending",
  },
];

// ---------------------------------------------------------------------------
// Clinical terminology autocomplete triggers (Objective textarea)
// ---------------------------------------------------------------------------

const clinicalTriggers: { trigger: string; suggestions: string[] }[] = [
  {
    trigger: "ROM:",
    suggestions: [
      "Flexion °, Extension °, Abduction °, Adduction °, IR °, ER °",
      "Within normal limits",
      "Limited in all planes",
    ],
  },
  {
    trigger: "Strength:",
    suggestions: [
      "Graded /5 using Oxford scale",
      "Globally 4/5 with 3/5 noted in",
      "Unable to assess due to pain",
    ],
  },
  {
    trigger: "Gait:",
    suggestions: [
      "Antalgic gait pattern, reduced stride length",
      "Normal gait pattern, no deviations noted",
      "Trendelenburg positive on affected side",
    ],
  },
  {
    trigger: "Special tests:",
    suggestions: [
      "Neer's, Hawkins-Kennedy, Empty Can, Drop Arm",
      "Lachman's, Anterior Drawer, McMurray's, Valgus/Varus stress",
      "SLR, Slump, FABER, Thomas test",
    ],
  },
  {
    trigger: "Palpation:",
    suggestions: [
      "Tenderness noted over",
      "No tenderness on palpation",
      "Increased tone and trigger points in",
    ],
  },
  {
    trigger: "Sensation:",
    suggestions: [
      "Intact to light touch in all dermatomes",
      "Reduced sensation in dermatome",
      "Intact bilaterally",
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SOAPNoteEditor({
  patientId,
  onSaved,
  initialObjective,
}: SOAPNoteEditorProps) {
  const createNote = useCreateNote();

  // AI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [showSignDialog, setShowSignDialog] = useState(false);

  // Ghost text
  const [ghostText, setGhostText] = useState("");
  const ghostTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subjectiveRef = useRef<HTMLTextAreaElement | null>(null);

  // Clinical autocomplete
  const [clinicalSuggestions, setClinicalSuggestions] = useState<string[]>([]);
  const [clinicalDropdownPos, setClinicalDropdownPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const objectiveRef = useRef<HTMLTextAreaElement | null>(null);

  // Template dropdown
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const templateDropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting },
  } = useForm<SOAPFormData>({
    defaultValues: {
      subjective: "",
      objective: initialObjective ?? "",
      assessment: "",
      plan: "",
    },
  });

  // Close template dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        templateDropdownRef.current &&
        !templateDropdownRef.current.contains(e.target as Node)
      ) {
        setShowTemplateDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ------------------------------------------------------------------
  // Template selection
  // ------------------------------------------------------------------

  function handleTemplateSelect(template: (typeof templates)[number]) {
    setValue("subjective", template.subjective, { shouldDirty: true });
    setValue("objective", template.objective, { shouldDirty: true });
    setShowTemplateDropdown(false);
  }

  // ------------------------------------------------------------------
  // Generate Full Note (Assessment + Plan with typewriter effect)
  // ------------------------------------------------------------------

  async function handleGenerateFullNote() {
    const { subjective, objective } = getValues();
    if (!subjective && !objective) return;

    setIsGenerating(true);
    try {
      const patientContext = buildPatientContext(patientId);
      const response = await fetch("/api/ai/soap-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjective,
          objective,
          patientContext,
        }),
      });

      if (!response.ok) {
        setIsGenerating(false);
        return;
      }

      const data = await response.json();
      const assessmentText: string = data.assessment ?? "";
      const planText: string = data.plan ?? "";

      // Typewriter effect for assessment
      setValue("assessment", "", { shouldDirty: true });
      await typewriterEffect("assessment", assessmentText);

      // Typewriter effect for plan
      setValue("plan", "", { shouldDirty: true });
      await typewriterEffect("plan", planText);
    } catch {
      // Silently handle - user can retry
    } finally {
      setIsGenerating(false);
    }
  }

  function typewriterEffect(
    field: "assessment" | "plan",
    text: string
  ): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setValue(field, text.substring(0, i), { shouldDirty: true });
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 15);
    });
  }

  // ------------------------------------------------------------------
  // Ghost text auto-suggest (Subjective)
  // ------------------------------------------------------------------

  const handleSubjectiveChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      // Clear previous ghost text and timer
      setGhostText("");
      if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);

      ghostTimerRef.current = setTimeout(() => {
        if (!value.trim()) return;
        const lowerVal = value.toLowerCase();
        for (const gs of ghostSuggestions) {
          if (lowerVal.endsWith(gs.trigger.toLowerCase())) {
            setGhostText(gs.completion);
            return;
          }
        }
        // Also check if last line ends with trigger
        const lines = value.split("\n");
        const lastLine = lines[lines.length - 1].trim().toLowerCase();
        for (const gs of ghostSuggestions) {
          if (lastLine.endsWith(gs.trigger.toLowerCase())) {
            setGhostText(gs.completion);
            return;
          }
        }
      }, 1500);
    },
    []
  );

  const handleSubjectiveKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ghostText) {
        if (e.key === "Tab") {
          e.preventDefault();
          const current = getValues("subjective");
          setValue("subjective", current + ghostText, { shouldDirty: true });
          setGhostText("");
        } else {
          setGhostText("");
        }
      }
    },
    [ghostText, getValues, setValue]
  );

  // ------------------------------------------------------------------
  // Clinical terminology autocomplete (Objective)
  // ------------------------------------------------------------------

  const handleObjectiveChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursorPos = e.target.selectionStart ?? value.length;
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastLine = textBeforeCursor.split("\n").pop() ?? "";
      const trimmedLine = lastLine.trimStart();

      let matched = false;
      for (const ct of clinicalTriggers) {
        if (
          trimmedLine.toLowerCase().endsWith(ct.trigger.toLowerCase()) ||
          trimmedLine.toLowerCase() === ct.trigger.toLowerCase()
        ) {
          setClinicalSuggestions(ct.suggestions);
          // Position the dropdown near the textarea
          if (objectiveRef.current) {
            const rect = objectiveRef.current.getBoundingClientRect();
            setClinicalDropdownPos({
              top: rect.bottom + 4,
              left: rect.left,
            });
          }
          matched = true;
          break;
        }
      }
      if (!matched) {
        setClinicalSuggestions([]);
        setClinicalDropdownPos(null);
      }
    },
    []
  );

  function handleClinicalSuggestionClick(suggestion: string) {
    const current = getValues("objective");
    const endsWithSpace = current.endsWith(" ") || current.endsWith("\n");
    setValue("objective", current + (endsWithSpace ? "" : " ") + suggestion, {
      shouldDirty: true,
    });
    setClinicalSuggestions([]);
    setClinicalDropdownPos(null);
    objectiveRef.current?.focus();
  }

  // ------------------------------------------------------------------
  // Save / Sign & Lock
  // ------------------------------------------------------------------

  function saveNote(data: SOAPFormData, signed: boolean) {
    const note = {
      id: `note-${Date.now()}`,
      patientId,
      date: new Date().toISOString().split("T")[0],
      subjective: data.subjective,
      objective: data.objective,
      assessment: data.assessment,
      plan: data.plan,
      therapistName: "Dr. Sarah Thompson",
      signed,
      createdAt: new Date().toISOString(),
    };
    createNote.mutate(note, {
      onSuccess: () => {
        if (signed) {
          setIsSigned(true);
          toast.success("SOAP note signed and locked");
        }
        if (!signed) {
          toast.success("SOAP note saved as draft");
          onSaved?.();
        }
      },
    });
  }

  function handleSignConfirm() {
    setShowSignDialog(false);
    handleSubmit((data) => saveNote(data, true))();
  }

  // Watch current values for ghost text display
  const subjectiveValue = watch("subjective");

  // Register refs properly
  const { ref: subjectiveFormRef, ...subjectiveRest } = register("subjective");
  const { ref: objectiveFormRef, ...objectiveRest } = register("objective");

  return (
    <>
      <form className="flex flex-col gap-6">
        {/* Signed banner */}
        {isSigned && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              This note has been signed and locked.
            </span>
            <Badge variant="default" className="ml-auto bg-green-600">
              Signed
            </Badge>
          </div>
        )}

        {/* Quick-fill template selector */}
        {!isSigned && (
          <div className="relative" ref={templateDropdownRef}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              className="gap-1.5"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Quick-fill Template
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            {showTemplateDropdown && (
              <div className="absolute top-full left-0 z-50 mt-1 w-64 rounded-lg border bg-popover p-1 shadow-md">
                {templates.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => handleTemplateSelect(t)}
                    className="flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subjective */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">
              <span className="inline-flex items-center justify-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 mr-2">
                S
              </span>
              Subjective
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="subjective" className="sr-only">
              Subjective
            </Label>
            <div className="relative">
              <Textarea
                id="subjective"
                placeholder="Patient complaints, history, symptoms as reported by the patient..."
                className={`min-h-28 resize-y ${isSigned ? "bg-muted/50" : ""}`}
                disabled={isSigned}
                {...subjectiveRest}
                ref={(el) => {
                  subjectiveFormRef(el);
                  subjectiveRef.current = el;
                }}
                onChange={(e) => {
                  subjectiveRest.onChange(e);
                  handleSubjectiveChange(e);
                }}
                onKeyDown={handleSubjectiveKeyDown}
              />
              {ghostText && !isSigned && (
                <div className="pointer-events-none absolute inset-0 px-2.5 py-2 text-base md:text-sm">
                  <span className="invisible whitespace-pre-wrap">
                    {subjectiveValue}
                  </span>
                  <span className="text-muted-foreground/40">
                    {ghostText}
                  </span>
                  <span className="ml-2 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                    Tab to accept
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Objective */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">
              <span className="inline-flex items-center justify-center rounded-md bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300 mr-2">
                O
              </span>
              Objective
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="objective" className="sr-only">
              Objective
            </Label>
            <Textarea
              id="objective"
              placeholder="Clinical findings, measurements, observations, test results..."
              className={`min-h-28 resize-y ${isSigned ? "bg-muted/50" : ""}`}
              disabled={isSigned}
              {...objectiveRest}
              ref={(el) => {
                objectiveFormRef(el);
                objectiveRef.current = el;
              }}
              onChange={(e) => {
                objectiveRest.onChange(e);
                handleObjectiveChange(e);
              }}
            />
            {/* Clinical terminology autocomplete dropdown */}
            {clinicalSuggestions.length > 0 &&
              clinicalDropdownPos &&
              !isSigned && (
                <div
                  className="fixed z-50 w-80 rounded-lg border bg-popover p-1 shadow-md"
                  style={{
                    top: clinicalDropdownPos.top,
                    left: clinicalDropdownPos.left,
                  }}
                >
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    Clinical suggestions
                  </div>
                  {clinicalSuggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleClinicalSuggestionClick(s)}
                      className="flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>

        {/* Generate Full Note button */}
        {!isSigned && (
          <div className="flex justify-center">
            <Button
              type="button"
              size="lg"
              onClick={handleGenerateFullNote}
              disabled={isGenerating}
              className="gap-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating
                ? "Generating Assessment & Plan..."
                : "Generate Full Note with AI"}
            </Button>
          </div>
        )}

        {/* Assessment */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">
              <span className="inline-flex items-center justify-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300 mr-2">
                A
              </span>
              Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="assessment" className="sr-only">
              Assessment
            </Label>
            <Textarea
              id="assessment"
              placeholder="Clinical reasoning, diagnosis, prognosis, progress assessment..."
              className={`min-h-28 resize-y ${isSigned ? "bg-muted/50" : ""}`}
              disabled={isSigned}
              {...register("assessment")}
            />
            {isGenerating && (
              <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                AI is generating content...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Plan */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">
              <span className="inline-flex items-center justify-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300 mr-2">
                P
              </span>
              Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="plan" className="sr-only">
              Plan
            </Label>
            <Textarea
              id="plan"
              placeholder="Treatment plan, exercises prescribed, follow-up schedule, goals..."
              className={`min-h-28 resize-y ${isSigned ? "bg-muted/50" : ""}`}
              disabled={isSigned}
              {...register("plan")}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        {!isSigned ? (
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isSubmitting || isGenerating}
              onClick={handleSubmit((data) => saveNote(data, false))}
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={isSubmitting || isGenerating}
              onClick={() => setShowSignDialog(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <FileCheck className="h-4 w-4" />
              Sign &amp; Lock
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => onSaved?.()}
            >
              Back to Patient
            </Button>
          </div>
        )}
      </form>

      {/* Billing & CPT Codes */}
      <BillingCodes
        noteContent={{
          subjective: watch("subjective"),
          objective: watch("objective"),
          assessment: watch("assessment"),
          plan: watch("plan"),
        }}
      />

      {/* Sign confirmation dialog */}
      <Dialog
        open={showSignDialog}
        onOpenChange={(open) => setShowSignDialog(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign &amp; Lock Note</DialogTitle>
            <DialogDescription>
              Once signed, this note cannot be edited. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSignDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleSignConfirm}
            >
              <FileCheck className="h-4 w-4" />
              Confirm Sign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
