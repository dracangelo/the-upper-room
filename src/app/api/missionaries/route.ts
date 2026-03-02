import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/missionaries - Get all missionaries
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const isActive = searchParams.get("active");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (country) where.country = country;
    if (isActive !== null) where.isActive = isActive === "true";

    const missionaries = await prisma.missionary.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
        updates: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
        _count: { select: { updates: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(missionaries);
  } catch (error) {
    console.error("Error fetching missionaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch missionaries" },
      { status: 500 }
    );
  }
}
