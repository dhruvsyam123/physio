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
  const referral = await prisma.referral.findFirst({
    where: {
      id,
      OR: [
        { patient: { therapistId: session.user.id } },
        { patientId: null },
      ],
    },
  });

  if (!referral) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...referral,
    date: referral.date.toISOString().split("T")[0],
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

  const existing = await prisma.referral.findFirst({
    where: {
      id,
      OR: [
        { patient: { therapistId: session.user.id } },
        { patientId: null },
      ],
    },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = { ...body };
  if (body.date) updateData.date = new Date(body.date);

  const referral = await prisma.referral.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({
    ...referral,
    date: referral.date.toISOString().split("T")[0],
  });
}
