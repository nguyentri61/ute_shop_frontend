// src/features/admin/adminUserSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    unblockAdminUser,
    changeAdminUserRole,
} from "../../service/api.admin.service.jsx";

/**
 * Thunks
 */
export const fetchAdminUsers = createAsyncThunk(
    "adminUsers/fetch",
    async (opts = {}, { rejectWithValue }) => {
        try {
            const res = await getAdminUsers(opts);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

export const createUser = createAsyncThunk(
    "adminUsers/create",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await createAdminUser(payload);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    "adminUsers/update",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await updateAdminUser(id, payload);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

export const removeUser = createAsyncThunk(
    "adminUsers/delete",
    async (id, { rejectWithValue }) => {
        try {
            const res = await deleteAdminUser(id);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

// Optional: unblock
export const unblockUser = createAsyncThunk(
    "adminUsers/unblock",
    async (id, { rejectWithValue }) => {
        try {
            const res = await unblockAdminUser(id);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

// Optional: change role
export const changeUserRole = createAsyncThunk(
    "adminUsers/changeRole",
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const res = await changeAdminUserRole(id, role);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

/**
 * Slice
 */
const slice = createSlice({
    name: "adminUsers",
    initialState: {
        items: [],
        meta: { total: 0, page: 1, size: 10, totalPages: 1 },
        loading: false,
        error: null,
        crudLoading: false,
        crudError: null,
        lastSuccess: null, // helpful to trigger UI effects
    },
    reducers: {
        // small helper if you need to reset state from UI
        resetAdminUsersState: (state) => {
            state.items = [];
            state.meta = { total: 0, page: 1, size: 10, totalPages: 1 };
            state.loading = false;
            state.error = null;
            state.crudLoading = false;
            state.crudError = null;
            state.lastSuccess = null;
        },
    },
    extraReducers: (builder) => {
        // fetch
        builder
            .addCase(fetchAdminUsers.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(fetchAdminUsers.fulfilled, (s, a) => {
                s.loading = false;
                const payload = a.payload ?? {};
                s.items = payload.items ?? payload.users ?? [];
                s.meta = payload.meta ?? s.meta;
            })
            .addCase(fetchAdminUsers.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload || a.error?.message;
            });

        // create
        builder
            .addCase(createUser.pending, (s) => {
                s.crudLoading = true;
                s.crudError = null;
            })
            .addCase(createUser.fulfilled, (s, a) => {
                s.crudLoading = false;
                // If backend returns created user, prepend it
                const created = a.payload ?? a.payload?.data ?? null;
                if (created && created.id) {
                    s.items = [created, ...s.items];
                    s.meta.total = (s.meta.total || 0) + 1;
                }
                s.lastSuccess = { type: "create", payload: created };
            })
            .addCase(createUser.rejected, (s, a) => {
                s.crudLoading = false;
                s.crudError = a.payload || a.error?.message;
            });

        // update
        builder
            .addCase(updateUser.pending, (s) => {
                s.crudLoading = true;
                s.crudError = null;
            })
            .addCase(updateUser.fulfilled, (s, a) => {
                s.crudLoading = false;
                const updated = a.payload ?? a.payload?.data ?? null;
                if (updated && updated.id) {
                    s.items = s.items.map((it) => (it.id === updated.id ? { ...it, ...updated } : it));
                }
                s.lastSuccess = { type: "update", payload: updated };
            })
            .addCase(updateUser.rejected, (s, a) => {
                s.crudLoading = false;
                s.crudError = a.payload || a.error?.message;
            });

        // delete (soft-block expected)
        builder
            .addCase(removeUser.pending, (s) => {
                s.crudLoading = true;
                s.crudError = null;
            })
            .addCase(removeUser.fulfilled, (s, a) => {
                s.crudLoading = false;
                const deleted = a.payload ?? a.payload?.data ?? null;
                // If backend returns id or user object, try to update list
                const deletedId = deleted?.id ?? deleted;
                if (deletedId) {
                    // mark as blocked if backend returns user, otherwise remove from list
                    s.items = s.items.map((it) => (it.id === deletedId ? { ...it, blocked: true } : it)).filter(Boolean);
                    s.meta.total = Math.max(0, (s.meta.total || 1) - 1);
                }
                s.lastSuccess = { type: "delete", payload: deleted };
            })
            .addCase(removeUser.rejected, (s, a) => {
                s.crudLoading = false;
                s.crudError = a.payload || a.error?.message;
            });

        // unblock
        builder
            .addCase(unblockUser.pending, (s) => {
                s.crudLoading = true;
                s.crudError = null;
            })
            .addCase(unblockUser.fulfilled, (s, a) => {
                s.crudLoading = false;
                const u = a.payload ?? a.payload?.data ?? null;
                if (u && u.id) {
                    s.items = s.items.map((it) => (it.id === u.id ? { ...it, ...u } : it));
                }
                s.lastSuccess = { type: "unblock", payload: u };
            })
            .addCase(unblockUser.rejected, (s, a) => {
                s.crudLoading = false;
                s.crudError = a.payload || a.error?.message;
            });

        // change role
        builder
            .addCase(changeUserRole.pending, (s) => {
                s.crudLoading = true;
                s.crudError = null;
            })
            .addCase(changeUserRole.fulfilled, (s, a) => {
                s.crudLoading = false;
                const u = a.payload ?? a.payload?.data ?? null;
                if (u && u.id) {
                    s.items = s.items.map((it) => (it.id === u.id ? { ...it, ...u } : it));
                }
                s.lastSuccess = { type: "changeRole", payload: u };
            })
            .addCase(changeUserRole.rejected, (s, a) => {
                s.crudLoading = false;
                s.crudError = a.payload || a.error?.message;
            });
    },
});

// Selectors
export const selectAdminUsers = (state) => state.adminUsers?.items ?? [];
export const selectAdminUsersMeta = (state) => state.adminUsers?.meta ?? { total: 0, page: 1, size: 10, totalPages: 1 };
export const selectAdminUsersLoading = (state) => state.adminUsers?.loading ?? false;
export const selectAdminUsersCrudLoading = (state) => state.adminUsers?.crudLoading ?? false;
export const selectAdminUsersError = (state) => state.adminUsers?.error ?? null;

export const { resetAdminUsersState } = slice.actions;
export default slice.reducer;
