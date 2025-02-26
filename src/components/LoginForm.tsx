"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import FormInput from "./FormInput";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimer, setBlockTimer] = useState(0);

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
            }, 1000);

            return () => clearTimeout(timer);
        } else if (isBlocked && blockTimer === 0) {
            setIsBlocked(false);
            setLoginAttempts(0);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isBlocked) {
            setGeneralError(`Too many failed attempts. Please wait ${blockTimer} seconds.`);
            return;
        }





            //--------PADURARU BACKEND LOGIC----------



            // Simulating a failed login attempt for demonstration purposes
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);

            // Block the account after 3 failed attempts
            if (newAttempts >= 3) {
                setIsBlocked(true);
                setBlockTimer(30); // 30 seconds block
                setGeneralError("Too many failed attempts. Please wait 30 seconds.");
            } else {
                setGeneralError(`Invalid credentials. Attempts: ${newAttempts}/3`);
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
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                    <button
                        type="submit"
                        className={`w-full font-bold py-2 px-4 rounded ${
                            isFormValid && !isBlocked
                                ? "bg-white hover:bg-gray-200 text-black"
                                : "bg-gray-600 text-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!isFormValid || isBlocked}
                    >
                        {isBlocked ? `Blocked (${blockTimer}s)` : "Login"}
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
            </div>
        </div>
    );
}