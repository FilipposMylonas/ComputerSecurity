"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, LogOut, CheckCircle } from "lucide-react";

export default function Dashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#181818] text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#212121] shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold flex items-center">
                                <Shield className="mr-2 text-white" size={30} />
                                ComputerSecurity Group 130
                            </Link>
                        </div>
                        <Link href="/login" className="flex items-center text-gray-300 hover:text-white">
                            <LogOut className="mr-2" size={18} />
                            Logout
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen pt-16 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#212121] p-8 rounded-xl shadow-md w-full max-w-md text-center"
                >
                    <CheckCircle className="mx-auto mb-4 text-green-400" size={60} />
                    <h1 className="text-2xl font-bold mb-4">Successfully Logged In</h1>
                    <p className="text-gray-300 mb-6">
                        Welcome to your secure session. Your login was successfully authenticated.
                    </p>

                    <div className="p-4 bg-[#0e0e0e] rounded-md mb-6">
                        <p className="text-sm text-gray-400">Current Session Time</p>
                        <p className="text-xl font-mono">
                            {currentTime.toLocaleTimeString()}
                        </p>
                    </div>

                    <p className="text-sm text-gray-400 mb-6">
                        For security reasons, you will be automatically logged out after 30 minutes of inactivity.
                    </p>

                    <Link
                        href="/login"
                        className="inline-block w-full py-2 px-4 bg-white text-black rounded-md hover:bg-gray-200 transition-colors"
                    >
                        End Session
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}