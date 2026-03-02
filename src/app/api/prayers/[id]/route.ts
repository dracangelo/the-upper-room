import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/prayers/[id] - Get single prayer request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prayer = await prisma.prayerRequest.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
        _count: { select: { prayers: true } },
        prayers: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!prayer) {
      return NextResponse.json({ error: "Prayer request not found" }, { status: 404 });
    }

    return NextResponse.json(prayer);
  } catch (error) {
    console.error("Error fetching prayer:", error);
    return NextResponse.json(
      { error: "Failed to fetch prayer request" },
      { status: 500 }
    );
  }
}

// POST /api/prayers/[id]/pray - User prays for this request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already prayed
    const existingPrayer = await prisma.prayer.findUnique({
      where: {
        userId_prayerRequestId: {
          userId: session.user.id,
          prayerRequestId: id,
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
        where: { id },
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
          prayerRequestId: id,
        },
      });

      // Update count
      const updated = await prisma.prayerRequest.update({
        where: { id },
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

// PUT /api/prayers/[id] - Update prayer request
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prayer = await prisma.prayerRequest.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!prayer) {
      return NextResponse.json({ error: "Prayer request not found" }, { status: 404 });
    }

    // Check if user is the author or admin/moderator
    if (prayer.authorId !== session.user.id && !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const { title, content, isAnswered, isAnonymous } = data;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (isAnswered !== undefined) updateData.isAnswered = isAnswered;
    if (isAnonymous !== undefined) updateData.isAnonymous = isAnonymous;

    const updatedPrayer = await prisma.prayerRequest.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
        _count: { select: { prayers: true } },
      },
    });

    return NextResponse.json(updatedPrayer);
  } catch (error) {
    console.error("Error updating prayer:", error);
    return NextResponse.json(
      { error: "Failed to update prayer request" },
      { status: 500 }
    );
  }
}

// DELETE /api/prayers/[id] - Delete prayer request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prayer = await prisma.prayerRequest.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!prayer) {
      return NextResponse.json({ error: "Prayer request not found" }, { status: 404 });
    }

    // Check if user is the author or admin/moderator
    if (prayer.authorId !== session.user.id && !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.prayerRequest.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Prayer request deleted successfully" });
  } catch (error) {
    console.error("Error deleting prayer:", error);
    return NextResponse.json(
      { error: "Failed to delete prayer request" },
      { status: 500 }
    );
  }
}
