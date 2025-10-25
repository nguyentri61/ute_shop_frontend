import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAdminCategories,
    getAdminCategoryById,
    createAdminCategory,
    updateAdminCategory,
    deleteAdminCategory,
} from "../../service/api.admin.service";

// ========== Thunks ==========
export const fetchAdminCategories = createAsyncThunk(
    "adminCategories/fetchList",
    async ({ q = "", page = 1, size = 10 } = {}, { rejectWithValue }) => {
        try {
            const res = await getAdminCategories({ q, page, size });
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

export const fetchAdminCategory = createAsyncThunk(
    "adminCategories/fetchOne",
    async (id, { rejectWithValue }) => {
        try {
            const res = await getAdminCategoryById(id);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

export const createAdminCategoryThunk = createAsyncThunk(
    "adminCategories/create",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await createAdminCategory(payload);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

export const updateAdminCategoryThunk = createAsyncThunk(
    "adminCategories/update",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await updateAdminCategory(id, payload);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

export const deleteAdminCategoryThunk = createAsyncThunk(
    "adminCategories/delete",
    async (id, { rejectWithValue }) => {
        try {
            const res = await deleteAdminCategory(id);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

// ========== Slice ==========
const slice = createSlice({
    name: "adminCategories",
    initialState: {
        items: [],
        meta: { total: 0, page: 1, size: 10, totalPages: 0 },
        listLoading: false,
        listError: null,

        selected: null,
        selectedLoading: false,
        selectedError: null,

        crudLoading: false,
        crudError: null,
    },
    reducers: {
        clearSelected(state) {
            state.selected = null;
            state.selectedError = null;
            state.selectedLoading = false;
        },
    },
    extraReducers: (builder) => {
        // fetch list
        builder
            .addCase(fetchAdminCategories.pending, (state) => {
                state.listLoading = true;
                state.listError = null;
            })
            .addCase(fetchAdminCategories.fulfilled, (state, action) => {
                state.listLoading = false;
                const payload = action.payload;
                if (Array.isArray(payload)) {
                    state.items = payload;
                    state.meta = { ...state.meta, total: payload.length };
                } else {
                    state.items = payload.items ?? payload;
                    state.meta = payload.meta ?? state.meta;
                }
            })
            .addCase(fetchAdminCategories.rejected, (state, action) => {
                state.listLoading = false;
                state.listError = action.payload || action.error.message;
            });

        // fetch one
        builder
            .addCase(fetchAdminCategory.pending, (state) => {
                state.selectedLoading = true;
                state.selectedError = null;
            })
            .addCase(fetchAdminCategory.fulfilled, (state, action) => {
                state.selectedLoading = false;
                state.selected = action.payload;
            })
            .addCase(fetchAdminCategory.rejected, (state, action) => {
                state.selectedLoading = false;
                state.selectedError = action.payload || action.error.message;
            });

        // create
        builder
            .addCase(createAdminCategoryThunk.pending, (state) => {
                state.crudLoading = true;
                state.crudError = null;
            })
            .addCase(createAdminCategoryThunk.fulfilled, (state, action) => {
                state.crudLoading = false;
                if (action.payload) state.items.unshift(action.payload);
            })
            .addCase(createAdminCategoryThunk.rejected, (state, action) => {
                state.crudLoading = false;
                state.crudError = action.payload || action.error.message;
            });

        // update
        builder
            .addCase(updateAdminCategoryThunk.pending, (state) => {
                state.crudLoading = true;
                state.crudError = null;
            })
            .addCase(updateAdminCategoryThunk.fulfilled, (state, action) => {
                state.crudLoading = false;
                const updated = action.payload;
                if (updated && updated.id) {
                    state.items = state.items.map((it) => (it.id === updated.id ? updated : it));
                }
                if (state.selected && state.selected.id === updated?.id) state.selected = updated;
            })
            .addCase(updateAdminCategoryThunk.rejected, (state, action) => {
                state.crudLoading = false;
                state.crudError = action.payload || action.error.message;
            });

        // delete
        builder
            .addCase(deleteAdminCategoryThunk.pending, (state) => {
                state.crudLoading = true;
                state.crudError = null;
            })
            .addCase(deleteAdminCategoryThunk.fulfilled, (state, action) => {
                state.crudLoading = false;
                const removed = action.payload;
                const removedId = removed?.id ?? removed;
                if (removedId) state.items = state.items.filter((it) => it.id !== removedId);
            })
            .addCase(deleteAdminCategoryThunk.rejected, (state, action) => {
                state.crudLoading = false;
                state.crudError = action.payload || action.error.message;
            });
    },
});

export const { clearSelected } = slice.actions;
export default slice.reducer;

// Selectors
export const selectAdminCategories = (state) => state.adminCategories.items;
export const selectAdminCategoriesMeta = (state) => state.adminCategories.meta;
export const selectAdminCategoriesLoading = (state) => state.adminCategories.listLoading;
export const selectAdminCategoriesError = (state) => state.adminCategories.listError;

export const selectAdminCategorySelected = (state) => state.adminCategories.selected;
export const selectAdminCategoryCrudLoading = (state) => state.adminCategories.crudLoading;
export const selectAdminCategoryCrudError = (state) => state.adminCategories.crudError;
