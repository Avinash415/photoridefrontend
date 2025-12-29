"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import "./page.css";

interface Service {
  title: string;
  price: number;
}

interface Photographer {
  _id: string;
  name: string;
  city: string;
  rating: number;
  coverImage: string;
  services: Service[];
}

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoading: authLoading } = useAuth(); // Token ab cookie mein hai → sirf loading check

  const [bookingDate, setBookingDate] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Wait for auth hydration (localStorage role load) before proceeding
  useEffect(() => {
    if (authLoading) return;

    // Actual auth is handled by HttpOnly cookie + backend middleware
    // So no need to check token here — backend will reject if not authenticated
    fetchPhotographer();
  }, [authLoading]);

  const fetchPhotographer = async () => {
    try {
      setFetchLoading(true);
      const data = await api(`/api/photographers/${id}`);
      setPhotographer(data);
    } catch (err: any) {
      // If 401 from backend → redirect to login
      if (err.message?.includes("authorized") || err.message?.includes("token")) {
        router.replace("/login");
        return;
      }
      alert("Failed to load photographer details");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!bookingDate || !selectedService) {
      alert("Please select a date and service");
      return;
    }

    setLoading(true);
    try {
      await api("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          photographerId: id,
          serviceTitle: selectedService.title,
          servicePrice: selectedService.price,
          bookingDate,
          note,
        }),
      });

      alert("✅ Booking request sent successfully!");
      router.push("/customer/bookings");
    } catch (err: any) {
      alert(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
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
    <section className="booking-page">
      <div className="booking-container fade-in">
        <div className="photographer-header">
          <div className="photographer-avatar">
            <img src={photographer.coverImage} alt={photographer.name} />
          </div>
          <div className="photographer-info">
            <h1>Book {photographer.name}</h1>
            <p className="location">
              {photographer.city} • ⭐ {photographer.rating}
            </p>
          </div>
        </div>

        <div className="booking-form">
          {/* Date Picker */}
          <div className="form-group">
            <label>Preferred Date</label>
            <input
              type="date"
              value={bookingDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setBookingDate(e.target.value)}
              required
            />
          </div>

          {/* Service Selection */}
          <div className="form-group">
            <label>Choose Service</label>
            <select
              value={selectedService?.title || ""}
              onChange={(e) => {
                const service = photographer.services.find(
                  (s: Service) => s.title === e.target.value
                );
                setSelectedService(service || null);
              }}
              required
            >
              <option value="" disabled>
                Select a service
              </option>
              {photographer.services.map((s, idx) => (
                <option key={idx} value={s.title}>
                  {s.title} – ₹{s.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Price Summary */}
          {selectedService && (
            <div className="price-summary fade-in">
              <span>Total Amount</span>
              <strong>₹{selectedService.price.toLocaleString()}</strong>
            </div>
          )}

          {/* Additional Notes */}
          <div className="form-group">
            <label>Additional Notes (Optional)</label>
            <textarea
              placeholder="Share event details, preferred location, timing, special requests..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            className="submit-btn"
            disabled={loading || !bookingDate || !selectedService}
            onClick={handleBooking}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}