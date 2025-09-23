import React, { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export default function FilterSidebar({ categories = [], filters, setFilters }) {
    const [showAll, setShowAll] = useState(false);
    const maxVisible = 5; // số danh mục hiển thị ban đầu

    const handleCategoryChange = (id) => {
        setFilters((prev) => ({ ...prev, categoryId: id || null }));
    };

    const handlePriceChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const applyPriceFilter = () => {
        setFilters((prev) => ({ ...prev })); // trigger re-fetch
    };

    const visibleCategories = showAll ? categories : categories.slice(0, maxVisible);

    return (
        <div className="bg-white p-4 rounded-xl shadow space-y-6">
            {/* Tiêu đề */}
            <div className="flex items-center gap-2 border-b pb-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Bộ lọc</h3>
            </div>

            {/* Lọc theo danh mục */}
            <div>
                <h4 className="font-medium mb-3 text-gray-700">Danh mục</h4>
                <ul className="space-y-2">
                    <li
                        onClick={() => handleCategoryChange(null)}
                        className={`cursor-pointer hover:text-indigo-600 ${!filters.categoryId ? "text-indigo-600 font-semibold" : "text-gray-700"
                            }`}
                    >
                        Tất cả
                    </li>
                    {visibleCategories.map((cat) => (
                        <li
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`cursor-pointer hover:text-indigo-600 ${String(filters.categoryId) === String(cat.id)
                                    ? "text-indigo-600 font-semibold"
                                    : "text-gray-700"
                                }`}
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>
                {/* Nút xem thêm/thu gọn */}
                {categories.length > maxVisible && (
                    <button
                        className="flex items-center gap-1 text-indigo-600 mt-2 text-sm hover:underline"
                        onClick={() => setShowAll((prev) => !prev)}
                    >
                        {showAll ? (
                            <>
                                <ChevronUp className="w-4 h-4" /> Thu gọn
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" /> Xem thêm
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Lọc theo giá */}
            <div>
                <h4 className="font-medium mb-3 text-gray-700">Khoảng giá</h4>

                {/* Các khoảng giá nhanh */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {[0, 50000, 100000, 200000, 500000].map((price, idx) => (
                        <button
                            key={price}
                            onClick={() => {
                                handlePriceChange("minPrice", idx === 0 ? 0 : price);
                                handlePriceChange("maxPrice", idx < 4 ? [50000, 100000, 200000, 500000][idx] : 0);
                                applyPriceFilter();
                            }}
                            className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition"
                        >
                            {idx === 0 ? "Dưới 50K" : `Từ ${price.toLocaleString("vi-VN")}đ`}
                        </button>
                    ))}
                </div>

                {/* Nhập khoảng giá tự do */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Từ"
                        className="border rounded-lg p-2 w-1/2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        onChange={(e) => handlePriceChange("minPrice", Number(e.target.value))}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="number"
                        placeholder="Đến"
                        className="border rounded-lg p-2 w-1/2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        onChange={(e) => handlePriceChange("maxPrice", Number(e.target.value))}
                    />
                </div>
                <button
                    onClick={applyPriceFilter}
                    className="mt-3 w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition"
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
}
