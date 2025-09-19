// src/components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Component kiểm tra quyền admin
function AdminRoute() {
  const { user, loading, isAuthenticated } = useSelector((state) => state.login);
  
  // Nếu không có xác thực thì redirect về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đang loading thì hiển thị loading
  if (loading) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  // Nếu không có user thì redirect về login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền admin
  const isAdmin = user.role === "ADMIN";

  // Nếu không phải admin thì redirect về trang chủ
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Nếu là admin thì render Outlet
  return <Outlet />;
}

export default AdminRoute;