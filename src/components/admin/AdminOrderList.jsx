// src/components/admin/AdminOrderList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../../features/admin/adminOrderSlice";
import toast from "react-hot-toast";

const AdminOrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, updateLoading, updateError, updateSuccess } = useSelector(
    (state) => state.adminOrder
  );
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Cập nhật trạng thái đơn hàng thành công");
    }
    if (updateError) {
      toast.error(updateError);
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
    { value: "NEW", label: "Đơn hàng mới", color: "bg-amber-100 text-amber-800" },
    { value: "CONFIRMED", label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
    { value: "PREPARING", label: "Đang chuẩn bị hàng", color: "bg-yellow-100 text-yellow-800" },
    { value: "SHIPPING", label: "Đang giao hàng", color: "bg-purple-100 text-purple-800" },
    { value: "DELIVERED", label: "Đã giao thành công", color: "bg-emerald-100 text-emerald-800" },
    { value: "CANCELLED", label: "Đã hủy", color: "bg-red-100 text-red-800" },
    { value: "CANCEL_REQUEST", label: "Yêu cầu hủy", color: "bg-orange-100 text-orange-800" },
  ];

  // Hàm lấy label từ value
  const getStatusLabel = (statusValue) => {
    const status = orderStatuses.find((s) => s.value === statusValue);
    return status ? status.label : statusValue;
  };

  // Hàm lấy màu từ value
  const getStatusColor = (statusValue) => {
    const status = orderStatuses.find((s) => s.value === statusValue);
    return status ? status.color : "bg-gray-100 text-gray-800";
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Không có đơn hàng nào</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <>
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id.slice(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.user?.fullName || order.user?.email || "N/A"}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalPrice)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        {expandedOrderId === order.id ? "Ẩn chi tiết" : "Xem chi tiết"}
                      </button>
                    </td>
                  </tr>

                  {/* Chi tiết đơn hàng khi mở rộng */}
                  {expandedOrderId === order.id && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Chi tiết đơn hàng</h4>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Địa chỉ giao hàng:</p>
                              <p className="text-sm">{order.address}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Số điện thoại:</p>
                              <p className="text-sm">{order.phone}</p>
                            </div>
                          </div>

                          <h5 className="font-medium mb-2">Sản phẩm:</h5>
                          <ul className="space-y-2 mb-4">
                            {order.items?.map((item) => (
                              <li key={item.id} className="flex justify-between text-sm">
                                <span>
                                  {item.product?.name} x {item.quantity}
                                </span>
                                <span className="font-medium">
                                  {formatCurrency((item.product?.discountPrice || item.product?.price) * item.quantity)}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <div className="border-t pt-2 flex justify-between font-medium">
                            <span>Tổng cộng:</span>
                            <span>{formatCurrency(order.totalPrice)}</span>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cập nhật trạng thái:</label>
                            <div className="flex flex-wrap gap-2">
                              {orderStatuses.map((status) => (
                                <button
                                  key={status.value}
                                  onClick={() => handleStatusChange(order.id, status.value)}
                                  disabled={order.status === status.value || updateLoading}
                                  className={`px-3 py-1 text-xs rounded-full ${status.color} ${order.status === status.value
                                    ? "ring-2 ring-offset-1 ring-indigo-500"
                                    : "hover:opacity-80"
                                    } ${order.status === status.value ? "cursor-default" : "cursor-pointer"}`}
                                >
                                  {status.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderList;