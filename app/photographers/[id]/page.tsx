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

// const handleBooking = () => {
//   router.push(`/booking/${id}`);
// };

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
      {/* HERO SECTION */}
      <div className="details-hero">
        <div className="hero-image-wrapper">
          <img
            src={photographer.coverImage}
            alt={photographer.name}
            className="hero-image"
          />
        </div>

        <div className="details-info">
          <h1 className="fade-in">{photographer.name}</h1>
          <p className="location fade-in delay-1">
            {photographer.category} • {photographer.city}
          </p>

          <div className="stats fade-in delay-2">
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span>{photographer.rating}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📸</span>
              <span>{photographer.experience}+ years</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">₹</span>
              <span>{photographer.price}/session</span>
            </div>
          </div>

          <button
            className="book-btn fade-in delay-3"
            onClick={handleBooking}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="details-section about-section fade-in delay-4">
        <h2>About the Photographer</h2>
        <p>{photographer.description}</p>
      </div>

      {/* SERVICES SECTION */}
      <div className="details-section services-section fade-in delay-5">
        <h2>Services Offered</h2>
        <ul className="services">
          <li className="service-item">Wedding Photography</li>
          <li className="service-item">Pre-wedding Shoots</li>
          <li className="service-item">Event Coverage</li>
          <li className="service-item">Portrait Sessions</li>
          <li className="service-item">Maternity & Newborn</li>
          <li className="service-item">Fashion & Portfolio</li>
        </ul>
      </div>
    </section>
  );
}