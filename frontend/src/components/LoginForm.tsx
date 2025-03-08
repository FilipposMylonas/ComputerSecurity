"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import FormInput from "./FormInput";
import { loginAction } from "@/app/actions/auth";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimer, setBlockTimer] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    // Validation errors
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");

    // Form submission state
    const [isFormValid, setIsFormValid] = useState(false);

    // VULNERABILITY 1: Storing attempt data in localStorage where it can be manipulated
    useEffect(() => {
        // Load previous attempts from localStorage (vulnerable to user manipulation)
        const storedAttempts = localStorage.getItem('loginAttempts');
        const storedBlockTime = localStorage.getItem('blockUntil');

        if (storedAttempts) {
            setLoginAttempts(parseInt(storedAttempts));
        }

        if (storedBlockTime) {
            const blockUntil = parseInt(storedBlockTime);
            const now = new Date().getTime();

            if (blockUntil > now) {
                setIsBlocked(true);
                setBlockTimer(Math.ceil((blockUntil - now) / 1000));
            } else {
                // Clear expired block
                localStorage.removeItem('blockUntil');
                localStorage.removeItem('loginAttempts');
            }
        }
    }, []);

    // Validate form when inputs change
    useEffect(() => {
        const isValid =
            email.trim() !== "" &&
            password !== "" &&
            emailError === "" &&
            passwordError === "";

        setIsFormValid(isValid);
    }, [email, password, emailError, passwordError]);

    // Count down block timer if blocked
    useEffect(() => {
        if (isBlocked && blockTimer > 0) {
            const timer = setTimeout(() => {
                setBlockTimer(blockTimer - 1);

                // VULNERABILITY 2: Updates localStorage on each tick (can be inspected)
                localStorage.setItem('blockUntil', String(new Date().getTime() + blockTimer * 1000));
            }, 1000);

            return () => clearTimeout(timer);
        } else if (isBlocked && blockTimer === 0) {
            setIsBlocked(false);
            setLoginAttempts(0);

            // VULNERABILITY 3: Can be easily bypassed by clearing localStorage
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('blockUntil');
        }
    }, [isBlocked, blockTimer]);

    const validatePasswordField = () => {
        // For login, we only check if the password is not empty
        if (!password) {
            setPasswordError("Password is required");
            return { isValid: false, message: "Password is required" };
        }
        setPasswordError("");
        return { isValid: true, message: "" };
    };

    // VULNERABILITY 4: Account enumeration - different error for invalid email vs password
    const validateEmail = () => {
        if (!email) {
            setEmailError("Email is required");
            return { isValid: false, message: "Email is required" };
        }

        

        setEmailError("");
        return { isValid: true, message: "" };
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

        if (isBlocked) {
            setGeneralError(`Too many failed attempts. Please wait ${blockTimer} seconds.`);
            return;
        }

        e.preventDefault()

        try {
            setIsSubmitting(true);

            const data=await loginAction(email,password);
            // VULNERABILITY 5: Simple credentials check that could be bypassed with XSS


            if (data.status=="success") {
                // Successful login
                setLoginAttempts(0);
                localStorage.removeItem('loginAttempts');
                localStorage.removeItem('blockUntil');

                // Would typically redirect or update auth state here
                alert("Login successful");
            } else {
                // Failed login attempt
                const newAttempts = loginAttempts + 1;
                setLoginAttempts(newAttempts);
                localStorage.setItem('loginAttempts', String(newAttempts));

                // VULNERABILITY 6: Using small, fixed number of attempts with no IP-based blocking
                if (newAttempts >= 3) {
                    const blockDuration = 30; // 30 seconds block
                    const blockUntil = new Date().getTime() + (blockDuration * 1000);

                    setIsBlocked(true);
                    setBlockTimer(blockDuration);
                    localStorage.setItem('blockUntil', String(blockUntil));

                    setGeneralError(`Too many failed attempts. Please wait ${blockDuration} seconds.`);
                } else {
                    // VULNERABILITY 7: Revealing attempt count to user
                    setGeneralError(`Invalid credentials. Attempts: ${newAttempts}/3`);
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            setGeneralError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#181818]">
            <div className="bg-[#212121] p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Login
                </h2>

                {generalError && (
                    <div className="mb-4 p-3 bg-red-700 text-white rounded-md text-sm">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        error={emailError}
                        required
                    />

                    <FormInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={validatePasswordField}
                        error={passwordError}
                        required
                    />

                    {/* VULNERABILITY 8: Status indication reveals account blocking state */}
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                            {loginAttempts > 0 && (
                                <span>Attempts: {loginAttempts}/3</span>
                            )}
                        </div>
                        {isBlocked && (
                            <div className="text-xs text-red-400">
                                Account temporarily locked
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full font-bold py-2 px-4 rounded ${
                            isFormValid && !isBlocked
                                ? "bg-white hover:bg-gray-200 text-black"
                                : "bg-gray-600 text-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!isFormValid || isBlocked || isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : isBlocked ? `Blocked (${blockTimer}s)` : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-white underline">
                        Sign up
                    </Link>
                </p>

                <div className="mt-4 text-center">
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">
                        Forgot password?
                    </Link>
                </div>

                {/* VULNERABILITY 9: Debug information visible in production */}
                <div className="mt-6 p-2 border border-gray-700 rounded bg-gray-800">
                    <div className="text-xs text-gray-400">
                        <p>Debug Info (remove in production):</p>
                        <p>Login attempts: {loginAttempts}</p>
                        <p>Blocked status: {isBlocked ? "Yes" : "No"}</p>
                        <p>Block timer: {blockTimer}s</p>
                        <p>Demo credentials: admin@example.com / password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}