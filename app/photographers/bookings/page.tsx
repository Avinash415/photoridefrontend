"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import  "./page.css";

interface Booking {
  _id: string;
  customerName: string;
  bookingDate: string;
  location: string;
  status: "pending" | "accepted" | "rejected";
}

export default function PhotographerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await api("/api/bookings/photographer");
      setBookings(data || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      await api(`/api/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      fetchBookings();
    } catch {
      alert("Unable to update booking status");
    }
  };

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const filterOptions: Array<{ value: typeof filter; label: string; count: number }> = [
    { value: "all", label: "All", count: bookings.length },
    { value: "pending", label: "Pending", count: bookings.filter(b => b.status === "pending").length },
    { value: "accepted", label: "Accepted", count: bookings.filter(b => b.status === "accepted").length },
    { value: "rejected", label: "Rejected", count: bookings.filter(b => b.status === "rejected").length },
  ];

  return (
    <div className="bookings-container">
      <header className="page-header">
        <div>
          <h1>Manage Bookings</h1>
          <p className="subtitle">Review and respond to customer booking requests</p>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`tab ${filter === option.value ? "active" : ""}`}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
            <span className="count">{option.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No {filter === "all" ? "" : filter} bookings</h3>
          <p>
            {filter === "all"
              ? "You haven't received any booking requests yet."
              : `No ${filter} bookings at the moment.`}
          </p>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-main">
                <h3 className="customer-name">{booking.customerName}</h3>
                <div className="details">
                  <span className="location">📍 {booking.location}</span>
                  <span className="date">
                    📅 {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="booking-side">
                <span className={`status-badge ${booking.status}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>

                {booking.status === "pending" && (
                  <div className="action-buttons">
                    <button
                      className="btn-accept"
                      onClick={() => updateStatus(booking._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => updateStatus(booking._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}