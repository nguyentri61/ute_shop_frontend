import { Link } from "react-router-dom";
import {
  computeOrderTotal,
  totalItemsCount,
  formatCurrency,
  formatDate,
} from "../../utils/order";
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
  NEW: "text-orange-500",
  CONFIRMED: "text-blue-500",
  PREPARING: "text-yellow-600",
  SHIPPING: "text-purple-600",
  DELIVERED: "text-green-600",
  CANCELLED: "text-gray-500",
  CANCEL_REQUEST: "text-red-500",
};

export default function OrderCard({
  order,
  isExpanded,
  onToggleExpand,
  onCancel,
  cancellingId,
}) {
  const total = computeOrderTotal(order);
  const itemCount = totalItemsCount(order);
  const statusText = STATUS_LABELS[order.status] || order.status;
  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div>
          <p className="text-sm text-gray-600">
            Mã đơn: <span className="font-medium">{shortId}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Ngày đặt: {formatDate(order.createdAt)} • {itemCount} sản phẩm
          </p>
        </div>
        <span
          className={`text-sm font-medium ${STATUS_COLORS[order.status] || "text-gray-600"
            }`}
        >
          {statusText}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {(isExpanded ? order.items : order.items.slice(0, 1)).map((it) => (
          <OrderItemCard
            key={it.id}
            product={it.product}
            quantity={it.quantity}
            canReview={order.status === "DELIVERED"}
          />
        ))}

        {/* Nút xem thêm / thu gọn */}
        {order.items.length > 1 && (
          <button
            onClick={onToggleExpand}
            className="text-sm text-blue-500 hover:underline"
          >
            {isExpanded
              ? "Thu gọn"
              : `Xem thêm ${order.items.length - 1} sản phẩm`}
          </button>
        )}
      </div>


      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-100">
        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
          Tổng thanh toán:{" "}
          <span className="text-lg font-semibold text-orange-600">
            {formatCurrency(total)}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/orders/${order.id}`}
            className="px-4 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Xem chi tiết
          </Link>
          {(order.status === "NEW" ||
            order.status === "CONFIRMED" ||
            order.status === "PREPARING") && (
              <button
                onClick={() => onCancel(order.id)}
                disabled={cancellingId === order.id}
                className="px-4 py-1.5 text-sm border border-red-400 text-red-500 rounded hover:bg-red-50 disabled:opacity-50"
              >
                {cancellingId === order.id ? "Đang huỷ..." : "Huỷ đơn"}
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
