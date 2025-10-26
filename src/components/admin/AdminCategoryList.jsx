// src/components/admin/AdminCategoryList.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PencilIcon,
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

/* ---------- small helpers ---------- */
const StatCard = ({ title, value, hint, tone = "indigo" }) => {
  const toneMap = {
    indigo: { text: "text-indigo-900", bg: "bg-white", border: "border-gray-100" },
    green: { text: "text-emerald-800", bg: "bg-white", border: "border-gray-100" },
    orange: { text: "text-amber-800", bg: "bg-white", border: "border-gray-100" },
    purple: { text: "text-violet-800", bg: "bg-white", border: "border-gray-100" },
  };
  const t = toneMap[tone] || toneMap.indigo;
  return (
    <div className={`rounded-xl p-5 ${t.bg} border ${t.border} shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</div>
      <div className={`text-3xl font-bold ${t.text} mt-2`}>{value}</div>
      {hint && <div className="text-xs text-gray-500 mt-2 font-medium">{hint}</div>}
    </div>
  );
};

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
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-lg text-sm font-medium shadow-sm hover:shadow transition"
      title="Xuất CSV"
    >
      <ArrowDownTrayIcon className="w-4 h-4 text-indigo-600" />
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

  // form state: name + icon could be URL string; iconFile holds File if user selected local file
  const [form, setForm] = useState({ name: "", icon: "" });
  const [iconFile, setIconFile] = useState(null); // File | null
  const [iconPreview, setIconPreview] = useState(""); // preview url (objectURL or existing url)
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAdminCategories({ q, page, size }));
  }, [dispatch, q, page, size]);

  useEffect(() => {
    if (meta?.page && meta.page !== page) setPage(meta.page);
  }, [meta?.page]);

  // clean up object URL on unmount / when iconFile changes
  useEffect(() => {
    return () => {
      if (iconPreview && iconPreview.startsWith("blob:")) {
        try { URL.revokeObjectURL(iconPreview); } catch (e) { /* ignore */ }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setIconFile(null);
    setIconPreview("");
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name || "", icon: cat.icon || "" });
    setIconFile(null);
    setIconPreview(cat.icon || "");
    setShowForm(true);
  };

  /* ---------------- image handlers ---------------- */
  const triggerPick = () => fileInputRef.current?.click();

  const onFileChange = (e) => {
    const f = e.target?.files?.[0];
    if (!f) return;
    // revoke old preview if blob
    if (iconPreview && iconPreview.startsWith("blob:")) {
      try { URL.revokeObjectURL(iconPreview); } catch (err) { }
    }
    const preview = URL.createObjectURL(f);
    setIconFile(f);
    setIconPreview(preview);
    // clear form.icon (we're using file now)
    setForm((s) => ({ ...s, icon: "" }));
    // reset input
    e.target.value = "";
  };

  const removeSelectedIcon = () => {
    if (iconPreview && iconPreview.startsWith("blob:")) {
      try { URL.revokeObjectURL(iconPreview); } catch (e) { }
    }
    setIconFile(null);
    setIconPreview("");
    // if editing, keep form.icon as '' so backend knows to remove icon when submitting (controller checks "icon" in body)
    if (editing) setForm((s) => ({ ...s, icon: "" }));
  };

  const submitForm = async (e) => {
    e?.preventDefault?.();
    try {
      if (!form.name?.trim()) return toast.error("Tên danh mục là bắt buộc");

      // If iconFile exists -> build FormData
      if (iconFile) {
        const fd = new FormData();
        fd.append("name", form.name.trim());
        fd.append("file", iconFile); // backend expects req.file
        // When editing: send as FormData to PATCH endpoint
        if (editing) {
          await dispatch(updateAdminCategoryThunk({ id: editing.id, payload: fd })).unwrap();
          toast.success("Cập nhật thành công");
        } else {
          await dispatch(createAdminCategoryThunk(fd)).unwrap();
          toast.success("Tạo danh mục thành công");
        }
      } else {
        // No file selected. Send JSON:
        // - If user set form.icon to empty string while editing and we include "icon" field, backend will treat it as removal.
        const payload = { name: form.name.trim() };
        // include icon key if user provided or explicitly cleared it (editing case)
        if ("icon" in form) payload.icon = form.icon ? form.icon.trim() : "";
        if (editing) {
          await dispatch(updateAdminCategoryThunk({ id: editing.id, payload })).unwrap();
          toast.success("Cập nhật thành công");
        } else {
          await dispatch(createAdminCategoryThunk(payload)).unwrap();
          toast.success("Tạo danh mục thành công");
        }
      }

      setShowForm(false);
      setIconFile(null);
      setIconPreview("");
      setForm({ name: "", icon: "" });
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
  const getFullUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    const raw = (import.meta.env.VITE_IMG_URL || "").replace(/\/+$/, "");
    if (!raw) return path;
    const origin = raw.replace(/\/api\/?$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${origin}${p}`;
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="space-y-6 p-6 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý danh mục</h1>
          <p className="text-sm text-gray-500 mt-1">Tạo, sửa, xóa và quản lý các danh mục sản phẩm</p>
        </div>

        <div className="flex items-center gap-3">
          <ExportCSVButton rows={filteredList.length ? filteredList : items} />
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Tạo mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng danh mục" value={total} hint={`Trang ${meta?.page ?? page} • ${meta?.size ?? size} / trang`} tone="indigo" />
        <StatCard title="Hiển thị" value={displayedCount} hint={startDate || endDate ? `${startDate || "—"} → ${endDate || "—"}` : "Không lọc theo ngày"} tone="green" />
        <StatCard title="Có icon" value={(items || []).filter((c) => c.icon).length} hint="Số danh mục có icon" tone="orange" />
        <StatCard title="Không có icon" value={(items || []).filter((c) => !c.icon).length} hint="Cần bổ sung icon" tone="purple" />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div className="flex items-center gap-3 w-full lg:w-2/3">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch(e)}
                placeholder="Tìm theo tên danh mục..."
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none text-gray-700"
              />
            </div>
            <button onClick={onSearch} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
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
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Date filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4 border-t border-gray-100 mt-4">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-sm font-medium text-gray-700">Từ:</label>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setActivePreset(""); }} className="border border-gray-200 rounded-lg px-3 py-2" />
            <label className="text-sm font-medium text-gray-700">Đến:</label>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setActivePreset(""); }} className="border border-gray-200 rounded-lg px-3 py-2" />
            <button onClick={clearDateFilters} className="px-2 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-rose-50 transition">Xóa</button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => applyPreset("7d")} className={`px-3 py-2 rounded-lg text-sm ${activePreset === "7d" ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>7 ngày</button>
            <button onClick={() => applyPreset("30d")} className={`px-3 py-2 rounded-lg text-sm ${activePreset === "30d" ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>30 ngày</button>
            <button onClick={() => applyPreset("90d")} className={`px-3 py-2 rounded-lg text-sm ${activePreset === "90d" ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>90 ngày</button>
            <button onClick={() => applyPreset("month")} className={`px-3 py-2 rounded-lg text-sm ${activePreset === "month" ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>Tháng này</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tên</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Icon</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Ngày tạo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <PhotoIcon className="w-16 h-16 text-gray-300" />
                      <div className="text-lg font-semibold text-gray-700">Không có danh mục</div>
                      <div className="text-sm text-gray-400">{q ? "Không tìm thấy danh mục phù hợp" : "Danh mục chưa được tạo"}</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{(meta?.page - 1) * (meta?.size || size) + idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-400 mt-1 font-mono">ID: {String(c.id).slice(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {c.icon ? (
                        <img src={getFullUrl(c.icon)} alt={c.name} className="w-12 h-12 object-cover rounded-md shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 text-gray-800 rounded-md hover:bg-indigo-50 transition"
                        >
                          <PencilIcon className="w-4 h-4 text-indigo-600" />
                          Sửa
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
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm">
        <div className="text-sm text-gray-600 font-medium">
          Hiển thị <span className="font-semibold text-gray-900">{filteredList.length}</span> / <span className="font-semibold text-gray-900">{total}</span> danh mục
        </div>
        <div className="flex items-center gap-3">
          <button onClick={goPrev} disabled={page <= 1} className="p-2 rounded-md border border-gray-100 bg-white hover:bg-indigo-50 disabled:opacity-50 transition">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div className="px-4 py-2 bg-white rounded-md border border-gray-100 text-sm font-semibold text-gray-800">{page} / {totalPages}</div>
          <button onClick={goNext} disabled={page >= totalPages} className="p-2 rounded-md border border-gray-100 bg-white hover:bg-indigo-50 disabled:opacity-50 transition">
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{editing ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-md hover:bg-gray-100">
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                  placeholder="Ví dụ: Thời trang, Điện tử..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-12 flex items-center justify-center border border-gray-200 rounded-md bg-gray-50 overflow-hidden">
                    {iconPreview ? (
                      <img src={iconPreview} alt="preview" className="w-full h-full object-cover" />
                    ) : form.icon ? (
                      <img src={form.icon} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                  <button type="button" onClick={triggerPick} className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm hover:bg-gray-50">
                    Chọn ảnh từ máy
                  </button>
                  {(iconPreview || form.icon) && (
                    <button
                      type="button"
                      onClick={removeSelectedIcon}
                      className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm hover:bg-rose-50 text-rose-600"
                    >
                      Xóa ảnh
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-2">Bạn có thể dán URL ảnh hoặc chọn ảnh từ máy. Khi chọn ảnh từ máy, file sẽ được gửi lên server.</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-100 rounded-md bg-white text-gray-700">
                  Hủy
                </button>
                <button type="submit" disabled={crudLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
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
