// src/features/profile/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetMyProfile } from "../../service/api.auth.service";

// Thunk: fetch profile từ API
export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await GetMyProfile();
            const d = res?.data ?? res;
            if (d && typeof d === "object" && "code" in d && "data" in d) return d.data;
            return d;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Lỗi khi lấy thông tin");
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
    },
    reducers: {
        startEdit: (state) => {
            state.editing = true;
        },
        cancelEdit: (state) => {
            state.editing = false;
        },
        updateProfileLocal: (state, action) => {
            state.data = { ...state.data, ...action.payload };
            state.editing = false;
        },
        logout: (state) => {
            localStorage.removeItem("token");
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = {
                    id: action.payload.id,
                    email: action.payload.email,
                    name:
                        action.payload.name ||
                        action.payload.username ||
                        action.payload.email?.split?.("@")?.[0] ||
                        "Người dùng",
                    avatarUrl:
                        action.payload.avatarUrl ||
                        action.payload.avatar ||
                        action.payload.picture ||
                        "https://via.placeholder.com/150",
                    role: action.payload.role,
                    verified: Boolean(action.payload.verified),
                    createdAt: action.payload.createdAt
                        ? new Date(action.payload.createdAt)
                        : null,
                };
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Không thể tải hồ sơ";
            });
    },
});

export const { startEdit, cancelEdit, updateProfileLocal, logout } =
    profileSlice.actions;
export default profileSlice.reducer;
