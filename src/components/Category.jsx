import React from "react";

export default function Category({ categories }) {
    console.log("Categories in Category component:", categories);

    return (
        <div className="p-6 bg-gray-50">
            <h3 className="text-2xl font-bold mb-6 text-center">Shop by Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer"
                    >
                        <img
                            src={`http://localhost:5000/public/icons/${cat.icon}`}
                            alt={cat.name}
                            className="w-12 h-12 mb-3"
                        />
                        <span className="text-lg font-medium text-gray-700">{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
