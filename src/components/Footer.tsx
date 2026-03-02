import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1E2A38] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-[#C9A227] font-bold text-lg mb-4">The Upper Room Forum</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Teach the Word, strengthen believers, support missionaries. A community for serious believers and church leaders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/teaching" className="text-gray-300 hover:text-[#C9A227] transition-colors">
                  Teaching
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-gray-300 hover:text-[#C9A227] transition-colors">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/prayer" className="text-gray-300 hover:text-[#C9A227] transition-colors">
                  Prayer Wall
                </Link>
              </li>
              <li>
                <Link href="/missionaries" className="text-gray-300 hover:text-[#C9A227] transition-colors">
                  Missionaries
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/statement-of-faith" className="text-gray-300 hover:text-[#C9A227] transition-colors">
                  Statement of Faith
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="text-gray-300 hover:text-[#C9A227] transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#C9A227] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#C9A227] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-gray-300 text-sm mb-4">
              Join our community and be part of something greater.
            </p>
            <Link
              href="/auth/signup"
              className="inline-block bg-[#C9A227] text-[#1E2A38] px-4 py-2 rounded-md font-semibold text-sm hover:bg-[#FDFBF7] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} The Upper Room Forum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
