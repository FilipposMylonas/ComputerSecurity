import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import SecureLoginForm from "@/components/LoginForm";

export default function SignupPage() {
    return (
        <>
            <SecureLoginForm/>
            <Link
                href="/"
                className="fixed bottom-6 right-6 bg-white text-black px-4 py-2 rounded-md shadow-lg hover:bg-gray-200 transition-colors flex items-center"
            >
                Back to Home
            </Link>
        </>
    );
}