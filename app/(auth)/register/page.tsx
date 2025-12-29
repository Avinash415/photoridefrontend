// app/(auth)/register/page.tsx
"use client";

import "./page.css";
import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    try {
      // Assuming your backend has /api/auth/register
      const response = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      // If registration successful and backend returns token directly
      // (some backends auto-login after register)
      if (response.role) {
        login(response.role); // 🔥 auto-login
      } else {
        // Otherwise redirect to login
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create Your Account">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            name="fullName"
            type="text"
            placeholder="Avinash Kumar"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label>Register As</label>
          <select name="role" required>
            <option value="customer">Customer</option>
            <option value="photographer">Photographer</option>
          </select>
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <button
          className="btn"
          type="submit"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <div className="form-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </AuthCard>
  );
}
