"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Heart, 
  Globe, 
  Calendar, 
  Mail, 
  MapPin, 
  Edit,
  Save,
  X
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt: string;
  _count: {
    posts: number;
    threads: number;
    prayerRequests: number;
    comments: number;
  };
}

export default function ProfilePage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  const isOwnProfile = session?.user?.id === id;

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updated = await response.json();
        setProfile(updated);
        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      ADMIN: "bg-red-100 text-red-800",
      MODERATOR: "bg-blue-100 text-blue-800",
      PASTOR: "bg-purple-100 text-purple-800",
      MISSIONARY: "bg-green-100 text-green-800",
      MEMBER: "bg-gray-100 text-gray-800",
    };
    return badges[role] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E2A38] mb-2">User not found</h2>
          <Link href="/" className="text-[#C9A227] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#1E2A38] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-[#C9A227] rounded-full flex items-center justify-center flex-shrink-0">
              {profile.image ? (
                <img src={profile.image} alt={profile.name} className="w-24 h-24 rounded-full" />
              ) : (
                <User className="w-12 h-12 text-[#1E2A38]" />
              )}
            </div>
            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-col md:flex-row items-center md:items-center space-y-2 md:space-y-0 md:space-x-3 mb-2">
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-2xl md:text-3xl font-bold bg-transparent border-b-2 border-[#C9A227] text-white focus:outline-none px-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(profile.role)}`}>
                  {profile.role}
                </span>
              </div>
              <p className="text-gray-400 mb-2">
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </p>
              {isOwnProfile && (
                <div className="flex items-center justify-center md:justify-start space-x-2 mt-4">
                  {editing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-[#C9A227] text-[#1E2A38] px-4 py-2 rounded-lg font-medium hover:bg-[#FDFBF7] transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: profile.name,
                            bio: profile.bio || "",
                            location: profile.location || "",
                            website: profile.website || "",
                          });
                        }}
                        className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-2 border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-[#1E2A38] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Sidebar - Bio & Info */}
          <div className="space-y-6">
            {/* Bio */}
            <div className="card">
              <h2 className="text-lg font-bold text-[#1E2A38] mb-4">About</h2>
              {editing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] resize-none"
                />
              ) : (
                <p className="text-gray-600">
                  {profile.bio || "No bio yet."}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="card">
              <h2 className="text-lg font-bold text-[#1E2A38] mb-4">Details</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  {editing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Your location"
                      className="flex-grow px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                  ) : (
                    <span className="text-gray-600">{profile.location || "No location set"}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  {editing ? (
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="Your website"
                      className="flex-grow px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                  ) : profile.website ? (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#C9A227] hover:underline"
                    >
                      {profile.website}
                    </a>
                  ) : (
                    <span className="text-gray-600">No website</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Stats & Activity */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <BookOpen className="w-6 h-6 text-[#C9A227] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#1E2A38]">{profile._count.posts}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div className="card text-center">
                <MessageSquare className="w-6 h-6 text-[#C9A227] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#1E2A38]">{profile._count.threads + profile._count.comments}</div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div className="card text-center">
                <Heart className="w-6 h-6 text-[#C9A227] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#1E2A38]">{profile._count.prayerRequests}</div>
                <div className="text-sm text-gray-600">Prayers</div>
              </div>
              <div className="card text-center">
                <Calendar className="w-6 h-6 text-[#C9A227] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#1E2A38]">
                  {Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            </div>

            {/* Activity Sections */}
            {profile._count.posts > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-[#1E2A38] mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Recent Articles
                </h2>
                <p className="text-gray-500">View all articles by {profile.name} in the Teaching section.</p>
                <Link 
                  href={`/teaching?author=${profile.id}`}
                  className="inline-block mt-2 text-[#C9A227] hover:underline"
                >
                  Browse Articles →
                </Link>
              </div>
            )}

            {profile._count.threads > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-[#1E2A38] mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Forum Activity
                </h2>
                <p className="text-gray-500">View {profile.name}'s forum discussions.</p>
                <Link 
                  href={`/forum?author=${profile.id}`}
                  className="inline-block mt-2 text-[#C9A227] hover:underline"
                >
                  View Threads →
                </Link>
              </div>
            )}

            {profile._count.prayerRequests > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-[#1E2A38] mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Prayer Requests
                </h2>
                <p className="text-gray-500">View {profile.name}'s prayer requests.</p>
                <Link 
                  href={`/prayer?author=${profile.id}`}
                  className="inline-block mt-2 text-[#C9A227] hover:underline"
                >
                  View Prayers →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
