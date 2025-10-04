import { useEffect, useState } from "react";
import { GetReview } from "../../service/api.product.service";

export default function ReviewModal({ isOpen, onClose, onSubmit, product }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSent, setIsSent] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    const getReview = async () => {
      try {
        const response = await GetReview(product.id);
        setComment(response.data.comment || "");
        setRating(response.data.rating || 5);
        setIsSent(response.data != null);
      } catch (err) {
        console.error(err);
      }
    };
    getReview();
  }, [isOpen, product]);

  if (!isOpen) return null;
  const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg
      className={`w-8 h-8 cursor-pointer transition-all duration-200 transform hover:scale-110 ${filled ? "text-yellow-400" : "text-gray-300"
        }`}
      fill="currentColor"
      viewBox="0 0 20 20"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const getRatingText = (rating) => {
    const texts = {
      1: "Rất tệ",
      2: "Tệ",
      3: "Trung bình",
      4: "Tốt",
      5: "Xuất sắc",
    };
    return texts[rating] || "";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100 animate-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đánh giá sản phẩm
          </h2>
          <p className="text-gray-600">
            Chia sẻ trải nghiệm của bạn với chúng tôi
          </p>
        </div>

        {/* Rating Section */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Đánh giá của bạn
          </label>
          <div
            className={`flex justify-center items-center gap-2 mb-4 ${isSent ? "pointer-events-none opacity-60" : ""
              }`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                filled={star <= (hoveredRating || rating)}
                onClick={() => !isSent && setRating(star)}
                onMouseEnter={() => !isSent && setHoveredRating(star)}
                onMouseLeave={() => !isSent && setHoveredRating(0)}
              />
            ))}
          </div>

          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full font-medium">
              {getRatingText(hoveredRating || rating)}
            </span>
          </div>
        </div>

        {/* Comment Section */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Chia sẻ chi tiết (không bắt buộc)
          </label>
          <textarea
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 resize-none text-gray-700"
            rows={4}
            placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSent}
          />
          <div className="text-right mt-2">
            <span className="text-xs text-gray-500">{comment.length}/500</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-gray-200"
          >
            Hủy bỏ
          </button>
          {!isSent && (
            <button
              onClick={() => {
                onSubmit({ rating, comment });
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl"
            >
              Gửi đánh giá
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
