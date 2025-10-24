import React from "react";
import { useNavigate } from "react-router-dom";

/** Utils */
const formatCurrency = (amount) =>
    typeof amount === "number"
        ? new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
        : "-";

/** Nút nhỏ gọn (tái sử dụng từ CartList) */
const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    disabled,
}) => {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary:
            "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm hover:shadow-md hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500",
        danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500",
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default function OrderList({ products = [] }) {
    const navigate = useNavigate();

    if (!products.length) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <img src="/empty-cart.svg" alt="Empty cart" className="w-40 mb-4" />
                <h3 className="mb-2 text-xl font-bold text-slate-800">Giỏ hàng trống</h3>
                <p className="mb-6 max-w-md text-slate-600">
                    Tiếp tục khám phá sản phẩm hấp dẫn và thêm vào giỏ nhé.
                </p>
                <Button variant="primary" onClick={() => navigate("/")}>
                    Mua sắm ngay
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <ul className="divide-y divide-slate-100">
                {products.map((p) => {
                    const basePrice = p.variant?.price ?? p.price ?? 0;
                    const price = p.variant?.discountPrice ?? basePrice;
                    const hasDiscount =
                        p.variant?.discountPrice && p.variant.discountPrice < basePrice;

                    return (
                        <li key={p.id} className="py-4">
                            <div className="grid grid-cols-[96px_1fr_auto] items-center gap-4">
                                {/* Ảnh sản phẩm */}
                                <img
                                    src={p.image || "/placeholder-product.png"}
                                    alt={p.name}
                                    className="h-24 w-24 rounded-xl border border-slate-100 object-cover shadow-sm"
                                    loading="lazy"
                                />

                                {/* Thông tin sản phẩm */}
                                <div className="min-w-0">
                                    <h3 className="truncate text-base font-semibold text-slate-900">
                                        {p.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">{p.description}</p>

                                    <div className="mt-2 flex items-center gap-3">
                                        <span className="text-lg font-bold text-indigo-700">
                                            {formatCurrency(price)}
                                        </span>
                                        {hasDiscount && (
                                            <>
                                                <span className="text-sm text-slate-400 line-through">
                                                    {formatCurrency(basePrice)}
                                                </span>
                                                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                                    -{Math.round(((basePrice - price) / basePrice) * 100)}%
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Hiển thị số lượng */}
                                    <p className="mt-2 text-sm text-slate-600">
                                        Số lượng: <span className="font-semibold">{p.qty}</span>
                                    </p>
                                </div>

                                {/* Tổng tiền */}
                                <div className="text-right">
                                    <div className="text-sm text-slate-500">Tổng</div>
                                    <div className="text-lg font-extrabold text-slate-900">
                                        {formatCurrency(price * p.qty)}
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
