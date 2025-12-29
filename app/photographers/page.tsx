"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import "./page.css";
import { useRouter } from "next/navigation";

interface Photographer {
  _id: string;
  name: string;
  city: string;
  category: string;
  price: number;
  rating: number;
  coverImage: string;
}

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPhotographers();
  }, []);

  const fetchPhotographers = async () => {
    try {
      setLoading(true);
      const data = await api("/api/photographers/");
      setPhotographers(data);
    } catch (err) {
      console.error("Failed to fetch photographers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Safe filtering that handles undefined/null values
  const filtered = photographers.filter((p) =>
    [p.name, p.city, p.category].some((field) =>
      (field ?? "").toLowerCase().includes(search.toLowerCase())
    )
  );

const handleView = (id: string) => {
  router.push(`/photographers/${id}`);
};


  return (
    <section className="photographers-page">
      <header className="photographers-header">
        <h1>Find Professional Photographers</h1>
        <p>Browse verified photographers near you</p>

        <input
          type="text"
          placeholder="Search by name, city or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      {loading ? (
        <div className="loading-state">
          <p>Loading photographers...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>
            {search
              ? "No photographers match your search."
              : "No photographers available at the moment."}
          </p>
        </div>
      ) : (
        <div className="photographer-grid">
          {filtered.map((p) => (
            <div className="photographer-card" key={p._id}>
              <img src={p.coverImage} alt={p.name} />
              <div className="card-body">
                <h3>{p.name}</h3>
                <p>
                  {p.category} • {p.city}
                </p>
                <div className="meta">
                  <span>⭐ {p.rating}</span>
                  <span>₹ {p.price}</span>
                </div>

                <button onClick={() => handleView(p._id)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}