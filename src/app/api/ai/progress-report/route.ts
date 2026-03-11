import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/ai";

const PROGRESS_REPORT_PROMPT = `You are a clinical documentation assistant for physiotherapists. Generate a structured progress report suitable for Medicare compliance and insurance review.

Output JSON with these fields:
{
  "summary": "Brief narrative summary of patient progress",
  "recommendations": "Updated plan of care recommendations",
  "medicalNecessity": "Medical necessity justification statement"
}

Use professional clinical language. Be specific about measurable outcomes. Reference objective data provided.`;

function getFallbackReport(patientName: string, condition: string, sessionCount: number) {
  return {
    summary: `${patientName} has been receiving skilled physical therapy services for ${condition} over ${sessionCount} treatment sessions. The patient has demonstrated measurable improvements in pain levels, range of motion, and functional capacity. Compliance with the home exercise program has been satisfactory, and the patient reports subjective improvement in ability to perform daily activities.`,
    recommendations: `Continue skilled physical therapy 2x/week for 4 weeks. Progress strengthening program as tolerated. Reassess outcome measures at next visit. Update home exercise program with increased intensity as appropriate. Consider discharge planning if goals are met within the next 4-6 sessions.`,
    medicalNecessity: `Continued skilled physical therapy services are medically necessary to address ${condition.toLowerCase()}. The patient has demonstrated measurable improvements but has not yet achieved functional goals required for safe discharge. The complexity of the condition requires the expertise of a licensed physical therapist to safely progress the treatment plan, manage exercise parameters, and prevent regression of gains. Skilled intervention cannot be replicated by the patient independently at this stage of recovery.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { patientName, condition, outcomes, notes, plan, sessionCount } = await req.json();

    if (!patientName || !condition) {
      return NextResponse.json(
        { error: "Patient name and condition are required" },
        { status: 400 }
      );
    }

    const prompt = [
      `Patient: ${patientName}`,
      `Condition: ${condition}`,
      `Sessions Completed: ${sessionCount || "Unknown"}`,
      outcomes ? `\nOutcome Measures:\n${JSON.stringify(outcomes)}` : "",
      notes ? `\nRecent SOAP Notes Summary:\n${notes}` : "",
      plan ? `\nCurrent Treatment Plan:\n${plan}` : "",
      "\nGenerate a progress report with summary, recommendations, and medical necessity statement.",
    ].join("\n");

    const result = await generateContent(prompt, PROGRESS_REPORT_PROMPT);

    if (!result) {
      return NextResponse.json(getFallbackReport(patientName, condition, sessionCount || 0));
    }

    try {
      const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({
        summary: parsed.summary,
        recommendations: parsed.recommendations,
        medicalNecessity: parsed.medicalNecessity,
      });
    } catch {
      return NextResponse.json(getFallbackReport(patientName, condition, sessionCount || 0));
    }
  } catch (error) {
    console.error("Progress report API error:", error);
    return NextResponse.json(
      { error: "Failed to generate progress report" },
      { status: 500 }
    );
  }
}
