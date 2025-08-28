import React from "react";

export default function ProductCard({ product }) {
  if (!product) return null;

  const { name, price, image, isNew, sale, description, rating } = product;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer">
      {/* Hình sản phẩm */}
      <div className="relative">
        {image && (
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover"
          />
        )}

        {/* Badge */}
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

      {/* Nội dung sản phẩm */}
      <div className="p-4 flex flex-col justify-between h-60">
        {/* Tên và mô tả */}
        <h4 className="text-lg font-semibold text-gray-800 mb-1">{name}</h4>
        {description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* Giá và đánh giá */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-blue-600 font-bold text-lg">${price}</p>
          {rating && (
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-gray-700 text-sm">{rating}</span>
            </div>
          )}
        </div>

        {/* Button Add to Cart */}
        <button className="mt-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
