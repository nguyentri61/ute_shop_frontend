// src/pages/admin/DashboardPage.jsx
import React, { useEffect } from 'react';
import {
    ShoppingBagIcon, CubeIcon, UsersIcon, ChartBarIcon,
    ArrowUpIcon, ArrowDownIcon,
} from '@heroicons/react/24/outline';
import {
    ResponsiveContainer, AreaChart, Area,
    CartesianGrid, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchDashboardStats,
    fetchWeeklySales,
    fetchCategoryShare
} from '../../features/admin/dashboardStatsSlice';
import { fetchBestSellingProducts } from '../../features/products/productSlice';

const DashboardPage = () => {
    const dispatch = useDispatch();

    // Stats cards
    const { stats } = useSelector((state) => state.dashboardStats);

    // Weekly sales (Area chart)
    const {
        weeklySales, weeklyLoading, weeklyError
    } = useSelector((state) => state.dashboardStats);

    // Category share (Pie chart)
    const {
        categoryShare, categoryLoading, categoryError
    } = useSelector((state) => state.dashboardStats);

    // Top selling
    const {
        bestSelling,
        loading: productLoading,
        error: productError,
    } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchWeeklySales({ status: 'DELIVERED' }));
        dispatch(fetchCategoryShare({ range: '30d', status: 'DELIVERED' })); // 30 ngày gần nhất
        dispatch(fetchBestSellingProducts());
    }, [dispatch]);

    const recentActivity = [
        { id: 1, action: 'Đơn hàng mới', detail: 'ORD001 - iPhone 15 Pro', time: '5 phút trước', type: 'order' },
        { id: 2, action: 'Sản phẩm hết hàng', detail: 'MacBook Air M3', time: '10 phút trước', type: 'warning' },
        { id: 3, action: 'Khách hàng mới', detail: 'Nguyễn Văn A đã đăng ký', time: '15 phút trước', type: 'user' },
        { id: 4, action: 'Thanh toán thành công', detail: 'ORD002 - Samsung Galaxy S24', time: '20 phút trước', type: 'payment' },
        { id: 5, action: 'Đánh giá mới', detail: '5 sao cho AirPods Pro', time: '25 phút trước', type: 'review' }
    ];

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount ?? 0);

    const formatNumber = (num) =>
        new Intl.NumberFormat('vi-VN').format(num ?? 0);

    const renderPercent = (percent) => {
        if (percent > 0) return `+${percent}% từ tháng trước`;
        if (percent < 0) return `-${Math.abs(percent)}% từ tháng trước`;
        return `0% từ tháng trước`;
    };

    const palette = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A78BFA', '#F472B6', '#34D399', '#F59E0B'];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats ? (
                    <>
                        {/* Orders */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.orders?.total}</p>
                                    <p className="text-sm text-gray-500 mt-1">Tháng này: {stats?.orders?.thisMonth}</p>
                                    <p className="text-sm text-gray-500">Tháng trước: {stats?.orders?.lastMonth}</p>
                                    <div className="flex items-center mt-2">
                                        {stats?.orders?.percent >= 0 ? (
                                            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                        ) : (
                                            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                                        )}
                                        <span className={`text-sm ${stats?.orders?.percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {renderPercent(stats?.orders?.percent)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.products?.total}</p>
                                    <p className="text-sm text-gray-500 mt-1">Tháng này: {stats?.products?.thisMonth}</p>
                                    <p className="text-sm text-gray-500">Tháng trước: {stats?.products?.lastMonth}</p>
                                    <div className="flex items-center mt-2">
                                        {stats?.products?.percent >= 0 ? (
                                            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                        ) : (
                                            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                                        )}
                                        <span className={`text-sm ${stats?.products?.percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {renderPercent(stats?.products?.percent)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CubeIcon className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        {/* Users */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Người dùng</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.users?.total}</p>
                                    <p className="text-sm text-gray-500 mt-1">Tháng này: {stats?.users?.thisMonth}</p>
                                    <p className="text-sm text-gray-500">Tháng trước: {stats?.users?.lastMonth}</p>
                                    <div className="flex items-center mt-2">
                                        {stats?.users?.percent >= 0 ? (
                                            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                        ) : (
                                            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                                        )}
                                        <span className={`text-sm ${stats?.users?.percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {renderPercent(stats?.users?.percent)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <UsersIcon className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        {/* Revenue */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.revenue?.total)}</p>
                                    <p className="text-sm text-gray-500 mt-1">Tháng này: {formatCurrency(stats?.revenue?.thisMonth)}</p>
                                    <p className="text-sm text-gray-500">Tháng trước: {formatCurrency(stats?.revenue?.lastMonth)}</p>
                                    <div className="flex items-center mt-2">
                                        {stats?.revenue?.percent >= 0 ? (
                                            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                        ) : (
                                            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                                        )}
                                        <span className={`text-sm ${stats?.revenue?.percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {renderPercent(stats?.revenue?.percent)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <ChartBarIcon className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // skeleton
                    <>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse h-40" />
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse h-40" />
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse h-40" />
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse h-40" />
                    </>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Doanh thu tuần</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-indigo-500 rounded mr-2"></div>
                                <span>Doanh thu</span>
                            </div>
                        </div>
                    </div>

                    {weeklyError && (
                        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                            Không tải được doanh thu tuần: {String(weeklyError?.message || weeklyError)}
                        </div>
                    )}

                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            {weeklyLoading ? (
                                <div className="w-full h-full animate-pulse bg-gray-100 rounded" />
                            ) : (
                                <AreaChart data={weeklySales}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value, key) => [
                                            key === 'sales'
                                                ? formatCurrency(value)
                                                : new Intl.NumberFormat('vi-VN').format(value),
                                            key === 'sales' ? 'Doanh thu' : 'Đơn hàng',
                                        ]}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Phân bố danh mục (30 ngày)</h3>
                        {categoryError && (
                            <span className="text-sm text-red-600">Lỗi: {String(categoryError?.message || categoryError)}</span>
                        )}
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            {categoryLoading ? (
                                <div className="w-full h-full animate-pulse bg-gray-100 rounded" />
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={(categoryShare ?? []).map((c, i) => ({
                                            name: c.name,
                                            value: c.value, // doanh thu
                                            color: palette[i % palette.length],
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {(categoryShare ?? []).map((_, i) => (
                                            <Cell key={`cell-${i}`} fill={palette[i % palette.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val), 'Doanh thu']}
                                    />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Products */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Sản phẩm bán chạy</h3>

                    {productError && (
                        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                            Không tải được danh sách: {String(productError)}
                        </div>
                    )}

                    {productLoading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(bestSelling ?? []).map((product, index) => (
                                <div
                                    key={product.id ?? index}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                {product.name ?? product.productName ?? 'Sản phẩm'}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {formatNumber(product.sold ?? product.totalSold ?? 0)} đã bán
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(product.variantDiscountPrice ?? product.discountPrice ?? product.price ?? 0)}
                                        </p>
                                        {/* Giá giảm (thay cho khối xu hướng) */}
                                        <div className="flex items-center justify-end mt-1">
                                            {(() => {
                                                const sale =
                                                    product?.variantDiscountPrice ??
                                                    product?.discountPrice ??
                                                    product?.variantPrice ??
                                                    product?.price ?? 0;

                                                const base =
                                                    product?.variantPrice ??
                                                    product?.price ??
                                                    product?.variantDiscountPrice ??
                                                    product?.discountPrice ?? 0;

                                                const hasDiscount = sale > 0 && base > 0 && sale < base;
                                                const percent = hasDiscount ? Math.round(((base - sale) / base) * 100) : 0;

                                                return hasDiscount ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs line-through text-gray-400">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(base)}
                                                        </span>
                                                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                                                            -{percent}%
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">—</span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(!bestSelling || bestSelling.length === 0) && (
                                <div className="text-sm text-gray-500">Chưa có dữ liệu sản phẩm bán chạy.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Hoạt động gần đây</h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${activity.type === 'order'
                                            ? 'bg-blue-100 text-blue-800'
                                            : activity.type === 'warning'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : activity.type === 'user'
                                                    ? 'bg-green-100 text-green-800'
                                                    : activity.type === 'payment'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {activity.type === 'order'
                                        ? '📦'
                                        : activity.type === 'warning'
                                            ? '⚠️'
                                            : activity.type === 'user'
                                                ? '👤'
                                                : activity.type === 'payment'
                                                    ? '💳'
                                                    : '⭐'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-600 truncate">{activity.detail}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        Xem tất cả hoạt động
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Thao tác nhanh</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                        <ShoppingBagIcon className="w-6 h-6 text-indigo-600 mb-2" />
                        <p className="font-medium text-gray-900">Tạo đơn hàng</p>
                        <p className="text-sm text-gray-600">Thêm đơn hàng mới</p>
                    </button>

                    <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                        <CubeIcon className="w-6 h-6 text-green-600 mb-2" />
                        <p className="font-medium text-gray-900">Thêm sản phẩm</p>
                        <p className="text-sm text-gray-600">Nhập sản phẩm mới</p>
                    </button>

                    <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                        <UsersIcon className="w-6 h-6 text-purple-600 mb-2" />
                        <p className="font-medium text-gray-900">Quản lý khách hàng</p>
                        <p className="text-sm text-gray-600">Xem danh sách khách hàng</p>
                    </button>

                    <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
                        <ChartBarIcon className="w-6 h-6 text-orange-600 mb-2" />
                        <p className="font-medium text-gray-900">Xem báo cáo</p>
                        <p className="text-sm text-gray-600">Thống kê chi tiết</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
