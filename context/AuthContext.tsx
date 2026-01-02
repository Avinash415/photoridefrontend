"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Restore session from backend (SOURCE OF TRUTH)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await api("/api/auth/me");
        setRole(data.user.role);
      } catch {
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ✅ Login (backend already set cookie)
  const login = (newRole: string) => {
    setRole(newRole);

    if (newRole === "customer") {
      router.replace("/");
    } else if (newRole === "photographer") {
      router.replace("/photographers/dashboard");
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {}

    setRole(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
