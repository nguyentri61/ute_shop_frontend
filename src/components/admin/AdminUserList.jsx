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
  deleteAdminUser,
  unblockAdminUser,
} from "../../service/api.admin.service.jsx";

const getFullUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const raw = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  if (!raw) return path;
  const origin = raw.replace(/\/api\/?$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
};

/* =========================
   CSV / Utility buttons — use gentle, pleasant palette
   ========================= */
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
      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold shadow-sm bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:opacity-95 transition"
      title="Xuất CSV"
    >
      <ArrowDownTrayIcon className="w-5 h-5" />
      Xuất CSV
    </button>
  );
};

/* =========================
   Component
   ========================= */
const AdminUserList = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, size: 10, totalPages: 1 });

  const [loading, setLoading] = useState(false);
  const [crudLoading, setCrudLoading] = useState(false);

  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ email: "", fullName: "", phone: "", role: "USER" });

  const normalizeResponse = (res, fallbackPage = 1, fallbackSize = size) => {
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

  const fetchList = async (opts = {}) => {
    setLoading(true);
    try {
      const requestedPage = opts?.page ?? page;
      const res = await getAdminUsers({ q, role, start, end, page: requestedPage, size, ...opts });
      const { items: newItems, meta: newMeta } = normalizeResponse(res, requestedPage, size);
      setItems(newItems);
      setMeta(newMeta);
      if (newMeta?.page && newMeta.page !== page) setPage(newMeta.page);
    } catch (err) {
      console.error("fetch users err", err);
      toast.error(err?.response?.data?.error || err.message || "Lỗi khi lấy danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
      fetchList({ page: 1 });
      setPage(1);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || err.message || "Lỗi khi thao tác");
    } finally {
      setCrudLoading(false);
    }
  };

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
        await deleteAdminUser(user.id);
        toast.success("Khóa tài khoản thành công");
      }
      fetchList();
    } catch (err) {
      console.error("toggleBlock err", err);
      toast.error(err?.response?.data?.error || err.message || "Lỗi khi thay đổi trạng thái");
    } finally {
      setCrudLoading(false);
    }
  };

  const currentPage = meta?.page ?? page ?? 1;
  const currentSize = meta?.size ?? size;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil((meta?.total ?? items.length) / currentSize));
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="space-y-6 p-6 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Quản lý người dùng</h2>
          <p className="text-sm text-gray-500 mt-1">Tìm kiếm, quản lý và phân quyền người dùng</p>
        </div>

        <div className="flex items-center gap-3">
          <ExportCSVButton rows={items} />
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 transition"
          >
            Tạo mới
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch(e)}
                placeholder="Tìm kiếm email, tên, số điện thoại..."
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-gray-700"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-gray-700"
            >
              <option value="">Tất cả vai trò</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-gray-700"
            />

            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={applyFilter}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            disabled={loading}
          >
            Áp dụng
          </button>
          <button
            onClick={clearFilter}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            disabled={loading}
          >
            Đặt lại
          </button>
          <button
            onClick={onSearch}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            disabled={loading}
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-5 py-3 text-left text-gray-600 uppercase tracking-wide">#</th>
                <th className="px-5 py-3 text-left text-gray-600 uppercase tracking-wide">Người dùng</th>
                <th className="px-5 py-3 text-left text-gray-600 uppercase tracking-wide">Email</th>
                <th className="px-5 py-3 text-left text-gray-600 uppercase tracking-wide">SĐT</th>
                <th className="px-5 py-3 text-left text-gray-600 uppercase tracking-wide">Vai trò</th>
                <th className="px-5 py-3 text-left text-gray-600 uppercase tracking-wide">Trạng thái</th>
                <th className="px-5 py-3 text-left text-gray-600 uppercase tracking-wide">Ngày tạo</th>
                <th className="px-5 py-3 text-left text-gray-600 uppercase tracking-wide">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">Không tìm thấy người dùng</td>
                </tr>
              ) : (
                items.map((u, idx) => (
                  <tr key={u.id} className={`${u.blocked ? "bg-rose-50" : "hover:bg-gray-50"} transition`}>
                    <td className="px-5 py-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-700 font-medium">
                        {(currentPage - 1) * currentSize + idx + 1}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden">
                          {u.avatar ? (
                            <img src={getFullUrl(u.avatar)} alt={u.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <UserCircleIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className={`font-medium ${u.blocked ? "text-gray-400 line-through" : "text-gray-900"}`}>{u.fullName || "—"}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-700">{u.email}</td>

                    <td className="px-5 py-4">
                      {u.phone ? <div className="text-gray-700">{u.phone}</div> : <div className="text-gray-400">—</div>}
                    </td>

                    <td className="px-5 py-4">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">ADMIN</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-gray-700 text-xs font-semibold">USER</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {u.blocked ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-rose-100 text-rose-700 text-xs font-medium">Bị khóa</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium">Hoạt động</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {u.createdAt ? (
                        <div className="text-xs">
                          <div className="font-medium">{new Date(u.createdAt).toLocaleDateString("vi-VN")}</div>
                          <div className="text-gray-400">{new Date(u.createdAt).toLocaleTimeString("vi-VN")}</div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 text-gray-800 rounded-md hover:bg-indigo-50 transition"
                          disabled={crudLoading}
                        >
                          <PencilIcon className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm">Sửa</span>
                        </button>

                        <button
                          onClick={() => toggleBlock(u)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${u.blocked ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-rose-600 text-white hover:bg-rose-700"} transition`}
                          disabled={crudLoading}
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span>{u.blocked ? "Mở khóa" : "Khóa"}</span>
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Hiển thị</span>
          <span className="px-3 py-1 bg-gray-50 rounded-md font-semibold text-gray-900">{items.length}</span>
          <span>trong tổng số</span>
          <span className="px-3 py-1 bg-gray-50 rounded-md font-semibold text-gray-900">{meta.total}</span>
          <span>người dùng</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={goPrev} disabled={page <= 1 || loading} className="px-3 py-1 rounded-md bg-white border border-gray-100 hover:bg-indigo-50 transition">Trước</button>
          <div className="px-4 py-1 bg-indigo-600 text-white rounded-md font-semibold">{currentPage} / {totalPages}</div>
          <button onClick={goNext} disabled={page >= totalPages || loading} className="px-3 py-1 rounded-md bg-white border border-gray-100 hover:bg-indigo-50 transition">Sau</button>
        </div>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{editing ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}</h3>
                <p className="text-sm text-gray-500">{editing ? "Cập nhật thông tin người dùng" : "Thêm người dùng vào hệ thống"}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200">✕</button>
            </div>

            <form onSubmit={submitForm} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                <input value={form.fullName} onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">SĐT</label>
                  <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Vai trò</label>
                  <select value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))} className="w-full border border-gray-200 rounded-md px-3 py-2">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 rounded-md">Hủy</button>
                <button type="submit" disabled={crudLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
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
