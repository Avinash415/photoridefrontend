export const api = async (url: string, options: RequestInit = {}) => {
  // ✅ PRODUCTION: Must use environment variable
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  
  if (!baseURL) {
    console.error("❌ NEXT_PUBLIC_API_URL is not set!");
    throw new Error("API URL is not configured");
  }
  
  console.log("🔍 API Call to:", `${baseURL}${url}`);

  try {
    const res = await fetch(`${baseURL}${url}`, {
      ...options,
      credentials: "include", // ✅ MUST for cookies
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    console.log("🔍 Response Status:", res.status);
    
    const responseText = await res.text();
    let responseData;
    
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch {
      responseData = { message: "Invalid JSON response" };
    }

    // ✅ Handle 401
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.location.href = "/login?session=expired";
      }
      throw new Error("Session expired");
    }

    // ✅ Handle 400 (Invalid credentials)
    if (res.status === 400) {
      throw new Error(responseData.message || "Invalid credentials");
    }

    // ✅ Handle other errors
    if (!res.ok) {
      throw new Error(responseData.message || `API error: ${res.status}`);
    }

    return responseData;
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
};