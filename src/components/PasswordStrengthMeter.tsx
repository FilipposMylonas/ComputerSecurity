"use client"
import { useEffect, useState } from "react";

interface PasswordStrengthMeter {
    password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeter> = ({ password }) => {
    const [strength, setStrength] = useState(0);

    // Calculate password strength
    useEffect(() => {
        // Simple password strength calculator
        const calculateStrength = (pass: string) => {
            if (!pass) return 0;

            let score = 0;

            // Length check
            if (pass.length >= 8) score += 1;
            if (pass.length >= 12) score += 1;

            // Character variety checks
            if (/[A-Z]/.test(pass)) score += 1; // Has uppercase
            if (/[a-z]/.test(pass)) score += 1; // Has lowercase
            if (/[0-9]/.test(pass)) score += 1; // Has number
            if (/[^A-Za-z0-9]/.test(pass)) score += 1; // Has special character

            // Normalize to 0-100 range
            return Math.min(Math.floor((score / 6) * 100), 100);
        };

        setStrength(calculateStrength(password));
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
            <p className="text-xs text-gray-400 mt-1">
                Password strength: <span className={strength < 30 ? "text-red-500" : strength < 70 ? "text-yellow-500" : "text-green-500"}>
          {getStrengthLabel()}
        </span>
            </p>
        </div>
    );
};

export default PasswordStrengthMeter;