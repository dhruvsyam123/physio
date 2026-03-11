import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const conversation = await prisma.conversation.findFirst({
    where: { id, patient: { therapistId: session.user.id } },
  });
  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: m.senderName,
      senderRole: m.senderRole,
      content: m.content,
      timestamp: m.createdAt.toISOString(),
      read: m.read,
    }))
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { content, senderId, senderName, senderRole } = body;

  if (!content || !senderId || !senderName || !senderRole) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id, patient: { therapistId: session.user.id } },
  });
  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderId,
      senderName,
      senderRole,
      content,
    },
  });

  // Update conversation metadata
  await prisma.conversation.update({
    where: { id },
    data: {
      lastMessage: content,
      lastMessageTime: message.createdAt,
      unreadCount:
        senderRole === "patient"
          ? { increment: 1 }
          : conversation.unreadCount,
    },
  });

  return NextResponse.json(
    {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.senderName,
      senderRole: message.senderRole,
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      read: message.read,
    },
    { status: 201 }
  );
}
