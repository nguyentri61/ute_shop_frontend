import { Link } from "react-router-dom";
import {
  computeOrderTotal,
  totalItemsCount,
  formatCurrency,
  formatDate,
} from "../../utils/order";
import OrderItemCard from "./OrderItemCard";

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-600",
    NEW: "bg-amber-50 text-amber-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    PREPARING: "bg-yellow-50 text-yellow-700",
    SHIPPING: "bg-purple-50 text-purple-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
    CANCEL_REQUEST: "bg-orange-50 text-orange-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
        variants[variant] ?? variants.default
      } transition-colors`}
    >
      {children}
    </span>
  );
};

const ActionButton = ({
  onClick,
  variant = "primary",
  children,
  disabled,
  loading,
}) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary:
      "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-1.5 rounded-md font-medium text-sm transition-colors ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
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
  const status = order.status;
  const shortId = order.id.slice(0, 6).toUpperCase();

  const STATUS_LABELS = {
    NEW: "Đơn hàng mới",
    CONFIRMED: "Đã xác nhận",
    PREPARING: "Đang chuẩn bị hàng",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao thành công",
    CANCELLED: "Đã hủy",
    CANCEL_REQUEST: "Yêu cầu hủy",
  };

  const totalPrice = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Mã đơn: {shortId}
              </h3>
              <Badge variant={status}>{STATUS_LABELS[status] || status}</Badge>
            </div>
            <div className="mt-1 space-y-1">
              <p className="text-xs text-gray-500">
                Ngày đặt: {formatDate(order.createdAt)}
              </p>
              <p className="text-xs text-gray-500">Sản phẩm: {itemCount}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Tổng thanh toán</p>
          <p className="text-lg font-bold text-indigo-600">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      {/* Product Preview */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {(order.items || []).slice(0, 6).map((it) => (
          <div key={it.id} className="relative group">
            <img
              src={it.product?.image}
              alt={it.product?.name}
              className="w-20 h-20 object-cover rounded-md border border-gray-200 transition-transform group-hover:scale-105"
            />
            <span className="absolute top-0 right-0 bg-gray-800 text-white text-xs rounded-full px-2 py-1">
              x{it.quantity}
            </span>
          </div>
        ))}
        {(order.items || []).length > 6 && (
          <div className="w-20 h-20 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-50 rounded-md border border-gray-200">
            +{(order.items || []).length - 6}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          <ActionButton onClick={onToggleExpand} variant="secondary">
            {isExpanded ? "Thu gọn" : "Xem chi tiết"}
          </ActionButton>
          <Link
            to={`/orders/${order.id}`}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Chi tiết
          </Link>
        </div>
        {(order.status === "NEW" ||
          order.status === "CONFIRMED" ||
          order.status === "PREPARING") && (
          <ActionButton
            onClick={() => onCancel(order.id)}
            variant="danger"
            loading={cancellingId === order.id}
          >
            {cancellingId === order.id ? "Đang huỷ" : "Huỷ đơn"}
          </ActionButton>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <ul className="space-y-4 max-h-64 overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {order.items?.map((it, index) => (
              <OrderItemCard
                key={it.id || index}
                product={it.product}
                quantity={it.quantity}
                canReview={order.status === "DELIVERED"}
              />
            ))}
          </ul>
          <div className="mt-4 text-right text-sm text-gray-600">
            Tạm tính:{" "}
            <span className="font-semibold">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      )}
    </article>
  );
}
