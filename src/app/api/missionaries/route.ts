import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

// POST /api/missionaries - Create missionary (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { userId, country, organization, ministryFocus, testimony, prayerNeeds, supportLink, isActive = true } = data;

    // Validate required fields
    if (!userId || !country || !ministryFocus || !prayerNeeds) {
      return NextResponse.json(
        { error: "Missing required fields: userId, country, ministryFocus, prayerNeeds" },
        { status: 400 }
      );
    }

    // Check if user is already a missionary
    const existingMissionary = await prisma.missionary.findUnique({
      where: { userId },
    });

    if (existingMissionary) {
      return NextResponse.json(
        { error: "User is already registered as a missionary" },
        { status: 400 }
      );
    }

    // Create missionary profile
    const missionary = await prisma.missionary.create({
      data: {
        userId,
        country,
        organization: organization || null,
        ministryFocus,
        testimony: testimony || null,
        prayerNeeds,
        supportLink: supportLink || null,
        isActive,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
      },
    });

    // Update user role to MISSIONARY
    await prisma.user.update({
      where: { id: userId },
      data: { role: "MISSIONARY" },
    });

    return NextResponse.json(missionary, { status: 201 });

  } catch (error) {
    console.error("Error creating missionary:", error);
    return NextResponse.json(
      { error: "Failed to create missionary" },
      { status: 500 }
    );
  }
}
