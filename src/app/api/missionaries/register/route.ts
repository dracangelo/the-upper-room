import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/missionaries/register - Register as missionary
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { country, organization, ministryFocus, testimony, prayerNeeds, supportLink } = data;

    // Validate required fields
    if (!country || !ministryFocus || !prayerNeeds) {
      return NextResponse.json(
        { error: "Missing required fields: country, ministryFocus, prayerNeeds" },
        { status: 400 }
      );
    }

    // Check if user is already a missionary
    const existingMissionary = await prisma.missionary.findUnique({
      where: { userId: session.user.id },
    });

    if (existingMissionary) {
      return NextResponse.json(
        { error: "You are already registered as a missionary" },
        { status: 400 }
      );
    }

    // Create missionary profile
    const missionary = await prisma.missionary.create({
      data: {
        userId: session.user.id,
        country,
        organization: organization || null,
        ministryFocus,
        testimony: testimony || null,
        prayerNeeds,
        supportLink: supportLink || null,
        isActive: false, // Start as inactive until approved
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
      },
    });

    // Update user role to MISSIONARY
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "MISSIONARY" },
    });

    return NextResponse.json({
      message: "Missionary registration submitted successfully",
      missionary,
    }, { status: 201 });

  } catch (error) {
    console.error("Error registering missionary:", error);
    return NextResponse.json(
      { error: "Failed to register missionary" },
      { status: 500 }
    );
  }
}
