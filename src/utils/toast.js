// src/utils/toast.js
import { toast } from "react-hot-toast"; // hoặc import từ shadcn/ui nếu bạn dùng

export const showError = (err) => {
  const msg = err?.response?.data?.message || err?.message || "Có lỗi xảy ra";
  toast.error(msg);
};

export const showSuccess = (message) => {
  toast.success(message);
};
