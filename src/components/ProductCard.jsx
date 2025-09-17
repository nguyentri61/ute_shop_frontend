import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  if (!product) return null;
  const { name, description, price, discountPrice, createdAt, images } =
    product;

  // Hình sản phẩm
  const imageUrl = images?.[0]?.url || "/placeholder.png";

  // Badge NEW <7 ngày
  const isNew = new Date() - new Date(createdAt) < 7 * 24 * 60 * 60 * 1000;

  // Badge SALE nếu có discountPrice
  const sale = discountPrice && discountPrice < price;
  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };
  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col h-full w-full min-w-[16rem]"
    >
      {/* Hình sản phẩm */}
      <div className="relative">
        <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
        {isNew && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </span>
        )}
        {sale && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </span>
        )}
      </div>

      {/* Nội dung */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
            {name}
          </h4>
          {description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Giá */}
        <div className="flex items-center justify-between mb-3">
          {sale ? (
            <div className="flex items-baseline gap-2">
              <span className="text-gray-400 line-through">
                {price.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-blue-600 font-bold text-lg">
                {discountPrice.toLocaleString("vi-VN")}₫
              </span>
            </div>
          ) : (
            <p className="text-blue-600 font-bold text-lg">
              {price.toLocaleString("vi-VN")}₫
            </p>
          )}
        </div>

        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition mt-auto">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}
