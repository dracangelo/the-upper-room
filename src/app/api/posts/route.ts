import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/posts - Get all posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    const where: any = {};
    if (category) where.category = { slug: category };
    if (featured === "true") where.featured = true;

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
        category: true,
        scriptures: true,
        _count: { select: { reactions: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { title, content, excerpt, categoryId, scriptures, featured } = data;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.slice(0, 200) + "...",
        slug,
        featured: featured || false,
        published: true,
        authorId: session.user.id,
        categoryId,
        scriptures: {
          create: scriptures?.map((ref: string) => {
            const parts = ref.match(/(\d?\s?\w+)\s+(\d+):(\d+)/);
            return {
              reference: ref,
              book: parts?.[1] || ref,
              chapter: parseInt(parts?.[2] || "1"),
              verse: parseInt(parts?.[3] || "1"),
            };
          }) || [],
        },
      },
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
        category: true,
        scriptures: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
