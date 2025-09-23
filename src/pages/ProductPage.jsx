import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaginatedProducts, fetchProductsByFilter } from "../features/products/productSlice";
import { fetchAllCategories } from "../features/products/categorySlice";

import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";

import { Search, X } from "lucide-react";

export default function ProductsPage() {
    const dispatch = useDispatch();
    const { filtered = [], pagination = {}, loading, error } = useSelector(
        (state) => state.product
    );
    const { all: categories } = useSelector((state) => state.category);

    const [filters, setFilters] = useState({
        category: null,
        sortDate: "asc",
        sortPrice: "asc",
        minPrice: -1,
        maxPrice: -1,
        search: "",
    });

    useEffect(() => {
        dispatch(fetchAllCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(
            fetchProductsByFilter({
                page: pagination.page || 1,
                limit: pagination.limit || 8,
                ...filters,
            })
        );
    }, [dispatch, filters]);

    const handlePageChange = (page) => {
        dispatch(
            fetchPaginatedProducts({
                page,
                limit: pagination.limit || 8,
                sort: filters.sortPrice || filters.sortDate,
                ...filters,
            })
        );
    };

    const handleSearchChange = (e) => {
        setFilters((prev) => ({ ...prev, search: e.target.value }));
    };

    const clearSearch = () => setFilters((prev) => ({ ...prev, search: "" }));

    const handleSortDateChange = (e) => {
        setFilters((prev) => ({ ...prev, sortDate: e.target.value }));
    };

    const handleSortPriceChange = (e) => {
        setFilters((prev) => ({ ...prev, sortPrice: e.target.value }));
    };

    (loading) && <p className="text-center mt-10">Đang tải sản phẩm...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Lỗi: {error}</p>;

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 py-10 text-center text-white shadow-md">
                <h1 className="text-3xl font-extrabold">Tất cả sản phẩm</h1>
            </div>

            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-6 mt-6 px-4">
                {/* Sidebar */}
                <aside className="md:w-1/4">
                    <FilterSidebar
                        categories={categories}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </aside>

                {/* Content */}
                <div className="flex-1">
                    {/* Thanh tìm kiếm + 2 select */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-3 rounded-xl shadow mb-4 gap-3">
                        {/* Search box */}
                        <div className="flex items-center gap-2 flex-1 bg-gray-50 px-3 py-2 rounded-lg border">
                            <Search className="w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="flex-1 bg-transparent outline-none text-gray-700"
                            />
                            {filters.search && (
                                <button onClick={clearSearch}>
                                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        {/* Select cũ / mới */}
                        <select
                            value={filters.sortDate}
                            onChange={handleSortDateChange}
                            className="border rounded-lg p-2 w-full sm:w-44 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        >
                            <option value="asc">Mới nhất</option>
                            <option value="desc">Cũ nhất</option>
                        </select>

                        {/* Select giá */}
                        <select
                            value={filters.sortPrice}
                            onChange={handleSortPriceChange}
                            className="border rounded-lg p-2 w-full sm:w-44 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        >
                            <option value="">-- Sắp xếp giá --</option>
                            <option value="asc">Giá tăng dần</option>
                            <option value="desc">Giá giảm dần</option>
                        </select>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filtered.length > 0 ? (
                            filtered.map((p) => <ProductCard key={p.id} product={p} />)
                        ) : (
                            <p className="col-span-4 text-center text-gray-500 py-10">
                                Không tìm thấy sản phẩm phù hợp
                            </p>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                totalPages={pagination.totalPages}
                                currentPage={pagination.page}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
