// src/service/api.admin.service.jsx
import axios from "./axios.customize";

const getAllOrders = () => {
  const API = "/orders/admin/all";
  return axios.get(API);
};

const updateOrderStatusAdmin = (orderId, status) => {
  const API = `/orders/${orderId}/status`;
  return axios.put(API, { status });
};

const getDashboardStats = () => {
  const API = "/admin/dashboard/stats";
  return axios.get(API);
};

/**
 * Doanh thu tuần (T2..CN)
 * @param {Object} [opts]
 * @param {string} [opts.status="DELIVERED"] - Trạng thái đơn để tính doanh thu
 */
const getWeeklySales = (opts = {}) => {
  const { status = "DELIVERED" } = opts;
  const API = `/admin/dashboard/weekly-sales`;
  return axios.get(API, { params: { status } });
};

/**
 * Cơ cấu doanh thu theo danh mục (Pie chart)
 * @param {Object} [opts]
 * @param {string} [opts.status="DELIVERED"] - Trạng thái đơn
 * @param {"7d"|"30d"|"90d"|"month"} [opts.range="30d"] - Khoảng thời gian nhanh
 * @param {string} [opts.start] - YYYY-MM-DD (ưu tiên hơn range nếu có)
 * @param {string} [opts.end]   - YYYY-MM-DD (ưu tiên hơn range nếu có)
 */
const getCategoryShare = (opts = {}) => {
  const { status = "DELIVERED", range = "30d", start, end } = opts;
  const API = `/admin/dashboard/category-share`;
  // Nếu có start/end thì backend sẽ ưu tiên chúng thay cho range
  return axios.get(API, { params: { status, range, start, end } });
};

/**
 * Top sản phẩm bán chạy
 * @param {number} [limit=6]
 */
const getBestSellingProducts = (limit = 6) => {
  const API = `/admin/dashboard/best-selling`;
  return axios.get(API, { params: { limit } });
};

export {
  getAllOrders,
  updateOrderStatusAdmin,
  getDashboardStats,
  getWeeklySales,
  getCategoryShare,
  getBestSellingProducts,
};
