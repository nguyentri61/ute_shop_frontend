// src/components/admin/AdminSidebar.jsx
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/loginSlice";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    { id: "orders", label: "Quản lý đơn hàng", icon: "📦" },
    { id: "products", label: "Quản lý sản phẩm", icon: "🛍️" },
    { id: "users", label: "Quản lý người dùng", icon: "👥" },
    { id: "categories", label: "Quản lý danh mục", icon: "📋" },
  ];

  return (
    <div className="w-64 bg-indigo-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">UTE Shop Admin</h2>
        <p className="text-indigo-200 text-sm">Quản lý hệ thống</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
              ? "bg-indigo-700 text-white"
              : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Link to="/" className="block w-full px-4 py-2 text-center rounded-lg bg-indigo-700 hover:bg-indigo-600 mb-2">
          Về trang chủ
        </Link>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-center rounded-lg bg-red-600 hover:bg-red-700"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;