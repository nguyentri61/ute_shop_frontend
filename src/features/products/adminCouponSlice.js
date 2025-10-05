import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    GetCouponStats,
    GetCouponDistribution,
    GetExpiringCoupons,
    CreateCoupon,
    GetCoupons,
} from "../../service/api.coupon.service";
import toast from "react-hot-toast";

// 📊 1. Lấy thống kê tổng quan mã giảm giá
export const fetchCouponStats = createAsyncThunk(
    "adminCoupons/fetchCouponStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await GetCouponStats();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 🥧 2. Lấy dữ liệu phân bố loại mã (PRODUCT, ORDER, USER)
export const fetchCouponDistribution = createAsyncThunk(
    "adminCoupons/fetchCouponDistribution",
    async (_, { rejectWithValue }) => {
        try {
            const res = await GetCouponDistribution();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ⏳ 3. Lấy danh sách mã sắp hết hạn trong 30 ngày tới
export const fetchExpiringCoupons = createAsyncThunk(
    "adminCoupons/fetchExpiringCoupons",
    async (_, { rejectWithValue }) => {
        try {
            const res = await GetExpiringCoupons();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ➕ 4. Tạo mã giảm giá mới + tự reload dữ liệu sau khi tạo
export const createCoupons = createAsyncThunk(
    "adminCoupons/createCoupons",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const res = await CreateCoupon(formData);
            toast.success("Tạo voucher thành công");

            await Promise.all([
                dispatch(fetchCouponStats()),
                dispatch(fetchCouponDistribution()),
                dispatch(fetchExpiringCoupons()),
                dispatch(fetchCoupons()),
            ]);

            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi tạo voucher");
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 📄 5. Lấy danh sách coupon (dành cho admin)
export const fetchCoupons = createAsyncThunk(
    "adminCoupons/fetchCoupons",
    async (filters = {}, { rejectWithValue }) => {
        try {
            console.log(filters);
            const res = await GetCoupons(filters);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


// 🧱 Slice quản lý state cho admin coupon
const couponSlice = createSlice({
    name: "adminCoupons",
    initialState: {
        stats: null,
        distribution: [],
        expiringCoupons: [],
        coupons: [],
        loading: false,
        error: null,
        creating: false,
        createSuccess: false,
    },
    reducers: {
        resetCreateState(state) {
            state.creating = false;
            state.createSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // === FETCH STATS ===
            .addCase(fetchCouponStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCouponStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchCouponStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // === FETCH DISTRIBUTION ===
            .addCase(fetchCouponDistribution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCouponDistribution.fulfilled, (state, action) => {
                state.loading = false;
                state.distribution = action.payload;
            })
            .addCase(fetchCouponDistribution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // === FETCH EXPIRING COUPONS ===
            .addCase(fetchExpiringCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpiringCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.expiringCoupons = action.payload;
            })
            .addCase(fetchExpiringCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // === CREATE COUPON ===
            .addCase(createCoupons.pending, (state) => {
                state.creating = true;
                state.createSuccess = false;
                state.error = null;
            })
            .addCase(createCoupons.fulfilled, (state) => {
                state.creating = false;
                state.createSuccess = true;
            })
            .addCase(createCoupons.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload || action.error.message;
            })
            // === FETCH COUPONS (list) ===
            .addCase(fetchCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload.items || [];
                state.pagination = {
                    page: action.payload.page,
                    size: action.payload.size,
                    total: action.payload.total,
                };
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

    },
});

export const { resetCreateState } = couponSlice.actions;
export default couponSlice.reducer;
