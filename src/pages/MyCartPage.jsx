import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, updateQuantity, removeFromCart } from "../features/order/cartSlice";

/** Utils */
const formatCurrency = (amount) =>
    typeof amount === "number"
        ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
        : "-";

/** Tiny UI primitives */
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
        ghost:
            "bg-transparent text-slate-600 hover:bg-slate-100",
        danger:
            "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500",
    };
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

const QuantityStepper = ({ value, onIncrease, onDecrease, disabled }) => (
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden">
        <button
            onClick={onDecrease}
            disabled={disabled}
            className="px-3 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            aria-label="Giảm số lượng"
        >
            −
        </button>
        <div className="min-w-10 text-center px-2 font-semibold text-slate-800 select-none">{value}</div>
        <button
            onClick={onIncrease}
            disabled={disabled}
            className="px-3 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            aria-label="Tăng số lượng"
        >
            +
        </button>
    </div>
);

const Line = () => <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />;

/** Skeletons */
const SkeletonLine = ({ className = "" }) => (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
);

const CartItemSkeleton = () => (
    <div className="grid grid-cols-[96px_1fr_auto] items-center gap-4 py-4">
        <SkeletonLine className="h-24 w-24" />
        <div className="space-y-2">
            <SkeletonLine className="h-5 w-3/4" />
            <SkeletonLine className="h-4 w-1/3" />
            <SkeletonLine className="h-8 w-48" />
        </div>
        <SkeletonLine className="h-6 w-20" />
    </div>
);

export default function MyCartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items = [], loading = false, error = null } = useSelector((state) => state.cart);
    const [updatingItemId, setUpdatingItemId] = useState(null);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const subtotal = useMemo(
        () => items.reduce((sum, it) => sum + ((it.variant?.discountPrice ?? it.variant?.price ?? 0) * it.quantity), 0),
        [items]
    );

    const totalQty = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);

    const freeShipThreshold = 500000; // ví dụ
    const remainingForFreeShip = Math.max(0, freeShipThreshold - subtotal);

    const handleIncrease = async (item) => {
        if (!item.variant) return;
        setUpdatingItemId(item.id);
        try {
            await dispatch(updateQuantity({ cartItemId: item.id, quantity: item.quantity + 1 })).unwrap();
        } catch (err) {
            alert("Lỗi khi cập nhật số lượng: " + err);
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleDecrease = async (item) => {
        if (!item.variant) return;
        const newQty = item.quantity - 1;
        setUpdatingItemId(item.id);
        try {
            if (newQty <= 0) {
                await dispatch(removeFromCart(item.id)).unwrap();
            } else {
                await dispatch(updateQuantity({ cartItemId: item.id, quantity: newQty })).unwrap();
            }
        } catch (err) {
            alert("Lỗi khi cập nhật số lượng: " + err);
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemove = async (id) => {
        setUpdatingItemId(id);
        try {
            await dispatch(removeFromCart(id)).unwrap();
        } catch (err) {
            alert("Lỗi khi xóa sản phẩm: " + err);
        } finally {
            setUpdatingItemId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(120deg,_#eef2ff,_#f8fafc_45%,_#f0f9ff)]/90">
            <div className="mx-auto max-w-6xl px-4 py-10">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Giỏ hàng</span>
                    </h1>
                    {totalQty > 0 && (
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                            {totalQty} sản phẩm
                        </span>
                    )}
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
                        {error}
                    </div>
                )}

                {/* Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
                    {/* Left: list */}
                    <div className="rounded-2xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-xl">
                        <div className="p-6">
                            {loading ? (
                                <>
                                    <CartItemSkeleton />
                                    <Line />
                                    <CartItemSkeleton />
                                    <Line />
                                    <CartItemSkeleton />
                                </>
                            ) : !items || items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 shadow-inner">
                                        {/* cart icon */}
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
                                    <Button as={Link} variant="primary" className="!px-5" onClick={() => { }}>
                                        <Link to="/">Mua sắm ngay</Link>
                                    </Button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {items.map((it) => {
                                        const product = it.variant?.product || {};
                                        const basePrice = it.variant?.price ?? 0;
                                        const price = it.variant?.discountPrice ?? basePrice;
                                        const hasDiscount = it.variant?.discountPrice && it.variant.discountPrice < basePrice;

                                        return (
                                            <li key={it.id} className="py-5 first:pt-0 last:pb-0">
                                                <div className="grid grid-cols-[96px_1fr_auto] items-center gap-4">
                                                    <img
                                                        src={product.image ?? "/placeholder-product.png"}
                                                        alt={product.name ?? "Sản phẩm"}
                                                        className="h-24 w-24 rounded-xl border border-slate-100 object-cover shadow-sm"
                                                        loading="lazy"
                                                    />

                                                    <div className="min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <h3 className="truncate text-base font-semibold text-slate-900">
                                                                    {product.name ?? "Sản phẩm"}
                                                                </h3>
                                                                {/* Variant chips (nếu có) */}
                                                                {it.variant?.name && (
                                                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                                                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                                            {it.variant.name}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                <div className="mt-2 flex items-center gap-3">
                                                                    <span className="text-lg font-bold text-indigo-700">{formatCurrency(price)}</span>
                                                                    {hasDiscount && (
                                                                        <>
                                                                            <span className="text-sm text-slate-500 line-through">{formatCurrency(basePrice)}</span>
                                                                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                                                                -{Math.round(((basePrice - price) / basePrice) * 100)}%
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Remove on mobile stacked below using button at right column */}
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
                            )}
                        </div>
                    </div>

                    {/* Right: summary */}
                    <div className="lg:sticky lg:top-6">
                        <div className="rounded-2xl border border-white/40 bg-white/90 backdrop-blur-xl p-6 shadow-xl">
                            <h2 className="text-lg font-bold text-slate-900">Tóm tắt đơn hàng</h2>
                            <Line />

                            {subtotal > 0 && (
                                <div className="mb-4 overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 p-4 ring-1 ring-emerald-100">
                                    {remainingForFreeShip > 0 ? (
                                        <p className="text-sm text-slate-700">
                                            Mua thêm <span className="font-semibold text-emerald-700">{formatCurrency(remainingForFreeShip)}</span> để được <span className="font-semibold">miễn phí vận chuyển</span>.
                                        </p>
                                    ) : (
                                        <p className="text-sm font-semibold text-emerald-700">Bạn đã được miễn phí vận chuyển 🎉</p>
                                    )}
                                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className="h-full bg-emerald-500"
                                            style={{ width: `${Math.min(100, (subtotal / freeShipThreshold) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between text-slate-700">
                                    <span>Tạm tính</span>
                                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-700">
                                    <span>Phí vận chuyển</span>
                                    <span className="font-medium">{subtotal >= freeShipThreshold ? "0 ₫" : "Tính khi thanh toán"}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-700">
                                    <span>Khuyến mãi</span>
                                    <span className="font-medium">Áp dụng ở bước sau</span>
                                </div>
                                <Line />
                                <div className="flex items-center justify-between text-base">
                                    <span className="font-bold text-slate-900">Tổng cộng</span>
                                    <span className="text-xl font-extrabold text-indigo-700">{formatCurrency(subtotal)}</span>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3">
                                <Button onClick={() => navigate("/checkout")} variant="primary" className="h-12 text-base">
                                    Tiến hành đặt hàng
                                </Button>
                                <Button variant="secondary" className="h-11" onClick={() => navigate("/")}>Tiếp tục mua sắm</Button>
                            </div>

                            <p className="mt-4 text-center text-xs text-slate-500">
                                Thanh toán an toàn. Đổi trả dễ dàng trong 7 ngày.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
