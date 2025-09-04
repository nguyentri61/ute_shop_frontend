// src/pages/MyOrdersPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, cancelOrder as apiCancelOrder } from "../service/api.order.service"; // giữ đường dẫn như bạn dùng

/* Reuse UI primitives giống style Profile */
const Badge = ({ children, variant = "default" }) => {
    const variants = {
        default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700",
        pending: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800",
        confirmed: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
        delivered: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800",
        cancelled: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    };
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${variants[variant] ?? variants.default}`}>
            {children}
        </span>
    );
};

const ActionButton = ({ onClick, variant = "primary", icon, children, className = "", disabled = false, loading = false, type = "button" }) => {
    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
        danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 ${variants[variant]} ${className}`}
        >
            {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9" />
                </svg>
            ) : icon}
            {children}
        </button>
    );
};

function formatCurrency(amount) {
    if (typeof amount !== "number") return "-";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function formatDate(iso) {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const [flash, setFlash] = useState(null); // { type: 'success'|'error', message }

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (flash) {
            const t = setTimeout(() => setFlash(null), 3000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    async function loadOrders() {
        setLoading(true);
        setError(null);
        try {
            const res = await getMyOrders();
            const payload = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
            setOrders(payload);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || err?.message || "Có lỗi khi tải đơn hàng.");
        } finally {
            setLoading(false);
        }
    }

    function computeOrderTotal(order) {
        if (typeof order?.total === "number" && !Number.isNaN(order.total)) return order.total;
        return (order.items || []).reduce((s, it) => {
            const price = it?.product?.discountPrice ?? it?.product?.price ?? 0;
            const qty = Number(it.quantity) || 0;
            return s + price * qty;
        }, 0);
    }

    function totalItemsCount(order) {
        return (order.items || []).reduce((s, it) => s + (Number(it.quantity) || 0), 0);
    }

    async function handleCancel(orderId) {
        // modal/confirm kiểu UI
        const ok = window.confirm("Bạn có chắc chắn muốn huỷ đơn hàng này?");
        if (!ok) return;

        setCancellingId(orderId);
        setError(null);
        try {
            await apiCancelOrder(orderId);
            // cập nhật local state
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)));
            setFlash({ type: "success", message: "Huỷ đơn thành công" });
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || err?.message || "Huỷ đơn thất bại";
            setFlash({ type: "error", message: msg });
        } finally {
            setCancellingId(null);
        }
    }

    /* UI */

    // Skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-semibold">Đơn hàng của tôi</h1>
                        <p className="text-sm text-gray-600">Danh sách và trạng thái các đơn hàng đã đặt</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 bg-white rounded-2xl shadow-sm animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/5 mb-3" />
                                <div className="h-3 bg-gray-200 rounded w-2/5 mb-4" />
                                <div className="flex gap-3">
                                    <div className="w-20 h-20 bg-gray-200 rounded" />
                                    <div className="flex-1">
                                        <div className="h-3 bg-gray-200 rounded mb-2" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Flash */}
                {flash && (
                    <div className={`fixed top-6 right-6 z-50 rounded-lg px-5 py-3 shadow-lg ${flash.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                        {flash.message}
                    </div>
                )}

                <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">Đơn hàng của tôi</h1>
                        <p className="text-sm text-gray-600 mt-1">Quản lý và xem chi tiết các đơn hàng đã đặt</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadOrders}
                            className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
                            aria-label="Làm mới danh sách"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12a9 9 0 10-3 6.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Làm mới
                        </button>
                        <Link to="/" className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">Mua sắm ngay</Link>
                    </div>
                </header>

                {error && (
                    <div className="mb-4 p-3 rounded border bg-red-50 text-red-700">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white/60 rounded-2xl p-8">
                        <img src="/empty-orders-illustration.svg" alt="No orders" className="mx-auto mb-4 w-48 opacity-80" />
                        <p className="text-lg font-medium mb-2">Bạn chưa có đơn hàng nào</p>
                        <p className="text-sm text-gray-500 mb-4">Bắt đầu mua sắm để tạo đơn đầu tiên của bạn.</p>
                        <Link to="/" className="px-5 py-2 bg-green-600 text-white rounded-md">Bắt đầu mua sắm</Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {orders.map((order) => {
                            const total = computeOrderTotal(order);
                            const itemCount = totalItemsCount(order);
                            const isExpanded = expandedOrderId === order.id;
                            const status = (order.status || "pending").toLowerCase();

                            return (
                                <article key={order.id} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-sm font-medium truncate">Mã: <span className="font-semibold text-gray-800">{order.id}</span></h3>
                                                <Badge variant={status}>{status === "pending" ? "Đang xử lý" : status === "confirmed" ? "Đã xác nhận" : status === "delivered" ? "Đã giao" : status === "cancelled" ? "Đã huỷ" : status}</Badge>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">Ngày đặt: <span className="text-gray-700 font-medium">{formatDate(order.createdAt)}</span></p>
                                            <p className="text-xs text-gray-500">Sản phẩm: <span className="text-gray-700 font-medium">{itemCount}</span></p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Tổng</p>
                                            <p className="text-lg font-semibold">{formatCurrency(total)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex items-center gap-3 overflow-x-auto py-1">
                                            {(order.items || []).slice(0, 6).map((it) => (
                                                <div key={it.id} className="w-20 flex-shrink-0 text-center">
                                                    <img src={it.product?.image} alt={it.product?.name} className="w-16 h-16 object-cover rounded-md mx-auto border" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-product.png"; }} />
                                                    <p className="text-xs text-gray-600 mt-1 truncate">{it.product?.name}</p>
                                                    <div className="text-xs text-gray-700 font-medium">{it.quantity}×</div>
                                                </div>
                                            ))}
                                            {(order.items || []).length > 6 && <div className="w-20 h-24 flex items-center justify-center text-sm text-gray-500">+{(order.items || []).length - 6}</div>}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <ActionButton onClick={() => setExpandedOrderId(isExpanded ? null : order.id)} variant="secondary">
                                                {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                                            </ActionButton>

                                            <Link to={`/orders/${order.id}`} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                                Chi tiết
                                            </Link>
                                        </div>

                                        <div>
                                            {order.status === "pending" && (
                                                <ActionButton
                                                    onClick={() => handleCancel(order.id)}
                                                    variant="danger"
                                                    loading={cancellingId === order.id}
                                                    disabled={cancellingId === order.id}
                                                >
                                                    {cancellingId === order.id ? "Đang huỷ..." : "Huỷ đơn"}
                                                </ActionButton>
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t text-sm text-gray-700">
                                            <ul className="space-y-3 max-h-52 overflow-auto pr-2">
                                                {(order.items || []).map((it) => {
                                                    const product = it.product || {};
                                                    const price = product.discountPrice ?? product.price ?? 0;
                                                    const subtotal = price * (Number(it.quantity) || 0);
                                                    return (
                                                        <li key={it.id} className="flex items-center gap-3">
                                                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-product.png"; }} />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium truncate">{product.name}</div>
                                                                <div className="text-xs text-gray-500">{formatCurrency(price)} × {it.quantity}</div>
                                                            </div>
                                                            <div className="text-right font-medium">{formatCurrency(subtotal)}</div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>

                                            <div className="mt-3 text-right text-sm text-gray-600">
                                                <div>Tạm tính: <span className="font-semibold text-gray-800">{formatCurrency(total)}</span></div>
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
