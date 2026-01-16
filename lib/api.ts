export const api = async (url: string, options: RequestInit = {}) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  if (!baseURL) throw new Error("API URL not set");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${baseURL}${url}`, {
    // ✅ ALWAYS include credentials
    credentials: "include",

    ...options,

    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
  // Selective clear: only auth items
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  window.location.href = "/login?session=expired";
  throw new Error("Session expired");
}

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API error");
  }

  return res.json();
};
