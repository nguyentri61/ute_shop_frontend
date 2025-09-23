import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByCategory } from "../features/products/productSlice";
import { fetchAllCategories } from "../features/products/categorySlice";

import Category from "../components/Category";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

export default function ProductsByCategoryPage() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { all: allCategories, loading: loadingCate } = useSelector(
        (state) => state.category
    );
    const {
        productByCategory = [],
        pagination = {},
        loading,
        error,
    } = useSelector((state) => state.product);

    const [categoryName, setCategoryName] = useState("");

    // Fetch danh mục nếu chưa có
    useEffect(() => {
        if (!allCategories?.length) {
            dispatch(fetchAllCategories());
        }
    }, [dispatch]);

    // Lấy tên danh mục từ categoryId
    useEffect(() => {
        if (allCategories?.length && categoryId) {
            const currentCat = allCategories.find(
                (cat) => String(cat.id) === String(categoryId)
            );
            setCategoryName(currentCat?.name || "");
        }
    }, [allCategories, categoryId]);

    // Fetch sản phẩm
    useEffect(() => {
        if (categoryId) {
            dispatch(fetchProductByCategory({ categoryId, page: 1, limit: 8 }));
        }
    }, [dispatch, categoryId]);

    const handlePageChange = (page) => {
        if (categoryId) {
            dispatch(fetchProductByCategory({ categoryId, page, limit: pagination.limit || 8 }));
        }
    };

    (loading || loadingCate)
        && <p className="text-center mt-10">Đang tải dữ liệu...</p>;

    if (error) {
        return <p className="text-center mt-10 text-red-500">Lỗi: {error}</p>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 py-10 text-center text-white shadow-md">
                <h1 className="text-3xl font-extrabold">
                    {categoryName ? `Danh mục: ${categoryName}` : "Danh mục sản phẩm"}
                </h1>
                <p className="mt-2 text-sm opacity-90">
                    Chọn nhanh danh mục khác ngay bên dưới
                </p>
            </div>


            <Category
                categories={allCategories || []}
                currentCategoryId={categoryId}
                onSelectCategory={(id) => navigate(`/categories/${id}`)}
            />

            {/* Danh sách sản phẩm */}
            <div className="max-w-[1200px] mx-auto p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">
                    {categoryName || "Sản phẩm"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productByCategory.length > 0 ? (
                        productByCategory.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p className="col-span-4 text-center text-gray-500">
                            Không có sản phẩm nào trong danh mục này.
                        </p>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8 mb-12">
                    <Pagination
                        totalPages={pagination.totalPages}
                        currentPage={pagination.page}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <Footer />
        </div>
    );
}
