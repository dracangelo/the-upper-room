"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, Users, Heart, Globe, Menu, X, User, LogOut } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: null },
  { href: "/teaching", label: "Teaching", icon: BookOpen },
  { href: "/forum", label: "Forum", icon: Users },
  { href: "/prayer", label: "Prayer Wall", icon: Heart },
  { href: "/missionaries", label: "Missionaries", icon: Globe },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 bg-[#1E2A38] shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-[#C9A227] font-bold text-xl">The Upper Room</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-white hover:text-[#C9A227] transition-colors flex items-center space-x-1 ${
                  pathname === item.href ? "active text-[#C9A227]" : ""
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href={`/profile/${session?.user?.id || ""}`}
                  className="flex items-center space-x-2 text-white hover:text-[#C9A227] transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-white hover:text-[#C9A227] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#C9A227] text-[#1E2A38] px-4 py-2 rounded-md font-semibold hover:bg-[#FDFBF7] transition-colors"
                >
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-white hover:text-[#C9A227] transition-colors py-2 px-3 rounded-md flex items-center space-x-2 ${
                    pathname === item.href ? "bg-[#C9A227]/20 text-[#C9A227]" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              ))}
              <hr className="border-[#C9A227]/30 my-2" />
              {isAuthenticated ? (
                <>
                  <Link
                    href={`/profile/${session?.user?.id || ""}`}
                    className={`text-white hover:text-[#C9A227] transition-colors py-2 px-3 rounded-md flex items-center space-x-2 ${
                      pathname.startsWith("/profile") ? "bg-[#C9A227]/20 text-[#C9A227]" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-400 hover:text-white transition-colors py-2 px-3 rounded-md flex items-center space-x-2 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-white hover:text-[#C9A227] transition-colors py-2 px-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-[#C9A227] text-[#1E2A38] px-4 py-2 rounded-md font-semibold text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
