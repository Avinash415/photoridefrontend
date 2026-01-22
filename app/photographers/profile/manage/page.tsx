"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import "./page.css";

interface Service {
  title: string;
  price: number;
  description: string;
}

interface PricePackage {
  type: "hourly" | "per-day" | "custom";
  amount: number;
  description: string;
}

export default function ManagePhotographerProfilePage() {
  const [saving, setSaving] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Form states...
  const [form, setForm] = useState({
    name: "",
    city: "",
    bio: "",
    experience: 0,
    available: true,
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pricePackages, setPricePackages] = useState<PricePackage[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [newService, setNewService] = useState<Service>({
    title: "",
    price: 0,
    description: "",
  });

  const [newPackage, setNewPackage] = useState<PricePackage>({
    type: "hourly",
    amount: 0,
    description: "",
  });

  // Fetch profile
  useEffect(() => {
    api("/api/photographers/profile")
      .then((data) => {
        const profile = data.profile || data;
        setForm({
          name: profile.name || "",
          city: profile.city || "",
          bio: profile.bio || "",
          experience: profile.experience || 0,
          available: profile.available ?? true,
        });
        setCategories(profile.categories || []);

        setServices(
          (profile.services || []).map((s: any) => ({
            title: s.title || "",
            description: s.description || "",
            price: Number(s.price || 0),
          })),
        );

        setPricePackages(
          (profile.pricePackages || []).map((p: any) => ({
            type: p.type,
            description: p.description || "",
            amount: Number(p.amount || 0),
          })),
        );

        // If existing images URLs come from server, you can set previews here
      })
      .catch(() => {});
  }, []);

  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "experience" ? Number(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    // Generate previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPreviewImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = (e.target as HTMLInputElement).value.trim();
      if (val && !categories.includes(val)) {
        setCategories([...categories, val]);
      }
      (e.target as HTMLInputElement).value = "";
    }
  };

  const removeCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  const addService = () => {
    if (!newService.title || newService.price <= 0) return;
    setServices([...services, newService]);
    setNewService({ title: "", price: 0, description: "" });
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const addPackage = () => {
    if (newPackage.amount <= 0) return;
    setPricePackages([...pricePackages, newPackage]);
    setNewPackage({ type: "hourly", amount: 0, description: "" });
  };

  const removePackage = (index: number) => {
    setPricePackages(pricePackages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSaving(true);
    const formData = new FormData();

    // ✅ Sirf wahi fields bhejo jo meaningful hain
    if (form.name) formData.append("name", form.name);
    if (form.city) formData.append("city", form.city);
    if (form.bio) formData.append("bio", form.bio);

    formData.append("experience", String(form.experience));
    formData.append("available", String(form.available));

    if (categories.length) {
      formData.append("categories", JSON.stringify(categories));
    }

    if (services.length) {
      formData.append("services", JSON.stringify(services));
    }

    if (pricePackages.length) {
      formData.append("pricePackages", JSON.stringify(pricePackages));
    }

    images.forEach((img) => formData.append("images", img));

    try {
      await api("/api/photographers/profile/full", {
        method: "PUT",
        body: formData,
      });
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="manage-profile">
      <header className="page-header">
        <h1>Manage Your Profile</h1>
        <p>Update your photographer details, services, packages & portfolio</p>
      </header>

      <div className="form-grid">
        {/* Basic Info */}
        <section className="glass-card section">
          <h2>Basic Information</h2>
          <div className="form-group">
            <label>Studio / Brand Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder=""
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder=""
            />
          </div>
          <div className="form-group">
            <label>Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              placeholder=""
            />
          </div>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={form.available}
              onChange={() =>
                setForm((p) => ({ ...p, available: !p.available }))
              }
            />
            <span>Available for bookings</span>
          </label>
        </section>

        {/* Categories */}
        <section className="glass-card section">
          <h2>Categories</h2>
          <input
            placeholder=""
            onKeyDown={addCategory}
            className="category-input"
          />
          <div className="chip-container">
            {categories.map((cat) => (
              <span key={cat} className="chip">
                {cat}
                <button onClick={() => removeCategory(cat)}>×</button>
              </span>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="glass-card section">
          <h2>Services</h2>
          <div className="list-container">
            {services.map((s, i) => (
              <div key={i} className="list-item">
                <div>
                  <strong>{s.title}</strong> — ₹{s.price.toLocaleString()}
                  <p>{s.description}</p>
                </div>
                <button className="remove-btn" onClick={() => removeService(i)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="add-form">
            <input
              placeholder=""
              value={newService.title}
              onChange={(e) =>
                setNewService({ ...newService, title: e.target.value })
              }
            />
            <input
              type="number"
              placeholder=""
              value={newService.price || ""}
              onChange={(e) =>
                setNewService({
                  ...newService,
                  price: Number(e.target.value) || 0,
                })
              }
            />
            <input
              placeholder=""
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
            />
            <button onClick={addService} className="add-btn">
              Add Service
            </button>
          </div>
        </section>

        {/* Price Packages – similar structure, omitted for brevity but same pattern */}

        {/* Portfolio Images */}
        <section className="glass-card section">
          <h2>Portfolio Images</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <p className="file-info">
            {images.length} new image{images.length !== 1 ? "s" : ""} selected
          </p>

          {previewImages.length > 0 && (
            <div className="image-preview-grid">
              {previewImages.map((src, i) => (
                <div key={i} className="preview-item">
                  <img src={src} alt="preview" />
                  <button
                    className="remove-preview"
                    onClick={() => removePreview(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <button
        className={`save-btn ${saving ? "saving" : ""}`}
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? <span className="spinner"></span> : "Save Profile"}
      </button>
    </div>
  );
}
