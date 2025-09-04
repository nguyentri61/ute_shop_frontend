// src/features/auth/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetMyProfile, UpdateProfile } from "../../service/api.auth.service";

// Thunk: fetch profile từ API
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GetMyProfile();
      const d = res?.data ?? res;
      if (d && typeof d === "object" && "status" in d && "data" in d)
        return d.data;
      return d;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Lỗi khi lấy thông tin"
      );
    }
  }
);

// Thunk: update profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await UpdateProfile(profileData);
      const d = res?.data ?? res;

      // Xử lý response có cấu trúc { status, data, message }
      if (d && typeof d === "object" && "status" in d && "data" in d) {
        if (d.status === 200 || d.status === "SUCCESS") {
          return d.data;
        } else {
          return rejectWithValue(d.message || "Lỗi khi cập nhật thông tin");
        }
      }

      return d;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Lỗi khi cập nhật thông tin"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
    editing: false,
    updating: false,
    updateError: null,
    updateSuccess: false,
  },
  reducers: {
    startEdit: (state) => {
      state.editing = true;
      state.updateError = null;
      state.updateSuccess = false;
    },
    cancelEdit: (state) => {
      state.editing = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    updateProfileLocal: (state, action) => {
      // Chỉ update local state, không gọi API
      state.data = { ...state.data, ...action.payload };
      state.editing = false;
    },
    clearUpdateStatus: (state) => {
      state.updateError = null;
      state.updateSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.data = null;
      state.editing = false;
      state.updating = false;
      state.updateError = null;
      state.updateSuccess = false;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH PROFILE CASES ==========
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = {
          id: action.payload.id,
          email: action.payload.email,
          fullName: action.payload.fullName || "Chưa cập nhật",
          phone: action.payload.phone || "",
          address: action.payload.address || "",
          gender: action.payload.gender || "other",
          role: action.payload.role,
          username: action.payload.username || "",
          verified: Boolean(action.payload.verified),
          createdAt: action.payload.createdAt
            ? new Date(action.payload.createdAt).toISOString() // Convert to ISO string
            : null,
        };
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải hồ sơ";
      })

      // ========== UPDATE PROFILE CASES ==========
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.editing = false;

        // Update the profile data with new information
        if (action.payload) {
          state.data = {
            ...state.data,
            fullName: action.payload.fullName || state.data.fullName,
            email: action.payload.email || state.data.email,
            phone: action.payload.phone || state.data.phone,
            address: action.payload.address || state.data.address,
            gender: action.payload.gender || state.data.gender,
            // Giữ nguyên các trường không thay đổi
            id: state.data.id,
            role: state.data.role,
            username: state.data.username,
            verified: state.data.verified,
            createdAt: action.payload.createdAt
              ? new Date(action.payload.createdAt).toISOString() // Convert to ISO string
              : state.data.createdAt,
          };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || "Không thể cập nhật thông tin";
      });
  },
});

export const {
  startEdit,
  cancelEdit,
  updateProfileLocal,
  clearUpdateStatus,
  clearError,
  logout,
} = profileSlice.actions;

export default profileSlice.reducer;
