"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // ✅ Restore session - IMPROVED VERSION
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await api("/api/auth/me");
        setRole(data.user.role);
        setUser(data.user);
        
        // ✅ Agar authenticated hai to localStorage mein save karo (fallback)
        if (data.user?.role) {
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        console.log("Session restore failed:", error);
        setRole(null);
        setUser(null);
        localStorage.removeItem("role");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ✅ Login function update
  const login = async (email: string, password: string) => {
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      setRole(data.role);
      setUser(data.user);
      
      // ✅ Local storage mein save karo
      if (data.role) {
        localStorage.setItem("role", data.role);
      }
      
      // Redirect based on role
      if (data.role === "customer") {
        router.push("/");
      } else if (data.role === "photographer") {
        router.push("/photographers/dashboard");
      }
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  // ✅ Logout function update
  const logout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    // Clear all state
    setRole(null);
    setUser(null);
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    
    router.push("/login");
  };

  // ✅ Check if user is authenticated
  const isAuthenticated = () => {
    return !!role;
  };

  return (
    <AuthContext.Provider value={{ 
      role, 
      user,
      login, 
      logout, 
      isLoading, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);