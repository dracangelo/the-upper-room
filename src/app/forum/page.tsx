"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, MessageSquare, Pin, Lock, Clock, User, TrendingUp } from "lucide-react";

interface Thread {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    image?: string;
    role: string;
  };
  category: {
    name: string;
  };
  _count: {
    comments: number;
    reactions: number;
  };
  comments: Array<{
    createdAt: string;
    author: {
      name: string;
    };
  }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count: {
    threads: number;
  };
}

export default function ForumPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalThreads: 0,
    totalPosts: 0,
    totalMembers: 2456,
    onlineNow: 89,
  });

  useEffect(() => {
    fetchThreads();
    fetchCategories();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await fetch("/api/threads?limit=20");
      if (response.ok) {
        const data = await response.json();
        setThreads(data);
        setStats(prev => ({
          ...prev,
          totalThreads: data.length,
          totalPosts: data.reduce((acc: number, t: Thread) => acc + t._count.comments, 0),
        }));
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?type=FORUM");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getCategoryIcon = (name: string) => {
    const icons: Record<string, string> = {
      "Theology Debates": "📖",
      "Prayer Requests": "🙏",
      "Mission Field Discussions": "🌍",
      "Church Leadership": "⛪",
      "Youth Ministry": "👥",
      "Forum Testimonies": "✨",
    };
    return icons[name] || "💬";
  };

  const getCategoryColor = (name: string) => {
    const colors: Record<string, string> = {
      "Theology Debates": "bg-blue-100",
      "Prayer Requests": "bg-purple-100",
      "Mission Field Discussions": "bg-green-100",
      "Church Leadership": "bg-yellow-100",
      "Youth Ministry": "bg-orange-100",
      "Forum Testimonies": "bg-pink-100",
    };
    return colors[name] || "bg-gray-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading discussions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#1E2A38] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-[#C9A227]" />
            <span className="text-[#C9A227] font-semibold uppercase tracking-wider">Forum</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Discussions</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Join moderated conversations on theology, ministry, and Christian living. 
            All discussions are grounded in Scripture and respectful dialogue.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="card text-center">
            <MessageSquare className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.totalThreads.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Threads</div>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.totalPosts.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="card text-center">
            <Users className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.totalMembers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Members</div>
          </div>
          <div className="card text-center">
            <Clock className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.onlineNow}</div>
            <div className="text-sm text-gray-600">Online Now</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* New Thread Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1E2A38]">Recent Discussions</h2>
              <Link
                href="/forum/new"
                className="btn-primary"
              >
                Start New Thread
              </Link>
            </div>

            {/* Threads List */}
            <div className="space-y-4">
              {threads.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-500">No discussions yet. Start the first one!</p>
                </div>
              ) : (
                threads.map((thread) => (
                  <div key={thread.id} className="card hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#1E2A38] rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-[#C9A227]" />
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {thread.isPinned && (
                            <Pin className="w-4 h-4 text-[#C9A227]" />
                          )}
                          {thread.isLocked && (
                            <Lock className="w-4 h-4 text-gray-500" />
                          )}
                          <Link
                            href={`/forum/thread/${thread.slug}`}
                            className="text-lg font-semibold text-[#1E2A38] hover:text-[#C9A227] transition-colors line-clamp-1"
                          >
                            {thread.title}
                          </Link>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 flex-wrap">
                          <span className="scripture-tag">{thread.category?.name}</span>
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {thread.author?.name}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {thread._count?.comments || 0} replies
                          </span>
                          <span>{formatDate(thread.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load More */}
            {threads.length > 0 && (
              <div className="text-center mt-8">
                <button className="btn-secondary">
                  Load More Threads
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="card">
              <h3 className="text-lg font-bold text-[#1E2A38] mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/forum/category/${category.slug}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className={`w-10 h-10 ${getCategoryColor(category.name)} rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                      {getCategoryIcon(category.name)}
                    </span>
                    <div className="flex-grow">
                      <div className="font-medium text-[#1E2A38]">{category.name}</div>
                      <div className="text-sm text-gray-500">
                        {category._count?.threads || 0} threads
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="card bg-yellow-50 border border-yellow-200">
              <h3 className="text-lg font-bold text-[#1E2A38] mb-3">Discussion Rules</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#C9A227] mr-2">•</span>
                  Scripture-based arguments only
                </li>
                <li className="flex items-start">
                  <span className="text-[#C9A227] mr-2">•</span>
                  No personal attacks
                </li>
                <li className="flex items-start">
                  <span className="text-[#C9A227] mr-2">•</span>
                  No political propaganda
                </li>
                <li className="flex items-start">
                  <span className="text-[#C9A227] mr-2">•</span>
                  No denominational mockery
                </li>
              </ul>
              <Link
                href="/community-guidelines"
                className="text-[#C9A227] text-sm font-medium mt-3 inline-block hover:underline"
              >
                Read Full Guidelines →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
