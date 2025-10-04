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
    <div className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0">
      {/* Trái: ảnh + thông tin */}
      <div className="flex gap-3">
        <img
          src={product?.image || "/placeholder-product.png"}
          alt={product?.name}
          className="w-16 h-16 object-cover rounded border border-gray-200"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-product.png";
          }}
        />
        <div className="flex flex-col justify-between">
          <p className="text-sm font-medium text-gray-800 line-clamp-2 max-w-[200px]">
            {product?.name}
          </p>
          <span className="text-xs text-gray-500 mt-1">x{quantity}</span>
        </div>
      </div>

      {/* Phải: giá + đánh giá */}
      <div className="text-right">
        <p className="text-sm font-medium text-gray-800">
          {formatCurrency(subtotal)}
        </p>
        <p className="text-xs text-gray-500 line-through">
          {product?.discountPrice ? formatCurrency(product.price) : null}
        </p>

        {canReview && (
          <button
            onClick={() => setIsOpen(true)}
            className="mt-2 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Đánh giá
          </button>
        )}
      </div>

      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
