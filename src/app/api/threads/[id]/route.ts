import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/threads/[id] - Get single thread
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const thread = await prisma.thread.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
        category: true,
        _count: { select: { comments: true, reactions: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true, image: true, role: true } },
            _count: { select: { reactions: true } },
            replies: {
              include: {
                author: { select: { id: true, name: true, image: true, role: true } },
                _count: { select: { reactions: true } },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json(thread);
  } catch (error) {
    console.error("Error fetching thread:", error);
    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 }
    );
  }
}

// PUT /api/threads/[id] - Update thread
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thread = await prisma.thread.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Check if user is the author or admin/moderator
    if (thread.authorId !== session.user.id && !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const { title, content, categoryId } = data;

    let slug;
    if (title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (categoryId) updateData.categoryId = categoryId;
    if (slug) updateData.slug = slug;

    const updatedThread = await prisma.thread.update({
      where: { id: params.id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
        category: true,
      },
    });

    return NextResponse.json(updatedThread);
  } catch (error) {
    console.error("Error updating thread:", error);
    return NextResponse.json(
      { error: "Failed to update thread" },
      { status: 500 }
    );
  }
}

// DELETE /api/threads/[id] - Delete thread
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thread = await prisma.thread.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Check if user is the author or admin/moderator
    if (thread.authorId !== session.user.id && !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.thread.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Thread deleted successfully" });
  } catch (error) {
    console.error("Error deleting thread:", error);
    return NextResponse.json(
      { error: "Failed to delete thread" },
      { status: 500 }
    );
  }
}
