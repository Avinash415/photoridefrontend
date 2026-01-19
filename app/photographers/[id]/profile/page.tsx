"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./full-profile.css";
import "./page.css";

interface Category {
  _id: string;
  name: string;
}

interface PricePackage {
  type: string;
  amount: number;
}

interface Photographer {
  name: string;
  bio: string;
  experience: number;
  categories: Category[];
  pricePackages: PricePackage[];
  portfolioImages: string[];
}

interface FullProfileData {
  photographer: Photographer;
}

export default function FullProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<FullProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api(`/api/photographers/${id}/full-profile`);
        setData(response);
      } catch (err) {
        setError("Failed to load profile. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !data?.photographer) {
    return (
      <div className="error-state">
        <p>{error || "Profile not found"}</p>
      </div>
    );
  }

  const { photographer } = data;

  return (
    <div className="full-profile">
      {/* Hero / Header */}
      <header className="profile-hero">
        <div className="hero-content">
          <h1 className="fade-in">{photographer.name}</h1>
          <p className="tagline fade-in delay-1">
            Professional Photographer • {photographer.experience}+ Years
          </p>
        </div>
      </header>

      <main className="profile-content">
        {/* About / Bio */}
        <section className="section about-section glass-card fade-in delay-2">
          <h2>About</h2>
          <p className="bio-text">
            {photographer.bio || "No biography available yet."}
          </p>
        </section>

        {/* Experience & Categories */}
        <section className="section info-grid fade-in delay-3">
          <div className="glass-card">
            <h3>Experience</h3>
            <p className="highlight">{photographer.experience}+ years</p>
          </div>

          <div className="glass-card">
            <h3>Specialties</h3>
            <div className="categories">
              {photographer.categories?.length > 0 ? (
                photographer.categories.map((cat) => (
                  <span key={cat._id} className="category-tag">
                    {cat.name}
                  </span>
                ))
              ) : (
                <span className="muted">Not specified</span>
              )}
            </div>
          </div>
        </section>

        {/* Price Packages */}
        {photographer.pricePackages?.length > 0 && (
          <section className="section pricing-section fade-in delay-4">
            <h2>Pricing Packages</h2>
            <div className="pricing-grid">
              {photographer.pricePackages.map((pkg) => (
                <div key={pkg.type} className="price-card glass-card">
                  <h3>{pkg.type}</h3>
                  <p className="price">₹{pkg.amount.toLocaleString()}</p>
                  <p className="per">per session / package</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Portfolio Gallery */}
        <section className="section gallery-section fade-in delay-5">
          <h2>Portfolio</h2>
          {photographer.portfolioImages?.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              loop={true}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              className="portfolio-swiper"
            >
              {photographer.portfolioImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="swiper-lazy">
                    <img
                      src={img} // use src directly
                      loading="lazy" // ← native browser lazy
                      alt={`Portfolio image ${index + 1}`}
                      className="swiper-lazy-loaded"
                    />
                    <div className="swiper-lazy-preloader"></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="muted center">No portfolio images available yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}
