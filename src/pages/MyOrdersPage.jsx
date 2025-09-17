import React, { useEffect, useState } from "react";
import {
  getMyOrders,
  cancelOrder as apiCancelOrder,
} from "../service/api.order.service";
import OrderCard from "../components/orders/OrderCard";
import toast from "react-hot-toast";
import { showError } from "../utils/toast";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await getMyOrders();
      setOrders(res.data ?? []);
    } catch {
      setError("Có lỗi khi tải đơn hàng.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(orderId) {
    if (!window.confirm("Bạn có chắc muốn huỷ đơn này?")) return;
    setCancellingId(orderId);
    try {
      await apiCancelOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            // Ví dụ: chỉ hủy khi đơn đang "PENDING" hoặc "CONFIRMED"
            if (o.status === "PENDING" || o.status === "CONFIRMED") {
              return { ...o, status: "CANCELLED" };
            } else {
              return { ...o, status: "CANCEL_REQUEST" };
            }
          }
          return o;
        })
      );
    } catch (err) {
      showError(err);
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></span>
        <span className="ml-3">Đang tải đơn hàng...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl text-white font-bold mb-2">Đơn hàng của tôi</h1>
      <p className="text-lg text-gray-600 mb-6">
        Xem lịch sử mua hàng và theo dõi tình trạng đơn hàng của bạn
      </p>

      {error && <p className="text-red-600">{error}</p>}
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrderId === order.id}
              onToggleExpand={() =>
                setExpandedOrderId(
                  expandedOrderId === order.id ? null : order.id
                )
              }
              onCancel={handleCancel}
              cancellingId={cancellingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
