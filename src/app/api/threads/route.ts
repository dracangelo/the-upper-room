import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/threads - Get all threads
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;

    const threads = await prisma.thread.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
        category: true,
        _count: { select: { comments: true, reactions: true } },
        comments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            author: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: (page - 1) * limit,
    });

    return NextResponse.json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

// POST /api/threads - Create new thread
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { title, content, categoryId } = data;

    // Check if user can post (7-day restriction for new users)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user && user.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      // Check if posting to theology category
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (category?.name === "Theology Debates") {
        return NextResponse.json(
          { error: "New users cannot post in Theology Debates for 7 days" },
          { status: 403 }
        );
      }
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const thread = await prisma.thread.create({
      data: {
        title,
        content,
        slug,
        authorId: session.user.id,
        categoryId,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
        category: true,
      },
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
