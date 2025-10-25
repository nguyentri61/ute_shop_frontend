// src/components/admin/AdminUserList.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,     // used as "block" (soft-block) per backend
  unblockAdminUser,    // used to unblock
} from "../../service/api.admin.service.jsx";

/**
 * Build absolute URL for image paths returned by backend.
 * - If path is absolute (http/https) -> return as-is
 * - If VITE_API_URL provided and contains '/api', we prefer origin (strip trailing /api)
 * - Otherwise prefix base + path
 */
const getFullUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const raw = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, ""); // strip trailing slash(es)
  if (!raw) return path;

  // If VITE_API_URL contains '/api' at the end, use origin (strip /api)
  const origin = raw.replace(/\/api\/?$/, "");
  // ensure path begins with '/'
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
};

const ExportCSVButton = ({ rows }) => {
  const handleExport = () => {
    if (!rows || rows.length === 0) {
      toast("Không có dữ liệu để xuất", { icon: "ℹ️" });
      return;
    }
    const header = ["id", "email", "fullName", "phone", "role", "verified", "blocked", "createdAt"];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [
          `"${String(r.id || "")}"`,
          `"${(r.email || "").replace(/"/g, '""')}"`,
          `"${(r.fullName || "").replace(/"/g, '""')}"`,
          `"${(r.phone || "").replace(/"/g, '""')}"`,
          `"${r.role || ""}"`,
          `"${r.verified ? "TRUE" : "FALSE"}"`,
          `"${r.blocked ? "TRUE" : "FALSE"}"`,
          `"${new Date(r.createdAt || "").toLocaleString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200"
      title="Xuất CSV"
    >
      <ArrowDownTrayIcon className="w-5 h-5" />
      Xuất CSV
    </button>
  );
};

const AdminUserList = () => {
  // data
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, size: 10, totalPages: 1 });

  // loading
  const [loading, setLoading] = useState(false);
  const [crudLoading, setCrudLoading] = useState(false);

  // filters + pagination (local state)
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [page, setPage] = useState(1);
  const size = 10; // page size local default

  // modal form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ email: "", fullName: "", phone: "", role: "USER" });

  // Normalize response payload to array + meta safely
  const normalizeResponse = (res, fallbackPage = 1, fallbackSize = size) => {
    // res may be axios response -> res.data -> { status,message,data:{items,meta} }
    const payload = res?.data?.data ?? res?.data ?? res;
    const itemsFromServer = payload?.items ?? payload?.users ?? [];
    const metaFromServer = payload?.meta ?? payload?.pagination ?? {};

    const total = Number(metaFromServer?.total ?? itemsFromServer.length ?? 0) || 0;
    const curPage = Number(metaFromServer?.page ?? fallbackPage) || fallbackPage;
    const curSize = Number(metaFromServer?.size ?? fallbackSize) || fallbackSize;
    const totalPages = Number(metaFromServer?.totalPages ?? Math.max(1, Math.ceil(total / curSize))) || Math.max(1, Math.ceil(total / curSize));

    return {
      items: Array.isArray(itemsFromServer) ? itemsFromServer : [],
      meta: { total, page: curPage, size: curSize, totalPages },
    };
  };

  // fetchList: use opts.page if provided, otherwise use state `page`
  const fetchList = async (opts = {}) => {
    setLoading(true);
    try {
      const requestedPage = opts?.page ?? page;
      // ensure we pass the final page and size explicitly
      const res = await getAdminUsers({ q, role, start, end, page: requestedPage, size, ...opts });
      const { items: newItems, meta: newMeta } = normalizeResponse(res, requestedPage, size);
      setItems(newItems);
      setMeta(newMeta);
      // sync local page if backend returned page different
      if (newMeta?.page && newMeta.page !== page) setPage(newMeta.page);
    } catch (err) {
      console.error("fetch users err", err);
      toast.error(err?.response?.data?.error || err.message || "Lỗi khi lấy danh sách");
    } finally {
      setLoading(false);
    }
  };

  // fetch when page changes
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // handlers
  const onSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPage(1);
    fetchList({ page: 1 });
  };

  const applyFilter = () => {
    setPage(1);
    fetchList({ page: 1 });
  };

  const clearFilter = () => {
    setQ("");
    setRole("");
    setStart("");
    setEnd("");
    setPage(1);
    fetchList({ page: 1, q: "", role: "", start: "", end: "" });
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ email: "", fullName: "", phone: "", role: "USER" });
    setShowForm(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ email: u.email || "", fullName: u.fullName || "", phone: u.phone || "", role: u.role || "USER" });
    setShowForm(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setCrudLoading(true);
    try {
      if (editing) {
        await updateAdminUser(editing.id, form);
        toast.success("Cập nhật thành công");
      } else {
        await createAdminUser(form);
        toast.success("Tạo người dùng thành công");
      }
      setShowForm(false);
      // refresh current page (go to first page after create)
      fetchList({ page: 1 });
      setPage(1);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || err.message || "Lỗi khi thao tác");
    } finally {
      setCrudLoading(false);
    }
  };

  /**
   * toggleBlock: nếu user.blocked === true => gọi unblockAdminUser
   *             nếu user.blocked === false => gọi deleteAdminUser (backend xử lý soft-block)
   */
  const toggleBlock = async (user) => {
    if (!user || !user.id) return;
    const isBlocked = !!user.blocked;
    const confirmMsg = isBlocked ? "Bạn có chắc muốn mở khóa tài khoản này?" : "Bạn có chắc muốn khóa tài khoản này? (khóa là soft-block)";
    if (!confirm(confirmMsg)) return;

    setCrudLoading(true);
    try {
      if (isBlocked) {
        await unblockAdminUser(user.id);
        toast.success("Mở khóa thành công");
      } else {
        await deleteAdminUser(user.id); // backend performs soft-block
        toast.success("Khóa tài khoản thành công");
      }
      // refresh list - keep on same page where possible
      fetchList();
    } catch (err) {
      console.error("toggleBlock err", err);
      toast.error(err?.response?.data?.error || err.message || "Lỗi khi thay đổi trạng thái");
    } finally {
      setCrudLoading(false);
    }
  };

  // pagination helpers - compute BEFORE render usage
  const currentPage = meta?.page ?? page ?? 1;
  const currentSize = meta?.size ?? size;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil((meta?.total ?? items.length) / currentSize));
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Quản lý người dùng</h2>
            <p className="text-indigo-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              Tìm kiếm, quản lý và phân quyền người dùng
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ExportCSVButton rows={items} />
          </div>
        </div>
      </div>

      {/* Controls with modern design */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch(e)}
                placeholder="Tìm kiếm email, tên, số điện thoại..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
            >
              <option value="">🎭 Tất cả vai trò</option>
              <option value="USER">👤 USER</option>
              <option value="ADMIN">👑 ADMIN</option>
            </select>

            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
            />

            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={applyFilter}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
            disabled={loading}
          >
            ✓ Áp dụng
          </button>
          <button
            onClick={clearFilter}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 hover:shadow-md transform hover:scale-105 transition-all disabled:opacity-50"
            disabled={loading}
          >
            ↻ Đặt lại
          </button>
          <button
            onClick={onSearch}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
            disabled={loading}
          >
            🔍 Tìm kiếm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">SĐT</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Không tìm thấy người dùng</p>
                        <p className="text-sm text-gray-400 mt-1">Thử thay đổi bộ lọc hoặc tạo người dùng mới</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`transition-all duration-200 ${u.blocked ? "bg-red-50/40" : "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {(currentPage - 1) * currentSize + idx + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center overflow-hidden shadow-md ring-2 ring-white">
                            {u.avatar ? (
                              <img src={getFullUrl(u.avatar)} alt={u.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <UserCircleIcon className="w-7 h-7 text-white" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${u.blocked ? "line-through text-gray-500" : "text-gray-900"}`}>{u.fullName || "—"}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.phone ? <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">{u.phone}</span> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-md">👑 ADMIN</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-bold shadow-md">👤 USER</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {u.blocked ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">🔒 Bị khóa</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">✅ Hoạt động</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.createdAt ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{new Date(u.createdAt).toLocaleDateString("vi-VN")}</span>
                          <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleTimeString("vi-VN")}</span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="group px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-1"
                          disabled={crudLoading}
                        >
                          <PencilIcon className="w-4 h-4" />
                          Sửa
                        </button>

                        <button
                          onClick={() => toggleBlock(u)}
                          className={`group px-3 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-1 ${u.blocked ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                            }`}
                          disabled={crudLoading}
                        >
                          <TrashIcon className="w-4 h-4" />
                          {u.blocked ? "Mở khóa" : "Khóa"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Hiển thị</span>
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-bold">{items.length}</span>
            <span className="text-gray-600">trong tổng số</span>
            <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-bold">{meta.total}</span>
            <span className="text-gray-600">người dùng</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={goPrev} disabled={page <= 1 || loading} className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-medium disabled:opacity-40">Trước</button>
            <div className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg">
              <span className="text-lg">{currentPage}</span>
              <span className="mx-2 opacity-75">/</span>
              <span className="text-lg">{totalPages}</span>
            </div>
            <button onClick={goNext} disabled={page >= totalPages || loading} className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-medium disabled:opacity-40">Sau</button>
          </div>
        </div>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-3xl px-8 py-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{editing ? "✏️ Chỉnh sửa người dùng" : "➕ Tạo người dùng mới"}</h3>
                <p className="text-sm text-indigo-100 mt-1">{editing ? "Cập nhật thông tin người dùng" : "Thêm người dùng vào hệ thống"}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center">
                ✕
              </button>
            </div>

            <form onSubmit={submitForm} className="p-8 space-y-6">
              <div>
                <label className="text-sm font-semibold">Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3" />
              </div>

              <div>
                <label className="text-sm font-semibold">Họ và tên</label>
                <input value={form.fullName} onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold">SĐT</label>
                  <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="text-sm font-semibold">Vai trò</label>
                  <select value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-100 rounded-xl">Hủy</button>
                <button type="submit" disabled={crudLoading} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-xl">
                  {crudLoading ? "Đang xử lý..." : (editing ? "Lưu thay đổi" : "Tạo người dùng")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
