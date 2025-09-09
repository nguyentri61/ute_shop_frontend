import React from "react";
import QuantitySelector from "./QuantitySelector";

const OrderItem = ({ id, name, qty, price, image, description, onIncrease, onDecrease }) => {
    return (
        <div className="flex items-center gap-4 border-b pb-3">
            {/* Ảnh sản phẩm */}
            <img
                src={image}
                alt={name}
                className="w-16 h-16 object-cover rounded-lg border"
            />

            {/* Thông tin sản phẩm */}
            <div className="flex-1">
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500 line-clamp-1">{description}</p>
            </div>

            {/* Bộ chọn số lượng - cột riêng */}
            <div className="w-32 flex justify-center">
                <QuantitySelector
                    value={qty}
                    onIncrease={() => onIncrease(id)}
                    onDecrease={() => onDecrease(id)}
                />
            </div>

            {/* Giá */}
            <p className="font-semibold text-right w-24">
                {(price * qty).toLocaleString()} đ
            </p>
        </div>
    );
};

export default OrderItem;
