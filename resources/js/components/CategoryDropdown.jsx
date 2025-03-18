import React, { useState } from "react";

const CategoryDropdown = ({ categories: initialCategories, onDeleteCategory, onSelectCategory, selectedCategory }) => {
    const [categories, setCategories] = useState(initialCategories);

    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (categoryId) => {
        if (typeof onSelectCategory === "function") {
            onSelectCategory({ target: { name: "category_id", value: categoryId } });
        }
    };


    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md bg-white flex justify-between items-center focus:outline-none"
            >
                {selectedCategory
                    ? categories.find((cat) => cat.id === selectedCategory)?.name || "Select Category"
                    : "Select Category"}
            </button>

            {isOpen && (
                <div className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-20">
                    <ul className="py-2">
                        <li
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSelect(null);
                            }}
                        >
                            Select Category
                        </li>

                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <li
                                    key={category.id}
                                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSelect(category.id);
                                    }}
                                >
                                    {category.name}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onDeleteCategory(category.id, setCategories);
                                        }}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No categories</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;
