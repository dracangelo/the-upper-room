"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Heart, MapPin, ExternalLink, Users, Clock } from "lucide-react";

interface Missionary {
  id: string;
  country: string;
  organization: string;
  ministryFocus: string;
  prayerNeeds: string;
  supportLink?: string;
  isActive: boolean;
  user: {
    name: string;
    image?: string;
  };
  updates: Array<{
    id: string;
    title: string;
    createdAt: string;
  }>;
  _count: {
    updates: number;
  };
}

const countryFlags: Record<string, string> = {
  "Kenya": "🇰🇪",
  "Uganda": "🇺🇬",
  "Thailand": "🇹🇭",
  "Nigeria": "🇳🇬",
  "India": "🇮🇳",
  "Tanzania": "🇹🇿",
  "Ghana": "🇬🇭",
  "Ethiopia": "🇪🇹",
  "Philippines": "🇵🇭",
  "Brazil": "🇧🇷",
};

export default function MissionariesPage() {
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stats, setStats] = useState({
    totalMissionaries: 0,
    countries: 0,
    totalPrayers: 0,
    activeUpdates: 0,
  });

  useEffect(() => {
    fetchMissionaries();
  }, []);

  const fetchMissionaries = async () => {
    try {
      const response = await fetch("/api/missionaries");
      if (response.ok) {
        const data = await response.json();
        setMissionaries(data);
        
        // Calculate stats
        const uniqueCountries = new Set(data.map((m: Missionary) => m.country));
        setStats({
          totalMissionaries: data.length,
          countries: uniqueCountries.size,
          totalPrayers: data.reduce((acc: number, m: Missionary) => acc + (m.updates?.length || 0) * 10, 0),
          activeUpdates: data.reduce((acc: number, m: Missionary) => acc + (m._count?.updates || 0), 0),
        });
      }
    } catch (error) {
      console.error("Error fetching missionaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMissionaries = selectedCountry
    ? missionaries.filter((m) => m.country.toLowerCase() === selectedCountry.toLowerCase())
    : missionaries;

  const uniqueCountries = Array.from(new Set(missionaries.map((m) => m.country)));

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 1) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading missionaries...</p>
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
            <Globe className="w-8 h-8 text-[#C9A227]" />
            <span className="text-[#C9A227] font-semibold uppercase tracking-wider">Missionaries</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Global Mission Network</h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Connect with missionaries worldwide. Pray for their needs, support their work, 
            and stay updated on God's work across the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/missionaries/support"
              className="inline-flex items-center justify-center bg-[#4A6741] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3d5637] transition-colors"
            >
              <Heart className="w-5 h-5 mr-2" />
              Support Missionaries
            </Link>
            <Link
              href="/missionaries/map"
              className="inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1E2A38] transition-colors"
            >
              <MapPin className="w-5 h-5 mr-2" />
              View World Map
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="card text-center">
            <Users className="w-8 h-8 text-[#4A6741] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.totalMissionaries}</div>
            <div className="text-sm text-gray-600">Missionaries</div>
          </div>
          <div className="card text-center">
            <Globe className="w-8 h-8 text-[#4A6741] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.countries}</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
          <div className="card text-center">
            <Heart className="w-8 h-8 text-[#4A6741] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.totalPrayers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Prayers Offered</div>
          </div>
          <div className="card text-center">
            <Clock className="w-8 h-8 text-[#4A6741] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1E2A38]">{stats.activeUpdates}</div>
            <div className="text-sm text-gray-600">New Updates</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
          >
            <option value="">All Countries</option>
            {uniqueCountries.map((country) => (
              <option key={country} value={country.toLowerCase()}>
                {countryFlags[country] || "🌍"} {country}
              </option>
            ))}
          </select>
          {selectedCountry && (
            <button
              onClick={() => setSelectedCountry("")}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear filter ✕
            </button>
          )}
        </div>

        {/* Missionaries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMissionaries.length === 0 ? (
            <div className="card text-center py-12 md:col-span-3">
              <p className="text-gray-500">No missionaries found in this country.</p>
            </div>
          ) : (
            filteredMissionaries.map((missionary) => (
              <div key={missionary.id} className="card hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{countryFlags[missionary.country] || "🌍"}</span>
                    <div>
                      <h3 className="font-bold text-[#1E2A38]">{missionary.user?.name || "Missionary"}</h3>
                      <p className="text-sm text-gray-500">{missionary.country}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    missionary.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {missionary.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Ministry Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Organization:</span> {missionary.organization}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Focus:</span> {missionary.ministryFocus}
                  </p>
                </div>

                {/* Prayer Needs */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm">
                    <span className="font-medium text-yellow-800">Prayer Needs:</span>{" "}
                    <span className="text-yellow-700">{missionary.prayerNeeds}</span>
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-[#C9A227]" />
                    {missionary._count?.updates || 0} updates
                  </span>
                  <span>
                    {missionary.updates && missionary.updates.length > 0 
                      ? `Updated ${formatDate(missionary.updates[0].createdAt)}`
                      : "No recent updates"
                    }
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-[#1E2A38] text-white py-2 rounded-lg font-medium hover:bg-[#C9A227] hover:text-[#1E2A38] transition-colors">
                    Pray Now
                  </button>
                  {missionary.supportLink && (
                    <Link
                      href={missionary.supportLink}
                      target="_blank"
                      className="flex-1 border-2 border-[#1E2A38] text-[#1E2A38] py-2 rounded-lg font-medium text-center hover:bg-[#1E2A38] hover:text-white transition-colors flex items-center justify-center"
                    >
                      Support
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 card bg-gradient-to-r from-[#4A6741] to-[#5a7d51] text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Are You a Missionary?</h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join our network to connect with supporters, share prayer needs, and receive encouragement 
            from the global Christian community.
          </p>
          <Link
            href="/missionaries/register"
            className="inline-block bg-white text-[#4A6741] px-8 py-3 rounded-lg font-semibold hover:bg-[#FDFBF7] transition-colors"
          >
            Register as Missionary
          </Link>
        </div>
      </div>
    </div>
  );
}
