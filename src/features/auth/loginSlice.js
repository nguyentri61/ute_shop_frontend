import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Login } from '../../service/api.auth.service';

// thunk async
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await Login(email, password);

      if (res?.code === 200) {
        // Trả về dữ liệu cần thiết cho Redux state
        return res.data; // { accessToken: "..." }
      } else {
        return rejectWithValue(res?.data?.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể kết nối tới server. Kiểm tra mạng hoặc cấu hình CORS.';
      return rejectWithValue(msg);
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    email: '',
    password: '',
    user: null,
    token: null,
    error: '',
    loading: false,
    isAuthenticated: false,
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.isAuthenticated = true;

        state.token = action.payload?.accessToken || null;
        state.user = action.payload?.user || null;

        if (state.token) {
          localStorage.setItem('token', state.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đăng nhập thất bại';
        state.isAuthenticated = false;
      });
  },
});

export const { setEmail, setPassword, logout } = loginSlice.actions;
export default loginSlice.reducer;
