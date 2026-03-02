"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  Share2
} from "lucide-react";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

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
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
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
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{thread.title}</h1>
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
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {thread.content}
              </div>
              <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-[#C9A227] transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Like</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-[#C9A227] transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
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
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap mb-3">
                      {comment.content}
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-[#C9A227] transition-colors text-sm">
                        <Heart className="w-4 h-4" />
                        <span>Like</span>
                      </button>
                      <button 
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-[#C9A227] transition-colors text-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors text-sm">
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
    </div>
  );
}
