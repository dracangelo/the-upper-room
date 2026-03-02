import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get last timestamp from query
    const { searchParams } = new URL(request.url);
    const since = searchParams.get("since");

    const sinceDate = since ? new Date(since) : new Date(Date.now() - 30000); // Last 30 seconds

    const [newPosts, newThreads, newComments, newPrayers, newUsers, newReports] = await Promise.all([
      prisma.post.count({
        where: { createdAt: { gt: sinceDate }, published: true },
      }),
      prisma.thread.count({
        where: { createdAt: { gt: sinceDate } },
      }),
      prisma.comment.count({
        where: { createdAt: { gt: sinceDate } },
      }),
      prisma.prayerRequest.count({
        where: { createdAt: { gt: sinceDate } },
      }),
      prisma.user.count({
        where: { createdAt: { gt: sinceDate }, isApproved: true },
      }),
      prisma.report.count({
        where: { createdAt: { gt: sinceDate } },
      }),
    ]);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      updates: {
        posts: newPosts,
        threads: newThreads,
        comments: newComments,
        prayers: newPrayers,
        users: newUsers,
        reports: newReports,
      },
      totalNew: newPosts + newThreads + newComments + newPrayers + newUsers + newReports,
    });
  } catch (error) {
    console.error("Realtime updates error:", error);
    return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 });
  }
}
