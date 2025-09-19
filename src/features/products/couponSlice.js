import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetMyCoupons } from "../../service/api.coupon.service";

// Thunk gọi API fetch tất cả categories
export const fetchMyShippingCoupons = createAsyncThunk(
    "coupons/fetchMyShippingCoupons",
    async (_, { rejectWithValue }) => {
        try {
            const res = await GetMyCoupons("SHIPPING");
            console.log("SHIPPING", res);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchMyProductCoupons = createAsyncThunk(
    "coupons/fetchMyProductCoupons",
    async (_, { rejectWithValue }) => {
        try {
            const res = await GetMyCoupons("PRODUCT");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const couponSlice = createSlice({
    name: "coupons",
    initialState: {
        shippingCoupons: [],
        productCoupons: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Pending
            .addCase(fetchMyShippingCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyProductCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fulfilled
            .addCase(fetchMyShippingCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.shippingCoupons = action.payload;
            })
            .addCase(fetchMyProductCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.productCoupons = action.payload;
            })
            // Rejected
            .addCase(fetchMyShippingCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchMyProductCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default couponSlice.reducer;
