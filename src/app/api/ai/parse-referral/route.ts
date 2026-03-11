import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/ai";
import { PARSE_REFERRAL_PROMPT } from "@/lib/ai-prompts";
import { auth } from "@/lib/auth";

function getFallbackParsedReferral(referralText: string) {
  const text = referralText.toLowerCase();

  // Try to extract a patient name from common patterns
  let patientName = "Unknown Patient";
  const namePatterns = [
    /(?:patient|re|regarding|name)[:\s]+([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /(?:dear|refer|referring)\s+([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /(?:mr|mrs|ms|miss|dr)\.?\s+([A-Z][a-z]+ [A-Z][a-z]+)/i,
  ];
  for (const pattern of namePatterns) {
    const match = referralText.match(pattern);
    if (match) {
      patientName = match[1];
      break;
    }
  }

  // Try to extract date of birth
  let dateOfBirth: string | null = null;
  const dobMatch = referralText.match(
    /(?:DOB|date of birth|born)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
  );
  if (dobMatch) {
    dateOfBirth = dobMatch[1];
  }

  // Determine condition from text
  let condition = "Musculoskeletal condition - requires assessment";
  if (text.includes("back") || text.includes("lumbar") || text.includes("spine")) {
    condition = "Low back pain";
  } else if (text.includes("shoulder")) {
    condition = "Shoulder pain / dysfunction";
  } else if (text.includes("knee")) {
    condition = "Knee pain / dysfunction";
  } else if (text.includes("neck") || text.includes("cervical")) {
    condition = "Neck pain / cervical dysfunction";
  } else if (text.includes("hip")) {
    condition = "Hip pain / dysfunction";
  } else if (text.includes("ankle") || text.includes("foot")) {
    condition = "Ankle / foot pain";
  } else if (text.includes("post-op") || text.includes("surgery") || text.includes("surgical")) {
    condition = "Post-surgical rehabilitation";
  }

  // Build goals based on condition
  const goals: string[] = [
    "Reduce pain and improve comfort",
    "Restore functional range of motion",
    "Improve strength and stability",
    "Return to normal daily activities",
  ];

  // Determine precautions
  const precautions: string[] = [];
  if (text.includes("diabetes") || text.includes("diabetic")) {
    precautions.push("Diabetes - monitor for neuropathy, delayed healing");
  }
  if (text.includes("hypertension") || text.includes("blood pressure")) {
    precautions.push("Hypertension - monitor BP during exercise");
  }
  if (text.includes("osteoporosis") || text.includes("osteopenia")) {
    precautions.push("Reduced bone density - avoid high-impact loading");
  }
  if (text.includes("surgery") || text.includes("post-op")) {
    precautions.push("Post-surgical - follow surgeon's weight-bearing and ROM protocols");
  }
  if (text.includes("anticoagulant") || text.includes("blood thin") || text.includes("warfarin")) {
    precautions.push("On anticoagulant therapy - caution with manual therapy");
  }
  if (precautions.length === 0) {
    precautions.push("No specific precautions noted in referral");
    precautions.push("Confirm any contraindications during initial assessment");
  }

  // Determine frequency
  let suggestedFrequency: string | null = null;
  const freqMatch = referralText.match(
    /(\d+)\s*(?:times?|x|sessions?)\s*(?:per|a|\/)\s*week/i
  );
  if (freqMatch) {
    suggestedFrequency = `${freqMatch[1]}x per week`;
  } else if (text.includes("weekly")) {
    suggestedFrequency = "1x per week";
  } else if (text.includes("twice")) {
    suggestedFrequency = "2x per week";
  }

  return {
    patientName,
    dateOfBirth,
    condition,
    history:
      "Referral received. Full medical history to be confirmed during initial assessment. " +
      "Please review the original referral letter for additional clinical details.",
    goals,
    precautions,
    suggestedFrequency,
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { referralText } = await req.json();

    if (!referralText) {
      return NextResponse.json(
        { error: "Referral text is required" },
        { status: 400 }
      );
    }

    const prompt = `Please parse the following referral letter and extract structured data:\n\n${referralText}`;

    const result = await generateContent(prompt, PARSE_REFERRAL_PROMPT);

    if (!result) {
      return NextResponse.json(getFallbackParsedReferral(referralText));
    }

    try {
      const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({
        patientName: parsed.patientName || "Unknown Patient",
        dateOfBirth: parsed.dateOfBirth || null,
        condition: parsed.condition || "Requires assessment",
        history: parsed.history || "See referral letter",
        goals: parsed.goals || [],
        precautions: parsed.precautions || [],
        suggestedFrequency: parsed.suggestedFrequency || null,
      });
    } catch {
      // If parsing fails, use fallback extraction
      return NextResponse.json(getFallbackParsedReferral(referralText));
    }
  } catch (error) {
    console.error("Parse referral API error:", error);
    return NextResponse.json(
      { error: "Failed to parse referral" },
      { status: 500 }
    );
  }
}
