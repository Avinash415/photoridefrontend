"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import "./page.css";

interface Photographer {
  _id: string;
  name: string;
  city: string;
  category: string;
  price: number;
  rating: number;
  experience: number;
  description: string;
  coverImage: string;
}

export default function PhotographerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { role } = useAuth();

  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotographer();
  }, [id]);

  const fetchPhotographer = async () => {
    try {
      setLoading(true);
      const data = await api(`/api/photographers/${id}`);
      setPhotographer(data);
    } catch (err) {
      console.error("Failed to fetch photographer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!role) {
      router.push("/login");
    } else {
      router.push(`/booking/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="error-state">
        <p>Photographer not found</p>
      </div>
    );
  }

  return (
    <section className="photographer-details">
      {/* HERO - more cinematic */}
      <div className="details-hero">
        <div className="hero-image-wrapper">
          <img
            src={photographer.coverImage}
            alt={photographer.name}
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="details-info glass-card">
          <h1 className="fade-in">{photographer.name}</h1>
          <p className="category-location fade-in delay-1">
            {photographer.category} • {photographer.city}
          </p>

          <div className="stats fade-in delay-2">
            <div className="stat-item">
              <span className="stat-icon">★</span>
              <span>{photographer.rating.toFixed(1)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📷</span>
              <span>{photographer.experience}+ yr</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">₹</span>
              <span>
                {photographer.price != null
                  ? photographer.price.toLocaleString()
                  : "—"}
                /session
              </span>
            </div>
          </div>

          <div className="action-buttons fade-in delay-3">
            <button className="btn-primary" onClick={handleBooking}>
              Book Now
            </button>
            <button
              className="btn-outline"
              onClick={() => router.push(`/photographers/${id}/profile`)}
            >
              View Full Profile
            </button>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="details-section about-section fade-in delay-4 glass-card">
        <h2>About {photographer.name}</h2>
        <p className="about-text">{photographer.description}</p>
      </div>

      {/* SERVICES - more visual & modern */}
      <div className="details-section services-section fade-in delay-5 glass-card">
        <h2>Services Offered</h2>
        <div className="services-grid">
          {[
            { icon: "💒", label: "Wedding Photography" },
            { icon: "🌸", label: "Pre-wedding Shoots" },
            { icon: "🎉", label: "Event Coverage" },
            { icon: "👤", label: "Portrait Sessions" },
            { icon: "👶", label: "Maternity & Newborn" },
            { icon: "👗", label: "Fashion & Portfolio" },
          ].map((service, idx) => (
            <div key={idx} className="service-card">
              <span className="service-icon">{service.icon}</span>
              <span>{service.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
