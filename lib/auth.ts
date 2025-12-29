export type UserRole = "customer" | "photographer" | "admin";

export const getUserRole = (): UserRole | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role") as UserRole | null;
};

export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("role");
};
