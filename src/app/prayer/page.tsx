"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Users, Clock, CheckCircle, Lock, User } from "lucide-react";

interface PrayerRequest {
  id: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  prayerCount: number;
  isAnswered: boolean;
  createdAt: string;
  author?: {
    name: string;
  };
  _count?: {
    prayers: number;
  };
}

export default function PrayerPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPrayers: 0,
    activeRequests: 0,
    answeredPrayers: 0,
    prayingNow: 23,
  });
  const [activeTab, setActiveTab] = useState("all");
  const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      const response = await fetch("/api/prayers");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        
        // Calculate stats
        setStats({
          totalPrayers: data.reduce((acc: number, p: PrayerRequest) => acc + (p.prayerCount || 0), 0),
          activeRequests: data.filter((p: PrayerRequest) => !p.isAnswered).length,
          answeredPrayers: data.filter((p: PrayerRequest) => p.isAnswered).length,
          prayingNow: 23, // This would come from a real-time system
        });
      }
    } catch (error) {
      console.error("Error fetching prayers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePray = async (id: string) => {
    try {
      const response = await fetch(`/api/prayers/${id}/pray`, {
        method: "POST",
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update local state
        setPrayedIds(prev => {
          const newSet = new Set(prev);
          if (data.prayed) {
            newSet.add(id);
          } else {
            newSet.delete(id);
          }
          return newSet;
        });
        
        // Update prayer count in the list
        setRequests(prev => prev.map(req => 
          req.id === id ? { ...req, prayerCount: data.prayerCount } : req
        ));
        
        // Update total stats
        setStats(prev => ({
          ...prev,
          totalPrayers: data.prayed ? prev.totalPrayers + 1 : prev.totalPrayers - 1,
        }));
      }
    } catch (error) {
      console.error("Error praying:", error);
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

  const filteredRequests = requests.filter((request) => {
    if (activeTab === "answered") return request.isAnswered;
    if (activeTab === "active") return !request.isAnswered;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prayer requests...</p>
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
            <Heart className="w-8 h-8 text-[#C9A227]" />
            <span className="text-[#C9A227] font-semibold uppercase tracking-wider">Prayer Wall</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pray Together</h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Share your prayer requests and join others in prayer. 
            The prayer of a righteous person is powerful and effective. (James 5:16)
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/prayer/new"
              className="inline-flex items-center justify-center bg-[#C9A227] text-[#1E2A38] px-6 py-3 rounded-lg font-semibold hover:bg-[#FDFBF7] transition-colors"
            >
              <Heart className="w-5 h-5 mr-2" />
              Share Prayer Request
            </Link>
            <Link
              href="/prayer?answered=true"
              className="inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1E2A38] transition-colors"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Answered Prayers
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="card text-center">
            <Heart className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.totalPrayers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Prayers Offered</div>
          </div>
          <div className="card text-center">
            <Users className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.activeRequests}</div>
            <div className="text-sm text-gray-600">Active Requests</div>
          </div>
          <div className="card text-center">
            <CheckCircle className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.answeredPrayers}</div>
            <div className="text-sm text-gray-600">Answered Prayers</div>
          </div>
          <div className="card text-center">
            <Clock className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.prayingNow}</div>
            <div className="text-sm text-gray-600">Praying Now</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "all" ? "text-[#C9A227] border-[#C9A227]" : "text-gray-600 hover:text-[#1E2A38]"
            }`}
          >
            All Requests
          </button>
          <button 
            onClick={() => setActiveTab("active")}
            className={`px-4 py-3 font-medium hover:text-[#1E2A38] transition-colors ${
              activeTab === "active" ? "text-[#C9A227] border-b-2 border-[#C9A227]" : "text-gray-600"
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setActiveTab("answered")}
            className={`px-4 py-3 font-medium hover:text-[#1E2A38] transition-colors ${
              activeTab === "answered" ? "text-[#C9A227] border-b-2 border-[#C9A227]" : "text-gray-600"
            }`}
          >
            Answered
          </button>
        </div>

        {/* Prayer Requests Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredRequests.length === 0 ? (
            <div className="card text-center py-12 md:col-span-2">
              <p className="text-gray-500">No prayer requests found. Share yours!</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className={`card ${request.isAnswered ? "bg-green-50 border-green-200" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-[#1E2A38] rounded-full flex items-center justify-center">
                      {request.isAnonymous ? (
                        <Lock className="w-5 h-5 text-[#C9A227]" />
                      ) : (
                        <User className="w-5 h-5 text-[#C9A227]" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-[#1E2A38]">
                        {request.isAnonymous ? "Anonymous" : request.author?.name}
                      </div>
                      <div className="text-sm text-gray-500">{formatDate(request.createdAt)}</div>
                    </div>
                  </div>
                  {request.isAnswered && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Answered
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#1E2A38] mb-2">{request.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{request.content}</p>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-1 text-[#C9A227]" />
                      {request.prayerCount || request._count?.prayers || 0} prayers
                    </span>
                  </div>
                  <button
                    onClick={() => handlePray(request.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      prayedIds.has(request.id)
                        ? "bg-[#C9A227] text-[#1E2A38]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {prayedIds.has(request.id) ? "✓ I Prayed" : "I Prayed"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Daily Scripture */}
        <div className="mt-12 card bg-gradient-to-r from-[#1E2A38] to-[#2d3d4f] text-white">
          <h3 className="text-lg font-semibold mb-4 text-[#C9A227]">Scripture for Today</h3>
          <blockquote className="text-xl italic leading-relaxed mb-4">
            "The prayer of a righteous person is powerful and effective. Elijah was a human being, even as we are. 
            He prayed earnestly that it would not rain, and it did not rain on the land for three and a half years."
          </blockquote>
          <p className="text-[#C9A227] font-medium">— James 5:16-17</p>
        </div>
      </div>
    </div>
  );
}
