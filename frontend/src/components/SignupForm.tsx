"use client"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import PasswordCheck from "../components/PasswordCheck";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, User, Lock } from "lucide-react";

const SignupForm: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formSubmitError, setFormSubmitError] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [tosAccepted, setTosAccepted] = useState(false);

    // FIXED: Using a ref to keep track of CAPTCHA expiration timing
    const captchaExpiryTimerRef = useRef<NodeJS.Timeout | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    // Form validation errors
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [tosError, setTosError] = useState("");

    useEffect(() => {
        // Validate form whenever inputs change
        validateForm();
    }, [name, email, password, confirmPassword, captchaToken, tosAccepted]);

    // FIXED: Cleanup CAPTCHA timer on unmount
    useEffect(() => {
        return () => {
            if (captchaExpiryTimerRef.current) {
                clearTimeout(captchaExpiryTimerRef.current);
            }
        };
    }, []);

    const validateForm = () => {
        const isValid =
            name.trim() !== "" && nameError === "" &&
            email.trim() !== "" && emailError === "" &&
            password.length >= 8 && passwordError === "" &&
            confirmPassword === password && confirmPasswordError === "" &&
            !!captchaToken &&
            tosAccepted && tosError === "";

        setIsFormValid(isValid);
        return isValid;
    };

    const validateName = () => {
        if (!name.trim()) {
            setNameError("Name is required");
            return false;
        }

        if (name.length < 2) {
            setNameError("Name must be at least 2 characters");
            return false;
        }

        // Name must contain only letters, spaces, hyphens, and apostrophes
        const nameRegex = /^[A-Za-z\s'-]+$/;
        if (!nameRegex.test(name)) {
            setNameError("Name contains invalid characters");
            return false;
        }

        setNameError("");
        return true;
    };

    const validateEmail = () => {
        if (!email.trim()) {
            setEmailError("Email is required");
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            return false;
        }

        setEmailError("");
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError("Password is required");
            return false;
        }

        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return false;
        }

        // Basic password complexity check
        // At least one uppercase, one lowercase, one number, and one special character
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        if (!(hasUppercase && hasLowercase && hasNumber && hasSpecial)) {
            setPasswordError("Password must include uppercase, lowercase, number, and special character");
            return false;
        }

        setPasswordError("");
        return true;
    };

    const validateConfirmPassword = () => {
        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your password");
            return false;
        }

        if (confirmPassword !== password) {
            setConfirmPasswordError("Passwords don't match");
            return false;
        }

        setConfirmPasswordError("");
        return true;
    };

    const validateTos = () => {
        if (!tosAccepted) {
            setTosError("You must accept the Terms of Service");
            return false;
        }

        setTosError("");
        return true;
    }

    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);

        // FIXED: Set a timer to reset CAPTCHA token when it expires (2 minutes)
        if (captchaExpiryTimerRef.current) {
            clearTimeout(captchaExpiryTimerRef.current);
        }

        if (token) {
            captchaExpiryTimerRef.current = setTimeout(() => {
                setCaptchaToken(null);
            }, 2 * 60 * 1000); // 2 minutes
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitError("");

        // Run all validations
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTosValid = validateTos();

        if (!(isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTosValid)) {
            return;
        }

        if (!captchaToken) {
            setFormSubmitError("Please complete the CAPTCHA verification");
            return;
        }

        try {
            setIsSubmitting(true);

            // PADURARU CODE:
            // Implement user registration endpoint
            // POST to /api/auth/register with user data
            // The backend should:
            // 1. Verify the CAPTCHA token with Google's API
            // 2. Check for existing email
            // 3. Validate all inputs server-side
            // 4. Hash the password with bcrypt (10+ rounds)
            // 5. Store user in database
            // 6. Send verification email
            // 7. Return appropriate response

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    captchaToken
                }),
                cache: 'no-store',
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle different error scenarios
                if (response.status === 400) {
                    // Validation errors
                    setFormSubmitError(data.message || "Please check your information and try again.");
                } else if (response.status === 409) {
                    // Email already exists
                    setFormSubmitError("An account with this email already exists.");
                } else if (response.status === 403) {
                    // CAPTCHA verification failed
                    setFormSubmitError("CAPTCHA verification failed. Please try again.");
                    if (recaptchaRef.current) {
                        recaptchaRef.current.reset();
                    }
                } else {
                    // Other errors
                    setFormSubmitError(data.message || "An error occurred. Please try again later.");
                }
            } else {
                // Successful registration
                // PADURARU CODE:
                // On successful registration, the backend should:
                // 1. Return success status
                // 2. Optionally pre-authenticate the user
                // 3. Provide next steps (e.g., email verification required)

                // Redirect to verification page or login
                router.push('/registration-success');
            }
        } catch (error) {
            console.error("Registration error:", error);
            setFormSubmitError("A network error occurred. Please check your connection and try again.");
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
                        <User className="mr-2" size={30} /> Sign Up
                    </h2>

                    {formSubmitError && (
                        <div className="mb-4 p-3 bg-red-700 text-white rounded-md text-sm">
                            {formSubmitError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={validateName}
                                required
                                aria-label="Full name"
                                className="w-full px-4 py-2 rounded-md bg-[#0e0e0e] text-white focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={validateEmail}
                                required
                                aria-label="Email address"
                                className="w-full px-4 py-2 rounded-md bg-[#0e0e0e] text-white focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password (min 8 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={validatePassword}
                                required
                                aria-label="Password"
                                className="w-full px-4 py-2 rounded-md bg-[#0e0e0e] text-white focus:outline-none focus:ring-2 focus:ring-white"
                            />

                            {/* Secure Password strength meter component */}
                            <PasswordCheck password={password} />

                            {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={validateConfirmPassword}
                                required
                                aria-label="Confirm password"
                                className="w-full px-4 py-2 rounded-md bg-[#0e0e0e] text-white focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            {confirmPasswordError && <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="tos"
                                checked={tosAccepted}
                                onChange={(e) => setTosAccepted(e.target.checked)}
                                aria-label="Accept terms of service"
                                className="mr-2"
                            />
                            <label htmlFor="tos" className="text-gray-400 text-sm">
                                I agree to the <a href="/terms" className="text-white underline">Terms of Service</a> and <a href="/privacy" className="text-white underline">Privacy Policy</a>
                            </label>
                        </div>
                        {tosError && <p className="mt-1 text-sm text-red-500">{tosError}</p>}

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
                                    ? "bg-white hover:bg-gray-500 text-black"
                                    : "bg-[#353535] text-gray-300 cursor-not-allowed"
                            }`}
                            disabled={!isFormValid || isSubmitting}
                            aria-label="Sign up button"
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
                </motion.div>
            </div>


        </div>
    );
};

export default SignupForm;