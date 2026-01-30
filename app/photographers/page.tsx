"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import "./page.css";

interface Photographer {
  _id: string;
  name: string;
  city: string;
  category: string;
  price: number;
  rating: number;
  coverImage: string;
  description?: string;
}

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [filtered, setFiltered] = useState<Photographer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const router = useRouter();

  // Available categories for filtering
  const categories = [
    "all",
    "wedding",
    "portrait",
    "event",
    "commercial",
    "landscape",
    "fashion",
  ];

  useEffect(() => {
    fetchPhotographers();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    filterPhotographers();
  }, [search, activeFilter, photographers]);

  const fetchPhotographers = async () => {
    try {
      setLoading(true);
      const data = await api("/api/photographers/");

      // Validate and sanitize data
      const sanitizedData = data.map((photographer: any) => ({
        _id: photographer._id || "",
        name: photographer.name || "Unknown Photographer",
        city: photographer.city || "Location not specified",
        category: photographer.category || "General",
        price: typeof photographer.price === "number" ? photographer.price : 0,
        rating:
          typeof photographer.rating === "number" ? photographer.rating : 0,
        coverImage: photographer.coverImage || "/default-photographer.jpg",
        description: photographer.description || "Professional photographer",
      }));

      setPhotographers(sanitizedData);
      setFiltered(sanitizedData);
    } catch (err) {
      console.error("Failed to fetch photographers:", err);
      // Set empty array instead of undefined
      setPhotographers([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPhotographers = () => {
    let filtered = photographers;

    // Apply search filter
    if (search) {
      filtered = filtered.filter((p) =>
        [p.name, p.city, p.category, p.description].some((field) =>
          (field ?? "").toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }

    // Apply category filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((p) =>
        p.category.toLowerCase().includes(activeFilter.toLowerCase()),
      );
    }

    setFiltered(filtered);
  };

  const handleView = (id: string) => {
    router.push(`/photographers/${id}`);
  };

  const handleFilter = (category: string) => {
    setActiveFilter(category);
  };

  const clearFilters = () => {
    setSearch("");
    setActiveFilter("all");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper function to safely format price
  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null || typeof price !== "number") {
      return "₹0";
    }
    return `₹${price.toLocaleString()}`;
  };

  // Helper function to safely format rating
  const formatRating = (rating: number | undefined | null) => {
    if (rating === undefined || rating === null || typeof rating !== "number") {
      return "0.0";
    }
    return rating.toFixed(1);
  };

  // Render skeleton loading
  if (loading) {
    return (
      <section className="photographers-page">
        <header className="photographers-header">
          <h1>Find Professional Photographers</h1>
          <p>Browse verified photographers near you</p>

          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search by name, city or category..."
              value="" // Fixed: Add empty value prop
              readOnly // Use readOnly instead of disabled for controlled input
              className="search-input-disabled"
            />
          </div>
        </header>

        <div className="filter-tags">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-tag ${activeFilter === category ? "active" : ""}`}
              onClick={() => handleFilter(category)}
              disabled
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="loading-state">
          <div className="loading-animation">
            <div className="loading-circle"></div>
            <div className="loading-circle"></div>
          </div>
          <p>Loading photographers...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="photographers-page">
      <header className="photographers-header">
        <h1>Find Professional Photographers</h1>
        <p>Browse verified photographers near you</p>

        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search by name, city or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="filter-tags">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-tag ${activeFilter === category ? "active" : ""}`}
            onClick={() => handleFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length > 0 && (
        <div className="results-count">
          Showing <strong>{filtered.length}</strong> photographer
          {filtered.length !== 1 ? "s" : ""}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📷</div>
          <p>
            {search || activeFilter !== "all"
              ? "No photographers match your search criteria."
              : "No photographers available at the moment."}
          </p>
          {(search || activeFilter !== "all") && (
            <button onClick={clearFilters} className="reset-button">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="photographer-grid">
          {filtered.map((p) => (
            <div className="photographer-card" key={p._id}>
              <div className="image-container">
                <img
                  src={p.coverImage || "/default-photographer.jpg"}
                  alt={p.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/default-photographer.jpg";
                  }}
                />
                <div className="image-overlay"></div>
                <span className="category-badge">
                  {p.category || "General"}
                </span>
              </div>

              <div className="card-body">
                <h3>{p.name || "Unknown Photographer"}</h3>
                <div className="location">
                  <span>{p.city || "Location not specified"}</span>
                </div>

                <p>
                  {p.description ||
                    "Professional photographer specializing in quality work."}
                </p>

                <div className="meta">
                  <div className="rating">
                    <span className="stars">★★★★★</span>
                    <span>{formatRating(p.rating)}</span>
                  </div>
                </div>

                <button onClick={() => handleView(p._id)}>
                  <span>View Details</span>
                  <span className="card-button-icon">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className={`scroll-top ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </section>
  );
}
