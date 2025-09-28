import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOrders, updateOrderStatusAdmin } from "../../service/api.admin.service";

// Thunk: lấy tất cả đơn hàng (admin)
export const fetchAllOrders = createAsyncThunk(
  "adminOrder/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllOrders();
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Lỗi khi lấy danh sách đơn hàng"
      );
    }
  }
);

// Thunk: cập nhật trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk(
  "adminOrder/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await updateOrderStatusAdmin(orderId, status);
      return { ...res.data?.data, orderId, status };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Lỗi khi cập nhật trạng thái đơn hàng"
      );
    }
  }
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    updateSuccess: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.updateError = null;
    },
    clearUpdateStatus: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllOrders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải danh sách đơn hàng";
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        const { orderId, status } = action.payload;
        // Cập nhật trạng thái đơn hàng trong danh sách
        state.orders = state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "Không thể cập nhật trạng thái đơn hàng";
      });
  },
});

export const { clearErrors, clearUpdateStatus } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;