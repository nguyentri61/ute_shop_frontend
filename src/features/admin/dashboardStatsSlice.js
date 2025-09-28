import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats } from '../../service/api.admin.service';

// Async thunk để gọi API
export const fetchDashboardStats = createAsyncThunk(
    'dashboardStats/fetchDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getDashboardStats();
            console.log('API response for dashboard stats:', response);
            return response.data?.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const dashboardStatsSlice = createSlice({
    name: 'dashboardStats',
    initialState: {
        stats: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardStatsSlice.reducer;