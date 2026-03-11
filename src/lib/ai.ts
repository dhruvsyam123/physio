import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export function getGeminiModel(): GenerativeModel | null {
  const ai = getGenAI();
  if (!ai) return null;
  return ai.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export async function streamChat(
  messages: { role: string; content: string }[],
  systemPrompt: string
) {
  const model = getGeminiModel();
  if (!model) return null;

  const chat = model.startChat({
    history: messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
    systemInstruction: systemPrompt,
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessageStream(lastMessage.content);
  return result;
}

export async function generateContent(prompt: string, systemPrompt: string) {
  const model = getGeminiModel();
  if (!model) return null;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: systemPrompt,
  });

  return result.response.text();
}
