import { Link } from "react-router-dom";
import { totalItemsCount, formatCurrency, formatDate } from "../../utils/order";
import OrderItemCard from "./OrderItemCard";

const STATUS_LABELS = {
  NEW: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PREPARING: "Chuẩn bị hàng",
  SHIPPING: "Đang giao",
  DELIVERED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  CANCEL_REQUEST: "Yêu cầu hủy",
};

const STATUS_COLORS = {
  NEW: "bg-orange-100 text-orange-600",
  CONFIRMED: "bg-blue-100 text-blue-600",
  PREPARING: "bg-yellow-100 text-yellow-600",
  SHIPPING: "bg-purple-100 text-purple-600",
  DELIVERED: "bg-green-100 text-green-600",
  CANCELLED: "bg-gray-100 text-gray-500",
  CANCEL_REQUEST: "bg-red-100 text-red-600",
};

export default function OrderCard({ order, isExpanded, onToggleExpand, onCancel, cancellingId }) {
  const total = order.total;
  const itemCount = totalItemsCount(order);
  const statusText = STATUS_LABELS[order.status] || order.status;
  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <div>
          <p className="text-sm text-gray-600">Mã đơn: <span className="font-medium">{shortId}</span></p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)} • {itemCount} sản phẩm</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || "bg-gray-200 text-gray-600"}`}>
          {statusText}
        </span>
      </div>

      {/* Items */}
      <div className="p-4 space-y-3">
        {(isExpanded ? order.items : order.items.slice(0, 1)).map((it) => (
          <OrderItemCard
            key={it.id}
            product={it.product}
            quantity={it.quantity}
            canReview={order.status === "DELIVERED"}
          />
        ))}

        {order.items.length > 1 && (
          <button onClick={onToggleExpand} className="text-sm text-blue-500 hover:underline">
            {isExpanded ? "Thu gọn" : `Xem thêm ${order.items.length - 1} sản phẩm`}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-100">
        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
          Tổng thanh toán: <span className="text-lg font-semibold text-orange-600">{formatCurrency(total)}</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Link
            to={`/orders/${order.id}`}
            className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Xem chi tiết
          </Link>
          {(order.status === "NEW" || order.status === "CONFIRMED" || order.status === "PREPARING") && (
            <button
              onClick={() => onCancel(order.id)}
              disabled={cancellingId === order.id}
              className="px-4 py-1.5 text-sm border border-red-400 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
            >
              {cancellingId === order.id ? "Đang huỷ..." : "Huỷ đơn"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
