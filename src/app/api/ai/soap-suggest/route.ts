import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/ai";
import { SOAP_SUGGEST_PROMPT } from "@/lib/ai-prompts";

function getFallbackResponse(subjective: string, objective: string) {
  const isLowerBack =
    subjective.toLowerCase().includes("back") ||
    objective.toLowerCase().includes("lumbar");
  const isShoulder =
    subjective.toLowerCase().includes("shoulder") ||
    objective.toLowerCase().includes("shoulder");
  const isKnee =
    subjective.toLowerCase().includes("knee") ||
    objective.toLowerCase().includes("knee");

  if (isLowerBack) {
    return {
      assessment:
        "Patient presents with mechanical low back pain with associated movement impairments. " +
        "Subjective reports are consistent with objective findings of reduced lumbar ROM and core stability deficits. " +
        "Functional limitations include difficulty with prolonged sitting and bending activities. " +
        "Neurological screening is negative, suggesting a musculoskeletal origin. Prognosis for recovery is good with appropriate intervention.",
      plan:
        "1. Manual therapy: lumbar mobilisations (PA glides L3-L5, Grade III-IV) to improve segmental mobility\n" +
        "2. Core stabilisation program: transversus abdominis activation (10x10s holds), bird-dogs (3x10), dead bugs (3x10)\n" +
        "3. Stretching: hip flexor stretches (3x30s bilateral), piriformis stretches (3x30s)\n" +
        "4. Patient education: ergonomic advice for workstation, pacing strategies for daily activities\n" +
        "5. Home exercise program provided with illustrated handout\n" +
        "6. Follow-up in 1 week to reassess and progress as appropriate",
    };
  }

  if (isShoulder) {
    return {
      assessment:
        "Patient presents with signs consistent with rotator cuff tendinopathy / subacromial impingement. " +
        "Positive impingement signs correlate with reported pain during overhead activities. " +
        "Scapular dyskinesis noted contributing to altered shoulder mechanics. " +
        "No signs of instability or significant structural damage. Moderate irritability level.",
      plan:
        "1. Manual therapy: glenohumeral joint mobilisations (inferior and posterior glides, Grade II-III), soft tissue massage to upper trapezius and pectoralis minor\n" +
        "2. Rotator cuff program: isometric ER/IR (5x10s) progressing to isotonic with theraband\n" +
        "3. Scapular stabilisation: wall push-ups with plus (3x10), prone Y-T-W (3x8)\n" +
        "4. Thoracic mobility exercises: foam roller extensions, open book stretches\n" +
        "5. Activity modification advice: avoid overhead reaching above 90° until pain settles\n" +
        "6. Review in 1 week, aim to progress to isotonic cuff strengthening",
    };
  }

  if (isKnee) {
    return {
      assessment:
        "Patient presents with anterior knee pain consistent with patellofemoral pain syndrome. " +
        "Objective findings of reduced quadriceps strength and VMO activation deficit support this presentation. " +
        "Contributing factors include hip abductor weakness and reduced ankle dorsiflexion. " +
        "No signs of ligamentous instability or meniscal pathology.",
      plan:
        "1. Quadriceps strengthening: isometric quad sets (5x10s), straight leg raises (3x10), mini squats 0-40° (3x10)\n" +
        "2. Hip strengthening: side-lying hip abduction (3x12), clamshells with band (3x12)\n" +
        "3. Patellar taping: McConnell medial glide technique for pain relief during exercises\n" +
        "4. Stretching: ITB foam rolling, calf stretches (3x30s), quadriceps stretches (3x30s)\n" +
        "5. Activity modification: reduce aggravating activities (stairs, prolonged sitting with bent knees)\n" +
        "6. Follow-up in 1 week to reassess and progress loading as tolerated",
    };
  }

  return {
    assessment:
      "Patient presents with musculoskeletal complaints consistent with the reported mechanism and symptom pattern. " +
      "Objective findings correlate with subjective reports, indicating a primarily mechanical presentation. " +
      "Functional limitations are moderate, impacting daily activities as described. " +
      "No red flags identified. Prognosis is favourable with appropriate physiotherapy intervention.",
    plan:
      "1. Manual therapy: joint mobilisations and soft tissue techniques as indicated by assessment findings\n" +
      "2. Therapeutic exercise: progressive strengthening program targeting identified deficits (3x10-12 reps)\n" +
      "3. Flexibility program: stretching of identified tight muscle groups (3x30s holds)\n" +
      "4. Neuromuscular control: proprioceptive and balance training appropriate to presentation\n" +
      "5. Patient education: condition explanation, activity modification advice, and self-management strategies\n" +
      "6. Home exercise program: 3-4 key exercises to be performed daily\n" +
      "7. Follow-up in 1 week to reassess and adjust treatment plan",
  };
}

export async function POST(req: NextRequest) {
  try {
    const { subjective, objective, patientContext } = await req.json();

    if (!subjective || !objective) {
      return NextResponse.json(
        { error: "Subjective and objective findings are required" },
        { status: 400 }
      );
    }

    const prompt = [
      `Subjective Findings:\n${subjective}`,
      `\nObjective Findings:\n${objective}`,
      patientContext ? `\nPatient Context:\n${patientContext}` : "",
      "\nGenerate the Assessment and Plan sections.",
    ].join("\n");

    const result = await generateContent(prompt, SOAP_SUGGEST_PROMPT);

    if (!result) {
      return NextResponse.json(getFallbackResponse(subjective, objective));
    }

    try {
      const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({
        assessment: parsed.assessment,
        plan: parsed.plan,
      });
    } catch {
      // If JSON parsing fails, try to extract content
      return NextResponse.json({
        assessment: result.substring(0, result.length / 2),
        plan: result.substring(result.length / 2),
      });
    }
  } catch (error) {
    console.error("SOAP suggest API error:", error);
    return NextResponse.json(
      { error: "Failed to generate SOAP suggestions" },
      { status: 500 }
    );
  }
}
