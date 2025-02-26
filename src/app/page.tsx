"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, User, Shield } from "lucide-react";

export default function LandingPage() {
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
              <div className="flex space-x-4">
                <Link
                    href="/login"
                    className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                    href="/signup"
                    className="px-4 py-2 rounded-md border border-white hover:bg-white hover:text-black transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative pt-16 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 pt-16">
                Secure Authentication <br /> Made Simple
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                Protect your application with robust, modern authentication that keeps your users safe without compromising on user experience.
              </p>

              <div className="flex justify-center space-x-4">
                <Link
                    href="/signup"
                    className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors text-lg font-semibold flex items-center"
                >
                  <User className="mr-2" /> Get Started
                </Link>
                <Link
                    href="/login"
                    className="px-6 py-3 border border-white rounded-md hover:bg-white hover:text-black transition-colors text-lg font-semibold flex items-center"
                >
                  <Lock className="mr-2" /> Login
                </Link>
              </div>
            </motion.div>

            {/* Features Section */}
            <div className="mt-20 grid md:grid-cols-3 gap-8">
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-[#212121] p-6 rounded-xl text-center"
              >
                <Lock className="mx-auto mb-4 text-white" size={50} />
                <h3 className="text-xl font-bold mb-3">Strong Security</h3>
                <p className="text-gray-300">
                  Implement multi-factor authentication and advanced password protection.
                </p>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-[#212121] p-6 rounded-xl text-center"
              >
                <Shield className="mx-auto mb-4 text-white" size={50} />
                <h3 className="text-xl font-bold mb-3">Advanced Protection</h3>
                <p className="text-gray-300">
                  Prevent brute-force attacks with intelligent rate limiting.
                </p>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="bg-[#212121] p-6 rounded-xl text-center"
              >
                <User className="mx-auto mb-4 text-white" size={50} />
                <h3 className="text-xl font-bold mb-3">User-Friendly</h3>
                <p className="text-gray-300">
                  Seamless authentication experience with intuitive design.
                </p>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#212121] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 text-center ">
            <p className="text-gray-400  ">
              © {new Date().getFullYear()} SecureAuth. All rights reserved.
            </p>
            <div className="mt-4 space-x-4">
              <Link href="/terms" className="text-gray-300 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
  );
}