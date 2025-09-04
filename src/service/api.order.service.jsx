// src/services/api.order.service.jsx
import axios from "./axios.customize";

/**
 * API service cho orders
 * Giữ cùng phong cách với AllCategories: trả về axios promise
 * Component gọi sẽ xử lý res.data (có thể là {status,message,data} hoặc mảng trực tiếp)
 */

const getMyOrders = () => {
    const API = "/orders/my-orders"; // chỉnh nếu backend của bạn khác
    return axios.get(API);
};

const getOrderById = (orderId) => {
    const API = `/orders/${orderId}`;
    return axios.get(API);
};

const createOrder = (payload) => {
    const API = "/orders";
    return axios.post(API, payload);
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

/**
 * Optional: helper để trả về trực tiếp mảng orders (unwrap response)
 * Nếu bạn thích component nhận luôn `data` thay vì axios response, dùng unwrapGetMyOrders
 */
const unwrapGetMyOrders = async () => {
    const res = await getMyOrders();
    // res.data có thể là { status, message, data } hoặc mảng
    return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
};

export {
    getMyOrders,
    getOrderById,
    createOrder,
    cancelOrder,
    updateOrderStatus,
    unwrapGetMyOrders,
};
