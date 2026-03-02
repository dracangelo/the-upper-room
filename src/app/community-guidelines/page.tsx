import { Shield, Users, MessageSquare, Heart, AlertTriangle, CheckCircle } from "lucide-react";

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#1E2A38] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-[#C9A227]" />
            <span className="text-[#C9A227] font-semibold uppercase tracking-wider">Community Standards</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Guidelines</h1>
          <p className="text-xl text-gray-300">
            Building a respectful, Scripture-centered community
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="card mb-8 bg-gradient-to-r from-[#1E2A38] to-[#2d3d4f] text-white">
          <Shield className="w-8 h-8 text-[#C9A227] mb-4" />
          <p className="text-lg leading-relaxed">
            The Upper Room Forum exists to strengthen believers and support missionaries through 
            biblical teaching, prayer, and respectful dialogue. These guidelines ensure our community 
            remains a safe, edifying space for all members.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <BookOpen className="w-8 h-8 text-[#C9A227] mx-auto mb-3" />
            <h3 className="font-bold text-[#1E2A38] mb-2">Scripture-Centered</h3>
            <p className="text-sm text-gray-600">All discussions rooted in biblical truth</p>
          </div>
          <div className="card text-center">
            <Heart className="w-8 h-8 text-[#C9A227] mx-auto mb-3" />
            <h3 className="font-bold text-[#1E2A38] mb-2">Respectful Love</h3>
            <p className="text-sm text-gray-600">Dialogue marked by Christ-like charity</p>
          </div>
          <div className="card text-center">
            <Users className="w-8 h-8 text-[#C9A227] mx-auto mb-3" />
            <h3 className="font-bold text-[#1E2A38] mb-2">Unity in Diversity</h3>
            <p className="text-sm text-gray-600">One body with many perspectives</p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="space-y-8">
          <section className="card">
            <div className="flex items-center space-x-3 mb-4">
              <MessageSquare className="w-6 h-6 text-[#C9A227]" />
              <h2 className="text-2xl font-bold text-[#1E2A38]">Discussion Guidelines</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span><strong>Scripture-Based Arguments:</strong> Support theological positions with relevant Bible passages and sound interpretation.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span><strong>No Personal Attacks:</strong> Disagree with ideas, not people. Ad hominem attacks are prohibited.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span><strong>Humble Posture:</strong> Approach discussions with humility, recognizing we all have more to learn.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span><strong>Constructive Engagement:</strong> Aim to build up, not tear down. Seek understanding before seeking to be understood.</span>
              </li>
            </ul>
          </section>

          <section className="card">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-[#1E2A38]">Prohibited Content</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span><strong>Political Propaganda:</strong> No promotion of political parties, candidates, or partisan agendas.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span><strong>Denominational Mockery:</strong> No ridicule or disrespect toward other Christian traditions or denominations.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span><strong>Prosperity Gospel Debates:</strong> Discussions about prosperity theology should be grounded in Scripture, not inflammatory rhetoric.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span><strong>False Teaching:</strong> Promotion of teachings contrary to our Statement of Faith is not permitted.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span><strong>Spam or Self-Promotion:</strong> No unsolicited commercial content or excessive self-promotion.</span>
              </li>
            </ul>
          </section>

          <section className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-[#C9A227]" />
              <h2 className="text-2xl font-bold text-[#1E2A38]">Member Tiers</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-[#C9A227] pl-4">
                <h3 className="font-bold text-[#1E2A38]">New Members (0-7 days)</h3>
                <p className="text-gray-600">Can read all content, post in Prayer Wall and Testimonies. Theology Debate access granted after 7 days.</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-[#1E2A38]">Established Members</h3>
                <p className="text-gray-600">Full posting privileges, can create threads in all categories, upvote content.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-[#1E2A38]">Recognized Contributors</h3>
                <p className="text-gray-600">Members with high reputation who consistently contribute valuable content. Can help moderate discussions.</p>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-[#C9A227]" />
              <h2 className="text-2xl font-bold text-[#1E2A38]">Moderation</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Our moderation team is committed to maintaining a respectful environment. 
              Violations of these guidelines may result in:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Content removal with explanation</li>
              <li>• Temporary posting restrictions</li>
              <li>• Account suspension for repeated violations</li>
              <li>• Permanent ban for severe or persistent violations</li>
            </ul>
          </section>

          <section className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-6 h-6 text-[#C9A227]" />
              <h2 className="text-2xl font-bold text-[#1E2A38]">Reporting</h2>
            </div>
            <p className="text-gray-700">
              If you encounter content that violates these guidelines, please use the "Report" 
              button available on every post and comment. Reports are reviewed by our moderation 
              team promptly and confidentially.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            By joining The Upper Room Forum, you agree to abide by these guidelines 
            and help us maintain a community that honors Christ.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: March 2026
          </p>
        </div>
      </div>
    </div>
  );
}

import { BookOpen } from "lucide-react";
