"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 Restore role on refresh
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
    setIsLoading(false);
  }, []);

  // 🔥 Login handler
  const login = (newRole: string) => {
    setRole(newRole);
    localStorage.setItem("role", newRole);

    // ✅ Redirect rules
    if (newRole === "customer") {
      router.replace("/");
    } else if (newRole === "photographer") {
      router.replace("/photographers/dashboard");
    }
  };

  // 🔥 Logout handler
  const logout = async () => {
    setRole(null);
    localStorage.removeItem("role");

    try {
      await fetch("https://photo-ride-backend-latest.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {}

    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
