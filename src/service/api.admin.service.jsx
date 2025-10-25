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

/* ============================
   Admin categories API (new)
   ============================ */

/**
 * GET /admin/categories?q=&page=&size=
 * @param {Object} params
 * @param {string} [params.q] - tìm theo tên
 * @param {number} [params.page=1]
 * @param {number} [params.size=10]
 */
const getAdminCategories = (params = {}) => {
  const API = "/admin/categories";
  return axios.get(API, { params });
};

/** GET /admin/categories/:id */
const getAdminCategoryById = (id) => {
  const API = `/admin/categories/${id}`;
  return axios.get(API);
};

/** POST /admin/categories { name, icon? } */
const createAdminCategory = (payload) => {
  const API = "/admin/categories";
  return axios.post(API, payload);
};

/** PATCH /admin/categories/:id { name?, icon? } */
const updateAdminCategory = (id, payload) => {
  const API = `/admin/categories/${id}`;
  return axios.patch(API, payload);
};

/** DELETE /admin/categories/:id */
const deleteAdminCategory = (id) => {
  const API = `/admin/categories/${id}`;
  return axios.delete(API);
};

export {
  getAllOrders,
  updateOrderStatusAdmin,
  getDashboardStats,
  getWeeklySales,
  getCategoryShare,
  getBestSellingProducts,

  // categories
  getAdminCategories,
  getAdminCategoryById,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
};
