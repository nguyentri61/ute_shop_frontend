import React from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Category from "../components/Category";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import ProductSection from "../components/ProductSection";
import { products, newProducts, bestSellers, mostViewed, topDiscounts } from "../data/products";


export default function Home() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <Banner />
            <Category />
            <div className="max-w-[1200px] mx-auto p-6">
                <ProductSection title="08 Sản phẩm mới nhất" products={newProducts} columns={4} />
                <ProductSection title="06 Sản phẩm bán chạy nhất" products={bestSellers} columns={3} />
                <ProductSection title="08 Sản phẩm được xem nhiều nhất" products={mostViewed} columns={4} />
                <ProductSection title="04 Sản phẩm khuyến mãi cao nhất" products={topDiscounts} columns={4} />
            </div>
            <div className="max-w-[1200px] mx-auto">
                <div className="p-6 bg-gray-50 rounded-xl mt-6">
                    <h3 className="text-2xl font-bold mb-6 text-center">Featured Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-8 mb-12">
                <Pagination
                    totalPages={10}
                    currentPage={1}
                    onPageChange={(page) => {
                        console.log("Selected page:", page);
                    }}
                />
            </div>

            <Footer />
        </div>
    );
}

