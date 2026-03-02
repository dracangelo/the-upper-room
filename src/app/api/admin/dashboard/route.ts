import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Overview stats
    const [
      totalUsers,
      newUsersToday,
      totalPosts,
      totalThreads,
      totalPrayers,
      pendingReports,
      pendingApprovals,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfToday,
            lt: endOfToday,
          },
        },
      }),
      prisma.post.count({ where: { published: true } }),
      prisma.thread.count(),
      prisma.prayerRequest.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { isApproved: false } }),
    ]);

    // Weekly activity
    const weeklyActivity = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        return prisma.$transaction([
          prisma.post.count({
            where: {
              createdAt: { gte: dayStart, lt: dayEnd },
              published: true,
            },
          }),
          prisma.thread.count({
            where: { createdAt: { gte: dayStart, lt: dayEnd } },
          }),
          prisma.comment.count({
            where: { createdAt: { gte: dayStart, lt: dayEnd } },
          }),
        ]);
      })
    );

    const formattedWeeklyActivity = weeklyActivity.map((counts, i) => {
      const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split("T")[0],
        posts: counts[0],
        threads: counts[1],
        comments: counts[2],
      };
    });

    // Recent reports
    const recentReports = await prisma.report.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        reporter: { select: { name: true } },
      },
    });

    // Pending approvals
    const pendingUsers = await prisma.user.findMany({
      where: { isApproved: false },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Top contributors (last 30 days)
    const topContributors = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      where: {
        createdAt: { gte: last30Days },
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        _count: {
          select: {
            posts: true,
            threads: true,
            comments: true,
          },
        },
      },
    });

    // Category stats
    const categoryStats = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
            threads: true,
          },
        },
      },
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        newUsersToday,
        totalPosts,
        totalThreads,
        totalPrayers,
        pendingReports,
        pendingApprovals,
      },
      weeklyActivity: formattedWeeklyActivity,
      recentReports,
      pendingUsers,
      topContributors,
      categoryStats,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
