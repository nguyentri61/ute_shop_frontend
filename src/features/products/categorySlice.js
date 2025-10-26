// src/features/category/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AllCategories } from "../../service/api.category.service";

// Thunk gọi API fetch tất cả categories
export const fetchAllCategories = createAsyncThunk(
    "category/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await AllCategories();

            // Chuẩn hoá nhiều dạng response có thể có:
            // - res.data.data -> { items, meta } hoặc array
            // - res.data -> array or object
            // - res -> array
            const payload = res?.data?.data ?? res?.data ?? res;

            // Nếu payload là object có items, dùng items
            if (payload && typeof payload === "object" && !Array.isArray(payload)) {
                if (Array.isArray(payload.items)) return payload.items;
                // nếu payload itself is an object representing a single category, wrap into array
                // but typically we expect items or array
                // try to extract array-like values
                const maybeArray = Object.values(payload).find((v) => Array.isArray(v));
                if (maybeArray) return maybeArray;
                // fallback: return empty array
                return [];
            }

            // nếu payload là array -> trả về luôn
            if (Array.isArray(payload)) return payload;

            // fallback
            return [];
        } catch (err) {
            // normalize error message
            const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || "Lỗi khi tải danh mục";
            return rejectWithValue(msg);
        }
    }
);

const initialState = {
    all: [],
    loading: false,
    error: null,
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        // optional: hỗ trợ reset
        clearCategories(state) {
            state.all = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // pending
            .addCase(fetchAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // fulfilled
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // action.payload is normalized to an array in thunk
                state.all = Array.isArray(action.payload) ? action.payload : [];
            })
            // rejected
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message || "Lỗi khi tải danh mục";
            });
    },
});

export const { clearCategories } = categorySlice.actions;

// Selectors
export const selectAllCategories = (state) => state.category?.all ?? [];
export const selectCategoriesLoading = (state) => state.category?.loading ?? false;
export const selectCategoriesError = (state) => state.category?.error ?? null;

export default categorySlice.reducer;
