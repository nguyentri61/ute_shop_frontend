import React, { useEffect, useState } from "react";
import {
  getMyOrders,
  cancelOrder as apiCancelOrder,
} from "../service/api.order.service";
import OrderCard from "../components/orders/OrderCard";
import { showError } from "../utils/toast";

const STATUS_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "NEW", label: "Chờ xác nhận" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "PREPARING", label: "Chuẩn bị hàng" },
  { key: "SHIPPING", label: "Đang giao" },
  { key: "DELIVERED", label: "Hoàn thành" },
  { key: "CANCELLED", label: "Đã hủy" },
];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeStatus, setActiveStatus] = useState("ALL");

  // Phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 5; // tùy chỉnh theo ý bạn

  useEffect(() => {
    loadOrders(activeStatus, page);
    // eslint-disable-next-line
  }, []);

  async function loadOrders(status = "ALL", pageNum = 1) {
    setLoading(true);
    try {
      const res = await getMyOrders(status, pageNum, LIMIT);
      // Backend trả về { data, currentPage, totalPages, totalItems }
      const result = res.data;
      setOrders(result?.data || []);
      setTotalPages(result?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Có lỗi khi tải đơn hàng.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(orderId) {
    if (!window.confirm("Bạn có chắc muốn huỷ đơn này?")) return;
    setCancellingId(orderId);
    try {
      await apiCancelOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            if (o.status === "PENDING" || o.status === "CONFIRMED") {
              return { ...o, status: "CANCELLED" };
            } else {
              return { ...o, status: "CANCEL_REQUEST" };
            }
          }
          return o;
        })
      );
    } catch (err) {
      showError(err);
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></span>
        <span className="ml-3">Đang tải đơn hàng...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Đơn hàng của tôi
      </h1>

      {/* Tabs filter */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveStatus(tab.key);
              setPage(1);
              loadOrders(tab.key, 1);
            }}
            className={`whitespace-nowrap pb-2 border-b-2 text-sm font-medium transition-colors ${activeStatus === tab.key
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-600 hover:text-orange-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-gray-600 mt-10 text-center">
          Không có đơn hàng nào.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrderId === order.id}
              onToggleExpand={() =>
                setExpandedOrderId(
                  expandedOrderId === order.id ? null : order.id
                )
              }
              onCancel={handleCancel}
              cancellingId={cancellingId}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          {/* Previous */}
          <button
            disabled={page === 1}
            onClick={() => {
              const newPage = page - 1;
              setPage(newPage);
              loadOrders(activeStatus, newPage);
            }}
            className="w-10 h-10 flex justify-center items-center rounded-full border border-gray-300 text-gray-500 hover:bg-orange-100 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            «
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPage(p);
                loadOrders(activeStatus, p);
              }}
              className={`w-10 h-10 flex justify-center items-center rounded-full border transition ${page === p
                  ? "bg-orange-500 text-white border-orange-500 shadow"
                  : "border-gray-300 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => {
              const newPage = page + 1;
              setPage(newPage);
              loadOrders(activeStatus, newPage);
            }}
            className="w-10 h-10 flex justify-center items-center rounded-full border border-gray-300 text-gray-500 hover:bg-orange-100 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            »
          </button>
        </div>
      )}


    </div>
  );
}
