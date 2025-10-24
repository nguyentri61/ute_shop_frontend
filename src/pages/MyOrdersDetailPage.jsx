import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailOrder } from "../service/api.order.service";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  XCircle,
} from "lucide-react";

export default function MyOrdersDetailPage() {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await getDetailOrder(id);
        setOrderDetail(res.data);
        console.log("Order Detail:", res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);
  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color: "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200",
        badge: "bg-yellow-500 text-white",
        icon: Clock,
        text: "Chờ xác nhận",
      },
      CONFIRMED: {
        color: "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200",
        badge: "bg-blue-500 text-white",
        icon: CheckCircle,
        text: "Đã xác nhận",
      },
      SHIPPING: {
        color: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200",
        badge: "bg-purple-500 text-white",
        icon: Truck,
        text: "Đang giao hàng",
      },
      DELIVERED: {
        color: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
        badge: "bg-green-500 text-white",
        icon: CheckCircle,
        text: "Đã giao hàng",
      },
      CANCELLED: {
        color: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200",
        badge: "bg-red-500 text-white",
        icon: XCircle,
        text: "Đã hủy",
      },
    };
    return configs[status] || configs.PENDING;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!orderDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Đang tải thông tin đơn hàng...
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(orderDetail.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Chi tiết đơn hàng
                </h1>
                <p className="text-gray-500">
                  Mã đơn hàng:{" "}
                  <span className="font-mono font-semibold text-gray-700">
                    #{orderDetail.id.slice(0, 8)}
                  </span>
                </p>
              </div>
              <div
                className={`flex items-center gap-3 ${statusConfig.badge} px-6 py-3 rounded-full shadow-lg`}
              >
                <StatusIcon className="w-5 h-5" />
                <span className="font-semibold text-lg">
                  {statusConfig.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                Lịch sử đơn hàng
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                <div className="space-y-6">
                  {orderDetail.statusHistory
                    ?.sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((history, index) => {
                      const historyConfig = getStatusConfig(history.status);
                      const HistoryIcon = historyConfig.icon;
                      return (
                        <div
                          key={history.id}
                          className="flex items-start gap-4 relative"
                        >
                          <div
                            className={`w-8 h-8 rounded-full ${index === 0
                              ? "bg-gradient-to-r from-blue-500 to-purple-500"
                              : "bg-gray-300"
                              } flex items-center justify-center z-10 shadow-md`}
                          >
                            <HistoryIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 pb-2">
                            <p className="font-semibold text-gray-800">
                              {historyConfig.text}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(history.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                Sản phẩm đã đặt
              </h2>
              <div className="space-y-4">
                {orderDetail.items?.map((item) => (
                  <div
                    key={item.id}
                    className="group hover:bg-gray-50 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <Package className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-lg mb-2">
                          {item.variant.product.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            Màu: {item.variant.color}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            Size: {item.variant.size}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            SL: {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.variant.discountPrice <
                              item.variant.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatCurrency(item.variant.price)}
                                </span>
                              )}
                            <span className="text-lg font-bold text-blue-600">
                              {formatCurrency(
                                item.variant.discountPrice || item.price
                              )}
                            </span>
                          </div>
                          {item.variant.discountPrice < item.variant.price && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md">
                              -
                              {Math.round(
                                (1 -
                                  item.variant.discountPrice /
                                  item.variant.price) *
                                100
                              )}
                              %
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-medium">
                      {formatCurrency(orderDetail.subTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-green-600">{formatCurrency(orderDetail.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Giảm giá sản phẩm</span>
                    <span className="font-medium text-green-600">-{formatCurrency(orderDetail.productDiscount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Giảm giá vận chuyển</span>
                    <span className="font-medium text-green-600">-{formatCurrency(orderDetail.shippingDiscount)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                    <span className="text-lg font-bold text-gray-800">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(orderDetail.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                Khách hàng
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Họ và tên</p>
                  <p className="font-semibold text-gray-800">
                    {orderDetail.user.fullName}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-800 text-sm break-all">
                    {orderDetail.user.email}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                  <p className="font-semibold text-gray-800">
                    {orderDetail.user.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                Giao hàng
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                    <p className="font-medium text-gray-800">
                      {orderDetail.address}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Liên hệ</p>
                    <p className="font-semibold text-gray-800">
                      {orderDetail.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ngày đặt</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(orderDetail.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Thanh toán
              </h2>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm opacity-90 mb-1">Phương thức</p>
                <p className="font-bold text-lg">Thanh toán khi nhận hàng</p>
                <p className="text-xs opacity-75 mt-2">
                  (COD - Cash on Delivery)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
