import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentlyViewed } from "../features/products/recentlyViewedSlice";
import ProductCard from "../components/ProductCard";

export default function RecentlyViewedPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.recentlyViewed);

  useEffect(() => {
    dispatch(fetchRecentlyViewed(12)); // Lấy 12 sản phẩm đã xem gần đây
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sản phẩm đã xem</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Chưa có sản phẩm đã xem</h2>
          <p className="text-gray-600 mb-4">
            Hãy xem một số sản phẩm để chúng xuất hiện ở đây
          </p>
          <a
            href="/"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Khám phá sản phẩm
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}