import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/reactions - Add or remove reaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { type, contentId, reactionType = "like" } = data;

    // Validate input
    if (!type || !contentId) {
      return NextResponse.json(
        { error: "Missing required fields: type and contentId" },
        { status: 400 }
      );
    }

    const validTypes = ["post", "thread", "prayer", "comment"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be one of: post, thread, prayer, comment" },
        { status: 400 }
      );
    }

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        userId: session.user.id,
        [getTypeField(type)]: contentId,
        type: reactionType,
      },
    });

    let result;

    if (existingReaction) {
      // Remove reaction (toggle off)
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      });

      result = { reacted: false, reactionType };
    } else {
      // Add reaction (toggle on)
      const reactionData: any = {
        userId: session.user.id,
        type: reactionType,
      };
      reactionData[getTypeField(type)] = contentId;

      await prisma.reaction.create({
        data: reactionData,
      });

      result = { reacted: true, reactionType };
    }

    // Get updated reaction count
    const reactionCount = await getReactionCount(type, contentId, reactionType);
    result.count = reactionCount;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error toggling reaction:", error);
    return NextResponse.json(
      { error: "Failed to update reaction" },
      { status: 500 }
    );
  }
}

// GET /api/reactions - Get reactions for content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const contentId = searchParams.get("contentId");
    const reactionType = searchParams.get("reactionType") || "like";

    if (!type || !contentId) {
      return NextResponse.json(
        { error: "Missing required query parameters: type and contentId" },
        { status: 400 }
      );
    }

    const validTypes = ["post", "thread", "prayer", "comment"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be one of: post, thread, prayer, comment" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Get reactions
    const reactions = await prisma.reaction.findMany({
      where: {
        [getTypeField(type)]: contentId,
        type: reactionType,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    const count = reactions.length;
    const userReacted = userId ? reactions.some(r => r.userId === userId) : false;

    return NextResponse.json({
      count,
      userReacted,
      reactions: reactions.slice(0, 10), // Return first 10 reactions
    });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}

// Helper functions
function getTypeField(type: string): string {
  switch (type) {
    case "post":
      return "postId";
    case "thread":
      return "threadId";
    case "prayer":
      return "prayerRequestId";
    case "comment":
      return "commentId";
    default:
      throw new Error("Invalid type");
  }
}

async function getReactionCount(type: string, contentId: string, reactionType: string): Promise<number> {
  const count = await prisma.reaction.count({
    where: {
      [getTypeField(type)]: contentId,
      type: reactionType,
    },
  });
  return count;
}
