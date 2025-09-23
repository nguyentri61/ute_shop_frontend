import React from "react";
import { useNavigate } from "react-router-dom";

export default function Category({ categories = [], currentCategoryId }) {
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/categories/${id}`); // chỉ navigate, trang đích tự fetch dữ liệu
    };

    return (
        <div className="p-6 bg-gray-50">
            <h3 className="text-2xl font-bold mb-6 text-center">Shop by Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-6">
                {categories.map((cat) => {
                    const isActive = String(cat.id) === String(currentCategoryId);
                    return (
                        <div
                            key={cat.id}
                            onClick={() => handleClick(cat.id)}
                            className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-md cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl
              ${isActive ? "bg-indigo-100 ring-2 ring-indigo-500" : "bg-white"}`}
                        >
                            <img
                                src={`http://localhost:5000/public/icons/${cat.icon}`}
                                alt={cat.name}
                                className="w-12 h-12 mb-3"
                            />
                            <span
                                className={`text-lg font-medium ${isActive ? "text-indigo-700" : "text-gray-700"
                                    }`}
                            >
                                {cat.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
