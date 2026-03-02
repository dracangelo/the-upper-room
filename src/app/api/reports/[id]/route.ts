import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// PATCH /api/reports/[id]/resolve - Resolve or dismiss a report
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reportId = params.id;
    const body = await req.json();
    const { status, resolutionNote } = body;

    const validStatuses = ["RESOLVED", "DISMISSED", "REVIEWING"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be RESOLVED, DISMISSED, or REVIEWING" },
        { status: 400 }
      );
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        resolvedAt: status === "RESOLVED" || status === "DISMISSED" ? new Date() : null,
        resolvedBy: status === "RESOLVED" || status === "DISMISSED" ? session.user.id : null,
        resolutionNote: resolutionNote || null,
      },
      include: {
        reporter: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Report ${status.toLowerCase()} successfully`,
      report: updatedReport,
    });
  } catch (error) {
    console.error("Report resolution error:", error);
    return NextResponse.json(
      { error: "Failed to resolve report" },
      { status: 500 }
    );
  }
}

// GET /api/reports/[id]/resolve - Get report details for resolution
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reportId = params.id;

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reporter: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Report fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}
