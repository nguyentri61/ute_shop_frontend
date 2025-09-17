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
    default: "bg-gray-200 text-gray-700",
    NEW: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PREPARING: "bg-yellow-100 text-yellow-800",
    SHIPPING: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
    CANCEL_REQUEST: "bg-orange-100 text-orange-800",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
        variants[variant] ?? variants.default
      }`}
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
    secondary: "bg-white text-gray-700 border hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2 rounded-lg font-medium ${variants[variant]}`}
    >
      {loading ? "..." : children}
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

  // Chỉ lấy 6 ký tự đầu tiên của order.id
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

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 flex flex-col border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-gray-600">
              Mã đơn:{" "}
              <span className="text-gray-900 font-semibold">{shortId}</span>
            </h3>
            <Badge variant={status}>{STATUS_LABELS[status] || status}</Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ngày đặt: {formatDate(order.createdAt)}
          </p>
          <p className="text-xs text-gray-500">Sản phẩm: {itemCount}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Tổng thanh toán</p>
          <p className="text-lg font-bold text-indigo-600">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      {/* Preview products */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {(order.items || []).slice(0, 6).map((it) => (
          <img
            key={it.id}
            src={it.product?.image}
            alt={it.product?.name}
            className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
          />
        ))}
        {(order.items || []).length > 6 && (
          <div className="w-16 h-16 flex items-center justify-center text-sm text-gray-500 bg-gray-100 rounded-lg">
            +{(order.items || []).length - 6}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <ActionButton onClick={onToggleExpand} variant="secondary">
            {isExpanded ? "Thu gọn" : "Xem chi tiết"}
          </ActionButton>
          <Link
            to={`/orders/${order.id}`}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
            {cancellingId === order.id ? "Đang huỷ..." : "Huỷ đơn"}
          </ActionButton>
        )}
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <ul className="space-y-3 max-h-52 overflow-auto">
            {order.items?.map((it, index) => (
              <OrderItemCard
                key={it.id || index}
                product={it.product}
                quantity={it.quantity}
              />
            ))}
          </ul>
          <div className="mt-3 text-right text-sm text-gray-600">
            Tạm tính:{" "}
            <span className="font-semibold">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
