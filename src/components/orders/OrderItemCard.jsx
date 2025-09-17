import { formatCurrency } from "../../utils/order";

export default function OrderItemCard({ product, quantity }) {
  const price = product?.discountPrice ?? product?.price ?? 0;
  const subtotal = price * (Number(quantity) || 0);

  return (
    <li className="flex items-center gap-3">
      <img
        src={product?.image || "/placeholder-product.png"}
        alt={product?.name}
        className="w-12 h-12 object-cover rounded"
        onError={(e) => {
          e.currentTarget.src = "/placeholder-product.png";
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{product?.name}</div>
        <div className="text-xs text-gray-500">
          {formatCurrency(price)} × {quantity}
        </div>
      </div>
      <div className="text-right font-medium">{formatCurrency(subtotal)}</div>
    </li>
  );
}
