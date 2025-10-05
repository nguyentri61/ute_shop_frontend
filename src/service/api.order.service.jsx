// src/services/api.order.service.jsx
import axios from "./axios.customize";

const getMyOrders = (status = "ALL", page = 1, limit = 5) => {
  return axios.get(
    `/orders/my-orders?status=${status}&page=${page}&limit=${limit}`
  );
};
const getOrderById = (orderId) => {
  const API = `/orders/${orderId}`;
  return axios.get(API);
};

const createOrderCODService = (
  address,
  phone,
  cartItemIds,
  shippingVoucher = null,
  productVoucher = null
) => {
  const API = "/orders/checkout-cod";
  return axios.post(API, {
    address,
    phone,
    cartItemIds,
    shippingVoucher,
    productVoucher,
  });
};

const cancelOrder = (orderId) => {
  // Nếu backend dùng POST /orders/:id/cancel
  const API = `/orders/${orderId}/cancel`;
  return axios.post(API);
  // Nếu backend dùng DELETE: // return axios.delete(`/orders/${orderId}`);
  // Nếu backend dùng PATCH để đổi trạng thái: // return axios.patch(`/orders/${orderId}`, { status: 'cancelled' });
};

const updateOrderStatus = (orderId, status) => {
  // endpoint ví dụ: PATCH /orders/:id/status
  const API = `/orders/${orderId}/status`;
  return axios.patch(API, { status });
};

const unwrapGetMyOrders = async () => {
  const res = await getMyOrders();
  // res.data có thể là { status, message, data } hoặc mảng
  return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
};

const getDetailOrder = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required");
  const API = `/orders/${orderId}/review`;
  return axios.get(API);
};
export {
  getMyOrders,
  getOrderById,
  createOrderCODService,
  cancelOrder,
  updateOrderStatus,
  unwrapGetMyOrders,
  getDetailOrder,
};
