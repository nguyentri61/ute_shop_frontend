import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    PreCheckout
} from "../../service/api.cart.service";

export const fetchPreCheckout = createAsyncThunk(
    "carts/selected",
    async ({ cartItemIds, shippingVoucher, productVoucher }, { rejectWithValue }) => {
        try {
            const res = await PreCheckout(cartItemIds, shippingVoucher, productVoucher);
            console.log("PreCheckout", res);
            return res.data;
        } catch (err) {
            console.log(err.message);
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const cartSlice = createSlice({
    name: "cartItems",
    initialState: {
        items: [],
        subTotal: 0,
        shippingFee: 0,
        shippingDiscount: 0,
        productDiscount: 0,
        total: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Pending
            .addCase(fetchPreCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fulfilled
            .addCase(fetchPreCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.subTotal = action.payload.summary.subTotal;
                state.shippingFee = action.payload.summary.shippingFee;
                state.shippingDiscount = action.payload.summary.shippingDiscount;
                state.productDiscount = action.payload.summary.productDiscount;
                state.total = action.payload.summary.total;
            })
            // Rejected
            .addCase(fetchPreCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default cartSlice.reducer;