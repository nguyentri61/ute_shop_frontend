import React from "react";
import OrderItem from "./OrderItem";

const OrderList = ({ products, onQtyChange }) => {
    return (
        <div className="bg-white p-4 rounded-2xl shadow h-[70vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4">Sản phẩm</h2>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {products?.map((p) => (
                    <OrderItem
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        price={p.price}
                        qty={p.qty}
                        image={p.image}
                        description={p.description}
                        onQtyChange={onQtyChange}
                    />

                ))}

                {products.length === 0 && (
                    <p className="text-gray-500 text-center py-6">
                        Giỏ hàng trống
                    </p>
                )}
            </div>
        </div>
    );
};

export default OrderList;
