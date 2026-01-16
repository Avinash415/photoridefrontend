"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Restore session - PRODUCTION READY
  useEffect(() => {
    const restoreSession = async () => {
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      if (role && token) {
        try {
          await api("/api/auth/me"); // Validate token (calls backend getMe)
          setRole(role);
        } catch {
          logout(); // Invalid → logout
        }
      } else {
        setRole(null);
      }
      setIsLoading(false);
    };
    restoreSession();
  }, []);

  // ✅ Login function
  const login = (newRole: string) => {
    console.log("✅ Setting role:", newRole);
    setRole(newRole);
    localStorage.setItem("role", newRole);

    // Add this: Set non-httpOnly cookie for middleware (sync with localStorage)
    document.cookie = `role=${newRole}; path=/; max-age=86400; sameSite=lax`; // 1 day expiry

    // ✅ Use window.location for production redirect
    if (newRole === "customer") {
      window.location.href = "/";
    } else if (newRole === "photographer") {
      window.location.href = "/photographers/dashboard";
    }
  };

  // ✅ Logout function
  const logout = () => {
    console.log("🚪 Logging out user");

    // 🔥 REMOVE JWT & USER DATA
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // Add this: Clear cookie
    document.cookie = "role=; path=/; max-age=0";

    // Reset state
    setRole(null);

    // ✅ HARD REDIRECT (IMPORTANT)
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
