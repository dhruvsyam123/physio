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
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: conversation.id,
    patientId: conversation.patientId,
    patientName: conversation.patientName,
    patientAvatar: conversation.patientAvatar,
    lastMessage: conversation.lastMessage,
    lastMessageTime: conversation.lastMessageTime.toISOString(),
    unreadCount: conversation.unreadCount,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: m.senderName,
      senderRole: m.senderRole,
      content: m.content,
      timestamp: m.createdAt.toISOString(),
      read: m.read,
    })),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.conversation.findFirst({
    where: { id, patient: { therapistId: session.user.id } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.markRead) {
    await prisma.conversation.update({
      where: { id },
      data: { unreadCount: 0 },
    });
    await prisma.message.updateMany({
      where: { conversationId: id, read: false },
      data: { read: true },
    });
  }

  return NextResponse.json({ success: true });
}
