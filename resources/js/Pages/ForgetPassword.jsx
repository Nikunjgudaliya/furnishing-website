import React, { useState } from 'react'
import { Link, useForm } from "@inertiajs/react";

function ForgetPassword() {

    const { data, setData } = useForm({
        email: "",
        password: "",
    });

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailVerified, setEmailVerified] = useState(null);

    const checkEmailExists = () => {
        fetch(`/check-email?email=${data.email}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.exists) {
                    setEmailVerified(true);
                } else {
                    setEmailVerified(false);
                }
            })
            .catch(() => setEmailVerified(false));
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();

        fetch("/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
            },
            body: JSON.stringify({
                email: data.email,
                password: newPassword,
                password_confirmation: confirmPassword,
            }),
        })
            .then((response) => {
                if (response.redirected) {
                    window.location.href = response.url; // Redirect to login page
                } else {
                    return response.json();
                }
            })
            .then((result) => {
                if (result?.message) {
                    alert(result.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };


    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                        Reset Password
                    </h2>
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={checkEmailExists}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Check
                            </button>
                            {emailVerified !== null && (
                                <span className={`text-lg ${emailVerified ? "text-green-500" : "text-red-500"}`}>
                                    {emailVerified ? "✔" : "✖"}
                                </span>
                            )}
                        </div>
                        {emailVerified && (
                            <>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {newPassword !== confirmPassword && (
                                    <p className="text-red-500 text-sm">Passwords do not match!</p>
                                )}
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                    disabled={!emailVerified || newPassword !== confirmPassword}
                                >
                                    Reset Password
                                </button>
                            </>
                        )}
                        <p
                            className="text-center text-sm text-blue-500 cursor-pointer hover:underline"
                        >
                            <Link href='/login'>Back to Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgetPassword
