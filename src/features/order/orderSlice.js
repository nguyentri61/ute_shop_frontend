// src/features/order/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getMyOrders,
    getOrderById,
    cancelOrder as apiCancelOrder,
    createOrderCODService
} from "../../service/api.order.service";

// Thunk: lấy danh sách đơn hàng của user
export const fetchMyOrders = createAsyncThunk(
    "orders/fetchMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getMyOrders(); // axios response
            const d = res?.data ?? res;
            // nếu payload là { status, data, message }
            if (d && typeof d === "object" && "status" in d && "data" in d) {
                return d.data;
            }
            // nếu trả về trực tiếp mảng
            return Array.isArray(d) ? d : [];
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || "Lỗi khi lấy đơn hàng"
            );
        }
    }
);

// Thunk: lấy chi tiết 1 đơn hàng
export const fetchOrderById = createAsyncThunk(
    "orders/fetchOrderById",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await getOrderById(orderId);
            const d = res?.data ?? res;
            if (d && typeof d === "object" && "status" in d && "data" in d) {
                return d.data;
            }
            return d;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || "Lỗi khi lấy chi tiết đơn hàng"
            );
        }
    }
);

// Thunk: huỷ đơn hàng
export const cancelOrder = createAsyncThunk(
    "orders/cancelOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await apiCancelOrder(orderId);
            const d = res?.data ?? res;
            // backend có thể trả {status, message, data}
            if (d && typeof d === "object" && "status" in d) {
                if (d.status === 200 || d.status === "SUCCESS") {
                    return { orderId, data: d.data ?? null };
                }
                return rejectWithValue(d.message || "Không thể huỷ đơn hàng");
            }
            return { orderId, data: d ?? null };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || "Lỗi khi huỷ đơn hàng"
            );
        }
    }
);

export const createOrderCOD = createAsyncThunk(
    "orders/createOrderCOD",
    async ({ address, phone, cartItemIds, shippingVoucher, productVoucher }, { rejectWithValue }) => {
        try {
            const res = await createOrderCODService(address, phone, cartItemIds, shippingVoucher, productVoucher);
            console.log(res.data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        data: [], // mảng orders
        loading: false,
        error: null,

        selectedOrder: null, // chi tiết 1 order
        orderLoading: false,
        orderError: null,

        cancelling: false,
        cancelError: null,
        cancelSuccess: false,
    },
    reducers: {
        clearOrdersError: (state) => {
            state.error = null;
            state.orderError = null;
            state.cancelError = null;
        },
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
            state.orderError = null;
        },
        clearCancelStatus: (state) => {
            state.cancelling = false;
            state.cancelError = null;
            state.cancelSuccess = false;
        },
        // cập nhật local trạng thái order (ví dụ set status = cancelled khi huỷ thành công)
        updateOrderLocal: (state, action) => {
            const { orderId, changes } = action.payload;
            state.data = state.data.map((o) => (o.id === orderId ? { ...o, ...changes } : o));
            if (state.selectedOrder?.id === orderId) {
                state.selectedOrder = { ...state.selectedOrder, ...changes };
            }
        },
        logoutOrders: (state) => {
            // dùng khi logout để clear data
            state.data = [];
            state.loading = false;
            state.error = null;
            state.selectedOrder = null;
            state.orderLoading = false;
            state.orderError = null;
            state.cancelling = false;
            state.cancelError = null;
            state.cancelSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchMyOrders
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload || [];
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Không thể tải đơn hàng";
            })

            // fetchOrderById
            .addCase(fetchOrderById.pending, (state) => {
                state.orderLoading = true;
                state.orderError = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.orderLoading = false;
                state.selectedOrder = action.payload ?? null;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.orderLoading = false;
                state.orderError = action.payload || "Không thể tải chi tiết đơn hàng";
            })

            // cancelOrder
            .addCase(cancelOrder.pending, (state) => {
                state.cancelling = true;
                state.cancelError = null;
                state.cancelSuccess = false;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.cancelling = false;
                state.cancelSuccess = true;
                const orderId = action.payload?.orderId;
                // cập nhật trạng thái local sang 'cancelled' nếu cần
                if (orderId) {
                    state.data = state.data.map((o) =>
                        o.id === orderId ? { ...o, status: "cancelled" } : o
                    );
                    if (state.selectedOrder?.id === orderId) {
                        state.selectedOrder = { ...state.selectedOrder, status: "cancelled" };
                    }
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.cancelling = false;
                state.cancelError = action.payload || "Không thể huỷ đơn hàng";
            })
            .addCase(createOrderCOD.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrderCOD.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrderCOD.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearOrdersError,
    clearSelectedOrder,
    clearCancelStatus,
    updateOrderLocal,
    logoutOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
