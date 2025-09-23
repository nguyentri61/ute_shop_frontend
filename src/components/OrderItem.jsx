import React from "react";
import QuantitySelector from "./QuantitySelector";

const OrderItem = ({ id, name, qty, price, image, description, onIncrease, onDecrease }) => {
    return (
        <div className="flex items-center gap-4 py-4 border-b last:border-b-0 hover:bg-gray-50 transition rounded-lg">
            {/* Ảnh sản phẩm */}
            <div className="relative">
                <img
                    src={image}
                    alt={name}
                    className="w-20 h-20 object-cover rounded-xl border shadow-sm hover:scale-105 transition-transform duration-200"
                />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{name}</p>
                <p className="text-sm text-gray-500 line-clamp-1">{description}</p>
            </div>

            {/* Bộ chọn số lượng */}
            <div className="w-32 flex justify-center">
                <QuantitySelector
                    value={qty}
                    onIncrease={() => onIncrease(id)}
                    onDecrease={() => onDecrease(id)}
                />
            </div>

            {/* Giá */}
            <div className="w-28 text-right">
                <p className="font-bold text-red-600 text-lg">
                    {(price * qty).toLocaleString()}₫
                </p>
                <p className="text-xs text-gray-400">
                    ({price.toLocaleString()}₫ / sp)
                </p>
            </div>
        </div>
    );
};

export default OrderItem;
