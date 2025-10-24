// src/pages/admin/CouponManagementPage.jsx
import React, { useCallback, useEffect, useState } from "react";
import {
    TagIcon,
    ClockIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCouponStats,
    fetchCouponDistribution,
    fetchExpiringCoupons,
    createCoupons,
    fetchCoupons,
} from "../../features/products/adminCouponSlice";

const AdminVoucher = () => {
    const dispatch = useDispatch();
    const {
        stats,
        distribution,
        expiringCoupons,
        coupons,
        pagination,
        loading,
        error,
        creating,
    } = useSelector((state) => state.adminCoupons);

    const [form, setForm] = useState({
        code: "",
        type: "PRODUCT",
        description: "",
        discount: 0,
        minOrderValue: 0,
        expiredAt: "",
        userId: "",
        quantity: "",
    });
    const [filters, setFilters] = useState({
        q: "",
        type: "",
        status: "",
        page: 1,
        size: 10,
    });

    const reload = useCallback(() => {
        dispatch(fetchCouponStats());
        dispatch(fetchCouponDistribution());
        dispatch(fetchExpiringCoupons());
        dispatch(fetchCoupons(filters));
    }, [dispatch]);

    useEffect(() => {
        reload();
    }, [reload]);

    const palette = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

    const handleCreate = async (e) => {
        e.preventDefault();
        await dispatch(createCoupons(form));

        // reset form sau khi tạo
        setForm({
            code: "",
            type: "PRODUCT",
            description: "",
            discount: 0,
            minOrderValue: 0,
            expiredAt: "",
            userId: "",
            quantity: "",
        });
    };

    // ===============================
    // 🔎 DANH SÁCH & LỌC
    // ===============================


    useEffect(() => {
        dispatch(fetchCoupons(filters));
    }, [dispatch, filters]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (page) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    const formatNumber = (num) =>
        new Intl.NumberFormat("vi-VN").format(num ?? 0);

    const formatCurrency = (num) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(num ?? 0);

    // ===============================
    // 🧱 GIAO DIỆN
    // ===============================
    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    Quản lý mã giảm giá
                </h2>
                <button
                    onClick={() =>
                        document
                            .getElementById("create-form")
                            .scrollIntoView({ behavior: "smooth" })
                    }
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Tạo mã mới
                </button>
            </div>

            {/* THỐNG KÊ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse h-40"
                        />
                    ))
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <p className="text-sm text-gray-600">Tổng số mã</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {formatNumber(stats?.total ?? 0)}
                            </p>
                            <div className="flex items-center mt-2">
                                <TagIcon className="w-5 h-5 text-indigo-600 mr-2" />
                                <span className="text-sm text-gray-500">Đã tạo</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <p className="text-sm text-gray-600">Mã còn hiệu lực</p>
                            <p className="text-3xl font-bold text-green-600">
                                {formatNumber(stats?.active ?? 0)}
                            </p>
                            <div className="flex items-center mt-2">
                                <ClockIcon className="w-5 h-5 text-green-600 mr-2" />
                                <span className="text-sm text-gray-500">
                                    Đã hết hạn: {stats?.expired ?? 0}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <p className="text-sm text-gray-600">Giá trị giảm trung bình</p>
                            <p className="text-3xl font-bold text-orange-600">
                                {formatCurrency(stats?.avgDiscount ?? 0)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Tính trên các mã còn hiệu lực
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <p className="text-sm text-gray-600">Loại phổ biến</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {stats?.mostType ?? "—"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Theo số lượng</p>
                        </div>
                    </>
                )}
            </div>

            {/* BIỂU ĐỒ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phân bố loại coupon */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Phân bố loại mã
                        </h3>
                        {error && <span className="text-sm text-red-600">{String(error)}</span>}
                    </div>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={distribution ?? []}
                                    dataKey="count"
                                    nameKey="type"
                                    outerRadius={90}
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {(distribution ?? []).map((_, i) => (
                                        <Cell key={i} fill={palette[i % palette.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Mã sắp hết hạn */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Mã sắp hết hạn (30 ngày tới)
                        </h3>
                    </div>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={expiringCoupons ?? []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366F1"
                                    fill="#6366F1"
                                    fillOpacity={0.1}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* FORM TẠO COUPON */}
            <div
                id="create-form"
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Tạo mã giảm giá mới
                </h3>

                <form
                    onSubmit={handleCreate}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Mã code</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Loại mã</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="PRODUCT">PRODUCT</option>
                            <option value="SHIPPING">SHIPPING</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-700 mb-1">Mô tả</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Giảm giá</label>
                        <input
                            type="number"
                            min={0}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={form.discount}
                            onChange={(e) =>
                                setForm({ ...form, discount: parseFloat(e.target.value) })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Giá trị đơn hàng tối thiểu
                        </label>
                        <input
                            type="number"
                            min={0}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={form.minOrderValue}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    minOrderValue: parseFloat(e.target.value),
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Ngày hết hạn
                        </label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={form.expiredAt}
                            onChange={(e) => setForm({ ...form, expiredAt: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Số lượng</label>
                        <input
                            type="number"
                            min={1}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={form.quantity}
                            onChange={(e) =>
                                setForm({ ...form, quantity: e.target.value })
                            }
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                            disabled={creating}
                        >
                            {creating ? "Đang tạo..." : "Tạo mã giảm giá"}
                        </button>
                    </div>
                </form>
            </div>

            {/* DANH SÁCH COUPONS */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Danh sách mã giảm giá
                </h3>

                {/* Bộ lọc */}
                <div className="flex flex-wrap gap-3 mb-4">
                    <input
                        placeholder="Tìm theo mã..."
                        className="border rounded-lg p-2"
                        value={filters.q}
                        onChange={(e) => handleFilterChange("q", e.target.value)}
                    />
                    <select
                        className="border rounded-lg p-2"
                        value={filters.type}
                        onChange={(e) => handleFilterChange("type", e.target.value)}
                    >
                        <option value="">Tất cả loại</option>
                        <option value="PRODUCT">PRODUCT</option>
                        <option value="SHIPPING">SHIPPING</option>
                    </select>
                    <select
                        className="border rounded-lg p-2"
                        value={filters.status}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        <option value="active">Hiệu lực</option>
                        <option value="expired">Hết hạn</option>
                    </select>
                </div>

                {/* Bảng dữ liệu */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-center">
                                <th className="p-2 border">Mã code</th>
                                <th className="p-2 border">Loại</th>
                                <th className="p-2 border">Mô tả</th>
                                <th className="p-2 border">Giảm giá</th>
                                <th className="p-2 border">Tối thiểu</th>
                                <th className="p-2 border">Số lượng</th>
                                <th className="p-2 border">Đã sử dụng</th>
                                <th className="p-2 border">Ngày hết hạn</th>
                                <th className="p-2 border">Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(coupons ?? []).map((c, i) => (
                                <tr key={`${c.code}-${i}`} className="text-center hover:bg-gray-50 transition">
                                    <td className="p-2 border font-medium text-gray-800">{c.code}</td>
                                    <td className="p-2 border">{c.type}</td>
                                    <td className="p-2 border text-gray-600">{c.description}</td>
                                    <td className="p-2 border text-indigo-600 font-semibold">
                                        {c.discount > 1 ? formatCurrency(c.discount) : c.discount * 100 + "%"}
                                    </td>
                                    <td className="p-2 border">{formatCurrency(c.minOrderValue)}</td>
                                    <td className="p-2 border text-gray-800">{c.quantity}</td>
                                    <td className="p-2 border text-gray-800">{c.usedCount}</td>
                                    <td className="p-2 border">
                                        {new Date(c.expiredAt).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="p-2 border">
                                        {new Date(c.expiredAt) > new Date() ? (
                                            <span className="text-green-600 font-medium">Còn hạn</span>
                                        ) : (
                                            <span className="text-red-600 font-medium">Hết hạn</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {(!coupons || coupons.length === 0) && (
                                <tr>
                                    <td colSpan="9" className="p-4 text-gray-500 text-center">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>

                {/* Phân trang */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        disabled={filters.page <= 1}
                        onClick={() => handlePageChange(filters.page - 1)}
                        className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <span>
                        Trang {pagination?.page ?? 1} /{" "}
                        {Math.ceil((pagination?.total ?? 1) / (pagination?.size ?? 10)) || 1}
                    </span>
                    <button
                        disabled={
                            filters.page >=
                            Math.ceil((pagination?.total ?? 1) / (pagination?.size ?? 10))
                        }
                        onClick={() => handlePageChange(filters.page + 1)}
                        className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminVoucher;
