import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ForgotPassword } from "../../service/api.auth.service";

// thunk async
export const forgotPasswordUser = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const res = await ForgotPassword(email);

            if (res?.status === 200 || res?.success === true) {
                return res.data ?? res; // server trả về { message: "...", success: true }
            } else {
                return rejectWithValue(res?.data?.message || "Gửi email thất bại");
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Không thể kết nối tới server. Kiểm tra mạng hoặc CORS.";
            return rejectWithValue(msg);
        }
    }
);

const forgotPasswordSlice = createSlice({
    name: "forgotPassword",
    initialState: {
        email: "",
        sent: false,
        loading: false,
        error: "",
    },
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        resetForgot: (state) => {
            state.sent = false;
            state.error = "";
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(forgotPasswordUser.pending, (state) => {
                state.loading = true;
                state.error = "";
                state.sent = false;
            })
            .addCase(forgotPasswordUser.fulfilled, (state) => {
                state.loading = false;
                state.sent = true;
                state.error = "";
            })
            .addCase(forgotPasswordUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Gửi email thất bại";
                state.sent = false;
            });
    },
});

export const { setEmail, resetForgot } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
