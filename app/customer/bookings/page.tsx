"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import "./page.css";

interface Booking {
  _id: string;
  photographer: {
    _id: string;
    name: string;
    city: string;
    coverImage: string;
  };
  serviceTitle: string;
  servicePrice: number;
  bookingDate: string;
  note?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
  createdAt: string;
}

export default function CustomerBookingsPage() {
  const { isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    fetchBookings();
  }, [authLoading]);

  const fetchBookings = async () => {
    try {
      setFetchLoading(true);
      const data = await api("/api/bookings/my");
      setBookings(data || []);
    } catch (err: any) {
      if (
        err.message?.toLowerCase().includes("authorized") ||
        err.message?.toLowerCase().includes("token")
      ) {
        router.replace("/login");
        return;
      }
      alert(err.message || "Failed to load your bookings");
    } finally {
      setFetchLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString.replace(".000Z", "Z"));
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusInfo = (status: Booking["status"]) => {
    switch (status) {
      case "PENDING":
        return { label: "Pending", color: "amber", icon: "⏳" };
      case "ACCEPTED":
        return { label: "Accepted", color: "emerald", icon: "✅" };
      case "REJECTED":
        return { label: "Rejected", color: "red", icon: "❌" };
      case "COMPLETED":
        return { label: "Completed", color: "blue", icon: "🎉" };
      default:
        return { label: status, color: "gray", icon: "📌" };
    }
  };

  if (authLoading || fetchLoading) {
    return (
      <div className="bookings-container">
        <div className="page-header">
          <h1>My Bookings</h1>
        </div>
        <div className="loading-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-lines">
                <div className="skeleton-line long"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p className="subtitle">Track and manage all your photography bookings in one place</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">📸</div>
          <h3>No bookings yet</h3>
          <p>Start your journey by booking a talented photographer today!</p>
          <button
            className="primary-btn"
            onClick={() => router.push("/photographers")}
          >
            Browse Photographers
          </button>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking, index) => {
            const statusInfo = getStatusInfo(booking.status);

            return (
              <div
                key={booking._id}
                className="booking-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="cover-image-wrapper">
                  <img
                    src={booking.photographer?.coverImage || "/placeholder.jpg"}
                    alt={booking.photographer?.name}
                    className="cover-image"
                  />
                  <div className="cover-overlay">
                    <div className="photographer-info">
                      <h3>{booking.photographer?.name || "Unknown Photographer"}</h3>
                      <p className="city">📍 {booking.photographer?.city || "Location not specified"}</p>
                    </div>
                    <div className={`status-badge ${statusInfo.color}`}>
                      <span className="icon">{statusInfo.icon}</span>
                      {statusInfo.label}
                    </div>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="label">Service</span>
                    <span className="value">{booking.serviceTitle}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Amount</span>
                    <span className="value price">₹{booking.servicePrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Booking Date</span>
                    <span className="value">{formatDate(booking.bookingDate)}</span>
                  </div>
                  {booking.note && (
                    <div className="detail-row note-row">
                      <span className="label">Your Note</span>
                      <span className="value note">"{booking.note}"</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}