import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../components/Banner";
import Category from "../components/Category";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import ProductSection from "../components/ProductSection";

import {
    fetchPaginatedProducts,
    fetchNewestProducts,
    fetchBestSellingProducts,
    fetchMostViewedProducts,
    fetchTopDiscountProducts,
} from "../features/products/productSlice";

import {
    fetchAllCategories
} from "../features/products/categorySlice"

export default function Home() {
    const dispatch = useDispatch();

    const { all: allCategories, loading: loadingCate, error: errorCate } = useSelector((state) => state.category);

    const {
        paginated,
        pagination,
        newest,
        bestSelling,
        mostViewed,
        topDiscount,
        loading,
        error,
    } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(fetchAllCategories());
        dispatch(fetchPaginatedProducts({ page: 1, limit: 8 }));
        dispatch(fetchNewestProducts());
        dispatch(fetchBestSellingProducts());
        dispatch(fetchMostViewedProducts());
        dispatch(fetchTopDiscountProducts());
    }, [dispatch]);

    const handlePageChange = (page) => {
        dispatch(fetchPaginatedProducts({ page, limit: pagination.limit || 8 }));
    };
    if (error || errorCate) return <p className="text-center mt-10 text-red-500">Lỗi: {error}</p>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <Banner />
            <Category categories={allCategories || []} />

            <div className="max-w-[1200px] mx-auto p-6">
                <ProductSection title="08 Sản phẩm mới nhất" products={newest} columns={4} />
                <ProductSection title="06 Sản phẩm bán chạy nhất" products={bestSelling} columns={3} />
                <ProductSection title="08 Sản phẩm được xem nhiều nhất" products={mostViewed} columns={4} />
                <ProductSection title="04 Sản phẩm khuyến mãi cao nhất" products={topDiscount} columns={4} />
            </div>

            <div className="max-w-[1200px] mx-auto">
                <div className="p-6 bg-gray-50 rounded-xl mt-6">
                    <h3 className="text-2xl font-bold mb-6 text-center">Featured Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginated.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-8 mb-12">
                <Pagination
                    totalPages={pagination.totalPages || 1}
                    currentPage={pagination.page || 1}
                    onPageChange={handlePageChange}
                />
            </div>

            <Footer />
        </div>
    );
}
