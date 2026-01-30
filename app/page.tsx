"use client";

import "@/styles/landing.css";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const handleBecomePhotographer = () => {
    const role = localStorage.getItem("role"); // ya cookie se

    if (role === "photographer") {
      router.push("/photographers/dashboard");
    } else {
      router.push("/register");
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🚀 Search for Photography</span>

          <h1 className="hero-title">
            Book Professional <span>Photographers</span>
            <br />
            Anytime, Anywhere
          </h1>

          <p className="hero-subtitle">
            Find verified photographers for weddings, events, portraits, and
            product shoots — book instantly with secure payments.
          </p>

          <div className="hero-actions">
            {role === "photographer" ? (
              <button
                onClick={() => router.push("/photographers/portfolio")}
                className="btn primary"
              >
                My Portfolio
              </button>
            ) : (
              <>
                <a href="/photographers" className="btn primary">
                  Find Photographers
                </a>

                <button
                  onClick={handleBecomePhotographer}
                  className="btn secondary"
                >
                  Become a Photographer
                </button>
              </>
            )}
          </div>

          <div className="hero-stats">
            <div>
              <strong>5K+</strong>
              <span>Photographers</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>Cities</span>
            </div>
            <div>
              <strong>10K+</strong>
              <span>Bookings</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5hZOmOkQZ-tuH9_Z48gtaoV05niF4YtKbw&s"
            alt="Professional photographer capturing moments"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <header className="section-header">
          <h2>Why Choose PhotoRide?</h2>
          <p>A trusted marketplace built for quality & reliability</p>
        </header>

        <div className="feature-grid">
          <article className="feature-card">
            <h3>📍 Location Based Search</h3>
            <p>Discover photographers near you using smart geo-search.</p>
          </article>

          <article className="feature-card">
            <h3>📸 Verified Professionals</h3>
            <p>All photographers are vetted and reviewed.</p>
          </article>

          <article className="feature-card">
            <h3>💳 Secure Payments</h3>
            <p>Safe & fast payments with full transparency.</p>
          </article>

          <article className="feature-card">
            <h3>⭐ Ratings & Reviews</h3>
            <p>Book confidently using real customer feedback.</p>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="steps">
        <header className="section-header light">
          <h2>How It Works</h2>
          <p>Book your photographer in just 4 simple steps</p>
        </header>

        <div className="progress-line" id="progressLine"></div>

        <div className="step-grid">
          {[
            {
              id: 1,
              title: "Search",
              desc: "Browse photographers by category & location.",
              icon: "🔍",
            },
            {
              id: 2,
              title: "Book",
              desc: "Choose package, date & confirm booking.",
              icon: "📅",
            },
            {
              id: 3,
              title: "Shoot",
              desc: "Photographer arrives & captures moments.",
              icon: "📸",
            },
            {
              id: 4,
              title: "Review",
              desc: "Rate & review after successful completion.",
              icon: "⭐",
            },
          ].map((step) => (
            <div className="step" key={step.id}>
              <div className="step-icon" aria-hidden="true">
                {step.icon}
              </div>
              <span>{step.id}</span>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Capture Moments?</h2>
        <p>
          Join thousands of customers and photographers using PhotoRide today.
        </p>
        <a href="/login" className="btn primary large">
          Get Started
        </a>
      </section>
    </>
  );
}
