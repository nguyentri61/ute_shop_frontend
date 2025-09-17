import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    PreCheckout,
    UpdateQuantity,
    AddToCart,
    RemoveFromCart,
    GetCart,
} from "../../service/api.cart.service";

// ----- Async Thunks -----
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const res = await GetCart();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ variantId, quantity }, { rejectWithValue }) => {
        try {
            const res = await AddToCart(variantId, quantity);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (cartItemId, { rejectWithValue }) => {
        try {
            await RemoveFromCart(cartItemId);
            return cartItemId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async ({ cartItemId, quantity }, { rejectWithValue }) => {
        try {
            const res = await UpdateQuantity(cartItemId, quantity);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchPreCheckout = createAsyncThunk(
    "cart/fetchPreCheckout",
    async ({ cartItemIds, shippingVoucher, productVoucher }, { rejectWithValue }) => {
        try {
            const res = await PreCheckout(cartItemIds, shippingVoucher, productVoucher);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ----- Helper -----
const calcSummary = (items, preCheckout = {}) => {
    const subTotal = items.reduce((sum, item) => {
        const price = item.variant?.discountPrice ?? item.variant?.price ?? 0;
        const qty = item.quantity ?? 0;
        return sum + price * qty;
    }, 0);

    return {
        subTotal,
        shippingFee: preCheckout.shippingFee ?? 0,
        shippingDiscount: preCheckout.shippingDiscount ?? 0,
        productDiscount: preCheckout.productDiscount ?? 0,
        total: preCheckout.total ?? subTotal,
    };
};

// ----- Slice -----
const cartSlice = createSlice({
    name: "cart",
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
    reducers: {
        clearCart: (state) => {
            state.items = [];
            Object.assign(state, calcSummary([]));
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchCart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
                Object.assign(state, calcSummary(state.items));
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // addToCart
            .addCase(addToCart.fulfilled, (state, action) => {
                if (action.payload) {
                    state.items.push(action.payload);
                    Object.assign(state, calcSummary(state.items));
                }
            })

            // removeFromCart
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = state.items.filter((i) => i.id !== action.payload);
                Object.assign(state, calcSummary(state.items));
            })

            // updateQuantity
            .addCase(updateQuantity.fulfilled, (state, action) => {
                const { id: cartItemId, quantity } = action.payload;
                const itemIndex = state.items.findIndex(i => i.id === cartItemId);

                if (itemIndex !== -1) {
                    if (quantity <= 0) {
                        // Xóa item nếu quantity = 0
                        state.items.splice(itemIndex, 1);
                    } else {
                        state.items[itemIndex].quantity = quantity;
                    }
                    Object.assign(state, calcSummary(state.items));
                }
            })

            // fetchPreCheckout
            .addCase(fetchPreCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPreCheckout.fulfilled, (state, action) => {
                state.loading = false;
                Object.assign(state, calcSummary(state.items, action.payload));
            })
            .addCase(fetchPreCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
