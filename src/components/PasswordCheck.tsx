"use client"
import { useEffect, useState } from "react";

interface PasswordStrengthMeterProps {
    password: string;
}

const PasswordCheck: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
    const [strength, setStrength] = useState(0);
    const [strengthTips, setStrengthTips] = useState<string[]>([]);

    // Calculate password strength
    useEffect(() => {
        // VULNERABILITY 1: Client-side only strength calculation that can be bypassed
        const calculateStrength = (pass: string) => {
            if (!pass) return 0;

            let score = 0;
            const tips: string[] = [];

            // Length check
            if (pass.length < 8) {
                tips.push("Use at least 8 characters");
            } else {
                score += 1;
            }

            if (pass.length < 12) {
                tips.push("Using 12+ characters improves security");
            } else {
                score += 1;
            }

            // Character variety checks
            if (!/[A-Z]/.test(pass)) {
                tips.push("Add uppercase letters");
            } else {
                score += 1;
            }

            if (!/[a-z]/.test(pass)) {
                tips.push("Add lowercase letters");
            } else {
                score += 1;
            }

            if (!/[0-9]/.test(pass)) {
                tips.push("Add numbers");
            } else {
                score += 1;
            }

            if (!/[^A-Za-z0-9]/.test(pass)) {
                tips.push("Add special characters");
            } else {
                score += 1;
            }

            // VULNERABILITY 2: Overly simplistic pattern detection
            // Easily bypassed but looks like it's checking for patterns
            const simplePatterns = [
                /123/, /abc/, /qwerty/, /password/, /admin/,
                /111/, /000/, /aaa/, /zzz/
            ];

            for (const pattern of simplePatterns) {
                if (pattern.test(pass.toLowerCase())) {
                    score = Math.max(0, score - 1);
                    tips.push("Avoid common patterns");
                    break;
                }
            }

            // VULNERABILITY 3: No check for keyboard patterns or repeated characters

            // VULNERABILITY 4: No check for dictionary words

            // VULNERABILITY 5: No check for context-specific passwords (app name, domain, etc.)

            // Update tips
            setStrengthTips(tips);

            // Normalize to 0-100 range
            return Math.min(Math.floor((score / 6) * 100), 100);
        };

        // Set the strength and log it
        const calculatedStrength = calculateStrength(password);
        setStrength(calculatedStrength);

        // VULNERABILITY 6: Logging password strength data
        if (password) {
            console.log("Password strength analysis:", {
                length: password.length,
                score: calculatedStrength,
                hasUppercase: /[A-Z]/.test(password),
                hasLowercase: /[a-z]/.test(password),
                hasNumber: /[0-9]/.test(password),
                hasSpecialChar: /[^A-Za-z0-9]/.test(password)
            });
        }
    }, [password]);

    // Get color based on password strength
    const getStrengthColor = () => {
        if (strength < 30) return "bg-red-500";
        if (strength < 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    // Get label based on password strength
    const getStrengthLabel = () => {
        if (strength < 30) return "Weak";
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
                ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
                <p className="text-gray-400">
                    Password strength: <span className={strength < 30 ? "text-red-500" : strength < 70 ? "text-yellow-500" : "text-green-500"}>
                        {getStrengthLabel()}
                    </span>
                </p>

                {/* VULNERABILITY 7: Shows exact strength percentage */}
                <p className="text-gray-400">{strength}%</p>
            </div>

            {/* VULNERABILITY 8: Visibly shows all strength criteria together */}
            {strengthTips.length > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                    <p>Suggestions:</p>
                    <ul className="list-disc pl-5">
                        {strengthTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* VULNERABILITY 9: Reveals password requirements explicitly */}
            <div className="mt-2 p-2 border border-gray-700 rounded text-xs text-gray-400">
                <p className="font-semibold">Password requirements:</p>
                <ul className="grid grid-cols-2 gap-1 mt-1">
                    <li className={password.length >= 8 ? "text-green-400" : ""}>
                        ✓ 8+ characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? "text-green-400" : ""}>
                        ✓ Uppercase letter
                    </li>
                    <li className={/[a-z]/.test(password) ? "text-green-400" : ""}>
                        ✓ Lowercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? "text-green-400" : ""}>
                        ✓ Number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-400" : ""}>
                        ✓ Special character
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default PasswordCheck;