import React from 'react';
import {
    ShoppingBagIcon,
    CubeIcon,
    UsersIcon,
    ChartBarIcon,
    ArrowUpIcon,
    ArrowDownIcon,
} from '@heroicons/react/24/outline';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const DashboardPage = () => {
    // Sample data for charts
    const salesData = [
        { name: 'T2', sales: 15000000, orders: 45 },
        { name: 'T3', sales: 22000000, orders: 67 },
        { name: 'T4', sales: 18000000, orders: 54 },
        { name: 'T5', sales: 28000000, orders: 82 },
        { name: 'T6', sales: 35000000, orders: 95 },
        { name: 'T7', sales: 42000000, orders: 120 },
        { name: 'CN', sales: 38000000, orders: 110 }
    ];

    const categoryData = [
        { name: 'Điện thoại', value: 45, color: '#0088FE' },
        { name: 'Laptop', value: 30, color: '#00C49F' },
        { name: 'Phụ kiện', value: 15, color: '#FFBB28' },
        { name: 'Tablet', value: 10, color: '#FF8042' }
    ];

    const recentActivity = [
        { id: 1, action: 'Đơn hàng mới', detail: 'ORD001 - iPhone 15 Pro', time: '5 phút trước', type: 'order' },
        { id: 2, action: 'Sản phẩm hết hàng', detail: 'MacBook Air M3', time: '10 phút trước', type: 'warning' },
        { id: 3, action: 'Khách hàng mới', detail: 'Nguyễn Văn A đã đăng ký', time: '15 phút trước', type: 'user' },
        { id: 4, action: 'Thanh toán thành công', detail: 'ORD002 - Samsung Galaxy S24', time: '20 phút trước', type: 'payment' },
        { id: 5, action: 'Đánh giá mới', detail: '5 sao cho AirPods Pro', time: '25 phút trước', type: 'review' }
    ];

    const topProducts = [
        { id: 1, name: 'iPhone 15 Pro Max', sold: 156, revenue: 468000000, trend: 'up' },
        { id: 2, name: 'Samsung Galaxy S24', sold: 134, revenue: 335000000, trend: 'up' },
        { id: 3, name: 'MacBook Air M3', sold: 89, revenue: 267000000, trend: 'down' },
        { id: 4, name: 'iPad Pro 2024', sold: 67, revenue: 167500000, trend: 'up' },
        { id: 5, name: 'AirPods Pro 2', sold: 234, revenue: 117000000, trend: 'up' }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                            <p className="text-3xl font-bold text-gray-900">1,234</p>
                            <div className="flex items-center mt-2">
                                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+12% từ tháng trước</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
                            <p className="text-3xl font-bold text-gray-900">567</p>
                            <div className="flex items-center mt-2">
                                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+5% từ tháng trước</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CubeIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Người dùng</p>
                            <p className="text-3xl font-bold text-gray-900">890</p>
                            <div className="flex items-center mt-2">
                                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+8% từ tháng trước</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <UsersIcon className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                            <p className="text-3xl font-bold text-gray-900">₫198M</p>
                            <div className="flex items-center mt-2">
                                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+15% từ tháng trước</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <ChartBarIcon className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
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
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                    fillOpacity={0.1}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Phân bố danh mục</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Products */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Sản phẩm bán chạy</h3>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                                        <p className="text-sm text-gray-600">{formatNumber(product.sold)} đã bán</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                                    <div className="flex items-center justify-end mt-1">
                                        {product.trend === 'up' ? (
                                            <ArrowUpIcon className="w-3 h-3 text-green-500 mr-1" />
                                        ) : (
                                            <ArrowDownIcon className="w-3 h-3 text-red-500 mr-1" />
                                        )}
                                        <span className={`text-sm ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            Xu hướng
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Hoạt động gần đây</h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${activity.type === 'order' ? 'bg-blue-100 text-blue-800' :
                                    activity.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                        activity.type === 'user' ? 'bg-green-100 text-green-800' :
                                            activity.type === 'payment' ? 'bg-purple-100 text-purple-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}>
                                    {activity.type === 'order' ? '📦' :
                                        activity.type === 'warning' ? '⚠️' :
                                            activity.type === 'user' ? '👤' :
                                                activity.type === 'payment' ? '💳' : '⭐'}
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