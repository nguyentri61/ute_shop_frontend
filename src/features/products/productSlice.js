import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    AllProducts,
    NewestProducts,
    BestSellingProducts,
    MostViewedProducts,
    TopDiscountProducts,
} from "../../service/api.product.service";

// thunk gọi API
export const fetchAllProducts = createAsyncThunk("product/fetchAll", async () => {
    const res = await AllProducts();
    return res.data;
});

export const fetchNewestProducts = createAsyncThunk("product/fetchNewest", async () => {
    const res = await NewestProducts();
    return res.data;
});

export const fetchBestSellingProducts = createAsyncThunk("product/fetchBestSelling", async () => {
    const res = await BestSellingProducts();
    return res.data;
});

export const fetchMostViewedProducts = createAsyncThunk("product/fetchMostViewed", async () => {
    const res = await MostViewedProducts();
    return res.data;
});

export const fetchTopDiscountProducts = createAsyncThunk("product/fetchTopDiscount", async () => {
    const res = await TopDiscountProducts();
    return res.data;
});

const productSlice = createSlice({
    name: "product",
    initialState: {
        all: [],
        newest: [],
        bestSelling: [],
        mostViewed: [],
        topDiscount: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // All
            .addCase(fetchAllProducts.pending, (state) => { state.loading = true; })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.all = action.payload;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Newest
            .addCase(fetchNewestProducts.fulfilled, (state, action) => {
                state.newest = action.payload;
            })

            // BestSelling
            .addCase(fetchBestSellingProducts.fulfilled, (state, action) => {
                state.bestSelling = action.payload;
            })

            // MostViewed
            .addCase(fetchMostViewedProducts.fulfilled, (state, action) => {
                state.mostViewed = action.payload;
            })

            // TopDiscount
            .addCase(fetchTopDiscountProducts.fulfilled, (state, action) => {
                state.topDiscount = action.payload;
            });
    },
});

export default productSlice.reducer;
