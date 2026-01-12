"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "customer" | "photographer";
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { role, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // ✅ Agar authenticated nahi hai
      if (!isAuthenticated()) {
        console.log("❌ Not authenticated, redirecting to login");
        router.push("/login");
        return;
      }

      // ✅ Agar specific role required hai
      if (requiredRole && role !== requiredRole) {
        console.log(`❌ Role mismatch. Required: ${requiredRole}, Has: ${role}`);
        router.push("/unauthorized");
        return;
      }
    }
  }, [isLoading, isAuthenticated, role, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  if (requiredRole && role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}