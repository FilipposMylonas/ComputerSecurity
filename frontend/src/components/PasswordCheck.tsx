"use client"
import { useEffect, useState } from "react";

interface PasswordStrengthMeterProps {
    password: string;
}

const PasswordCheck: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
    const [strength, setStrength] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState("");

    // Calculate password strength securely
    useEffect(() => {
        // FIXED: More robust password strength calculation without console logging
        const calculateStrength = (pass: string) => {
            if (!pass) return { score: 0, feedback: "" };

            let score = 0;
            let feedback = "";

            // Basic criteria
            const hasLength = pass.length >= 8;
            const hasUppercase = /[A-Z]/.test(pass);
            const hasLowercase = /[a-z]/.test(pass);
            const hasNumber = /[0-9]/.test(pass);
            const hasSpecial = /[^A-Za-z0-9]/.test(pass);

            // Length-based scoring
            if (pass.length >= 12) score += 25;
            else if (pass.length >= 10) score += 15;
            else if (pass.length >= 8) score += 10;
            else score += 0;

            // Character variety scoring
            if (hasUppercase) score += 15;
            if (hasLowercase) score += 15;
            if (hasNumber) score += 15;
            if (hasSpecial) score += 20;

            // Pattern detection penalties
            // Repeated characters
            const repeatedChars = /(.)\1{2,}/.test(pass);
            if (repeatedChars) {
                score -= 15;
                feedback = "Avoid repeated characters";
            }

            // Sequential characters
            const sequentialChars = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(pass);
            if (sequentialChars) {
                score -= 15;
                feedback = feedback || "Avoid sequential characters";
            }

            // Common words check
            const commonWords = ['password', 'admin', 'welcome', 'qwerty', 'letmein'];
            const containsCommonWord = commonWords.some(word => pass.toLowerCase().includes(word));
            if (containsCommonWord) {
                score -= 25;
                feedback = "Avoid common words in passwords";
            }

            // Normalize score to 0-100 range
            score = Math.max(0, Math.min(100, score));

            // Generate feedback if we don't already have specific feedback
            if (!feedback) {
                if (score < 40) {
                    feedback = "Consider a stronger password";
                } else if (score < 70) {
                    feedback = "Good password, could be stronger";
                } else {
                    feedback = "Strong password";
                }
            }

            return { score, feedback };
        };

        const result = calculateStrength(password);
        setStrength(result.score);
        setFeedbackMessage(result.feedback);
    }, [password]);

    // Get color based on password strength
    const getStrengthColor = () => {
        if (strength < 40) return "bg-red-500";
        if (strength < 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    // Get label based on password strength
    const getStrengthLabel = () => {
        if (strength < 40) return "Weak";
        if (strength < 70) return "Medium";
        return "Strong";
    };

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full ${getStrengthColor()}`}
                    style={{ width: `${strength}%` }}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={strength}
                    role="progressbar"
                ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
                <p className="text-gray-400">
                    Password strength: <span className={strength < 40 ? "text-red-500" : strength < 70 ? "text-yellow-500" : "text-green-500"}>
                        {getStrengthLabel()}
                    </span>
                </p>
            </div>

            {/* Only show feedback when relevant */}
            {feedbackMessage && (
                <p className="text-xs text-gray-400 mt-1">{feedbackMessage}</p>
            )}

            {/* FIXED: No detailed requirements list that would aid attackers */}
        </div>
    );
};

export default PasswordCheck;