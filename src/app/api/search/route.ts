import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all";
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
    }

    const searchTerm = query.toLowerCase();
    const results: any = {};

    // Search posts
    if (type === "all" || type === "posts") {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
            { excerpt: { contains: searchTerm, mode: "insensitive" } },
          ],
          published: true,
        },
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true } },
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      results.posts = posts;
    }

    // Search threads
    if (type === "all" || type === "threads") {
      const threads = await prisma.thread.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true } },
          _count: { select: { comments: true } },
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      results.threads = threads;
    }

    // Search prayer requests
    if (type === "all" || type === "prayers") {
      const prayers = await prisma.prayerRequest.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: {
          author: { select: { name: true } },
          _count: { select: { prayers: true } },
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      results.prayers = prayers;
    }

    // Search users
    if (type === "all" || type === "users") {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { bio: { contains: searchTerm, mode: "insensitive" } },
          ],
          isApproved: true,
        },
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
          bio: true,
        },
        take: limit,
      });
      results.users = users;
    }

    // Search missionaries
    if (type === "all" || type === "missionaries") {
      const missionaries = await prisma.missionary.findMany({
        where: {
          OR: [
            { country: { contains: searchTerm, mode: "insensitive" } },
            { organization: { contains: searchTerm, mode: "insensitive" } },
            { ministryFocus: { contains: searchTerm, mode: "insensitive" } },
            { prayerNeeds: { contains: searchTerm, mode: "insensitive" } },
          ],
          isActive: true,
        },
        include: {
          user: { select: { name: true, image: true } },
        },
        take: limit,
      });
      results.missionaries = missionaries;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
