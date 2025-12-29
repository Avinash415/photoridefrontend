"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import "./page.css";

interface Service {
  title: string;
  price: number;
  description: string;
}

export default function PhotographerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    coverImage: "",
    city: "",
    experience: 0,
    bio: "",
    available: true,
  });

  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Service>({
    title: "",
    price: 0,
    description: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api("/api/photographers/profile");

        const profile = data.profile || data;

        setForm({
          name: profile.name || "",
          coverImage: profile.coverImage || "",
          city: profile.city || "",
          experience: profile.experience || 0,
          bio: profile.bio || "",
          available: profile.available ?? true,
        });

        setServices(profile.services || []);
      } catch (err) {
        console.log("No existing profile found – starting fresh");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "experience" ? Number(value) : value,
    }));
  };

  const addService = () => {
    if (!newService.title.trim() || newService.price <= 0) return;
    setServices([...services, { ...newService }]);
    setNewService({ title: "", price: 0, description: "" });
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api("/api/photographers/profile", {
        method: "POST",
        body: JSON.stringify({ ...form, services }),
      });

      alert("Profile updated successfully! ✅");
    } catch (err: any) {
      alert(err.message || "Failed to update profile ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="skeleton-header"></div>
        <div className="skeleton-card large"></div>
        <div className="skeleton-card"></div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="page-header">
        <h1>Edit Photographer Profile</h1>
        <p className="subtitle">Update your details to attract more clients</p>
      </header>

      {/* Cover Preview */}
      <div className="cover-preview">
        <img
          src={
            form.coverImage ||
            "https://png.pngtree.com/png-clipart/20240727/original/pngtree-professional-female-photographer-holding-camera-with-tripod-concept-png-image_15647946.png"
          }
          alt="Cover preview"
          className="cover-image"
        />
        <div className="cover-overlay">
          <span>📸 Cover Image</span>
        </div>
      </div>

      {/* Basic Info Card */}
      <div className="form-card">
        <h2>Basic Information</h2>
        <div className="form-grid">
          <div className="field">
            <label>Studio / Brand Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Pixel Perfect Studio"
            />
          </div>
          <div className="field">
            <label>Cover Image URL</label>
            <input
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
            />
          </div>
          <div className="field">
            <label>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
            />
          </div>
          <div className="field">
            <label>Experience (years)</label>
            <input
              name="experience"
              type="number"
              min="0"
              value={form.experience}
              onChange={handleChange}
            />
          </div>
          <div className="field full">
            <label>Short Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell clients about your style and passion..."
            />
          </div>
          <div className="field toggle">
            <label>Available for Bookings</label>
            <button
              className={`toggle-switch ${form.available ? "on" : "off"}`}
              onClick={() =>
                setForm((prev) => ({ ...prev, available: !prev.available }))
              }
            >
              <span className="toggle-knob"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Services Card */}
      <div className="form-card">
        <h2>Services & Pricing</h2>

        <div className="services-list">
          {services.length === 0 ? (
            <p className="empty-text">No services added yet.</p>
          ) : (
            services.map((s, i) => (
              <div key={i} className="service-chip">
                <div>
                  <strong>{s.title}</strong> — ₹{s.price.toLocaleString()}
                  {s.description && <p className="desc">{s.description}</p>}
                </div>
                <button onClick={() => removeService(i)} className="remove-btn">
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div className="add-service-grid">
          <input
            placeholder="Service Title"
            value={newService.title}
            onChange={(e) =>
              setNewService((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={newService.price || ""}
            onChange={(e) =>
              setNewService((prev) => ({
                ...prev,
                price: Number(e.target.value) || 0,
              }))
            }
          />
          <input
            placeholder="Short Description (optional)"
            value={newService.description}
            onChange={(e) =>
              setNewService((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <button onClick={addService} className="add-btn">
            Add Service
          </button>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={saving} className="save-button">
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
