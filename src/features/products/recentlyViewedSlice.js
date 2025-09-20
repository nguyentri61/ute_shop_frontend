import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetRecentlyViewedProducts,
  AddToRecentlyViewed
} from "../../service/api.favorite.service";

// Thunk actions
export const fetchRecentlyViewed = createAsyncThunk(
  "recentlyViewed/fetchRecentlyViewed",
  async (limit = 8, { rejectWithValue }) => {
    try {
      const res = await GetRecentlyViewedProducts(limit);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Không thể tải sản phẩm đã xem");
    }
  }
);

export const addToRecentlyViewed = createAsyncThunk(
  "recentlyViewed/addToRecentlyViewed",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await AddToRecentlyViewed(productId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Không thể cập nhật sản phẩm đã xem");
    }
  }
);

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch recently viewed products
      .addCase(fetchRecentlyViewed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchRecentlyViewed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to recently viewed
      .addCase(addToRecentlyViewed.fulfilled, (state, action) => {
        // Nếu API trả về danh sách mới, cập nhật state
        if (Array.isArray(action.payload)) {
          state.products = action.payload;
        }
      });
  },
});

export default recentlyViewedSlice.reducer;