"use client"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { signUpAction } from "@/app/actions/auth";

const SignupForm: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formSubmitError, setFormSubmitError] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useEffect(() => {
        setIsFormValid(
            name.trim() !== "" &&
            email.trim() !== "" &&
            password.length >= 6 &&
            confirmPassword === password &&
            !!captchaToken
        );
    }, [name, email, password, confirmPassword, captchaToken]);

    const handleCaptchaChange = (token: string | null) => {
        console.log("Captcha token received:", token ? "Valid token" : "No token");
        setCaptchaToken(token);
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

            // In a real implementation, you would verify the token on your server
            // by making a request to the Google reCAPTCHA API

            // Simulate API call
            const data= await signUpAction(email,password)
            if (data.status=='success'){
                console.log("User registered successfully");

                // Reset the form
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setCaptchaToken(null);
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
            }
            

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

                    <div>
                        <input
                            type="password"
                            placeholder="Password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                        />

                        {/* Password strength meter component */}
                        <PasswordStrengthMeter password={password} />
                    </div>

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                    />

                    <div className="flex justify-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LfEUOMqAAAAAEmTMr1Gz1ygxV4a0vkNO_MPOVgS"
                            onChange={handleCaptchaChange}
                            theme="dark"
                        />
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