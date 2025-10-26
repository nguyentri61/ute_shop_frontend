// src/components/admin/AdminOrderList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../features/admin/adminOrderSlice";
import toast from "react-hot-toast";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  PencilIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const AdminOrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, updateLoading, updateError, updateSuccess } =
    useSelector((state) => state.adminOrder);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Cập nhật trạng thái đơn hàng thành công", {
        icon: "✅",
      });
    }
    if (updateError) {
      toast.error(updateError, {
        icon: "❌",
      });
    }
  }, [updateSuccess, updateError]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Định nghĩa các trạng thái đơn hàng
  const orderStatuses = [
    {
      value: "NEW",
      label: "Đơn hàng mới",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      dotColor: "bg-amber-400",
    },
    {
      value: "CONFIRMED",
      label: "Đã xác nhận",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      dotColor: "bg-blue-400",
    },
    {
      value: "PREPARING",
      label: "Đang chuẩn bị hàng",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dotColor: "bg-yellow-400",
    },
    {
      value: "SHIPPING",
      label: "Đang giao hàng",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      dotColor: "bg-purple-400",
    },
    {
      value: "DELIVERED",
      label: "Đã giao thành công",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      dotColor: "bg-emerald-400",
    },
    {
      value: "CANCELLED",
      label: "Đã hủy",
      color: "bg-red-100 text-red-800 border-red-200",
      dotColor: "bg-red-400",
    },
    {
      value: "CANCEL_REQUEST",
      label: "Yêu cầu hủy",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      dotColor: "bg-orange-400",
    },
  ];

  // Hàm lấy label từ value
  const getStatusLabel = (statusValue) => {
    const status = orderStatuses.find((s) => s.value === statusValue);
    return status ? status.label : statusValue;
  };

  // Hàm lấy màu từ value
  const getStatusStyle = (statusValue) => {
    const status = orderStatuses.find((s) => s.value === statusValue);
    return (
      status || {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        dotColor: "bg-gray-400",
      }
    );
  };

  // Quy tắc cho phép chọn trạng thái:
  // - Không cho chọn các trạng thái "trước" trạng thái hiện tại (không đi lùi)
  // - Chỉ cho chọn trạng thái tiến 1 bước (index + 1)
  // - Ngoại lệ: các trạng thái liên quan hủy ("CANCELLED", "CANCEL_REQUEST") có thể chọn bất cứ lúc nào
  const canSelectStatus = (current, target) => {
    if (!current || !target) return true;
    if (current === target) return false;

    // Nếu đã hoàn thành hoặc đã hủy -> không cho thay đổi nữa
    const immutableCurrent = ["DELIVERED", "CANCELLED"];
    if (immutableCurrent.includes(current)) return false;

    const cancelSteps = ["CANCELLED", "CANCEL_REQUEST"];
    // cho phép chuyển sang huỷ (hoặc yêu cầu huỷ) nếu hiện tại chưa ở trạng thái bất biến
    if (cancelSteps.includes(target)) return true;

    const idxCurrent = orderStatuses.findIndex((s) => s.value === current);
    const idxTarget = orderStatuses.findIndex((s) => s.value === target);
    if (idxTarget === -1 || idxCurrent === -1) return false;
    // không cho chọn trạng thái trước (không đi lùi)
    if (idxTarget < idxCurrent) return false;
    // chỉ cho tiến một bước
    return idxTarget === idxCurrent + 1;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Filter và search orders
  const filteredOrders =
    orders
      ?.filter((order) => {
        const matchesStatus =
          filterStatus === "all" || order.status === filterStatus;
        const matchesSearch =
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.user?.fullName || order.user?.email || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.phone.includes(searchTerm);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest")
          return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "highest") return b.totalPrice - a.totalPrice;
        if (sortBy === "lowest") return a.totalPrice - b.totalPrice;
        return 0;
      }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h3 className="font-medium">Có lỗi xảy ra</h3>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header với stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold text-blue-900">
            {orders?.length || 0}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800">
            Đã giao thành công
          </h3>
          <p className="text-2xl font-bold text-green-900">
            {orders?.filter((o) => o.status === "DELIVERED").length || 0}
          </p>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800">Đang xử lý</h3>
          <p className="text-2xl font-bold text-yellow-900">
            {orders?.filter((o) =>
              ["NEW", "CONFIRMED", "PREPARING", "SHIPPING"].includes(o.status)
            ).length || 0}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-800">
            Tổng doanh thu
          </h3>
          <p className="text-2xl font-bold text-purple-900">
            {formatCurrency(
              orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0
            )}
          </p>
        </div>
      </div>

      {/* Filters và Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter by status */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              {orderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="highest">Giá cao nhất</option>
              <option value="lowest">Giá thấp nhất</option>
            </select>
          </div>

          {/* Export button */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.09M7 13h10v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Không có đơn hàng
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Không tìm thấy đơn hàng nào phù hợp với bộ lọc"
                : "Chưa có đơn hàng nào trong hệ thống"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            #{order.id.slice(0, 8)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {(
                                  order.user?.fullName ||
                                  order.user?.email ||
                                  "U"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.user?.fullName ||
                                order.user?.email ||
                                "Khách hàng"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(order.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              getStatusStyle(order.status).dotColor
                            }`}
                          ></div>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${
                              getStatusStyle(order.status).color
                            }`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                          >
                            <EyeIcon className="w-3 h-3 mr-1" />
                            {expandedOrderId === order.id ? "Ẩn" : "Xem"}
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <PencilIcon className="w-3 h-3 mr-1" />
                            Sửa
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Chi tiết đơn hàng khi mở rộng */}
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="px-6 py-6">
                          <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="text-lg font-semibold text-gray-900">
                                Chi tiết đơn hàng #{order.id.slice(0, 8)}
                              </h4>
                              <button
                                onClick={() => toggleOrderDetails(order.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <ChevronUpIcon className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                              {/* Thông tin giao hàng */}
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h5 className="font-semibold text-blue-900 mb-3 flex items-center">
                                  <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  Thông tin giao hàng
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      Địa chỉ:
                                    </span>
                                    <p className="text-gray-900 mt-1">
                                      {order.address}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      Số điện thoại:
                                    </span>
                                    <p className="text-gray-900">
                                      {order.phone}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Thông tin đơn hàng */}
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h5 className="font-semibold text-green-900 mb-3 flex items-center">
                                  <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H9a2 2 0 01-2-2v-5z"
                                    />
                                  </svg>
                                  Thông tin đơn hàng
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-700">
                                      Ngày đặt:
                                    </span>
                                    <span className="font-medium">
                                      {formatDate(order.createdAt)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-700">
                                      Số lượng sản phẩm:
                                    </span>
                                    <span className="font-medium">
                                      {order.items?.length || 0}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-700">
                                      Phương thức thanh toán:
                                    </span>
                                    <span className="font-medium">COD</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className="mb-6">
                              <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                  />
                                </svg>
                                Sản phẩm đã đặt
                              </h5>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                  {/* Danh sách sản phẩm */}
                                  <div className="space-y-3">
                                    {order.items?.map((item, index) => (
                                      <div
                                        key={item.id || index}
                                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                                      >
                                        <div className="flex items-center space-x-4">
                                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <svg
                                              className="w-6 h-6 text-gray-400"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                              />
                                            </svg>
                                          </div>
                                          <div>
                                            <h6 className="font-medium text-gray-900">
                                              {item.product?.name || "Sản phẩm"}
                                            </h6>
                                            <p className="text-sm text-gray-500">
                                              Số lượng: {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-semibold text-gray-900">
                                            {formatCurrency(
                                              (item.product?.discountPrice ||
                                                item.product?.price ||
                                                0) * item.quantity
                                            )}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {formatCurrency(
                                              item.product?.discountPrice ||
                                                item.product?.price ||
                                                0
                                            )}{" "}
                                            x {item.quantity}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Tổng hợp phí & giảm giá */}
                                  <div className="mt-6 border-t border-gray-200 pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Tạm tính
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {formatCurrency(order.subTotal || 0)}
                                      </span>
                                    </div>

                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Phí vận chuyển
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {formatCurrency(order.shippingFee || 0)}
                                      </span>
                                    </div>

                                    {order.shippingDiscount > 0 && (
                                      <div className="flex justify-between text-emerald-600">
                                        <span>Giảm phí vận chuyển</span>
                                        <span>
                                          -
                                          {formatCurrency(
                                            order.shippingDiscount
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {order.productDiscount > 0 && (
                                      <div className="flex justify-between text-emerald-600">
                                        <span>Giảm giá sản phẩm</span>
                                        <span>
                                          -
                                          {formatCurrency(
                                            order.productDiscount
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {/* Tổng cộng */}
                                    <div className="flex justify-between border-t border-gray-200 pt-3 mt-2">
                                      <span className="text-base font-semibold text-gray-900">
                                        Tổng cộng
                                      </span>
                                      <span className="text-lg font-bold text-indigo-700">
                                        {formatCurrency(order.total || 0)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="border-t border-gray-200 mt-4 pt-4">
                                  <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Tổng cộng:</span>
                                    <span className="text-indigo-600">
                                      {formatCurrency(order.total)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Cập nhật trạng thái */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <h5 className="font-semibold text-yellow-900 mb-3 flex items-center">
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                                Cập nhật trạng thái đơn hàng
                              </h5>
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                {orderStatuses.map((status) => {
                                  const isCurrentStatus =
                                    order.status === status.value;
                                  const allowed = canSelectStatus(
                                    order.status,
                                    status.value
                                  );
                                  const disabled =
                                    !allowed ||
                                    isCurrentStatus ||
                                    updateLoading;
                                  return (
                                    <button
                                      key={status.value}
                                      onClick={() =>
                                        !disabled &&
                                        handleStatusChange(
                                          order.id,
                                          status.value
                                        )
                                      }
                                      disabled={disabled}
                                      title={
                                        isCurrentStatus
                                          ? "Đang ở trạng thái này"
                                          : !allowed
                                          ? "Chỉ có thể chuyển 1 bước tiếp theo (hoặc hủy)"
                                          : ""
                                      }
                                      className={`relative px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                                        status.color
                                      } ${
                                        disabled
                                          ? "opacity-50 cursor-not-allowed"
                                          : "hover:shadow-md hover:scale-105"
                                      }`}
                                    >
                                      {isCurrentStatus && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white" />
                                      )}
                                      <div
                                        className={`w-2 h-2 rounded-full ${status.dotColor} inline-block mr-2`}
                                      ></div>
                                      {status.label}
                                      {updateLoading && isCurrentStatus && (
                                        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
                                          <div className="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination (có thể thêm sau) */}
      {filteredOrders.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị{" "}
            <span className="font-medium">{filteredOrders.length}</span> đơn
            hàng
            {(searchTerm || filterStatus !== "all") && (
              <span>
                {" "}
                (đã lọc từ{" "}
                <span className="font-medium">{orders?.length || 0}</span> đơn
                hàng)
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Cập nhật lần cuối: {new Date().toLocaleTimeString("vi-VN")}
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminOrderList;
