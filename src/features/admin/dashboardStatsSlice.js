// src/features/admin/dashboardStatsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats, getWeeklySales, getCategoryShare } from '../../service/api.admin.service';

// ========== Thunk: Stats cards ==========
export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const res = await getDashboardStats();
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

// ========== Thunk: Weekly sales (Area chart) ==========
export const fetchWeeklySales = createAsyncThunk(
    'dashboard/fetchWeeklySales',
    async (options = {}, { rejectWithValue }) => {
        try {
            const res = await getWeeklySales(options); // { status?: 'DELIVERED' }
            return res.data?.data ?? res.data; // [{ name, sales, orders, date }]
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

// ========== Thunk: Category share (Pie chart) ==========
export const fetchCategoryShare = createAsyncThunk(
    'dashboard/fetchCategoryShare',
    async (options = {}, { rejectWithValue }) => {
        try {
            // options: { status?: 'DELIVERED', range?: '30d' | '7d' | '90d' | 'month', start?: 'YYYY-MM-DD', end?: 'YYYY-MM-DD' }
            const res = await getCategoryShare(options);
            return res.data?.data ?? res.data; // [{ categoryId, name, value, units }]
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        // Stats cards
        stats: null,
        statsLoading: false,
        statsError: null,

        // Weekly sales
        weeklySales: [],     // [{ name, sales, orders, date }]
        weeklyLoading: false,
        weeklyError: null,

        // Category share
        categoryShare: [],   // [{ categoryId, name, value, units }]
        categoryLoading: false,
        categoryError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ---- Stats ----
            .addCase(fetchDashboardStats.pending, (state) => {
                state.statsLoading = true;
                state.statsError = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.statsError = action.payload;
            })

            // ---- Weekly sales ----
            .addCase(fetchWeeklySales.pending, (state) => {
                state.weeklyLoading = true;
                state.weeklyError = null;
            })
            .addCase(fetchWeeklySales.fulfilled, (state, action) => {
                state.weeklyLoading = false;
                state.weeklySales = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchWeeklySales.rejected, (state, action) => {
                state.weeklyLoading = false;
                state.weeklyError = action.payload;
            })

            // ---- Category share ----
            .addCase(fetchCategoryShare.pending, (state) => {
                state.categoryLoading = true;
                state.categoryError = null;
            })
            .addCase(fetchCategoryShare.fulfilled, (state, action) => {
                state.categoryLoading = false;
                state.categoryShare = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchCategoryShare.rejected, (state, action) => {
                state.categoryLoading = false;
                state.categoryError = action.payload;
            });
    },
});

export default dashboardSlice.reducer;

// Selectors
export const selectDashboardStats = (state) => state.dashboardStats.stats;
export const selectWeeklySales = (state) => state.dashboardStats.weeklySales;
export const selectCategoryShare = (state) => state.dashboardStats.categoryShare;

export const selectDashboardLoading = (state) => state.dashboardStats.statsLoading;
export const selectWeeklyLoading = (state) => state.dashboardStats.weeklyLoading;
export const selectCategoryLoading = (state) => state.dashboardStats.categoryLoading;

export const selectDashboardError = (state) => state.dashboardStats.statsError;
export const selectWeeklyError = (state) => state.dashboardStats.weeklyError;
export const selectCategoryError = (state) => state.dashboardStats.categoryError;
