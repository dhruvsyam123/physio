import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: { patient: { therapistId: session.user.id } },
    include: { messages: { orderBy: { createdAt: "asc" } } },
    orderBy: { lastMessageTime: "desc" },
  });

  const mapped = conversations.map((c) => ({
    id: c.id,
    patientId: c.patientId,
    patientName: c.patientName,
    patientAvatar: c.patientAvatar,
    lastMessage: c.lastMessage,
    lastMessageTime: c.lastMessageTime.toISOString(),
    unreadCount: c.unreadCount,
    messages: c.messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: m.senderName,
      senderRole: m.senderRole,
      content: m.content,
      timestamp: m.createdAt.toISOString(),
      read: m.read,
    })),
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { patientId, patientName, patientAvatar } = body;

  if (!patientId || !patientName) {
    return NextResponse.json({ error: "patientId and patientName required" }, { status: 400 });
  }

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId: session.user.id },
  });
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  const conversation = await prisma.conversation.create({
    data: { patientId, patientName, patientAvatar },
  });

  return NextResponse.json(
    {
      id: conversation.id,
      patientId: conversation.patientId,
      patientName: conversation.patientName,
      patientAvatar: conversation.patientAvatar,
      lastMessage: conversation.lastMessage,
      lastMessageTime: conversation.lastMessageTime.toISOString(),
      unreadCount: conversation.unreadCount,
      messages: [],
    },
    { status: 201 }
  );
}
