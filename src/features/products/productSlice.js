import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    AllProducts,
    PaginatedProducts,
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

export const fetchPaginatedProducts = createAsyncThunk("product/fetchPaginatedProducts", async ({ page, limit }) => {
    const res = await PaginatedProducts({ page, limit });
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
        paginated: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
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
            // Paginated
            .addCase(fetchPaginatedProducts.pending, (state) => { state.loading = true; })
            .addCase(fetchPaginatedProducts.fulfilled, (state, action) => {
                state.loading = false;

                console.log("Payload:", action.payload);
                state.paginated = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchPaginatedProducts.rejected, (state, action) => {
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
