import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetFavorites,
  AddToFavorites,
  RemoveFromFavorites,
  CheckIsFavorite
} from "../../service/api.favorite.service";
import { showSuccess, showError } from "../../utils/toast";

// Thunk actions
export const fetchFavorites = createAsyncThunk(
  "favorite/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GetFavorites();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Không thể tải sản phẩm yêu thích");
    }
  }
);

export const addToFavorites = createAsyncThunk(
  "favorite/addToFavorites",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await AddToFavorites(productId);
      showSuccess("Đã thêm vào danh sách yêu thích");
      return { productId, data: res.data };
    } catch (error) {
      showError(error.response?.data?.message || "Không thể thêm vào yêu thích");
      return rejectWithValue(error.response?.data?.message || "Không thể thêm vào yêu thích");
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "favorite/removeFromFavorites",
  async (productId, { rejectWithValue }) => {
    try {
      await RemoveFromFavorites(productId);
      showSuccess("Đã xóa khỏi danh sách yêu thích");
      return productId;
    } catch (error) {
      showError(error.response?.data?.message || "Không thể xóa khỏi yêu thích");
      return rejectWithValue(error.response?.data?.message || "Không thể xóa khỏi yêu thích");
    }
  }
);

export const checkIsFavorite = createAsyncThunk(
  "favorite/checkIsFavorite",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await CheckIsFavorite(productId);
      return { productId, isFavorite: res.data.isFavorite };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Không thể kiểm tra trạng thái yêu thích");
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    favorites: [],
    favoriteIds: [], // Sử dụng array thay vì Set
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
        state.favoriteIds = action.payload.map(item => item.id);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to favorites
      .addCase(addToFavorites.fulfilled, (state, action) => {
        const { productId, data } = action.payload;
        if (!state.favoriteIds.includes(productId)) {
          state.favorites.push(data);
          state.favoriteIds.push(productId);
        }
      })

      // Remove from favorites
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        const productId = action.payload;
        state.favorites = state.favorites.filter(item => item.id !== productId);
        state.favoriteIds = state.favoriteIds.filter(id => id !== productId);
      })

      // Check is favorite
      .addCase(checkIsFavorite.fulfilled, (state, action) => {
        const { productId, isFavorite } = action.payload;
        if (isFavorite) {
          if (!state.favoriteIds.includes(productId)) {
            state.favoriteIds.push(productId);
          }
        } else {
          state.favoriteIds = state.favoriteIds.filter(id => id !== productId);
        }
      });
  },
});

export default favoriteSlice.reducer;