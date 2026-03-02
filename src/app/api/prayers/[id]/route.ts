import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/prayers/[id]/pray - User prays for this request
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already prayed
    const existingPrayer = await prisma.prayer.findUnique({
      where: {
        userId_prayerRequestId: {
          userId: session.user.id,
          prayerRequestId: params.id,
        },
      },
    });

    if (existingPrayer) {
      // Remove prayer (toggle off)
      await prisma.prayer.delete({
        where: { id: existingPrayer.id },
      });

      // Update count
      const updated = await prisma.prayerRequest.update({
        where: { id: params.id },
        data: { prayerCount: { decrement: 1 } },
        include: {
          _count: { select: { prayers: true } },
        },
      });

      return NextResponse.json({ prayed: false, prayerCount: updated.prayerCount });
    } else {
      // Add prayer (toggle on)
      await prisma.prayer.create({
        data: {
          userId: session.user.id,
          prayerRequestId: params.id,
        },
      });

      // Update count
      const updated = await prisma.prayerRequest.update({
        where: { id: params.id },
        data: { prayerCount: { increment: 1 } },
        include: {
          _count: { select: { prayers: true } },
        },
      });

      return NextResponse.json({ prayed: true, prayerCount: updated.prayerCount });
    }
  } catch (error) {
    console.error("Error toggling prayer:", error);
    return NextResponse.json(
      { error: "Failed to update prayer" },
      { status: 500 }
    );
  }
}

// PUT /api/prayers/[id] - Update prayer request (mark answered, edit)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { isAnswered } = data;

    const prayer = await prisma.prayerRequest.update({
      where: { id: params.id },
      data: { isAnswered },
      include: {
        author: { select: { id: true, name: true } },
        _count: { select: { prayers: true } },
      },
    });

    return NextResponse.json(prayer);
  } catch (error) {
    console.error("Error updating prayer:", error);
    return NextResponse.json(
      { error: "Failed to update prayer" },
      { status: 500 }
    );
  }
}
