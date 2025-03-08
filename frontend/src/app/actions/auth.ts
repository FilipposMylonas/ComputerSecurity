"use server";

export async function loginAction(email:string,password:string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            email: email,
            password: password,
        }),
        credentials: "include",  // Make sure cookies are sent
        cache: "no-store",  // Ensure fresh API responses
    });

    const data = await res.json();


    return data;
}

export async function signUpAction(email:string,password:string){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body:  new URLSearchParams({
            email: email,
            password: password,
        }),
        credentials: "include",  // Make sure cookies are sent
        cache: "no-store",  // Ensure fresh API responses
    });

    const data = await res.json();

    return data;
}