// app/photographer-dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import "./page.css";

interface Booking {
  _id: string;
  customerName: string;
  service: string;
  bookingDate: string;
  status: "pending" | "accepted" | "rejected";
}

export default function PhotographerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api("/api/bookings/photographer");

      const mapped: Booking[] = data.map((b: any) => ({
        _id: b._id,
        customerName: b.customer?.name || b.customerName || "Unknown Customer",
        service:
          b.service?.title ||
          b.service?.name ||
          b.serviceName ||
          "Photography Service",
        bookingDate: b.bookingDate,
        status:
          b.status === "ACCEPTED"
            ? "accepted"
            : b.status === "REJECTED"
            ? "rejected"
            : "pending",
      }));

      // Newest first
      setBookings(
        mapped.sort(
          (a, b) =>
            new Date(b.bookingDate).getTime() -
            new Date(a.bookingDate).getTime()
        )
      );
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      const backendStatus = status === "accepted" ? "ACCEPTED" : "REJECTED";
      await api(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: backendStatus }),
      });
      setOpenActionId(null);
      fetchBookings();
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Could not update booking status");
    }
  };

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  const getCount = (status: Booking["status"] | "all") =>
    status === "all"
      ? bookings.length
      : bookings.filter((b) => b.status === status).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Photographer Dashboard</h1>
      </header>

      <section className="stats-grid">
        {(["all", "pending", "accepted", "rejected"] as const).map((filter) => (
          <div
            key={filter}
            className={`stat-card ${filter} ${
              activeFilter === filter ? "active" : ""
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            <div className="stat-label">
              {filter === "all"
                ? "Total Requests"
                : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </div>
            <div className="stat-value animate-count">{getCount(filter)}</div>
          </div>
        ))}
      </section>

      <section className="bookings-section">
        <h2 className="section-title">Booking Requests</h2>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <p>
              No {activeFilter !== "all" ? activeFilter : ""} bookings found
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-info">
                  <h3>{booking.customerName}</h3>
                  <p className="service">{booking.service}</p>
                  <time className="date">
                    {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <div className="booking-actions">
                  {booking.status === "pending" ? (
                    openActionId === booking._id ? (
                      <div className="action-buttons animate-in">
                        <button
                          className="btn btn-accept"
                          onClick={() => updateStatus(booking._id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-reject"
                          onClick={() => updateStatus(booking._id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-pending"
                        onClick={() => setOpenActionId(booking._id)}
                      >
                        Action Required ▾
                      </button>
                    )
                  ) : (
                    <span
                      className={`status-badge ${booking.status} animate-in`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
