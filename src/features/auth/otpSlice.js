import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VerifyOtp } from '../../service/api.auth.service';

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const res = await VerifyOtp(email, otp);
            return res.message;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const otpSlice = createSlice({
    name: 'otp',
    initialState: {
        loading: false,
        error: '',
        success: false,
    },
    reducers: {
        resetOtp: (state) => {
            state.loading = false;
            state.error = '';
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = ''; })
            .addCase(verifyOtp.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(verifyOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { resetOtp } = otpSlice.actions;
export default otpSlice.reducer;
