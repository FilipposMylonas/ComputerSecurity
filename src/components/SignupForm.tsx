"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import {SimpleCaptcha} from "@/components/SimpleCaptcha";

const SignupForm: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formSubmitError, setFormSubmitError] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaValid, setCaptchaValid] = useState(false);

    useEffect(() => {
        setIsFormValid(
            name.trim() !== "" &&
            email.trim() !== "" &&
            password.length >= 6 &&
            confirmPassword === password &&
            captchaValid
        );
    }, [name, email, password, confirmPassword, captchaValid]);

    const handleCaptchaChange = (isValid: boolean) => {
        console.log("Captcha validation result:", isValid);
        setCaptchaValid(isValid);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitError("");

        if (!isFormValid) {
            setFormSubmitError("Please fill out all required fields correctly and complete the captcha");
            return;
        }

        try {
            setIsSubmitting(true);
            console.log("Signup form is valid, proceeding with submission...");

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("User registered successfully");

            // Reset the form
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setCaptchaValid(false);

        } catch (error) {
            console.error("Signup error:", error);
            setFormSubmitError(
                error instanceof Error ? error.message : "An unknown error occurred"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#181818]">
            <div className="bg-[#212121] p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Sign Up
                </h2>

                {formSubmitError && (
                    <div className="mb-4 p-3 bg-red-700 text-white rounded-md text-sm">
                        {formSubmitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                    />

                    <div className="flex justify-center">
                        <SimpleCaptcha onChange={handleCaptchaChange} />
                    </div>

                    <button
                        type="submit"
                        className={`w-full font-bold py-2 px-4 rounded ${
                            isFormValid && !isSubmitting
                                ? "bg-white hover:bg-gray-200 text-black"
                                : "bg-gray-600 text-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;