"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Search, Filter, Clock, User } from "lucide-react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured: boolean;
  createdAt: string;
  author: {
    name: string;
    role: string;
  };
  category: {
    name: string;
  };
  scriptures: { reference: string }[];
  _count: {
    reactions: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function TeachingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?type=BLOG");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category?.name === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
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
            <BookOpen className="w-8 h-8 text-[#C9A227]" />
            <span className="text-[#C9A227] font-semibold uppercase tracking-wider">Teaching</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Biblical Teaching & Doctrine</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Deep biblical studies, expository teaching, and systematic theology to strengthen your faith and understanding of God's Word.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === "All"
                    ? "bg-[#C9A227] text-[#1E2A38]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.name
                      ? "bg-[#C9A227] text-[#1E2A38]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-6">Featured Article</h2>
            <div className="card bg-gradient-to-r from-[#1E2A38] to-[#2d3d4f] text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="inline-block bg-[#C9A227] text-[#1E2A38] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    Featured
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h3>
                  <p className="text-gray-300 mb-6 text-lg">{featuredPost.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {featuredPost.author?.name || "Unknown"}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(featuredPost.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link
                    href={`/teaching/${featuredPost.slug}`}
                    className="inline-block bg-[#C9A227] text-[#1E2A38] px-6 py-3 rounded-lg font-semibold hover:bg-[#FDFBF7] transition-colors"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38] mb-6">Latest Articles</h2>
          {regularPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="scripture-tag">{post.category?.name || "Uncategorized"}</span>
                    <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1E2A38] mb-3 line-clamp-2">
                    <Link href={`/teaching/${post.slug}`} className="hover:text-[#C9A227] transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author?.name || "Unknown"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn-secondary">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  );
}
