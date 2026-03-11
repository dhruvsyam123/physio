import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const createReferralSchema = z.object({
  patientId: z.string().optional(),
  patientName: z.string().optional(),
  referrerName: z.string().min(1),
  referrerType: z.string().min(1),
  date: z.string(),
  condition: z.string().min(1),
  rawText: z.string().min(1),
  status: z.string().optional(),
  parsedData: z.any().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get referrals that belong to this therapist's patients, or unassigned ones
  const referrals = await prisma.referral.findMany({
    where: {
      OR: [
        { patient: { therapistId: session.user.id } },
        { patientId: null },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = referrals.map((r) => ({
    id: r.id,
    patientId: r.patientId,
    patientName: r.patientName,
    referrerName: r.referrerName,
    referrerType: r.referrerType,
    date: r.date.toISOString().split("T")[0],
    condition: r.condition,
    rawText: r.rawText,
    status: r.status,
    parsedData: r.parsedData,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = createReferralSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = result.data;
  const referral = await prisma.referral.create({
    data: {
      patientId: data.patientId || null,
      patientName: data.patientName,
      referrerName: data.referrerName,
      referrerType: data.referrerType,
      date: new Date(data.date),
      condition: data.condition,
      rawText: data.rawText,
      status: data.status || "pending",
      parsedData: data.parsedData || undefined,
    },
  });

  return NextResponse.json(
    {
      ...referral,
      date: referral.date.toISOString().split("T")[0],
    },
    { status: 201 }
  );
}
