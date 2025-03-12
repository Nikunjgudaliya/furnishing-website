import React, { useEffect, useState } from "react";
import { Link, router } from "@inertiajs/react";
import axios from "axios";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch current logged-in user
    useEffect(() => {
        axios.get("/current-user")
            .then((response) => {
                if (response.data && response.data.status) {
                    setUser(response.data); // ✅ Ensure only active users are set
                } else {
                    setUser(null);
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
            {/* Left Navigation Links */}
            <div className="flex space-x-6">
                <Link href="/" className="hover:text-gray-400">Home</Link>
                <Link href="/discover" className="hover:text-gray-400">Discover</Link>
                <Link href="/about" className="hover:text-gray-400">About Us</Link>
                <Link href="/contact" className="hover:text-gray-400">Contact Us</Link>
            </div>

            {/* Right User Section */}
            <div className="flex items-center space-x-4">
                {loading ? (
                    <span className="text-white">Loading...</span>
                ) : user ? (
                    <>
                        {/* User Profile Image */}
                        {user.image && (
                            <img
                                src={user.image}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border border-gray-300"
                                onError={(e) => e.target.src = "/default-user.png"}
                            />
                        )}

                        {/* Username Display */}
                        <span className="text-white font-medium">{user.username}</span>

                        {/* Logout Button */}
                        <button
                            onClick={() => {
                                router.post("/logout", {
                                    onSuccess: () => setUser(null),
                                });
                            }}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    // Login Button (if no user is logged in)
                    <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
