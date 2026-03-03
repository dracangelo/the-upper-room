import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/missionaries/[id]/approve - Approve missionary
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or moderator
    if (!["ADMIN", "MODERATOR"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Approve missionary
    const missionary = await prisma.missionary.update({
      where: { id },
      data: { isActive: true },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
      },
    });

    return NextResponse.json({
      message: "Missionary approved successfully",
      missionary,
    });

  } catch (error) {
    console.error("Error approving missionary:", error);
    return NextResponse.json(
      { error: "Failed to approve missionary" },
      { status: 500 }
    );
  }
}
