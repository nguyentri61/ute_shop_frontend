import React from "react";
import { FaLaptop, FaTshirt, FaShoePrints, FaHatCowboy } from "react-icons/fa"; // Icon từ react-icons

const categories = [
    { name: "Electronics", icon: <FaLaptop size={30} /> },
    { name: "Clothing", icon: <FaTshirt size={30} /> },
    { name: "Shoes", icon: <FaShoePrints size={30} /> },
    { name: "Accessories", icon: <FaHatCowboy size={30} /> },
];

export default function Category() {
    return (
        <div className="p-6 bg-gray-50">
            <h3 className="text-2xl font-bold mb-6 text-center">Shop by Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer"
                    >
                        <div className="text-blue-500 mb-3">{cat.icon}</div>
                        <span className="text-lg font-medium text-gray-700">{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
