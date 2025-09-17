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

export {
  getAllOrders,
  updateOrderStatusAdmin,
};