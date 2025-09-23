import React from "react";
import OrderItem from "./OrderItem";
import { useNavigate } from "react-router-dom";

const OrderList = ({ products, onIncrease, onDecrease }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg max-h-[100vh] flex flex-col">
            {/* Tiêu đề */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="ri-shopping-bag-3-line text-blue-500 text-2xl"></i>
                Sản phẩm đã chọn
            </h2>

            {/* Danh sách sản phẩm */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {products?.length > 0 ? (
                    products.map((p) => (
                        <OrderItem
                            key={p.id}
                            id={p.id}
                            name={p.name}
                            price={p.price}
                            qty={p.qty}
                            image={p.image}
                            description={p.description}
                            onIncrease={onIncrease}
                            onDecrease={onDecrease}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <img
                            src="/empty-cart.svg"
                            alt="Empty cart"
                            className="w-40 mb-4"
                        />
                        <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg shadow"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;
