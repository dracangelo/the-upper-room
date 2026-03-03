"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Globe, Heart, MapPin, Users, ArrowLeft, Check, X } from "lucide-react";

export default function MissionaryRegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    country: "",
    organization: "",
    ministryFocus: "",
    testimony: "",
    prayerNeeds: "",
    supportLink: "",
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center card p-8 max-w-md">
          <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to register as a missionary.
          </p>
          <Link
            href="/auth/signin?callbackUrl=/missionaries/register"
            className="inline-block bg-[#1E2A38] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#C9A227] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center card p-8 max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E2A38] mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering as a missionary! Your application has been received and will be reviewed by our team.
          </p>
          <Link
            href="/missionaries"
            className="inline-block bg-[#4A6741] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3d5637] transition-colors"
          >
            View Missionaries
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/missionaries/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    "Kenya", "Uganda", "Thailand", "Nigeria", "India", "Tanzania", 
    "Ghana", "Ethiopia", "Philippines", "Brazil", "United States", 
    "Canada", "United Kingdom", "Australia", "South Africa", "Mexico",
    "Argentina", "Chile", "Peru", "Colombia", "Venezuela", "Guatemala",
    "Costa Rica", "Panama", "Cuba", "Jamaica", "Trinidad and Tobago",
    "Barbados", "Bahamas", "Dominican Republic", "Puerto Rico", "Haiti"
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#1E2A38] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <Link href="/missionaries" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <Globe className="w-8 h-8 text-[#C9A227]" />
            <span className="text-[#C9A227] font-semibold uppercase tracking-wider">Missionary Registration</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Mission Network</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Connect with supporters worldwide, share your prayer needs, and receive encouragement 
            from the global Christian community.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-[#C9A227]" />
              Basic Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country of Service *
                </label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Your mission organization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>
            </div>
          </div>

          {/* Ministry Details */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1E2A38] mb-6 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-[#C9A227]" />
              Ministry Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ministry Focus *
                </label>
                <textarea
                  required
                  value={formData.ministryFocus}
                  onChange={(e) => setFormData({ ...formData, ministryFocus: e.target.value })}
                  placeholder="Describe your ministry focus and work..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimony
                </label>
                <textarea
                  value={formData.testimony}
                  onChange={(e) => setFormData({ ...formData, testimony: e.target.value })}
                  placeholder="Share your calling and testimony..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prayer Needs *
                </label>
                <textarea
                  required
                  value={formData.prayerNeeds}
                  onChange={(e) => setFormData({ ...formData, prayerNeeds: e.target.value })}
                  placeholder="What are your current prayer needs?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Link
                </label>
                <input
                  type="url"
                  value={formData.supportLink}
                  onChange={(e) => setFormData({ ...formData, supportLink: e.target.value })}
                  placeholder="https://your-support-page.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/missionaries"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#4A6741] text-white rounded-lg font-medium hover:bg-[#3d5637] disabled:opacity-50 transition-colors"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
