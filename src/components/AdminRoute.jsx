// src/components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCurrentUser } from "../features/auth/loginSlice";

// Component kiểm tra quyền admin
function AdminRoute() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.login);

  // Tải thông tin người dùng nếu đã đăng nhập nhưng chưa có thông tin user
  useEffect(() => {
    if (isAuthenticated && !user) {
      console.log("AdminRoute - Fetching user info");
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated, user, dispatch]);

  console.log("AdminRoute - user:", user);
  console.log("AdminRoute - isAuthenticated:", isAuthenticated);
  console.log("AdminRoute - loading:", loading);

  // Kiểm tra đã đăng nhập
  if (!isAuthenticated) {
    console.log("AdminRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Hiển thị loading khi đang tải thông tin người dùng
  if (loading) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  // Kiểm tra quyền admin
  if (!user) {
    console.log("AdminRoute - No user data, redirecting to home");
    return <Navigate to="/" replace />;
  }
  
  console.log("AdminRoute - User data:", user);
  console.log("AdminRoute - User role check:", user.role, typeof user.role);
  
  // Kiểm tra quyền admin với nhiều cách viết có thể có
  const isAdmin = user && (
    user.role === "ADMIN" || 
    user.role === "admin" || 
    (user.roles && (user.roles.includes("ADMIN") || user.roles.includes("admin"))) ||
    (Array.isArray(user.role) && (user.role.includes("ADMIN") || user.role.includes("admin")))
  );
  
  console.log("AdminRoute - isAdmin:", isAdmin);
    
  if (!isAdmin) {
    console.log("AdminRoute - Not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;