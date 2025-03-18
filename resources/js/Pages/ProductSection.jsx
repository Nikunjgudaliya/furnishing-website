import React, { useState, useEffect } from "react";
import { useForm, usePage, router } from "@inertiajs/react";

function ProductSection() {
    const { categories = [] } = usePage().props;

    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        description: "",
        price: "",
        category_id: "",
        subcategory_id: "",
        images: [],
    });

    const categoryForm = useForm({ name: "" });
    const subcategoryForm = useForm({ name: "", category_id: "" });
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [localCategories, setLocalCategories] = useState(categories);

    const handleChange = async (e) => {
        const { name, value, files } = e.target;

        if (name === "category_id") {
            if (!value) return;

            setSelectedCategory(value);
            setData("category_id", value);
            setData("subcategory_id", "");

            try {
                const response = await fetch(`/categories/${value}/subcategories`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setFilteredSubcategories(result.subcategories);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
                setFilteredSubcategories([]);
            }
        }

        if (name === "images") {
            setData("images", files);
        } else {
            setData(name, value);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!categoryForm.data.name.trim()) return;

        try {
            const response = await fetch("/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                },
                body: JSON.stringify(categoryForm.data),
            });

            const result = await response.json();

            if (result.success) {
                setLocalCategories(prev => [...prev, result.category]);
                categoryForm.reset();
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };


    const handleAddSubcategory = async (e) => {
        e.preventDefault();
        if (!subcategoryForm.data.name.trim() || !selectedCategory) return;

        try {
            const response = await fetch("/subcategories", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                },
                body: JSON.stringify({
                    name: subcategoryForm.data.name,
                    category_id: selectedCategory,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorMessage}`);
            }

            const result = await response.json();
            setFilteredSubcategories(prev => [...prev, result.subcategory]);
            subcategoryForm.reset();
        } catch (error) {
            console.error("Error adding subcategory:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("_token", document.querySelector('meta[name="csrf-token"]').getAttribute("content")); // CSRF Token
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("category_id", data.category_id);
        formData.append("subcategory_id", data.subcategory_id);

        for (let i = 0; i < data.images.length; i++) {
            formData.append("images[]", data.images[i]);
        }

        post("/products", formData, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };


    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="block">Product Name</label>
                    <input type="text" name="name" value={data.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="mb-3">
                    <label className="block">Description</label>
                    <textarea name="description" value={data.description} onChange={handleChange} className="w-full p-2 border rounded" required></textarea>
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div className="mb-3">
                    <label className="block">Price ($)</label>
                    <input type="number" name="price" value={data.price} onChange={handleChange} className="w-full p-2 border rounded" required />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                <div className="mb-3">
                    <label className="block">Category</label>
                    <select name="category_id" value={data.category_id} onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Select Category</option>
                        {localCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
                </div>

                <div className="mb-4 p-4 bg-gray-100 rounded">
                    <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={categoryForm.data.name}
                            onChange={(e) => categoryForm.setData("name", e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter new category"
                        />
                        <button type="button" onClick={handleAddCategory} className="bg-green-500 text-white px-4 py-2 rounded">
                            Add
                        </button>
                    </div>
                    {categoryForm.errors.name && <p className="text-red-500 text-sm">{categoryForm.errors.name}</p>}
                </div>

                {Array.isArray(filteredSubcategories) && filteredSubcategories.length > 0 ? (
                    <div className="mb-3">
                        <label className="block">Subcategory</label>
                        <select name="subcategory_id" value={data.subcategory_id} onChange={handleChange} className="w-full p-2 border rounded" required>
                            <option value="">Select Subcategory</option>
                            {filteredSubcategories.map((subcategory) => (
                                subcategory ? (
                                    <option key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </option>
                                ) : null
                            ))}
                        </select>
                        {errors.subcategory_id && <p className="text-red-500 text-sm">{errors.subcategory_id}</p>}
                    </div>
                ) : null}

                {selectedCategory && (
                    <div className="mb-4 p-4 bg-gray-100 rounded">
                        <h3 className="text-lg font-semibold mb-2">Add New Subcategory</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={subcategoryForm.data.name}
                                onChange={(e) => subcategoryForm.setData("name", e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Enter subcategory name"
                            />
                            <button type="button" onClick={handleAddSubcategory} className="bg-green-500 text-white px-4 py-2 rounded">
                                Add
                            </button>
                        </div>
                        {subcategoryForm.errors.name && <p className="text-red-500 text-sm">{subcategoryForm.errors.name}</p>}
                    </div>
                )}

                <div className="mb-3">
                    <label className="block">Upload Images</label>
                    <input type="file" name="images" multiple onChange={handleChange} className="w-full p-2 border rounded" accept="image/*" />
                    {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={processing}>
                    {processing ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
}

export default ProductSection;
