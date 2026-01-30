"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import "@/styles/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { role, logout, isLoading } = useAuth(); // ← token removed

  // Show placeholder while role is being hydrated from localStorage
  if (isLoading) {
    return <div style={{ height: "64px" }} />; // Keeps layout stable
  }

  const isLoggedIn = !!role; // ← Role exists → user is logged in (auth via cookie)
  const isPhotographer = role === "photographer";
  const isCustomer = role === "customer";

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout(); // Calls backend logout (optional) + clears role ..
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* LOGO */}
        <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
          <Image
            src="/photoridelogo.png"
            alt="PhotoRide Logo"
            width={32}
            height={32}
            className="logo-img"
            priority
          />
          <span>PhotoRide</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {!isPhotographer && (
            <Link href="/photographers" onClick={() => setMenuOpen(false)}>
              Find Photographers
            </Link>
          )}

          {/* Logged-in user specific links */}
          {isLoggedIn ? (
            <>
              {/* Customer-specific */}
              {isCustomer && (
                <Link
                  href="/customer/bookings"
                  onClick={() => setMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}

              {/* Photographer-specific */}
              {isPhotographer && (
                <>
                  <Link
                    href="/photographers/dashboard"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/photographers/bookings"
                    onClick={() => setMenuOpen(false)}
                  >
                    Manage Bookings
                  </Link>
                  <Link
                    href="/photographers/portfolio"
                    onClick={() => setMenuOpen(false)}
                  >
                    Portfolio
                  </Link>
                </>
              )}

              {/* User greeting + Logout */}
              <div className="user-section">
                <span className="user-greeting">
                  👋 Hi, {isPhotographer ? "Photographer" : "Explorer"}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest user links */}
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                href="/register"
                className="nav-cta"
                onClick={() => setMenuOpen(false)}
              >
                Join as Photographer
              </Link>
            </>
          )}
        </nav>

        {/* MOBILE HAMBURGER MENU */}
        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
