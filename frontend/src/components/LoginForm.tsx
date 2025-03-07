"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, User } from "lucide-react";

export default function SecureLoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    // We don't store attempt counts client-side anymore
    // These states are only for UI feedback purposes
    const [isTemporaryBlocked, setIsTemporaryBlocked] = useState(false);
    const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

    // Validation errors
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");

    // Form submission state
    const [isFormValid, setIsFormValid] = useState(false);

    // Validate form when inputs change
    useEffect(() => {
        const isValid =
            email.trim() !== "" &&
            password.trim() !== "" &&
            emailError === "" &&
            passwordError === "";

        setIsFormValid(isValid);
    }, [email, password, emailError, passwordError]);

    // Handle temporary block countdown
    useEffect(() => {
        if (isTemporaryBlocked && blockTimeRemaining > 0) {
            const timer = setTimeout(() => {
                setBlockTimeRemaining(blockTimeRemaining - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (isTemporaryBlocked && blockTimeRemaining === 0) {
            setIsTemporaryBlocked(false);
        }
    }, [isTemporaryBlocked, blockTimeRemaining]);

    const validatePasswordField = () => {
        if (!password.trim()) {
            setPasswordError("Password is required");
            return { isValid: false };
        }
        setPasswordError("");
        return { isValid: true };
    };

    // FIXED: No more account enumeration - use generic error messages
    const validateEmail = () => {
        if (!email.trim()) {
            setEmailError("Email is required");
            return { isValid: false };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            return { isValid: false };
        }

        setEmailError("");
        return { isValid: true };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");

        // Validate inputs
        const emailValidation = validateEmail();
        const passwordValidation = validatePasswordField();

        if (!emailValidation.isValid || !passwordValidation.isValid) {
            return;
        }

        if (isTemporaryBlocked) {
            setGeneralError(`Please wait ${blockTimeRemaining} seconds before trying again.`);
            return;
        }

        e.preventDefault()

        try {
            setIsSubmitting(true);

            // PADURARU CODE:
            // Implement login endpoint on your backend
            // POST to /api/auth/login with email and password
            // Return proper JWT token on success, handle rate limiting on the server
            // The response should include:
            // - status: 'success' or 'error'
            // - message: For errors only
            // - token: JWT token on success
            // - user: User object on success
            // - blockDuration: If rate limited, how many seconds to wait

            // API call to your backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",  // Make sure cookies are sent
                cache: "no-store",  // Ensure fresh API responses
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle different error scenarios
                if (response.status === 429) {
                    // Too many attempts (rate limited)
                    setIsTemporaryBlocked(true);
                    setBlockTimeRemaining(data.blockDuration || 30);
                    setGeneralError(`Too many login attempts. Please try again in ${data.blockDuration || 30} seconds.`);
                } else if (response.status === 401) {
                    // FIXED: Generic error message for invalid credentials
                    setGeneralError("Invalid email or password. Please try again.");
                } else {
                    // Other errors
                    setGeneralError(data.message || "An error occurred during login. Please try again.");
                }
            } else {
                // Successful login
                // PADURARU CODE:
                // On successful login, the backend should:
                // 1. Return a signed JWT token with appropriate expiration
                // 2. Include necessary user information WITHOUT sensitive data
                // 3. Reset the failed attempt counter for this user/IP

                // Store the token securely in an HttpOnly cookie (backend responsibility)
                // Or if you need to store it in localStorage or sessionStorage:
                if (data.token) {
                    // This should ideally be an httpOnly cookie set by the server
                    // Only use this as a fallback if cookies aren't an option
                    sessionStorage.setItem('auth_token', data.token);
                }

                // Redirect to dashboard or home page
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Login error:", error);
            setGeneralError("A network error occurred. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#181818] text-white">
            {/* Signup Form */}
            <div className="flex items-center justify-center min-h-screen pt-16 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-[#212121] p-8 rounded-xl shadow-md w-full max-w-md"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
                        <Lock className="mr-2" size={30} /> Login
                    </h2>

                    {generalError && (
                        <div className="mb-4 p-3 bg-red-700 text-white rounded-md text-sm">
                            {generalError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => validateEmail()}
                                required
                                aria-label="Email address"
                                className="w-full px-4 py-2 rounded-md bg-[#0e0e0e] text-white focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => validatePasswordField()}
                                required
                                aria-label="Password"
                                className="w-full px-4 py-2 rounded-md bg-[#0e0e0e] text-white focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
                        </div>

                        {/* FIXED: No login attempt counter visible to user */}
                        {isTemporaryBlocked && (
                            <div className="text-xs text-red-400 text-center">
                                Account temporarily locked. Try again in {blockTimeRemaining} seconds.
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full font-bold py-2 px-4 rounded ${
                                isFormValid && !isTemporaryBlocked && !isSubmitting
                                    ? "bg-white hover:bg-gray-500 text-black"
                                    : "bg-[#353535] text-gray-300 cursor-not-allowed"
                            }`}
                            disabled={!isFormValid || isTemporaryBlocked || isSubmitting}
                            aria-label="Login button"
                        >
                            {isSubmitting ? "Logging in..." : isTemporaryBlocked ? `Try again in ${blockTimeRemaining}s` : "Login"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-gray-400">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-white underline">
                            Sign up
                        </Link>
                    </p>

                    <div className="mt-4 text-center">
                        <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white">
                            Forgot password?
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}