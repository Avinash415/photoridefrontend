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
    const registerData = {
      name: formData.get("fullName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
    };

    try {
      const response = await api("/api/auth/register", {
        method: "POST",
        credentials: "include", // Important for cookie support
        body: JSON.stringify(registerData),
      });

      console.log("📝 Register API response:", response);

      // Check if registration + token was successful
      if (response.success && response.token && response.role) {
        // Store everything just like in login flow
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }

        // Auto-login via AuthContext (sets state + role cookie)
        login(response.role);

        // Success feedback
        alert("Registration successful! You're now logged in.");

        // Redirect based on role
        if (response.role === "photographer") {
          router.push("/photographers/dashboard");
        } else {
          router.push("/");
        }
      } else {
        // Fallback if no token/role returned (shouldn't happen after backend fix)
        setError(
          "Registration succeeded but login failed. Please log in manually."
        );
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      console.error("❌ Registration error:", err);
      const errorMessage =
        err.message ||
        err.response?.data?.message ||
        "Something went wrong during registration";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create Your Account">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Avinash Kumar"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Register As</label>
          <select id="role" name="role" defaultValue="" required>
            <option value="" disabled>
              Select your role
            </option>
            <option value="customer">Customer</option>
            <option value="photographer">Photographer</option>
          </select>
        </div>

        {error && (
          <div
            style={{
              color: "#d32f2f",
              textAlign: "center",
              margin: "1.2rem 0",
              padding: "0.8rem",
              background: "rgba(211, 47, 47, 0.08)",
              borderRadius: "8px",
              fontSize: "0.95rem",
            }}
          >
            {error.includes("exists") || error.includes("User exists") ? (
              <>
                This email is already registered.
                <a
                  href="/login"
                  style={{
                    color: "#1976d2",
                    marginLeft: "8px",
                    textDecoration: "underline",
                    fontWeight: 500,
                  }}
                >
                  Login here
                </a>
              </>
            ) : (
              error
            )}
          </div>
        )}

        <button
          className="btn"
          type="submit"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? (
            <>
              <span className="btn-spinner" /> Creating Account...
            </>
          ) : (
            "Register"
          )}
        </button>

        <div className="form-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </AuthCard>
  );
}
