import { useState } from "react";
import { formatCurrency } from "../../utils/order";
import ReviewModal from "./ReviewModal";
import { CreateReview } from "../../service/api.product.service";

export default function OrderItemCard({ product, quantity, canReview }) {
  const price = product?.discountPrice ?? product?.price ?? 0;
  const subtotal = price * (Number(quantity) || 0);
  const [isOpen, setIsOpen] = useState(false);
  const handleSubmitReview = async (review) => {
    try {
      await CreateReview(product.id, review);
      alert("Đánh giá thành công, bạn đã nhận mã giảm giá 🎉");
    } catch (err) {
      console.error(err);
      alert("Gửi đánh giá thất bại!");
    }
  };
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
      {canReview && (
        <button
          onClick={() => setIsOpen(true)}
          className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Đánh giá
        </button>
      )}
      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </li>
  );
}
