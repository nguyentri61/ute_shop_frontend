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
    <div className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition">
      {/* Left: image + info */}
      <div className="flex gap-3 items-center">
        <img
          src={product?.image || "/placeholder-product.png"}
          alt={product?.name}
          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
          onError={(e) => { e.currentTarget.src = "/placeholder-product.png"; }}
        />
        <div>
          <p className="text-sm font-medium text-gray-800 line-clamp-2 max-w-[200px]">{product?.name}</p>
          <p className="text-xs text-gray-500 mt-1">x{quantity}</p>
        </div>
      </div>

      {/* Right: price + review */}
      <div className="text-right flex flex-col items-end gap-1">
        <p className="text-sm font-medium text-gray-800">{formatCurrency(subtotal)}</p>
        {product?.discountPrice && <p className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</p>}
        {canReview && (
          <button
            onClick={() => setIsOpen(true)}
            className="mt-1 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Đánh giá
          </button>
        )}
      </div>

      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmitReview}
        product={product}
      />
    </div>
  );
}
