import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Register } from '../../service/api.auth.service';

// Async thunk để đăng ký user
export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await Register(email, password);
            if (res?.code === 200) {
                // server gửi OTP sau khi đăng ký
                return { message: res.message || "Đăng ký thành công", email };
            } else {
                return rejectWithValue('Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Không thể kết nối tới server.';
            return rejectWithValue(msg);
        }
    }
);

const registerSlice = createSlice({
    name: 'register',
    initialState: {
        email: '',
        password: '',
        loading: false,
        error: '',
        success: false,
        otpEmail: null, // email để xác thực OTP
    },
    reducers: {
        setEmail: (state, action) => { state.email = action.payload; },
        setPassword: (state, action) => { state.password = action.payload; },
        resetRegister: (state) => {
            state.email = '';
            state.password = '';
            state.loading = false;
            state.error = '';
            state.success = false;
            state.otpEmail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.otpEmail = action.payload.email;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Đăng ký thất bại';
            });
    },
});

export const { setEmail, setPassword, resetRegister } = registerSlice.actions;
export default registerSlice.reducer;
