// components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { token, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else if (!allowedRoles.includes(role!)) {
      router.push("/");
    }
  }, [token, role, router, allowedRoles]);

  if (!token || !role || !allowedRoles.includes(role)) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}