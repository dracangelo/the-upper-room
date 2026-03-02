"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Globe, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Flag,
  UserX,
  Eye,
  BarChart3,
  Settings,
  Search,
  Loader2,
  ArrowLeft,
  BookOpen,
  User
} from "lucide-react";

interface DashboardData {
  overview: {
    totalUsers: number;
    newUsersToday: number;
    totalPosts: number;
    totalThreads: number;
    totalPrayers: number;
    pendingReports: number;
    pendingApprovals: number;
  };
  weeklyActivity: Array<{
    date: string;
    posts: number;
    threads: number;
    comments: number;
  }>;
  recentReports: Array<{
    id: string;
    reason: string;
    status: string;
    createdAt: string;
    reporter: { name: string };
  }>;
  pendingUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  topContributors: Array<{
    id: string;
    name: string;
    image?: string;
    role: string;
    _count: {
      posts: number;
      threads: number;
      comments: number;
    };
  }>;
  categoryStats: Array<{
    id: string;
    name: string;
    type: string;
    _count: {
      posts: number;
      threads: number;
    };
  }>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      setError("Unauthorized access");
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, [session, status]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });
      if (response.ok) fetchDashboardData();
    } catch (err) {
      console.error("Failed to approve user:", err);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT" }),
      });
      if (response.ok) fetchDashboardData();
    } catch (err) {
      console.error("Failed to reject user:", err);
    }
  };

  const handleResolveReport = async (reportId: string, status: "RESOLVED" | "DISMISSED") => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) fetchDashboardData();
    } catch (err) {
      console.error("Failed to resolve report:", err);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C9A227] mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1E2A38] mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">{error || "You don't have permission to access this page."}</p>
          <Link href="/" className="btn-primary inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const stats = data?.overview || {
    totalUsers: 0, newUsersToday: 0, totalPosts: 0, totalThreads: 0,
    totalPrayers: 0, pendingReports: 0, pendingApprovals: 0,
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <Users className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-sm opacity-90">Total Users</div>
          <div className="text-xs mt-1 opacity-75">+{stats.newUsersToday} today</div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <MessageSquare className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.totalPosts.toLocaleString()}</div>
          <div className="text-sm opacity-90">Total Posts</div>
          <div className="text-xs mt-1 opacity-75">+{stats.postsToday} today</div>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <Heart className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.prayerCount.toLocaleString()}</div>
          <div className="text-sm opacity-90">Prayers Offered</div>
        </div>
        <div className="card bg-gradient-to-br from-[#4A6741] to-[#5a7d51] text-white">
          <Globe className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{stats.activeMissionaries}</div>
          <div className="text-sm opacity-90">Active Missionaries</div>
        </div>
      </div>

      {/* Alert Boxes */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`card border ${stats.pendingReports > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`w-5 h-5 ${stats.pendingReports > 0 ? "text-red-500" : "text-gray-400"}`} />
              <h3 className={`font-bold ${stats.pendingReports > 0 ? "text-red-800" : "text-gray-700"}`}>Content Reports</h3>
            </div>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${stats.pendingReports > 0 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-600"}`}>
              {stats.pendingReports} pending
            </span>
          </div>
          <p className={`text-sm mb-3 ${stats.pendingReports > 0 ? "text-red-700" : "text-gray-500"}`}>
            {stats.pendingReports > 0 
              ? `${stats.pendingReports} reports require moderator review.`
              : "No pending reports to review."}
          </p>
          <button 
            onClick={() => setActiveTab("moderation")}
            className={`text-sm font-medium ${stats.pendingReports > 0 ? "text-red-600 hover:text-red-800" : "text-gray-500"}`}
          >
            {stats.pendingReports > 0 ? "Review Now →" : "View History →"}
          </button>
        </div>

        <div className={`card border ${stats.pendingApprovals > 0 ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Shield className={`w-5 h-5 ${stats.pendingApprovals > 0 ? "text-yellow-600" : "text-gray-400"}`} />
              <h3 className={`font-bold ${stats.pendingApprovals > 0 ? "text-yellow-800" : "text-gray-700"}`}>Pending Approvals</h3>
            </div>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${stats.pendingApprovals > 0 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"}`}>
              {stats.pendingApprovals} pending
            </span>
          </div>
          <p className={`text-sm mb-3 ${stats.pendingApprovals > 0 ? "text-yellow-700" : "text-gray-500"}`}>
            {stats.pendingApprovals > 0 
              ? `${stats.pendingApprovals} user applications need approval.`
              : "No pending user approvals."}
          </p>
          <button 
            onClick={() => setActiveTab("users")}
            className={`text-sm font-medium ${stats.pendingApprovals > 0 ? "text-yellow-600 hover:text-yellow-800" : "text-gray-500"}`}
          >
            {stats.pendingApprovals > 0 ? "Review Applications →" : "View Users →"}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-bold text-[#1E2A38] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/search" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <Search className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Search Content</span>
          </Link>
          <Link href="/forum" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <MessageSquare className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">View Forum</span>
          </Link>
          <Link href="/teaching" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">View Teaching</span>
          </Link>
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <Settings className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Site Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderModeration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1E2A38]">Content Moderation</h2>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option>All Status</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWING">Reviewing</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {data?.recentReports && data.recentReports.length > 0 ? (
          data.recentReports.map((report) => (
            <div key={report.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      report.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      report.status === "REVIEWING" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-2 font-medium">{report.reason}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Reported by: <span className="font-medium">{report.reporter?.name || "Unknown"}</span></span>
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  {report.status === "PENDING" && (
                    <>
                      <button 
                        onClick={() => handleResolveReport(report.id, "RESOLVED")}
                        className="p-2 text-green-600 hover:bg-green-50 rounded" 
                        title="Resolve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleResolveReport(report.id, "DISMISSED")}
                        className="p-2 text-red-600 hover:bg-red-50 rounded" 
                        title="Dismiss"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No reports to review</h3>
            <p className="text-gray-500">All caught up! No pending moderation reports.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1E2A38]">User Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="card">
        <h3 className="text-lg font-bold text-[#1E2A38] mb-4">Pending Role Approvals</h3>
        <div className="space-y-4">
          {data?.pendingUsers && data.pendingUsers.length > 0 ? (
            data.pendingUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-[#1E2A38]">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    Applied {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleApproveUser(user.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleRejectUser(user.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <Link 
                    href={`/profile/${user.id}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 inline-flex items-center"
                  >
                    <User className="w-4 h-4 mr-1" />
                    View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-600">No pending approvals</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Contributors */}
      {data?.topContributors && data.topContributors.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-[#1E2A38] mb-4">Top Contributors (Last 30 Days)</h3>
          <div className="space-y-3">
            {data.topContributors.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#1E2A38] rounded-full flex items-center justify-center">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <User className="w-5 h-5 text-[#C9A227]" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-[#1E2A38]">{user.name}</div>
                    <span className="scripture-tag text-xs">{user.role}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[#1E2A38]">
                    {user._count.posts + user._count.threads + user._count.comments} contributions
                  </div>
                  <div className="text-xs text-gray-500">
                    {user._count.posts} posts · {user._count.threads} threads · {user._count.comments} comments
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1E2A38]">Analytics Dashboard</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Category Stats */}
        {data?.categoryStats && data.categoryStats.length > 0 && (
          <div className="card md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1E2A38]">Content by Category</h3>
              <BarChart3 className="w-5 h-5 text-[#C9A227]" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Posts</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Threads</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categoryStats.map((cat) => (
                    <tr key={cat.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{cat.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          cat.type === "BLOG" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}>
                          {cat.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{cat._count.posts}</td>
                      <td className="px-4 py-3 text-sm">{cat._count.threads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Weekly Summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1E2A38]">Weekly Summary</h3>
            <TrendingUp className="w-5 h-5 text-[#C9A227]" />
          </div>
          {data?.weeklyActivity && (
            <div className="space-y-3">
              {(() => {
                const totals = data.weeklyActivity.reduce((acc, day) => ({
                  posts: acc.posts + day.posts,
                  threads: acc.threads + day.threads,
                  comments: acc.comments + day.comments,
                }), { posts: 0, threads: 0, comments: 0 });
                return (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Posts</span>
                      <span className="font-medium">{totals.posts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Threads</span>
                      <span className="font-medium">{totals.threads}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Comments</span>
                      <span className="font-medium">{totals.comments}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Platform Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1E2A38]">Platform Overview</h3>
            <Globe className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Users</span>
              <span className="font-medium">{stats.totalUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Posts</span>
              <span className="font-medium">{stats.totalPosts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Prayer Requests</span>
              <span className="font-medium">{stats.totalPrayers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Categories</span>
              <span className="font-medium">{data?.categoryStats?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#1E2A38] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-[#C9A227]" />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-300">Manage content, users, and community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "moderation", label: "Moderation", icon: Shield },
            { id: "users", label: "Users", icon: Users },
            { id: "analytics", label: "Analytics", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-[#1E2A38] shadow-sm"
                  : "text-gray-600 hover:text-[#1E2A38]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "moderation" && renderModeration()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "analytics" && renderAnalytics()}
      </div>
    </div>
  );
}
