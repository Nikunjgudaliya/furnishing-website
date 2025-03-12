import React from "react";
import { Link } from "@inertiajs/react";

export default function Navbar() {
    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <div className="flex space-x-6">
                <Link href="/" className="hover:text-gray-400">Home</Link>
                <Link href="/discover" className="hover:text-gray-400">Discover</Link>
                <Link href="/about" className="hover:text-gray-400">About Us</Link>
                <Link href="/contact" className="hover:text-gray-400">Contact Us</Link>
            </div>
            <div>
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                    Login
                </Link>
            </div>
        </nav>
    );
}
