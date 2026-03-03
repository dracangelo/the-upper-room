import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/threads/[id]/comments - Get comments for a thread
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First, find the thread by slug or id to get the actual thread ID
    const thread = await prisma.thread.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id }
        ]
      },
      select: { id: true }
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const comments = await prisma.comment.findMany({
      where: { threadId: thread.id, parentId: null },
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { reactions: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/threads/[id]/comments - Add comment to thread
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const { content, parentId } = data;

    // First, find the thread by slug or id to get the actual thread ID
    const thread = await prisma.thread.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id }
        ]
      },
      select: { id: true }
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        threadId: thread.id,
        authorId: session.user.id,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
