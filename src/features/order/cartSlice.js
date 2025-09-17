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
            console.log("fetchPreCheckOut: ", { cartItemIds, shippingVoucher, productVoucher });
            const res = await PreCheckout(cartItemIds, shippingVoucher, productVoucher);
            console.log("PreCheckout response: ", res.data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ----- Helper -----
const calcSummary = (items, preCheckout = {}, selectedIds = null) => {
    const list = selectedIds ? items.filter(i => selectedIds.includes(i.id)) : items;
    const subTotal = list.reduce((sum, item) => {
        const price = item.variant?.discountPrice ?? item.variant?.price ?? 0;
        const qty = item.quantity ?? 0;
        return sum + price * qty;
    }, 0);

    const summary = preCheckout.summary || preCheckout;

    return {
        subTotal,
        shippingFee: summary.shippingFee ?? 0,
        shippingDiscount: summary.shippingDiscount ?? 0,
        productDiscount: summary.productDiscount ?? 0,
        total: summary.total ?? subTotal,
    };
};

// ----- LocalStorage helper -----
const saveSelectionToStorage = (selectedIds) => {
    localStorage.setItem("selectedCartItemIds", JSON.stringify(selectedIds));
};
const loadSelectionFromStorage = () => {
    try {
        return JSON.parse(localStorage.getItem("selectedCartItemIds")) || [];
    } catch {
        return [];
    }
};

// ----- Slice -----
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        selectedCartItemIds: loadSelectionFromStorage(),
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
            state.selectedCartItemIds = [];
            saveSelectionToStorage([]);
            Object.assign(state, calcSummary([]));
        },
        setSelectedCartItems: (state, action) => {
            state.selectedCartItemIds = action.payload;
            saveSelectionToStorage(state.selectedCartItemIds);
        },
        toggleSelectItem: (state, action) => {
            const id = action.payload;
            if (state.selectedCartItemIds.includes(id)) {
                state.selectedCartItemIds = state.selectedCartItemIds.filter(i => i !== id);
            } else {
                state.selectedCartItemIds.push(id);
            }
            saveSelectionToStorage(state.selectedCartItemIds);
            Object.assign(state, calcSummary(state.items, {}, state.selectedCartItemIds));
        },
        selectAllItems: (state) => {
            state.selectedCartItemIds = state.items.map(i => i.id);
            saveSelectionToStorage(state.selectedCartItemIds);
            Object.assign(state, calcSummary(state.items, {}, state.selectedCartItemIds));
        },
        clearSelection: (state) => {
            state.selectedCartItemIds = [];
            saveSelectionToStorage([]);
            Object.assign(state, calcSummary(state.items, {}, []));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
                // Recalculate summary using selectedCartItemIds restored from localStorage
                Object.assign(state, calcSummary(state.items, {}, state.selectedCartItemIds));
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(addToCart.fulfilled, (state, action) => {
                if (action.payload) {
                    state.items.push(action.payload);
                    Object.assign(state, calcSummary(state.items));
                }
            })

            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = state.items.filter((i) => i.id !== action.payload);
                state.selectedCartItemIds = state.selectedCartItemIds.filter(i => i !== action.payload);
                saveSelectionToStorage(state.selectedCartItemIds);
                Object.assign(state, calcSummary(state.items, {}, state.selectedCartItemIds));
            })

            .addCase(updateQuantity.fulfilled, (state, action) => {
                const { id: cartItemId, quantity } = action.payload;
                const itemIndex = state.items.findIndex(i => i.id === cartItemId);
                if (itemIndex !== -1) {
                    if (quantity <= 0) {
                        state.items.splice(itemIndex, 1);
                        state.selectedCartItemIds = state.selectedCartItemIds.filter(i => i !== cartItemId);
                        saveSelectionToStorage(state.selectedCartItemIds);
                    } else {
                        state.items[itemIndex].quantity = quantity;
                    }
                    Object.assign(state, calcSummary(state.items, {}, state.selectedCartItemIds));
                }
            })

            .addCase(fetchPreCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPreCheckout.fulfilled, (state, action) => {
                state.loading = false;
                Object.assign(state, calcSummary(state.items, action.payload, state.selectedCartItemIds));
            })
            .addCase(fetchPreCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearCart, setSelectedCartItems, toggleSelectItem, selectAllItems, clearSelection } =
    cartSlice.actions;

export default cartSlice.reducer;
