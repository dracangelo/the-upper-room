"use client";

import { useState } from "react";
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
  Filter
} from "lucide-react";

// Sample admin data
const stats = {
  totalUsers: 2456,
  newUsersToday: 23,
  totalPosts: 14270,
  postsToday: 156,
  prayerCount: 15891,
  activeMissionaries: 24,
  reportedContent: 12,
  pendingApprovals: 8,
};

const recentReports = [
  {
    id: 1,
    type: "comment",
    content: "This comment contains inappropriate language...",
    reporter: "user123",
    reported: "offender99",
    reason: "Offensive content",
    status: "pending",
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    type: "thread",
    content: "Thread: 'Why doctrine X is wrong'",
    reporter: "pastor_john",
    reported: "newuser22",
    reason: "False teaching",
    status: "reviewed",
    createdAt: "5 hours ago",
  },
  {
    id: 3,
    type: "prayer",
    content: "Prayer request appears to be spam",
    reporter: "moderator_sarah",
    reported: "suspicious_user",
    reason: "Spam",
    status: "resolved",
    createdAt: "1 day ago",
  },
];

const pendingUsers = [
  {
    id: 1,
    name: "Michael Johnson",
    email: "michael.j@example.com",
    role: "Missionary",
    appliedAt: "3 hours ago",
    status: "pending",
  },
  {
    id: 2,
    name: "Grace Chen",
    email: "grace.chen@example.com",
    role: "Pastor",
    appliedAt: "5 hours ago",
    status: "pending",
  },
  {
    id: 3,
    name: "David Okonkwo",
    email: "david.o@example.com",
    role: "Missionary",
    appliedAt: "1 day ago",
    status: "pending",
  },
];

const flaggedKeywords = [
  { word: "prosperity gospel", count: 23, action: "flag" },
  { word: "false teacher", count: 15, action: "review" },
  { word: "political party name", count: 8, action: "auto-remove" },
  { word: "doctrinal attack", count: 12, action: "flag" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

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
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-red-800">Content Reports</h3>
            </div>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
              {stats.reportedContent} pending
            </span>
          </div>
          <p className="text-sm text-red-700 mb-3">
            {stats.reportedContent} pieces of content require moderator review.
          </p>
          <button 
            onClick={() => setActiveTab("moderation")}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Review Now →
          </button>
        </div>

        <div className="card bg-yellow-50 border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-yellow-800">Pending Approvals</h3>
            </div>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
              {stats.pendingApprovals} pending
            </span>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            {stats.pendingApprovals} user applications need approval.
          </p>
          <button 
            onClick={() => setActiveTab("users")}
            className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
          >
            Review Applications →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-bold text-[#1E2A38] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <UserX className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Ban User</span>
          </button>
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <Flag className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Flag Content</span>
          </button>
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">View Analytics</span>
          </button>
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
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>Reviewed</option>
            <option>Resolved</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>All Types</option>
            <option>Comments</option>
            <option>Threads</option>
            <option>Prayers</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {recentReports.map((report) => (
          <div key={report.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    report.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    report.status === "reviewed" ? "bg-blue-100 text-blue-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {report.status}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{report.type}</span>
                </div>
                <p className="text-gray-800 mb-2">{report.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Reported by: <span className="font-medium">{report.reporter}</span></span>
                  <span>Reported user: <span className="font-medium text-red-600">{report.reported}</span></span>
                  <span>Reason: {report.reason}</span>
                  <span>{report.createdAt}</span>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="p-2 text-green-600 hover:bg-green-50 rounded" title="Approve">
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded" title="Remove">
                  <XCircle className="w-5 h-5" />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auto-flag Settings */}
      <div className="card">
        <h3 className="text-lg font-bold text-[#1E2A38] mb-4">Auto-Flag Keywords</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Keyword/Phrase</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Flagged Count</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flaggedKeywords.map((keyword, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3 font-mono text-sm">{keyword.word}</td>
                  <td className="px-4 py-3 text-sm">{keyword.count}</td>
                  <td className="px-4 py-3 text-sm capitalize">{keyword.action}</td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-red-600 hover:underline">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Moderator</option>
            <option>Missionary</option>
            <option>Pastor</option>
            <option>Member</option>
          </select>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="card">
        <h3 className="text-lg font-bold text-[#1E2A38] mb-4">Pending Role Approvals</h3>
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-[#1E2A38]">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-[#C9A227] text-[#1E2A38] px-2 py-1 rounded font-medium">
                    {user.role}
                  </span>
                  <span className="text-xs text-gray-500">Applied {user.appliedAt}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">
                  Approve
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
                  Reject
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1E2A38]">Analytics Dashboard</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1E2A38]">Most Prayed Requests</h3>
            <BarChart3 className="w-5 h-5 text-[#C9A227]" />
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-sm">Healing for mother</span>
              <span className="font-medium">156 prayers</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Mission trip to Kenya</span>
              <span className="font-medium">89 prayers</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Church plant safety</span>
              <span className="font-medium">234 prayers</span>
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1E2A38]">Top Theology Topics</h3>
            <TrendingUp className="w-5 h-5 text-[#C9A227]" />
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-sm">Trinity Discussion</span>
              <span className="font-medium">45 threads</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Eschatology</span>
              <span className="font-medium">32 threads</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Salvation & Grace</span>
              <span className="font-medium">28 threads</span>
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1E2A38]">Engagement by Country</h3>
            <Globe className="w-5 h-5 text-[#C9A227]" />
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-sm">🇰🇪 Kenya</span>
              <span className="font-medium">456 users</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">🇺🇸 United States</span>
              <span className="font-medium">892 users</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">🇳🇬 Nigeria</span>
              <span className="font-medium">234 users</span>
            </li>
          </ul>
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
