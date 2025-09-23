import React from "react";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { useDispatch } from "react-redux";
import { addToRecentlyViewed } from "../features/products/recentlyViewedSlice";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!product) return null;
  const {
    id,
    name,
    description,
    price,
    discountPrice,
    createdAt,
    images,
    averageRating,
    reviewCount,
  } = product;

  const imageUrl = images?.[0]?.url || "/placeholder-product.png";
  const isNew = new Date() - new Date(createdAt) < 7 * 24 * 60 * 60 * 1000;
  const sale = discountPrice && discountPrice < price;

  const handleClick = () => {
    if (id) dispatch(addToRecentlyViewed(id));
    navigate(`/products/${id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden w-full relative
                 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
    >
      {/* Nút yêu thích */}
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton
          productId={id}
          className="bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm"
        />
      </div>

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {isNew && (
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </span>
        )}
        {sale && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}
      </div>

      {/* Hình ảnh */}
      <div className="h-48 w-full bg-gray-200" onClick={handleClick}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-product.png";
          }}
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4">
        <h3
          className="text-lg font-semibold mb-1 line-clamp-2 hover:text-indigo-600 transition"
          onClick={handleClick}
        >
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>

        {/* Rating */}
        {averageRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}

        {/* Giá */}
        <div className="flex items-center justify-between">
          <div>
            {sale ? (
              <div className="flex flex-col">
                <span className="text-gray-500 line-through text-sm">
                  {price.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-indigo-600 font-bold">
                  {discountPrice.toLocaleString("vi-VN")}₫
                </span>
              </div>
            ) : (
              <span className="text-indigo-600 font-bold">
                {price.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
