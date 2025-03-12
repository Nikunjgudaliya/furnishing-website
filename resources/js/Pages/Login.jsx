import React from "react";
import { Link, useForm, usePage, router } from "@inertiajs/react";
import Navbar from "../components/Navbar";

export default function Login() {
    // ✅ Get user data from Inertia props
    const { props } = usePage();
    const user = props.auth?.user;

    // ✅ If user is logged in, redirect
    if (user) {
        return router.visit("/");
    }

    // ✅ Form state for login
    const { data, setData, post, errors, processing } = useForm({
        email: "",
        password: "",
    });

    // ✅ Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login", {
            onSuccess: () => router.visit("/"),
        });
    };

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                        Login
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {processing ? "Logging in..." : "Login"}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-blue-500 hover:underline">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
