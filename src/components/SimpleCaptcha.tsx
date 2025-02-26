"use client";

import React, { useState, useEffect } from "react";

interface SimpleCaptchaProps {
    onChange: (isValid: boolean) => void;
}

// Helper function to generate a random number between min and max (inclusive)
const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function SimpleCaptcha({ onChange }: SimpleCaptchaProps) {
    // Initialize with placeholder values
    const [firstNum, setFirstNum] = useState<number | null>(null);
    const [secondNum, setSecondNum] = useState<number | null>(null);
    const [isClientSide, setIsClientSide] = useState(false);
    const [answer, setAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [verified, setVerified] = useState(false);
    const [refresh, setRefresh] = useState(0);

    // Initialize numbers only on client-side
    useEffect(() => {
        setIsClientSide(true);
        setFirstNum(getRandomNumber(1, 9));
        setSecondNum(getRandomNumber(1, 9));
        console.log("SimpleCaptcha initialized on client");
    }, []);

    // Generate new math problem when refresh changes
    useEffect(() => {
        if (refresh > 0 && isClientSide) {
            console.log("Generating new captcha numbers");
            setFirstNum(getRandomNumber(1, 9));
            setSecondNum(getRandomNumber(1, 9));
            setAnswer("");
            setIsCorrect(null);
            setVerified(false);
        }
    }, [refresh, isClientSide]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAnswer(value);

        // Clear the verification state when input changes
        if (verified) {
            setVerified(false);
            setIsCorrect(null);
            onChange(false);
        }
    };

    const handleVerify = () => {
        console.log("Verify button clicked");
        if (!firstNum || !secondNum || answer.trim() === "") {
            setIsCorrect(false);
            setVerified(true);
            onChange(false);
            return;
        }

        const numAnswer = parseInt(answer, 10);
        const newIsCorrect = !isNaN(numAnswer) && numAnswer === firstNum + secondNum;
        setIsCorrect(newIsCorrect);
        setVerified(true);
        onChange(newIsCorrect);
    };

    const resetCaptcha = () => {
        console.log("Reset button clicked");
        setRefresh(prev => prev + 1);
        onChange(false);
    };

    // Determine input border color based on verification state
    const getInputClass = () => {
        if (!verified) {
            return "border-gray-600 bg-gray-700 text-white focus:ring-blue-500";
        }
        return isCorrect
            ? "border-2 border-green-500 bg-gray-700 text-white focus:ring-green-500"
            : "border-2 border-red-500 bg-gray-700 text-white focus:ring-red-500";
    };

    // Show loading state until client-side initialization is complete
    if (!isClientSide || firstNum === null || secondNum === null) {
        return (
            <div className="bg-gray-800 rounded-md p-4 w-full max-w-xs">
                <div className="text-center mb-3 text-white font-medium">
                    Loading captcha...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-md p-4 w-full max-w-xs">
            <div className="text-center mb-3 text-white font-medium">
                Verify you're human
            </div>

            <div className="flex items-center justify-center mb-3">
                <span className="text-white text-lg">{firstNum} + {secondNum} = ?</span>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={answer}
                        onChange={handleInputChange}
                        placeholder="Enter the sum"
                        className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${getInputClass()}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleVerify();
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={resetCaptcha}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-2 rounded-md"
                        title="Try a different challenge"
                    >
                        ↻
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleVerify}
                    className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                    Verify
                </button>

                {/* Debug button to help troubleshoot event handling */}
                <button
                    type="button"
                    onClick={() => alert('Button click test works!')}
                    className="w-full py-1 px-2 rounded-md bg-gray-500 text-xs text-white"
                >
                    Click Test
                </button>
            </div>

            {verified && isCorrect === false && (
                <div className="mt-2 text-red-400 text-sm">
                    That's not correct. Try again.
                </div>
            )}

            {verified && isCorrect === true && (
                <div className="mt-2 text-green-400 text-sm">
                    Correct! You're verified.
                </div>
            )}
        </div>
    );
}