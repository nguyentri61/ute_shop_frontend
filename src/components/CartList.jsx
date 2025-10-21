import React from "react";
import QuantityStepper from "./QuantityStepper";
import { Link } from "react-router-dom";
import {
    toggleSelectItem,
    selectAllItems,
    clearSelection,
} from "../features/order/cartSlice";

/** Utils */
const formatCurrency = (amount) =>
    typeof amount === "number"
        ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
        : "-";

/** Tiny Button component (tách từ MyCartPage) */
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
        secondary:
            "bg-white/70 text-slate-800 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300",
        danger:
            "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500",
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

export default function CartList({
    items,
    selectedCartItemIds,
    loading,
    updatingItemId,
    dispatch,
    handleIncrease,
    handleDecrease,
    handleRemove,
}) {
    if (loading) {
        return (
            <div className="p-6 animate-pulse text-slate-500">Đang tải giỏ hàng...</div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 shadow-inner">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-500">
                        <path d="M6 6h15l-1.5 9h-13z" strokeWidth="1.5" />
                        <circle cx="9" cy="20" r="1.5" />
                        <circle cx="18" cy="20" r="1.5" />
                    </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-800">Giỏ hàng trống</h3>
                <p className="mb-6 max-w-md text-slate-600">
                    Tiếp tục khám phá sản phẩm hấp dẫn và thêm vào giỏ nhé.
                </p>
                <Button as={Link} variant="primary" className="!px-5">
                    <Link to="/">Mua sắm ngay</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header chọn tất cả */}
            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    checked={selectedCartItemIds.length === items.length && items.length > 0}
                    onChange={(e) => {
                        if (e.target.checked) dispatch(selectAllItems());
                        else dispatch(clearSelection());
                    }}
                    className="h-5 w-5 accent-indigo-600 mr-2"
                />
                <span className="text-sm text-slate-700">Chọn tất cả</span>
            </div>

            {/* Danh sách sản phẩm */}
            <ul className="divide-y divide-slate-100">
                {items.map((it) => {
                    const product = it.variant?.product || {};
                    const basePrice = it.variant?.price ?? 0;
                    const price = it.variant?.discountPrice ?? basePrice;
                    const hasDiscount =
                        it.variant?.discountPrice && it.variant.discountPrice < basePrice;

                    return (
                        <li key={it.id} className="py-5 first:pt-0 last:pb-0">
                            <div className="grid grid-cols-[24px_96px_1fr_auto] items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={selectedCartItemIds.includes(it.id)}
                                    onChange={() => dispatch(toggleSelectItem(it.id))}
                                    className="h-5 w-5 accent-indigo-600"
                                />

                                <img
                                    src={product.image ?? "/placeholder-product.png"}
                                    alt={product.name ?? "Sản phẩm"}
                                    className="h-24 w-24 rounded-xl border border-slate-100 object-cover shadow-sm"
                                />

                                <div className="min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-base font-semibold text-slate-900">
                                                {product.name ?? "Sản phẩm"}
                                            </h3>
                                            {it.variant?.name && (
                                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                        {it.variant.name}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="mt-2 flex items-center gap-3">
                                                <span className="text-lg font-bold text-indigo-700">
                                                    {formatCurrency(price)}
                                                </span>
                                                {hasDiscount && (
                                                    <>
                                                        <span className="text-sm text-slate-500 line-through">
                                                            {formatCurrency(basePrice)}
                                                        </span>
                                                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                                            -{Math.round(((basePrice - price) / basePrice) * 100)}%
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-3">
                                        <QuantityStepper
                                            value={it.quantity}
                                            onIncrease={() => handleIncrease(it)}
                                            onDecrease={() => handleDecrease(it)}
                                            disabled={updatingItemId === it.id}
                                        />
                                        <Button
                                            variant="danger"
                                            className="!px-3"
                                            onClick={() => handleRemove(it.id)}
                                            disabled={updatingItemId === it.id}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm text-slate-500">Tổng</div>
                                    <div className="text-lg font-extrabold text-slate-900">
                                        {formatCurrency(price * it.quantity)}
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
