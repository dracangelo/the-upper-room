"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  ArrowLeft,
  User,
  Clock,
  Pin,
  Lock,
  Send,
  Flag,
  Heart,
  Share2,
  Edit2,
  Trash2,
  X,
  Check,
  MoreVertical
} from "lucide-react";
import { useSession } from "next-auth/react";
import ReportModal from "@/components/ReportModal";

interface Thread {
  id: string;
  title: string;
  content: string;
  slug: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
    role: string;
  };
  category: {
    name: string;
    slug: string;
  };
  _count: {
    comments: number;
    reactions: number;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
    role: string;
  };
  replies?: Comment[];
  _count?: {
    reactions: number;
  };
}

export default function ThreadPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ contentType: "post" | "thread" | "comment" | "user"; contentId: string } | null>(null);

  // Edit states
  const [editingThread, setEditingThread] = useState(false);
  const [editThreadData, setEditThreadData] = useState({ title: "", content: "" });
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  // Reaction states
  const [threadReactions, setThreadReactions] = useState({ count: 0, userReacted: false });
  const [commentReactions, setCommentReactions] = useState<Record<string, { count: number; userReacted: boolean }>>({});

  useEffect(() => {
    if (slug) {
      fetchThread();
      fetchComments();
    }
  }, [slug]);

  const fetchThread = async () => {
    try {
      const response = await fetch(`/api/threads/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setThread(data);
      }
    } catch (error) {
      console.error("Error fetching thread:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/threads/${slug}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        // Initialize comment reactions
        const reactions: Record<string, { count: number; userReacted: boolean }> = {};
        data.forEach((comment: Comment) => {
          reactions[comment.id] = {
            count: comment._count?.reactions || 0,
            userReacted: false
          };
        });
        setCommentReactions(reactions);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Thread edit/delete functions
  const handleEditThread = () => {
    if (!thread) return;
    setEditThreadData({ title: thread.title, content: thread.content });
    setEditingThread(true);
  };

  const handleSaveThread = async () => {
    if (!thread) return;

    try {
      const response = await fetch(`/api/threads/${thread.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editThreadData),
      });

      if (response.ok) {
        const updatedThread = await response.json();
        setThread(updatedThread);
        setEditingThread(false);
      }
    } catch (error) {
      console.error("Error updating thread:", error);
    }
  };

  const handleDeleteThread = async () => {
    if (!thread) return;

    if (!confirm("Are you sure you want to delete this thread? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/threads/${thread.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/forum");
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  // Comment edit/delete functions
  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditCommentContent(content);
  };

  const handleSaveComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editCommentContent }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(comments.map(c =>
          c.id === commentId ? { ...c, content: updatedComment.content } : c
        ));
        setEditingCommentId(null);
        setEditCommentContent("");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Reaction functions
  const handleThreadReaction = async () => {
    if (!thread || !session) return;

    try {
      const response = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "thread", contentId: thread.id }),
      });

      if (response.ok) {
        const result = await response.json();
        setThreadReactions({
          count: result.count,
          userReacted: result.reacted
        });
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  const handleCommentReaction = async (commentId: string) => {
    if (!session) return;

    try {
      const response = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "comment", contentId: commentId }),
      });

      if (response.ok) {
        const result = await response.json();
        setCommentReactions(prev => ({
          ...prev,
          [commentId]: {
            count: result.count,
            userReacted: result.reacted
          }
        }));
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  const canEditContent = (authorId: string) => {
    return session?.user?.id === authorId || ["ADMIN", "MODERATOR"].includes(session?.user?.role || "");
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/threads/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !session) return;

    try {
      const response = await fetch(`/api/threads/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent, parentId }),
      });

      if (response.ok) {
        const reply = await response.json();
        setComments(comments.map(c => 
          c.id === parentId 
            ? { ...c, replies: [...(c.replies || []), reply] }
            : c
        ));
        setReplyContent("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleReport = (contentType: "post" | "thread" | "comment" | "user", contentId: string) => {
    setReportTarget({ contentType, contentId });
    setReportModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      ADMIN: "bg-red-100 text-red-800",
      MODERATOR: "bg-blue-100 text-blue-800",
      PASTOR: "bg-purple-100 text-purple-800",
      MISSIONARY: "bg-green-100 text-green-800",
    };
    return badges[role] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E2A38] mb-2">Thread not found</h2>
          <Link href="/forum" className="text-[#C9A227] hover:underline">
            ← Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#1E2A38] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/forum" 
            className="inline-flex items-center text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Link>
          <div className="flex items-center space-x-2 mb-2">
            {thread.isPinned && <Pin className="w-5 h-5 text-[#C9A227]" />}
            {thread.isLocked && <Lock className="w-5 h-5 text-gray-400" />}
            <span className="scripture-tag text-sm">{thread.category.name}</span>
            {canEditContent(thread.author.id) && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEditThread}
                  className="text-gray-400 hover:text-[#C9A227] transition-colors"
                  title="Edit Thread"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteThread}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete Thread"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {editingThread ? (
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={editThreadData.title}
                onChange={(e) => setEditThreadData(prev => ({ ...prev, title: e.target.value }))}
                className="flex-grow text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-[#C9A227] text-white focus:outline-none px-2"
              />
              <button
                onClick={handleSaveThread}
                className="text-green-400 hover:text-green-300 transition-colors"
                title="Save"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => setEditingThread(false)}
                className="text-red-400 hover:text-red-300 transition-colors"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{thread.title}</h1>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {thread.author.name}
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${getRoleBadge(thread.author.role)}`}>
                {thread.author.role}
              </span>
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatDate(thread.createdAt)}
            </span>
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {thread._count.comments} replies
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Thread Content */}
        <div className="card mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#1E2A38] rounded-full flex items-center justify-center">
                {thread.author.image ? (
                  <img src={thread.author.image} alt={thread.author.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <User className="w-6 h-6 text-[#C9A227]" />
                )}
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-[#1E2A38]">{thread.author.name}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${getRoleBadge(thread.author.role)}`}>
                  {thread.author.role}
                </span>
                <span className="text-sm text-gray-500">{formatDate(thread.createdAt)}</span>
              </div>
              {editingThread ? (
                <div className="mb-4">
                  <textarea
                    value={editThreadData.content}
                    onChange={(e) => setEditThreadData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent resize-none"
                    rows={6}
                  />
                </div>
              ) : (
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {thread.content}
                </div>
              )}
              <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
                <button
                  onClick={handleThreadReaction}
                  className={`flex items-center space-x-1 transition-colors ${
                    threadReactions.userReacted ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-[#C9A227]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${threadReactions.userReacted ? "fill-current" : ""}`} />
                  <span className="text-sm">{threadReactions.count}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-[#C9A227] transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
                <button 
                  onClick={() => handleReport("thread", thread.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  <span className="text-sm">Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#1E2A38] mb-6">
            {comments.length} {comments.length === 1 ? "Reply" : "Replies"}
          </h2>

          {/* New Comment Form */}
          {!thread.isLocked && session && (
            <form onSubmit={handleSubmitComment} className="card mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#1E2A38] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#C9A227]" />
                  </div>
                </div>
                <div className="flex-grow">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                      className="btn-primary disabled:opacity-50 flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {submitting ? "Posting..." : "Post Reply"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {thread.isLocked && (
            <div className="card mb-6 bg-gray-50 border-gray-200 text-center py-4">
              <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">This thread is locked. No new replies can be added.</p>
            </div>
          )}

          {!session && !thread.isLocked && (
            <div className="card mb-6 bg-gray-50 border-gray-200 text-center py-4">
              <p className="text-gray-600">
                Please <Link href="/auth/signin" className="text-[#C9A227] hover:underline">sign in</Link> to reply to this discussion.
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="card">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[#1E2A38] rounded-full flex items-center justify-center">
                      {comment.author.image ? (
                        <img src={comment.author.image} alt={comment.author.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <User className="w-5 h-5 text-[#C9A227]" />
                      )}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-[#1E2A38]">{comment.author.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getRoleBadge(comment.author.role)}`}>
                        {comment.author.role}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      {canEditContent(comment.author.id) && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditComment(comment.id, comment.content)}
                            className="text-gray-400 hover:text-[#C9A227] transition-colors"
                            title="Edit Comment"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Comment"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="mb-3">
                        <textarea
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent resize-none"
                          rows={3}
                        />
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => handleSaveComment(comment.id)}
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditCommentContent("");
                            }}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-700 whitespace-pre-wrap mb-3">
                        {comment.content}
                      </div>
                    )}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleCommentReaction(comment.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          commentReactions[comment.id]?.userReacted ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-[#C9A227]"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${commentReactions[comment.id]?.userReacted ? "fill-current" : ""}`} />
                        <span className="text-sm">{commentReactions[comment.id]?.count || 0}</span>
                      </button>
                      <button 
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-[#C9A227] transition-colors text-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                      <button 
                        onClick={() => handleReport("comment", comment.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors text-sm"
                      >
                        <Flag className="w-4 h-4" />
                        <span>Report</span>
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && session && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-start space-x-3">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            rows={2}
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent resize-none"
                          />
                          <button
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={!replyContent.trim()}
                            className="btn-primary disabled:opacity-50 whitespace-nowrap"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-[#1E2A38]">{reply.author.name}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${getRoleBadge(reply.author.role)}`}>
                                {reply.author.role}
                              </span>
                              <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          onClose={() => {
            setReportModalOpen(false);
            setReportTarget(null);
          }}
          contentType={reportTarget.contentType}
          contentId={reportTarget.contentId}
          onSubmit={() => setReportModalOpen(false)}
        />
      )}
    </div>
  );
}
