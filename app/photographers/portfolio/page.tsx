"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import "./page.css";

interface Service {
  title: string;
  price: number;
  description: string;
}

interface Profile {
  name: string;
  coverImage: string;
  city: string;
  experience: number;
  bio: string;
  available: boolean;
  services: Service[];
}

export default function PhotographerPortfolioPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api("/api/photographers/profile/me");
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="portfolio-container">
        <div className="skeleton-cover"></div>
        <div className="skeleton-header"></div>
        <div className="skeleton-card large"></div>
        <div className="skeleton-card"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="empty-portfolio">
        <div className="empty-illustration">📸</div>
        <h2>Your portfolio is empty</h2>
        <p>Create your photographer profile to attract clients.</p>
        <button onClick={() => router.push("/photographers/profile")}>
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Hero */}
      <section className="hero-cover">
        <img
          src={
            profile.coverImage ||
            "https://via.placeholder.com/1600x800?text=Photographer+Cover"
          }
          className="cover-image"
        />
        <div className="hero-overlay">
          <h1>{profile.name}</h1>
          <p>📍 {profile.city} • {profile.experience}+ yrs experience</p>
          <p className="bio">{profile.bio}</p>

          <span className={`status ${profile.available ? "on" : "off"}`}>
            {profile.available ? "Available for Booking" : "Not Available"}
          </span>
        </div>
      </section>

      {/* Actions */}
      <div className="actions-bar">
        <button onClick={() => router.push("/photographers/profile")}>
          ✏️ Edit Profile
        </button>
        <button onClick={() => router.push("/photographers/profile")}>
          ➕ Add Services
        </button>
      </div>

      {/* Services */}
      <section className="services-section">
        <h2>Services</h2>

        {profile.services.length === 0 ? (
          <p className="empty-services">No services added yet.</p>
        ) : (
          <div className="services-grid">
            {profile.services.map((s, i) => (
              <div key={i} className="service-card">
                <h3>{s.title}</h3>
                <p className="price">₹{s.price}</p>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
