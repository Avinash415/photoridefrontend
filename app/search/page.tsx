"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function SearchPage() {
  const [photographers, setPhotographers] = useState<any[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPhotographers = async () => {
      const res = await axios.get("http://localhost:5000/api/photographers");
      setPhotographers(res.data);
    };
    fetchPhotographers();
  }, []);

  return (
    <main className="container">
      <h1>Search Photographers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {photographers.map((p) => (
          <div key={p._id} className="p-4 shadow rounded">
            <h2>{p.user.name}</h2>
            <p>{p.city}</p>
            <p>{p.bio}</p>

            <h3>Services:</h3>
            <ul>
              {p.services.map((s: any) => (
                <li key={s.title}>
                  {s.title} - ₹{s.price}
                </li>
              ))}
            </ul>

            <button
              className="btn mt-2"
              onClick={async () => {
                if (!token) return alert("Login first");
                const service = p.services[0];
                await axios.post(
                  "http://localhost:5000/api/bookings",
                  {
                    photographerId: p._id,
                    serviceTitle: service.title,
                    price: service.price,
                    bookingDate: new Date(),
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                alert("Booking Requested");
              }}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
