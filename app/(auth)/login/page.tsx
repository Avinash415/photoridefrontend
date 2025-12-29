"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import "./page.css";

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <main className="login-page">
        <div className="login-card">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="login-page">
      <LoginForm onSuccess={login} />
    </main>
  );
}

function LoginForm({ onSuccess }: { onSuccess: (role: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Backend sets HttpOnly cookie + returns role
      onSuccess(response.role);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h1>
        Welcome to <span>PhotoRide</span>
      </h1>
      <p>Sign in to continue</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="form-footer">
        Don't have an account? <Link href="/register">Register</Link>
      </div>
    </div>
  );
}