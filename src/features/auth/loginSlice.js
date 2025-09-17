import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Login, GetCurrentUser } from "../../service/api.auth.service";

// Thunk để lấy thông tin người dùng hiện tại
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GetCurrentUser();
      console.log("fetchCurrentUser - API response:", res);
      // Xử lý cấu trúc phản hồi từ API /users/me
      // Cấu trúc: { status, message, data: { user } }
      // Kiểm tra cấu trúc phản hồi từ API
      console.log("Response structure:", JSON.stringify(res.data, null, 2));
      if (res && res.data) {
        if (res.data.data && res.data.data.user) {
          return res.data.data.user;
        } else if (res.data.user) {
          return res.data.user;
        } else {
          return res.data;
        }
      } else {
        return res;
      }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Không thể lấy thông tin người dùng"
      );
    }
  }
);

// thunk async
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const res = await Login(email, password);

      if (res?.status === 200) {
        // Lưu token vào localStorage
        const token = res.data?.accessToken;
        if (token) {
          localStorage.setItem("token", token);
          // Sau khi đăng nhập thành công, lấy thông tin người dùng
          dispatch(fetchCurrentUser());
        }
        // Trả về dữ liệu cần thiết cho Redux state
        return res.data; // { accessToken: "..." }
      } else {
        return rejectWithValue(res?.data?.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể kết nối tới server. Kiểm tra mạng hoặc cấu hình CORS.";
      return rejectWithValue(msg);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    email: "",
    password: "",
    user: null,
    token: null,
    error: "",
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
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.isAuthenticated = true;
        state.token = action.payload?.accessToken || null;
        // Thông tin user sẽ được cập nhật bởi fetchCurrentUser
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
        state.isAuthenticated = false;
      })
      // Xử lý fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user = action.payload;
        state.isAuthenticated = true;
        console.log("User info loaded:", action.payload);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể lấy thông tin người dùng";
        // Không đặt isAuthenticated = false ở đây vì có thể đã đăng nhập nhưng không lấy được thông tin
      });
  },
});

export const { setEmail, setPassword, logout } = loginSlice.actions;
export default loginSlice.reducer;
