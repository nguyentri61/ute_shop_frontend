import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Profile from "./pages/Profile";
import MyOrdersPage from "./pages/MyOrdersPage";
import VerifyOTP from "./pages/VerifyOTP";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorPage from "./pages/ErrorPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckOutPage from "./pages/CheckOutPage";
import MyCartPage from "./pages/MyCartPage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";

// Thêm import
import { Toaster } from "react-hot-toast";

// Protected Route component
function ProtectedRoute() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Layout component that includes Header and renders Outlet
function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Thêm Toaster ở đây để toast hiển thị cho toàn bộ app */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

// Auth layout for login/register pages without header
function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Outlet />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Main routes with header */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/checkout" element={<CheckOutPage />} />
            <Route path="/cart" element={<MyCartPage />} />
          </Route>
        </Route>

        {/* Auth routes without header */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
        </Route>

        {/* Admin Route */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
