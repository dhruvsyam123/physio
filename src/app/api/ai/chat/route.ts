import { NextRequest } from "next/server";
import { streamChat } from "@/lib/ai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { messages, patientContext } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = patientContext
      ? `${CHAT_SYSTEM_PROMPT}\n\nCurrent patient context:\n${patientContext}`
      : CHAT_SYSTEM_PROMPT;

    const result = await streamChat(messages, systemPrompt);

    // Fallback for demo mode (no API key)
    if (!result) {
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

      let fallback =
        "Based on the clinical presentation you've described, I'd recommend considering the following approach:\n\n";

      if (lastMessage.includes("shoulder") || lastMessage.includes("rotator")) {
        fallback +=
          "**Assessment Considerations:**\n" +
          "- Perform a thorough shoulder examination including Neer's, Hawkins-Kennedy, and Empty Can tests\n" +
          "- Assess scapular kinematics and thoracic mobility\n" +
          "- Rule out cervical spine referral patterns\n\n" +
          "**Treatment Suggestions:**\n" +
          "- Begin with pain management: ice, gentle AROM within pain-free range\n" +
          "- Progress to rotator cuff isometrics → isotonics\n" +
          "- Address scapular stabilization early\n" +
          "- Consider manual therapy for glenohumeral joint mobility\n\n" +
          "Remember to correlate with imaging findings and adjust based on irritability level.";
      } else if (lastMessage.includes("knee") || lastMessage.includes("acl")) {
        fallback +=
          "**Assessment Considerations:**\n" +
          "- Evaluate ligamentous stability (Lachman's, anterior drawer, pivot shift)\n" +
          "- Assess quadriceps and hamstring strength symmetry\n" +
          "- Check for concurrent meniscal involvement\n\n" +
          "**Treatment Suggestions:**\n" +
          "- Focus on early quad activation and patellar mobilisation\n" +
          "- Progress through CKC exercises before OKC\n" +
          "- Include neuromuscular control and proprioception training\n" +
          "- Follow evidence-based return-to-sport criteria\n\n" +
          "Ensure you're monitoring for effusion and tracking objective measures throughout rehab.";
      } else if (lastMessage.includes("back") || lastMessage.includes("lumbar") || lastMessage.includes("spine")) {
        fallback +=
          "**Assessment Considerations:**\n" +
          "- Screen for red flags (cauda equina, progressive neurological deficit)\n" +
          "- Assess movement patterns and directional preference\n" +
          "- Evaluate core stability and hip mobility\n\n" +
          "**Treatment Suggestions:**\n" +
          "- Identify and utilise directional preference if present\n" +
          "- Graded exposure to movement with pain education\n" +
          "- Address motor control deficits (transversus abdominis, multifidus)\n" +
          "- Consider McKenzie approach or manual therapy based on findings\n\n" +
          "Patient education about the benign nature of most LBP is a key component of management.";
      } else {
        fallback +=
          "**General Recommendations:**\n" +
          "- Conduct a thorough subjective and objective assessment\n" +
          "- Identify key impairments and functional limitations\n" +
          "- Establish SMART goals with the patient\n" +
          "- Develop a graduated exercise program targeting identified deficits\n" +
          "- Include patient education and self-management strategies\n\n" +
          "Could you provide more specific details about the patient's condition? I can give more targeted recommendations with additional context about:\n" +
          "- Mechanism of injury / onset\n" +
          "- Current irritability level\n" +
          "- Functional limitations\n" +
          "- Relevant imaging or test results";
      }

      // Stream the fallback response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = fallback.split(" ");
          for (const word of words) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Stream the real Gemini response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
