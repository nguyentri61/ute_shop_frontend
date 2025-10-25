import { useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  TagIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,

} from "@heroicons/react/24/outline";
import AdminOrderList from "../components/admin/AdminOrderList";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminProductList from "../components/admin/AdminProductList";
import AdminUserList from "../components/admin/AdminUserList";
import AdminCategoryList from "../components/admin/AdminCategoryList";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/loginSlice";
import { Avatar } from "antd";
import { LogOut } from "lucide-react";
import NotificationBell from "../components/NotificationBell";
import DashboardPage from "../components/admin/DashBoard";
import AdminVoucher from "../components/admin/AdminVoucher";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
    { id: "orders", label: "Đơn hàng", icon: ShoppingBagIcon, },
    { id: "products", label: "Sản phẩm", icon: CubeIcon },
    { id: "users", label: "Người dùng", icon: UsersIcon },
    { id: "vouchers", label: "Mã giảm giá", icon: TagIcon },
    { id: "categories", label: "Danh mục", icon: TagIcon },
    { id: "settings", label: "Cài đặt", icon: Cog6ToothIcon },

  ];

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate("/login");
  };

  const getPageTitle = () => {
    const item = menuItems.find((item) => item.id === activeTab);
    return item ? item.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Avatar src="/logo.png" icon size={"large"} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                    ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-indigo-500" : "text-gray-400"
                        }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User info at bottom */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>

              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-gray-500">
                  Quản lý và theo dõi hoạt động
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden sm:block">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
                <NotificationBell />
              </button>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {"Admin"}
                    </span>
                  </div>
                  <span className="hidden sm:block font-medium">Admin</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Admin</p>
                      <p className="text-xs text-gray-500">admin@gmail.com</p>
                    </div>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <UserCircleIcon className="w-4 h-4 mr-3" />
                      Thông tin cá nhân
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Cog6ToothIcon className="w-4 h-4 mr-3" />
                      Cài đặt
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          {activeTab === "dashboard" && (
            <DashboardPage />
          )}
          {activeTab === "orders" && <AdminOrderList />}
          {activeTab === "products" && <AdminProductList />}
          {activeTab === "users" && <AdminUserList />}
          {activeTab === "categories" && <AdminCategoryList />}

          {activeTab === "settings" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Cài đặt hệ thống
              </h3>
              <p className="text-gray-600">
                Trang cài đặt đang được phát triển.
              </p>
            </div>
          )}
          {activeTab === "vouchers" && <AdminVoucher />}
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e5e7eb",
          },
        }}
      />

      {/* Click outside to close dropdown
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setUserDropdownOpen(false)}
        />
      )} */}
    </div>
  );
};

export default AdminPage;
