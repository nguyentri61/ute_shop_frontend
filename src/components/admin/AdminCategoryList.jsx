// src/components/admin/AdminCategoryList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  fetchAdminCategories,
  createAdminCategoryThunk,
  updateAdminCategoryThunk,
  deleteAdminCategoryThunk,
  selectAdminCategories,
  selectAdminCategoriesMeta,
  selectAdminCategoriesLoading,
  selectAdminCategoryCrudLoading,
} from "../../features/admin/categorySlice";

/**
 * AdminCategoryList — Modern Design with beautiful UI
 */

const StatCard = ({ title, value, hint, from = "from-indigo-50", to = "to-indigo-100", border = "border-indigo-200", text = "text-indigo-800" }) => (
  <div className={`group rounded-xl p-5 bg-gradient-to-br ${from} ${to} border ${border} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</div>
    <div className={`text-3xl font-bold ${text} mt-2 group-hover:scale-105 transition-transform duration-300`}>{value}</div>
    {hint && <div className="text-xs text-gray-600 mt-2 font-medium">{hint}</div>}
  </div>
);

const ExportCSVButton = ({ rows }) => {
  const handleExport = () => {
    if (!rows || rows.length === 0) {
      toast("Không có dữ liệu để xuất", { icon: "ℹ️" });
      return;
    }
    const header = ["id", "name", "icon", "createdAt"];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [
          `"${String(r.id || "")}"`,
          `"${(r.name || "").replace(/"/g, '""')}"`,
          `"${(r.icon || "").replace(/"/g, '""')}"`,
          `"${new Date(r.createdAt || "").toLocaleString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `categories_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất file CSV");
  };

  return (
    <button
      onClick={handleExport}
      className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow"
      title="Xuất CSV"
    >
      <ArrowDownTrayIcon className="w-4 h-4 group-hover:animate-bounce" />
      Xuất CSV
    </button>
  );
};

const AdminCategoryList = () => {
  const dispatch = useDispatch();

  const itemsFromStore = useSelector((s) => selectAdminCategories(s) ?? []);
  const metaFromStore = useSelector((s) => selectAdminCategoriesMeta(s) ?? { total: 0, page: 1, size: 10, totalPages: 1 });
  const loading = useSelector((s) => selectAdminCategoriesLoading(s) ?? false);
  const crudLoading = useSelector((s) => selectAdminCategoryCrudLoading(s) ?? false);

  const items = Array.isArray(itemsFromStore) ? itemsFromStore : (itemsFromStore?.items ?? []);
  const meta = metaFromStore;

  const [q, setQ] = useState("");
  const [page, setPage] = useState(meta?.page ?? 1);
  const [size] = useState(meta?.size ?? 10);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activePreset, setActivePreset] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", icon: "" });

  useEffect(() => {
    dispatch(fetchAdminCategories({ q, page, size }));
  }, [dispatch, q, page, size]);

  useEffect(() => {
    if (meta?.page && meta.page !== page) setPage(meta.page);
  }, [meta?.page]);

  const applyPreset = (preset) => {
    const now = new Date();
    let start = "";
    let end = now.toISOString().slice(0, 10);
    if (preset === "7d") {
      const s = new Date();
      s.setDate(now.getDate() - 6);
      start = s.toISOString().slice(0, 10);
    } else if (preset === "30d") {
      const s = new Date();
      s.setDate(now.getDate() - 29);
      start = s.toISOString().slice(0, 10);
    } else if (preset === "90d") {
      const s = new Date();
      s.setDate(now.getDate() - 89);
      start = s.toISOString().slice(0, 10);
    } else if (preset === "month") {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      start = s.toISOString().slice(0, 10);
    } else {
      start = "";
      end = "";
    }
    setStartDate(start);
    setEndDate(end);
    setActivePreset(preset);
  };

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
    setActivePreset("");
  };

  const filteredList = useMemo(() => {
    if (!startDate && !endDate) return items || [];
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;
    return (items || []).filter((c) => {
      if (!c?.createdAt) return false;
      const d = new Date(c.createdAt);
      if (isNaN(d.getTime())) return false;
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });
  }, [items, startDate, endDate]);

  const total = meta?.total ?? items.length;
  const displayedCount = filteredList.length;
  const totalPages = Math.max(1, Math.ceil((meta?.total ?? items.length) / (meta?.size || size)));

  const onSearch = (e) => {
    e?.preventDefault?.();
    setPage(1);
    dispatch(fetchAdminCategories({ q, page: 1, size }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", icon: "" });
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name || "", icon: cat.icon || "" });
    setShowForm(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (!form.name?.trim()) return toast.error("Tên danh mục là bắt buộc");
      if (editing) {
        await dispatch(updateAdminCategoryThunk({ id: editing.id, payload: form })).unwrap();
        toast.success("Cập nhật thành công");
      } else {
        await dispatch(createAdminCategoryThunk(form)).unwrap();
        toast.success("Tạo danh mục thành công");
      }
      setShowForm(false);
      dispatch(fetchAdminCategories({ q, page, size }));
    } catch (err) {
      const msg = err?.message || err?.error || JSON.stringify(err);
      toast.error(String(msg));
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await dispatch(deleteAdminCategoryThunk(id)).unwrap();
      toast.success("Xóa thành công");
      dispatch(fetchAdminCategories({ q, page, size }));
    } catch (err) {
      toast.error(err?.message || "Lỗi khi xóa");
    }
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h1>
            <p className="text-indigo-100 mt-2 text-sm">Tạo, sửa, xóa và quản lý các danh mục sản phẩm của bạn</p>
          </div>

          <div className="flex items-center gap-3">
            <ExportCSVButton rows={filteredList.length ? filteredList : items} />
            <button
              onClick={openCreate}
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Tạo mới
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng danh mục"
          value={total}
          hint={`Trang ${meta?.page ?? page} • ${meta?.size ?? size} / trang`}
        />
        <StatCard
          title="Hiển thị"
          value={displayedCount}
          hint={startDate || endDate ? `${startDate || "—"} → ${endDate || "—"}` : "Không lọc theo ngày"}
          from="from-emerald-50"
          to="to-emerald-100"
          border="border-emerald-200"
          text="text-emerald-800"
        />
        <StatCard
          title="Có icon"
          value={(items || []).filter((c) => c.icon).length}
          hint="Số danh mục có icon"
          from="from-yellow-50"
          to="to-yellow-100"
          border="border-yellow-200"
          text="text-yellow-800"
        />
        <StatCard
          title="Không có icon"
          value={(items || []).filter((c) => !c.icon).length}
          hint="Cần bổ sung icon"
          from="from-rose-50"
          to="to-rose-100"
          border="border-rose-200"
          text="text-rose-800"
        />
      </div>

      {/* Controls */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div className="flex items-center gap-3 w-full lg:w-2/3">
            <div className="relative w-full group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch(e)}
                placeholder="Tìm theo tên danh mục..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
            <button onClick={onSearch} className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-md hover:shadow-lg transition-all duration-200">
              Tìm
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setQ("");
                setPage(1);
                dispatch(fetchAdminCategories({ q: "", page: 1, size }));
              }}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 font-medium transition-all duration-200"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Date filter row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-sm font-semibold text-gray-700">Từ:</label>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setActivePreset(""); }} className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" />
            <label className="text-sm font-semibold text-gray-700">Đến:</label>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setActivePreset(""); }} className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" />
            <button onClick={clearDateFilters} className="px-3 py-2 border-2 border-gray-200 rounded-lg bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-600 font-medium transition-all">
              Xóa
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => applyPreset("7d")} className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${activePreset === "7d" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200"}`}>7 ngày</button>
            <button onClick={() => applyPreset("30d")} className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${activePreset === "30d" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200"}`}>30 ngày</button>
            <button onClick={() => applyPreset("90d")} className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${activePreset === "90d" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200"}`}>90 ngày</button>
            <button onClick={() => applyPreset("month")} className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${activePreset === "month" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200"}`}>Tháng này</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Icon</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                      <p className="text-gray-600 font-medium">Đang tải...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <PhotoIcon className="w-16 h-16 text-gray-300 mb-4" />
                      <div className="text-lg font-semibold text-gray-700">Không có danh mục</div>
                      <div className="text-sm text-gray-400 mt-2">{q ? "Không tìm thấy danh mục phù hợp" : "Danh mục chưa được tạo"}</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{(meta?.page - 1) * (meta?.size || size) + idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">ID: {String(c.id).slice(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {c.icon ? (
                        <img src={c.icon} alt={c.name} className="w-12 h-12 object-cover rounded-lg shadow-sm ring-2 ring-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-xs font-medium">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg text-sm font-medium text-yellow-700 hover:from-yellow-100 hover:to-orange-100 hover:border-yellow-300 transition-all duration-200 hover:shadow-md"
                        >
                          <PencilIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Sửa
                        </button>
                        <button
                          onClick={() => onDelete(c.id)}
                          disabled={crudLoading}
                          className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg text-sm font-medium text-red-600 hover:from-red-100 hover:to-pink-100 hover:border-red-300 transition-all duration-200 hover:shadow-md disabled:opacity-50"
                        >
                          <TrashIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          {crudLoading ? "..." : "Xóa"}
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
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-4 shadow-lg">
        <div className="text-sm text-gray-600 font-medium">
          Hiển thị <span className="font-bold text-indigo-600">{filteredList.length}</span> / <span className="font-bold text-gray-900">{total}</span> danh mục
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={page <= 1}
            className="p-2.5 border-2 border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-sm font-bold text-gray-700 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
            {page} / {totalPages}
          </div>
          <button
            onClick={goNext}
            disabled={page >= totalPages}
            className="p-2.5 border-2 border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {editing ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
                onClick={() => setShowForm(false)}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={submitForm} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Tên danh mục *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                  placeholder="Ví dụ: Thời trang, Điện tử..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Icon (URL)</label>
                <div className="flex gap-3">
                  <input
                    value={form.icon}
                    onChange={(e) => setForm((s) => ({ ...s, icon: e.target.value }))}
                    className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                    placeholder="https://..."
                  />
                  <div className="w-16 h-14 flex items-center justify-center border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {form.icon ? (
                      <img src={form.icon} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Bạn có thể dán URL ảnh hoặc dùng endpoint upload riêng nếu cần.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-medium transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={crudLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {crudLoading ? "Đang xử lý..." : editing ? "Lưu thay đổi" : "Tạo danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryList;