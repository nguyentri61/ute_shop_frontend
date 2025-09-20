import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetSimilarProducts } from "../../service/api.favorite.service";

// Thunk actions
export const fetchSimilarProducts = createAsyncThunk(
  "similarProducts/fetchSimilarProducts",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await GetSimilarProducts(productId, 8);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Không thể tải sản phẩm tương tự");
    }
  }
);

const similarProductsSlice = createSlice({
  name: "similarProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSimilarProducts: (state) => {
      state.products = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSimilarProducts } = similarProductsSlice.actions;
export default similarProductsSlice.reducer;