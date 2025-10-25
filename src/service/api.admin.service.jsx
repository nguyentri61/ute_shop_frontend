// src/service/api.admin.service.jsx
import axios from "./axios.customize";

/* ============================
   Orders / Dashboard / Admin
   ============================ */

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

const getWeeklySales = (opts = {}) => {
  const { status = "DELIVERED" } = opts;
  const API = `/admin/dashboard/weekly-sales`;
  return axios.get(API, { params: { status } });
};

const getCategoryShare = (opts = {}) => {
  const { status = "DELIVERED", range = "30d", start, end } = opts;
  const API = `/admin/dashboard/category-share`;
  return axios.get(API, { params: { status, range, start, end } });
};

const getBestSellingProducts = (limit = 6) => {
  const API = `/admin/dashboard/best-selling`;
  return axios.get(API, { params: { limit } });
};

/* ============================
   Admin categories
   ============================ */

/**
 * GET /admin/categories?q=&page=&size=
 * params: { q, page, size }
 */
const getAdminCategories = (params = {}) => {
  const API = "/admin/categories";
  return axios.get(API, { params });
};

const getAdminCategoryById = (id) => {
  const API = `/admin/categories/${id}`;
  return axios.get(API);
};

const createAdminCategory = (payload) => {
  const API = "/admin/categories";
  return axios.post(API, payload);
};

const updateAdminCategory = (id, payload) => {
  const API = `/admin/categories/${id}`;
  return axios.patch(API, payload);
};

const deleteAdminCategory = (id) => {
  const API = `/admin/categories/${id}`;
  return axios.delete(API);
};

/* ============================
   Admin users
   ============================ */

/**
 * GET /admin/users?q=&role=&start=&end=&page=&size=
 * opts: { q, role, start, end, page, size }
 */
const getAdminUsers = (opts = {}) => {
  const { q, role, start, end, page = 1, size = 10 } = opts;
  return axios.get("/admin/users", { params: { q, role, start, end, page, size } });
};

/** GET /admin/users/:id */
const getAdminUser = (id) => axios.get(`/admin/users/${id}`);

/** POST /admin/users { email, fullName, phone?, role?, address? } */
const createAdminUser = (payload) => axios.post("/admin/users", payload);

/** PATCH /admin/users/:id { fullName?, phone?, role?, address?, verified? } */
const updateAdminUser = (id, payload) => axios.patch(`/admin/users/${id}`, payload);

/**
 * DELETE /admin/users/:id
 * NOTE: backend implemented this as a soft-block (blocked=true) — keep using DELETE for admin "remove"
 */
const deleteAdminUser = (id) => axios.delete(`/admin/users/${id}`);

/** PATCH /admin/users/:id/unblock  -> mở chặn tài khoản */
const unblockAdminUser = (id) => axios.patch(`/admin/users/${id}/unblock`);

/** PATCH /admin/users/:id/role -> thay đổi vai trò (body: { role: "ADMIN"|"USER" }) */
const changeAdminUserRole = (id, role) => axios.patch(`/admin/users/${id}/role`, { role });

/* ============================
   Exports
   ============================ */

export {
  // orders / dashboard
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

  // users
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  unblockAdminUser,
  changeAdminUserRole,
};
