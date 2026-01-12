export const api = async (url: string, options: RequestInit = {}) => {
  // ✅ Ensure we're using correct API URL
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  const res = await fetch(`${baseURL}${url}`, {
    ...options,
    credentials: "include", // ✅ Cookies send/receive ke liye zaroori
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // ✅ Handle 401 (Unauthorized) specifically
  if (res.status === 401) {
    // Clear local auth state
    if (typeof window !== "undefined") {
      localStorage.removeItem("role");
      window.location.href = "/login?session=expired";
    }
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    let errorMessage = "API error";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return res.json();
};