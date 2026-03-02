"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Flag, X, AlertTriangle, MessageSquare, BookOpen, User } from "lucide-react";

interface ReportModalProps {
  contentType: "post" | "thread" | "comment" | "user";
  contentId: string;
  contentTitle?: string;
  onClose: () => void;
  onSubmit: () => void;
}

const reasons = [
  { id: "INAPPROPRIATE", label: "Inappropriate Content" },
  { id: "HARASSMENT", label: "Harassment or Bullying" },
  { id: "SPAM", label: "Spam or Advertising" },
  { id: "FALSE", label: "False Information" },
  { id: "OTHER", label: "Other" },
];

export default function ReportModal({ contentType, contentId, contentTitle, onClose, onSubmit }: ReportModalProps) {
  const { data: session } = useSession();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError("Please sign in to report content");
      return;
    }
    if (!reason) {
      setError("Please select a reason");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          contentId,
          reason,
          description,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        onSubmit();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to submit report");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getIcon = () => {
    switch (contentType) {
      case "post": return <BookOpen className="w-5 h-5" />;
      case "thread": return <MessageSquare className="w-5 h-5" />;
      case "user": return <User className="w-5 h-5" />;
      default: return <Flag className="w-5 h-5" />;
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flag className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-[#1E2A38] mb-2">Report Submitted</h3>
          <p className="text-gray-600 mb-4">
            Thank you for helping keep our community safe. Our moderators will review this report.
          </p>
          <button onClick={onClose} className="btn-primary w-full">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-[#1E2A38]">Report Content</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {contentTitle && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 text-gray-600">
              {getIcon()}
              <span className="font-medium text-[#1E2A38]">{contentTitle}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1E2A38] mb-2">
              Why are you reporting this?
            </label>
            <div className="space-y-2">
              {reasons.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    reason === r.id
                      ? "border-[#C9A227] bg-yellow-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.id}
                    checked={reason === r.id}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-[#C9A227] focus:ring-[#C9A227]"
                  />
                  <span className="text-gray-700">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1E2A38] mb-2">
              Additional Details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide more context..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !reason}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
