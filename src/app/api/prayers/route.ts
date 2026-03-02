import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/prayers - Get all prayer requests
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const answered = searchParams.get("answered");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    const where: any = {};
    if (answered !== null) where.isAnswered = answered === "true";

    const prayers = await prisma.prayerRequest.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
        _count: { select: { prayers: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    });

    return NextResponse.json(prayers);
  } catch (error) {
    console.error("Error fetching prayers:", error);
    return NextResponse.json(
      { error: "Failed to fetch prayers" },
      { status: 500 }
    );
  }
}

// POST /api/prayers - Create prayer request
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { title, content, isAnonymous } = data;

    const prayer = await prisma.prayerRequest.create({
      data: {
        title,
        content,
        isAnonymous: isAnonymous || false,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        _count: { select: { prayers: true } },
      },
    });

    return NextResponse.json(prayer, { status: 201 });
  } catch (error) {
    console.error("Error creating prayer:", error);
    return NextResponse.json(
      { error: "Failed to create prayer request" },
      { status: 500 }
    );
  }
}
