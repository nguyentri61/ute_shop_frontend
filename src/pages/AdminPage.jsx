// src/pages/AdminPage.jsx
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import AdminOrderList from "../components/admin/AdminOrderList";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminProductList from "../components/admin/AdminProductList";
import AdminUserList from "../components/admin/AdminUserList";
import AdminCategoryList from "../components/admin/AdminCategoryList";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Quản lý cửa hàng</h1>

        {/* Tab content */}
        {activeTab === "orders" && <AdminOrderList />}
        {activeTab === "products" && <AdminProductList />}
        {activeTab === "users" && <AdminUserList />}
        {activeTab === "categories" && <AdminCategoryList />}
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default AdminPage;