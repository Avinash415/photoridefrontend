"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import "./page.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isLoading: authLoading } = useAuth();

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
      <LoginForm />
    </main>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("🔍 Frontend: Login attempt", { email });

    try {
      // ✅ Use api() function with credentials
      const response = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      console.log("✅ Login successful:", response);

      // ✅ Save to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      // ✅ Redirect based on role
      if (response.role === "customer") {
        window.location.href = "/"; // ✅ Force page reload
      } else if (response.role === "photographer") {
        window.location.href = "/photographers/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);

      // ✅ Better error messages
      let userMessage = err.message;
      if (err.message.toLowerCase().includes("invalid credential")) {
        userMessage = "Invalid email or password. Please try again.";
      } else if (
        err.message.includes("fetch") ||
        err.message.includes("network")
      ) {
        userMessage = "Cannot connect to server. Please check your connection.";
      }

      setError(userMessage);
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

      {/* Debug Info */}
      <div
        style={{
          background: "#f0f0f0",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "15px",
          fontSize: "12px",
        }}
      >
        <strong>Debug Info:</strong>
        <br />
        API URL: {process.env.NEXT_PUBLIC_API_URL || "Not set"}
      </div>

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
          <div
            className="error-text"
            style={{
              background: "#ffebee",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #f44336",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

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
