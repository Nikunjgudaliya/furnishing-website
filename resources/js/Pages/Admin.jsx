import React, { useState } from "react";
import UserSection from "./userSection";
import ProductSection from "./ProductSection";
import { Inertia } from "@inertiajs/inertia";



export default function Admin() {
    const [activeSection, setActiveSection] = useState("user");

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-5">
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                <ul>
                    <li
                        className={`cursor-pointer p-3 rounded ${activeSection === "user" ? "bg-blue-500" : "hover:bg-gray-700"}`}
                        onClick={() => setActiveSection("user")}
                    >
                        User
                    </li>
                    <li
                        className={`cursor-pointer p-3 rounded mt-2 ${activeSection === "product" ? "bg-blue-500" : "hover:bg-gray-700"}`}
                        onClick={() => setActiveSection("product")}
                    >
                        Product
                    </li>
                </ul>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8">
                {activeSection === "user" ? <UserSection /> : <ProductSection />}
            </div>
        </div>
    );
}
