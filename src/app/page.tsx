import Link from "next/link";
import { BookOpen, Users, Heart, Globe, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#1E2A38] text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to <span className="text-[#C9A227]">The Upper Room</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Teach the Word, strengthen believers, support missionaries. 
              A community for serious believers, church leaders, and theology-minded Christians.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center bg-[#C9A227] text-[#1E2A38] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#FDFBF7] transition-colors"
              >
                Join the Community
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/teaching"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#1E2A38] transition-colors"
              >
                Explore Teaching
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E2A38] mb-4">
              Four Pillars of Our Community
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built on the foundation of Scripture, prayer, fellowship, and missions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Teaching */}
            <div className="card text-center group">
              <div className="w-16 h-16 bg-[#1E2A38] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C9A227] transition-colors">
                <BookOpen className="w-8 h-8 text-[#C9A227] group-hover:text-[#1E2A38]" />
              </div>
              <h3 className="text-xl font-bold text-[#1E2A38] mb-3">Teaching</h3>
              <p className="text-gray-600 mb-4">
                Deep biblical doctrine, expository studies, and systematic theology for spiritual growth.
              </p>
              <Link
                href="/teaching"
                className="text-[#C9A227] font-semibold hover:text-[#1E2A38] transition-colors inline-flex items-center"
              >
                Explore Teaching <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>

            {/* Forum */}
            <div className="card text-center group">
              <div className="w-16 h-16 bg-[#1E2A38] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C9A227] transition-colors">
                <Users className="w-8 h-8 text-[#C9A227] group-hover:text-[#1E2A38]" />
              </div>
              <h3 className="text-xl font-bold text-[#1E2A38] mb-3">Forum</h3>
              <p className="text-gray-600 mb-4">
                Moderated discussions on theology, leadership, youth ministry, and evangelism strategies.
              </p>
              <Link
                href="/forum"
                className="text-[#C9A227] font-semibold hover:text-[#1E2A38] transition-colors inline-flex items-center"
              >
                Join Discussions <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>

            {/* Prayer Wall */}
            <div className="card text-center group">
              <div className="w-16 h-16 bg-[#1E2A38] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C9A227] transition-colors">
                <Heart className="w-8 h-8 text-[#C9A227] group-hover:text-[#1E2A38]" />
              </div>
              <h3 className="text-xl font-bold text-[#1E2A38] mb-3">Prayer Wall</h3>
              <p className="text-gray-600 mb-4">
                Share prayer requests, join others in prayer, and mark requests as answered.
              </p>
              <Link
                href="/prayer"
                className="text-[#C9A227] font-semibold hover:text-[#1E2A38] transition-colors inline-flex items-center"
              >
                Pray Together <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>

            {/* Missionaries */}
            <div className="card text-center group">
              <div className="w-16 h-16 bg-[#4A6741] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C9A227] transition-colors">
                <Globe className="w-8 h-8 text-white group-hover:text-[#1E2A38]" />
              </div>
              <h3 className="text-xl font-bold text-[#1E2A38] mb-3">Missionaries</h3>
              <p className="text-gray-600 mb-4">
                Support and connect with missionaries worldwide. Pray for their needs and field updates.
              </p>
              <Link
                href="/missionaries"
                className="text-[#C9A227] font-semibold hover:text-[#1E2A38] transition-colors inline-flex items-center"
              >
                Support Missions <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scripture Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bible-verse text-2xl md:text-3xl mb-8">
            "And they continued steadfastly in the apostles' doctrine and fellowship, 
            and in breaking of bread, and in prayers."
          </div>
          <p className="text-[#C9A227] font-semibold text-lg">— Acts 2:42</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#1E2A38]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Deepen Your Faith?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of believers worldwide who are growing in their understanding 
            of God's Word and supporting the spread of the Gospel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center bg-[#C9A227] text-[#1E2A38] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#FDFBF7] transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/statement-of-faith"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#1E2A38] transition-colors"
            >
              Our Beliefs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

