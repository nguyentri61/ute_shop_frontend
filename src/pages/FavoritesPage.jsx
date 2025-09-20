import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../features/products/favoriteSlice";
import ProductCard from "../components/ProductCard";

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const { favorites, loading, error } = useSelector((state) => state.favorite);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sản phẩm yêu thích</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Chưa có sản phẩm yêu thích</h2>
          <p className="text-gray-600 mb-4">
            Hãy thêm sản phẩm vào danh sách yêu thích để xem ở đây
          </p>
          <a
            href="/"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}