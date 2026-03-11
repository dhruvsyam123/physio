import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/ai";
import { DRAFT_MESSAGE_PROMPT } from "@/lib/ai-prompts";
import { auth } from "@/lib/auth";

function getFallbackDraft(
  patientName: string,
  condition: string,
  lastMessage?: string
) {
  const firstName = patientName.split(" ")[0];

  if (lastMessage) {
    return {
      draft:
        `Hi ${firstName},\n\n` +
        `Thanks for your message. I'm glad to hear you're keeping up with your exercises for your ${condition} management.\n\n` +
        `It's completely normal to experience some fluctuations in your symptoms as we progress through treatment. ` +
        `Continue with your home exercise program as prescribed, and remember to pace your activities throughout the day. ` +
        `If you notice any significant increase in pain or new symptoms, please don't hesitate to reach out.\n\n` +
        `I look forward to seeing you at your next appointment where we can review your progress and adjust your program as needed.\n\n` +
        `Best regards,\nYour Physiotherapy Team`,
    };
  }

  return {
    draft:
      `Hi ${firstName},\n\n` +
      `I hope you're doing well. I wanted to check in on how you're progressing with your ${condition} rehabilitation.\n\n` +
      `As a reminder, it's important to continue with your home exercises consistently. ` +
      `Try to complete them at least once daily, and remember to stay within your comfortable range of motion. ` +
      `Consistency is key to making steady progress.\n\n` +
      `If you have any questions about your exercises or have noticed any changes in your symptoms, please let me know. ` +
      `Otherwise, I'll see you at your next scheduled appointment.\n\n` +
      `Take care,\nYour Physiotherapy Team`,
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { patientName, condition, lastMessage, context } = await req.json();

    if (!patientName || !condition) {
      return NextResponse.json(
        { error: "Patient name and condition are required" },
        { status: 400 }
      );
    }

    const prompt = [
      `Patient Name: ${patientName}`,
      `Condition: ${condition}`,
      lastMessage ? `Last message from patient: "${lastMessage}"` : "",
      context ? `Additional context: ${context}` : "",
      "\nDraft an appropriate follow-up message.",
    ]
      .filter(Boolean)
      .join("\n");

    const result = await generateContent(prompt, DRAFT_MESSAGE_PROMPT);

    if (!result) {
      return NextResponse.json(
        getFallbackDraft(patientName, condition, lastMessage)
      );
    }

    try {
      const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({ draft: parsed.draft });
    } catch {
      // If JSON parsing fails, return the raw text as the draft
      return NextResponse.json({ draft: result.trim() });
    }
  } catch (error) {
    console.error("Draft message API error:", error);
    return NextResponse.json(
      { error: "Failed to draft message" },
      { status: 500 }
    );
  }
}
