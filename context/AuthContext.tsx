"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Restore session - PRODUCTION READY
  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
    setIsLoading(false);
  }, []);

  // ✅ Login function
  const login = (newRole: string) => {
    console.log("✅ Setting role:", newRole);
    setRole(newRole);
    localStorage.setItem("role", newRole);

    // ✅ Use window.location for production redirect
    if (newRole === "customer") {
      window.location.href = "/";
    } else if (newRole === "photographer") {
      window.location.href = "/photographers/dashboard";
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL;
      if (baseURL) {
        await fetch(`${baseURL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear everything
    setRole(null);
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // Redirect to login
    window.location.href = "/login";
  };

  // ✅ Check authentication
  const isAuthenticated = () => {
    return !!role;
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        isLoading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
