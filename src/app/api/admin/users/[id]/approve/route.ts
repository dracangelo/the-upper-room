import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = params.id;
    const body = await req.json();
    const { action, role: requestedRole } = body;

    if (!["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be APPROVE or REJECT" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isApproved) {
      return NextResponse.json(
        { error: "User is already approved" },
        { status: 400 }
      );
    }

    let updatedUser;

    if (action === "APPROVE") {
      const role = requestedRole || user.role;

      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          isApproved: true,
          role: role as Role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isApproved: true,
          updatedAt: true,
        },
      });
    } else {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          isApproved: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isApproved: true,
          updatedAt: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: action === "APPROVE" ? "User approved successfully" : "User rejected successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { error: "Failed to process approval" },
      { status: 500 }
    );
  }
}
