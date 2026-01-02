export const api = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${url}`,
    {
      ...options,
      credentials: "include", // ← Crucial for sending/receiving cookies
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        // NO Authorization header – cookie handles auth now
      },
    }
  );

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