"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, BookOpen, MessageSquare, Heart, User, Globe, Filter } from "lucide-react";

interface SearchResults {
  posts?: Array<{
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    author: { name: string };
    category: { name: string };
    createdAt: string;
  }>;
  threads?: Array<{
    id: string;
    title: string;
    slug: string;
    content: string;
    author: { name: string };
    category: { name: string };
    _count: { comments: number };
    createdAt: string;
  }>;
  prayers?: Array<{
    id: string;
    title: string;
    content: string;
    isAnonymous: boolean;
    author?: { name: string };
    prayerCount: number;
    createdAt: string;
  }>;
  users?: Array<{
    id: string;
    name: string;
    image?: string;
    role: string;
    bio?: string;
  }>;
  missionaries?: Array<{
    id: string;
    country: string;
    organization: string;
    ministryFocus: string;
    user: { name: string };
  }>;
}

const tabs = [
  { id: "all", label: "All Results", icon: Search },
  { id: "posts", label: "Teaching", icon: BookOpen },
  { id: "threads", label: "Forum", icon: MessageSquare },
  { id: "prayers", label: "Prayer Wall", icon: Heart },
  { id: "users", label: "Members", icon: User },
  { id: "missionaries", label: "Missionaries", icon: Globe },
];

function SearchForm() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState<SearchResults>({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setSearched(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (query) {
      performSearch(query);
    }
  };

  const getTotalCount = () => {
    let count = 0;
    if (results.posts) count += results.posts.length;
    if (results.threads) count += results.threads.length;
    if (results.prayers) count += results.prayers.length;
    if (results.users) count += results.users.length;
    if (results.missionaries) count += results.missionaries.length;
    return count;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#1E2A38] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Search</h1>
          
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for posts, threads, prayers, people..."
              className="w-full pl-14 pr-4 py-4 text-lg text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#C9A227] text-[#1E2A38] px-6 py-2 rounded font-semibold hover:bg-[#FDFBF7] transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#C9A227] text-[#1E2A38]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Results */}
        {searched && (
          <div>
            <p className="text-gray-600 mb-6">
              {getTotalCount()} {getTotalCount() === 1 ? "result" : "results"} for "{query}"
            </p>

            {/* Posts Results */}
            {(activeTab === "all" || activeTab === "posts") && results.posts && results.posts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#1E2A38] mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Teaching Articles ({results.posts.length})
                </h2>
                <div className="space-y-4">
                  {results.posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/teaching/${post.slug}`}
                      className="card hover:shadow-md transition-shadow block"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="scripture-tag text-sm">{post.category.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1E2A38] mb-2">{post.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
                      <p className="text-sm text-gray-500 mt-2">by {post.author.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Threads Results */}
            {(activeTab === "all" || activeTab === "threads") && results.threads && results.threads.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#1E2A38] mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Forum Discussions ({results.threads.length})
                </h2>
                <div className="space-y-4">
                  {results.threads.map((thread) => (
                    <Link
                      key={thread.id}
                      href={`/forum/thread/${thread.slug}`}
                      className="card hover:shadow-md transition-shadow block"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="scripture-tag text-sm">{thread.category.name}</span>
                        <span className="text-sm text-gray-500">
                          {thread._count.comments} replies
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1E2A38] mb-2">{thread.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{thread.content}</p>
                      <p className="text-sm text-gray-500 mt-2">by {thread.author.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Prayers Results */}
            {(activeTab === "all" || activeTab === "prayers") && results.prayers && results.prayers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#1E2A38] mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Prayer Requests ({results.prayers.length})
                </h2>
                <div className="space-y-4">
                  {results.prayers.map((prayer) => (
                    <div key={prayer.id} className="card">
                      <h3 className="text-lg font-semibold text-[#1E2A38] mb-2">{prayer.title}</h3>
                      <p className="text-gray-600 line-clamp-2 mb-2">{prayer.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{prayer.isAnonymous ? "Anonymous" : prayer.author?.name}</span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1 text-[#C9A227]" />
                          {prayer.prayerCount} prayers
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Results */}
            {(activeTab === "all" || activeTab === "users") && results.users && results.users.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#1E2A38] mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Members ({results.users.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {results.users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.id}`}
                      className="card hover:shadow-md transition-shadow block"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#1E2A38] rounded-full flex items-center justify-center flex-shrink-0">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full" />
                          ) : (
                            <User className="w-6 h-6 text-[#C9A227]" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1E2A38]">{user.name}</h3>
                          <span className="scripture-tag text-xs">{user.role}</span>
                        </div>
                      </div>
                      {user.bio && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{user.bio}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Missionaries Results */}
            {(activeTab === "all" || activeTab === "missionaries") && results.missionaries && results.missionaries.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#1E2A38] mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Missionaries ({results.missionaries.length})
                </h2>
                <div className="space-y-4">
                  {results.missionaries.map((missionary) => (
                    <div key={missionary.id} className="card">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">
                          {missionary.country === "Kenya" ? "🇰🇪" :
                           missionary.country === "Uganda" ? "🇺🇬" :
                           missionary.country === "Thailand" ? "🇹🇭" :
                           missionary.country === "Nigeria" ? "🇳🇬" :
                           missionary.country === "India" ? "🇮🇳" : "🌍"}
                        </span>
                        <span className="font-semibold text-[#1E2A38]">{missionary.country}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1E2A38]">{missionary.user.name}</h3>
                      <p className="text-gray-600 text-sm">{missionary.organization}</p>
                      <p className="text-gray-600 mt-2">{missionary.ministryFocus}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {getTotalCount() === 0 && !loading && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1E2A38] mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1E2A38] mb-2">Start searching</h3>
            <p className="text-gray-600">
              Search for teaching articles, forum discussions, prayer requests, members, and missionaries
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchForm />
    </Suspense>
  );
}
