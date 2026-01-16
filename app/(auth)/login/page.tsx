"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import "./page.css";

export default function LoginPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
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
      <LoginForm />
    </main>
  );
}

function LoginForm() {
  const { login } = useAuth(); // ✅ USE CONTEXT
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

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("user", JSON.stringify(response.user));

      // ✅ SINGLE SOURCE OF TRUTH
      login(response.role, response.token, response.user);
    } catch (err: any) {
      let msg = err.message || "Login failed";

      if (msg.toLowerCase().includes("invalid")) {
        msg = "Invalid email or password";
      } else if (msg.toLowerCase().includes("fetch")) {
        msg = "Cannot connect to server";
      }

      setError(msg);
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

        {error && (
          <div className="error-text">
            <strong>Error:</strong> {error}
          </div>
        )}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="form-footer">
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </div>
    </div>
  );
}
