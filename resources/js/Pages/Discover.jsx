import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Navbar from "../components/Navbar";

function Discover() {
    const { categories = [] } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Handle Category Selection
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setSelectedSubcategory("");

        // Find subcategories of selected category
        if (categoryId) {
            const selectedCat = categories.find(cat => cat.id === parseInt(categoryId));
            setFilteredSubcategories(selectedCat ? selectedCat.subcategories : []);
        } else {
            setFilteredSubcategories([]);
        }

        // Filter products for selected category
        filterProducts(categoryId, "");
    };

    // Handle Subcategory Selection
    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        setSelectedSubcategory(subcategoryId);
        filterProducts(selectedCategory, subcategoryId);
    };

    // Function to filter products
    const filterProducts = (categoryId, subcategoryId) => {
        let products = [];

        if (!categoryId) {
            // Show all products by default
            categories.forEach(category => {
                products = [...products, ...category.products];
            });
        } else {
            const selectedCat = categories.find(cat => cat.id === parseInt(categoryId));
            if (selectedCat) {
                products = selectedCat.products;
                if (subcategoryId) {
                    products = products.filter(product => product.subcategory_id === parseInt(subcategoryId));
                }
            }
        }

        setFilteredProducts(products);
    };

    // Load all products by default
    useEffect(() => {
        filterProducts("", "");
    }, [categories]);

    return (
        <>
            <Navbar />
            <div className="p-6 max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Discover Products by Category</h1>

                {/* Category Filter Dropdown */}
                <div className="mb-4">
                    <label className="block text-lg font-semibold">Select Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subcategory Filter Dropdown (only show if category is selected) */}
                {filteredSubcategories.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-lg font-semibold">Select Subcategory:</label>
                        <select
                            value={selectedSubcategory}
                            onChange={handleSubcategoryChange}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">All Subcategories</option>
                            {filteredSubcategories.map((subcategory) => (
                                <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Display Filtered Products */}
                <div className="grid grid-cols-3 gap-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className="border p-4 rounded shadow">
                                <h3 className="text-lg font-bold">{product.name}</h3>
                                <p>{product.description}</p>
                                <p className="text-green-600 font-semibold">${product.price}</p>
                                <div className="flex space-x-2 mt-2">
                                    {product.images.map((image) => (
                                        <img
                                            key={image.id}
                                            src={`/storage/${image.image_path}`}
                                            alt={product.name}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No products available.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Discover;
