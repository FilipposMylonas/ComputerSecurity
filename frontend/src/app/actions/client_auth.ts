"use client";

export async function loginAction(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  
  // localStorage is available here since this code runs on the client
  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);
  
  return data;
}
export async function logOutAction() {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}
export async function getProfileAction(){
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Not authenticated");
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
    return data;
  
}