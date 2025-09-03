import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AllCategories } from "../../service/api.category.service";

// Thunk gọi API fetch tất cả categories
export const fetchAllCategories = createAsyncThunk(
    "category/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await AllCategories();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState: {
        all: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Pending
            .addCase(fetchAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fulfilled
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.all = action.payload;
            })
            // Rejected
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default categorySlice.reducer;
