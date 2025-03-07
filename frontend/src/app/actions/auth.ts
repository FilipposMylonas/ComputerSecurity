"use server";

export async function loginAction(email:string,password:string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",  // Make sure cookies are sent
        cache: "no-store",  // Ensure fresh API responses
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
    }

    return res.json();
}

export async function signUpAction(email:string,password:string){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",  // Make sure cookies are sent
        cache: "no-store",  // Ensure fresh API responses
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Sign up failed");
    }

    return res.json();
}