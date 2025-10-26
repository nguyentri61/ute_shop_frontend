// src/components/admin/AdminProductList.jsx
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  PhotoIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import axios from "../../service/axios.customize"; // reuse your axios instance
import {
  getAdminProducts,
  getAdminProductById,
  deleteAdminProduct,
  getAdminCategories,
} from "../../service/api.admin.service.jsx";

/* ---------- helpers ---------- */
const getFullUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const raw = (import.meta.env.VITE_IMG_URL || "").replace(/\/+$/, "");
  if (!raw) return path;
  const origin = raw.replace(/\/api\/?$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
};

const ExportCSVButton = ({ rows = [] }) => {
  const handleExport = () => {
    if (!rows || rows.length === 0) {
      toast("Không có dữ liệu để xuất", { icon: "ℹ️" });
      return;
    }
    const header = [
      "id",
      "name",
      "category",
      "price",
      "discountPrice",
      "stock",
      "createdAt",
    ];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [
          `"${r.id || ""}"`,
          `"${(r.name || "").replace(/"/g, '""')}"`,
          `"${(r.category?.name || "").replace(/"/g, '""')}"`,
          `"${r.price ?? ""}"`,
          `"${r.discountPrice ?? ""}"`,
          `"${r.stock ?? ""}"`,
          `"${new Date(r.createdAt || "").toLocaleString()}"`,
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold shadow-sm hover:scale-[1.02] transition transform bg-gradient-to-r from-sky-300 to-sky-200 text-slate-800"
      title="Xuất CSV"
    >
      <ArrowDownTrayIcon className="w-5 h-5" />
      Xuất CSV
    </button>
  );
};

/* ---------- empty templates ---------- */
const emptyVariant = () => ({
  color: "",
  size: "",
  price: "",
  discountPrice: "",
  stock: "",
});
const emptyImage = () => "";

/* ========== Component ========== */
const AdminProductList = () => {
  // data + meta
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    size: 10,
    totalPages: 1,
  });

  // categories
  const [categories, setCategories] = useState([]);

  // ui
  const [loading, setLoading] = useState(false);
  const [crudLoading, setCrudLoading] = useState(false);
  const [page, setPage] = useState(1);
  const size = 10;

  // filters
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [sortDate, setSortDate] = useState("");

  // modal/form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    variants: [emptyVariant()],
    images: [emptyImage()],
  });

  // tempFiles: parallel array to form.images; null or File object.
  const [tempFiles, setTempFiles] = useState([]); // same length as form.images
  const fileInputRef = useRef(null);

  /* ---------- normalize response ---------- */
  const normalizeResponse = (res, fallbackPage = 1, fallbackSize = size) => {
    const payload = res?.data?.data ?? res?.data ?? res;
    const itemsFromServer = payload?.items ?? payload?.products ?? [];
    const metaFromServer = payload?.meta ?? payload?.pagination ?? {};
    const total =
      Number(metaFromServer?.total ?? itemsFromServer.length ?? 0) || 0;
    const curPage =
      Number(metaFromServer?.page ?? fallbackPage) || fallbackPage;
    const curSize =
      Number(metaFromServer?.size ?? fallbackSize) || fallbackSize;
    const totalPages =
      Number(
        metaFromServer?.totalPages ?? Math.max(1, Math.ceil(total / curSize))
      ) || Math.max(1, Math.ceil(total / curSize));
    return {
      items: Array.isArray(itemsFromServer) ? itemsFromServer : [],
      meta: { total, page: curPage, size: curSize, totalPages },
    };
  };

  /* ---------- fetch categories ---------- */
  const fetchCategories = async () => {
    try {
      const res = await getAdminCategories({ page: 1, size: 1000 });
      const payload = res?.data?.data ?? res?.data ?? res;
      const cats = payload?.items ?? payload ?? [];
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
      console.error("fetch categories", err);
    }
  };

  /* ---------- fetch products ---------- */
  const fetchList = async (opts = {}) => {
    setLoading(true);
    try {
      const requestedPage = opts?.page ?? page;
      const res = await getAdminProducts({
        q,
        category,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortPrice: sortPrice || undefined,
        sortDate: sortDate || undefined,
        page: requestedPage,
        size,
        ...opts,
      });
      const { items: newItems, meta: newMeta } = normalizeResponse(
        res,
        requestedPage,
        size
      );
      setItems(newItems);
      setMeta(newMeta);
      if (newMeta?.page && newMeta.page !== page) setPage(newMeta.page);
    } catch (err) {
      console.error("fetch products err", err);
      toast.error(
        err?.response?.data?.error ||
          err.message ||
          "Lỗi khi lấy danh sách sản phẩm"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /* ---------- handlers: filters, search ---------- */
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
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortPrice("");
    setSortDate("");
    setPage(1);
    fetchList({
      page: 1,
      q: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortPrice: "",
      sortDate: "",
    });
  };

  /* ---------- open create/edit ---------- */
  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      categoryId: "",
      variants: [emptyVariant()],
      images: [emptyImage()],
    });
    setTempFiles([null]);
    setShowForm(true);
  };

  const openEdit = async (p) => {
    setCrudLoading(true);
    try {
      const res = await getAdminProductById(p.id);
      const payload = res?.data?.data ?? res?.data ?? res;
      const variants = (payload?.variants ?? []).map((v) => ({
        color: v.color ?? "",
        size: v.size ?? "",
        price: v.price != null ? String(v.price) : "",
        discountPrice: v.discountPrice != null ? String(v.discountPrice) : "",
        stock: v.stock != null ? String(v.stock) : "",
      }));
      const images = (payload?.productImage ?? []).map((img) => img.url ?? "");
      setEditing(payload);
      setForm({
        name: payload.name ?? "",
        description: payload.description ?? "",
        categoryId: payload.categoryId ?? payload.category?.id ?? "",
        variants: variants.length > 0 ? variants : [emptyVariant()],
        images: images.length > 0 ? images : [emptyImage()],
      });
      // tempFiles aligned with images (null for existing URLs)
      setTempFiles(Array.from({ length: images.length || 1 }).map(() => null));
      setShowForm(true);
    } catch (err) {
      console.error("openEdit err", err);
      toast.error("Không thể load sản phẩm");
    } finally {
      setCrudLoading(false);
    }
  };

  /* ---------- image file helpers ---------- */
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelected = (e) => {
    const files = Array.from(e.target?.files || []);
    if (files.length === 0) return;
    // map files -> previews
    const previews = files.map((f) => URL.createObjectURL(f));
    setForm((s) => {
      const imgs = [...(s.images || [])];
      // append previews
      previews.forEach((p) => imgs.push(p));
      return { ...s, images: imgs };
    });
    setTempFiles((t) => {
      const arr = Array.isArray(t) ? [...t] : [];
      files.forEach((f) => arr.push(f));
      return arr;
    });
    // reset input value so selecting same file twice works
    if (e.target) e.target.value = "";
  };

  const handleImageChange = (index, value) => {
    setForm((s) => {
      const imgs = [...(s.images || [])];
      imgs[index] = value;
      return { ...s, images: imgs };
    });
    // if user typed a URL, ensure tempFiles index null
    setTempFiles((t) => {
      const arr = Array.isArray(t) ? [...t] : [];
      arr[index] = null;
      return arr;
    });
  };

  const addImage = () => {
    setForm((s) => ({ ...s, images: [...(s.images || []), ""] }));
    setTempFiles((t) => [...(t && Array.isArray(t) ? t : []), null]);
  };

  const removeImage = (index) => {
    setForm((s) => {
      const imgs = [...(s.images || [])];
      const removed = imgs.splice(index, 1)[0];
      // revoke objectURL if it was a blob URL
      if (typeof removed === "string" && removed.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(removed);
        } catch {
          return;
        }
      }
      return { ...s, images: imgs };
    });
    setTempFiles((t) => {
      const arr = Array.isArray(t) ? [...t] : [];
      arr.splice(index, 1);
      return arr;
    });
  };

  // revoke object URLs on unmount to avoid leaks
  useEffect(() => {
    return () => {
      (form.images || []).forEach((img) => {
        if (typeof img === "string" && img.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(img);
          } catch {
            return;
          }
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- variants ---------- */
  const handleVariantChange = (index, field, value) => {
    setForm((s) => {
      const v = [...s.variants];
      v[index] = { ...v[index], [field]: value };
      return { ...s, variants: v };
    });
  };
  const addVariant = () =>
    setForm((s) => ({ ...s, variants: [...s.variants, emptyVariant()] }));
  const removeVariant = (i) =>
    setForm((s) => {
      const v = s.variants.filter((_, idx) => idx !== i);
      return { ...s, variants: v.length ? v : [emptyVariant()] };
    });

  /* ---------- submit form (multipart to backend with multer) ---------- */
  const submitForm = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setCrudLoading(true);
    try {
      if (!form.name || !form.categoryId) {
        toast.error("Tên sản phẩm và danh mục là bắt buộc");
        setCrudLoading(false);
        return;
      }

      // Normalize variants
      const variantsPayload = (form.variants || []).map((v) => ({
        color: v.color || null,
        size: v.size || null,
        price: v.price !== "" ? Number(v.price) : 0,
        discountPrice:
          v.discountPrice !== ""
            ? v.discountPrice == null
              ? null
              : Number(v.discountPrice)
            : null,
        stock: v.stock !== "" ? Number(v.stock) : 0,
      }));

      // Existing image URLs (exclude preview blob: URLs)
      const existingImageUrls = (form.images || [])
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter((x) => x && !x.startsWith("blob:"));

      // Files to send (from tempFiles array) — safe detect
      const filesToUpload = (tempFiles || []).filter(
        (f) => f && typeof f === "object" && "name" in f
      );

      // Build FormData
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("categoryId", form.categoryId);
      if (form.description) fd.append("description", form.description);
      fd.append("variants", JSON.stringify(variantsPayload));
      fd.append("images", JSON.stringify(existingImageUrls)); // existing URLs

      // append files (field name "files" to match uploadMedia.array("files"))
      filesToUpload.forEach((file) => fd.append("files", file, file.name));

      // Debug: iterate formdata (optional)
      // for (const pair of fd.entries()) {
      //   console.log("FormData:", pair[0], pair[1]);
      // }

      // Send: DON'T set Content-Type manually. Let axios set it (with boundary).
      if (editing && editing.id) {
        await axios.patch(`/admin/products/${editing.id}`, fd); // no headers
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await axios.post("/admin/products", fd); // no headers
        toast.success("Tạo sản phẩm thành công");
      }

      // cleanup previews (revoke blob urls)
      (form.images || []).forEach((img) => {
        if (typeof img === "string" && img.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(img);
          } catch {
            return;
          }
        }
      });

      setShowForm(false);
      setTempFiles([]);
      setForm({
        name: "",
        description: "",
        categoryId: "",
        variants: [emptyVariant()],
        images: [emptyImage()],
      });
      // refresh list
      fetchList({ page: 1 });
      setPage(1);
    } catch (err) {
      console.error("submitForm err", err);
      toast.error(
        err?.response?.data?.error || err.message || "Lỗi khi lưu sản phẩm"
      );
    } finally {
      setCrudLoading(false);
    }
  };

  /* ---------- delete ---------- */
  const onDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    setCrudLoading(true);
    try {
      await deleteAdminProduct(id);
      toast.success("Xóa sản phẩm thành công");
      const remaining = items.length - 1;
      if (remaining <= 0 && meta.page > 1) {
        setPage((p) => Math.max(1, p - 1));
      } else {
        fetchList();
      }
    } catch (err) {
      console.error("delete err", err);
      toast.error(err?.response?.data?.error || err.message || "Lỗi khi xóa");
    } finally {
      setCrudLoading(false);
    }
  };

  /* ---------- pagination ---------- */
  const currentPage = meta?.page ?? page ?? 1;
  const currentSize = meta?.size ?? size;
  const totalPages =
    meta?.totalPages ??
    Math.max(1, Math.ceil((meta?.total ?? items.length) / currentSize));
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  /* ========== render ========== */
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-white to-slate-50 min-h-screen">
      {/* header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 text-slate-800 border border-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Quản lý sản phẩm</h2>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-300 rounded-full animate-pulse" />
              Tạo / Sửa / Lọc / Xuất dữ liệu
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ExportCSVButton rows={items} />
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white text-slate-700 font-semibold shadow-sm hover:scale-[1.03] transform transition border border-slate-100"
            >
              <PlusIcon className="w-5 h-5" />
              Tạo mới
            </button>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch(e)}
                placeholder="Tìm tên hoặc mô tả..."
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-sky-300 focus:ring-2 focus:ring-sky-50 transition outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3"
            >
              <option value="">Tất cả danh mục </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Giá từ"
              className="border border-slate-200 rounded-xl px-4 py-3 w-28"
            />
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Giá đến"
              className="border border-slate-200 rounded-xl px-4 py-3 w-28"
            />

            <select
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3"
            >
              <option value="">Sắp xếp giá</option>
              <option value="asc">Giá tăng</option>
              <option value="desc">Giá giảm</option>
            </select>

            <select
              value={sortDate}
              onChange={(e) => setSortDate(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3"
            >
              <option value="">Sắp xếp ngày</option>
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={applyFilter}
            disabled={loading}
            className="px-5 py-2.5 bg-sky-300 text-white rounded-xl font-medium hover:shadow-sm transform hover:scale-105 transition disabled:opacity-50"
          >
            ✓ Áp dụng
          </button>
          <button
            onClick={clearFilter}
            disabled={loading}
            className="px-5 py-2.5 bg-white text-slate-700 rounded-xl font-medium hover:bg-slate-50 border border-slate-100"
          >
            ↻ Đặt lại
          </button>
          <button
            onClick={onSearch}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-300 to-sky-200 text-slate-800 rounded-xl font-medium"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                  Khuyến mãi
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                  Tồn kho
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-sky-300 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-500 font-medium">
                        Đang tải sản phẩm...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <SparklesIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium">
                          Không có sản phẩm
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          Thử thay đổi bộ lọc hoặc thêm sản phẩm mới
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 transition-all duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-800 font-bold text-xs shadow-sm">
                        {(currentPage - 1) * currentSize + idx + 1}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                          {p.productImage && p.productImage[0] ? (
                            <img
                              src={getFullUrl(p.productImage[0].url)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <PhotoIcon className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {p.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {p.description
                              ? p.description.slice(0, 80) +
                                (p.description.length > 80 ? "..." : "")
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {p.category?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {p.price != null ? p.price : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {p.discountPrice != null ? p.discountPrice : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {p.stock ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-800 shadow-sm border border-slate-100 hover:bg-slate-200 transition"
                        >
                          <PencilIcon className="w-4 h-4" />
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

      {/* pagination */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Hiển thị</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg font-semibold">
            {items.length}
          </span>
          <span className="text-slate-600">trong tổng số</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg font-semibold">
            {meta.total}
          </span>
          <span className="text-slate-600">sản phẩm</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={page <= 1 || loading}
            className="px-4 py-2 rounded-xl border bg-white disabled:opacity-40 flex items-center gap-2"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Trước
          </button>

          <div className="px-5 py-2 bg-slate-100 text-slate-800 rounded-xl font-semibold">
            <span className="text-lg">{currentPage}</span>
            <span className="mx-2 opacity-75">/</span>
            <span className="text-lg">{totalPages}</span>
          </div>

          <button
            onClick={goNext}
            disabled={page >= totalPages || loading}
            className="px-4 py-2 rounded-xl border bg-white disabled:opacity-40 flex items-center gap-2"
          >
            Sau
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[90vh]">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                  <PhotoIcon className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {editing ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {editing
                      ? "Cập nhật thông tin & variants"
                      : "Thêm sản phẩm vào kho"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  aria-label="Đóng"
                  className="w-10 h-10 rounded-lg bg-white/80 hover:bg-slate-50 flex items-center justify-center border border-slate-100"
                >
                  <XMarkIcon className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* BODY */}
            <form
              onSubmit={submitForm}
              className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5"
            >
              {/* ROW 1: name + category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, name: e.target.value }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-sky-50 outline-none"
                    placeholder="Ví dụ: Áo thun cotton"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, categoryId: e.target.value }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-sky-50 outline-none"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ROW 2: description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, description: e.target.value }))
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 min-h-[90px] focus:ring-2 focus:ring-sky-50 outline-none"
                  placeholder="Mô tả ngắn"
                />
              </div>

              {/* IMAGES SECTION (full width) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hình ảnh (URLs hoặc chọn từ máy)
                </label>

                <div className="rounded-xl border border-dashed border-slate-100 bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <PhotoIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Kéo thả ảnh hoặc chọn từ máy
                        </div>
                        <div className="text-xs text-slate-400">
                          Ảnh sẽ upload khi lưu
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={triggerFileSelect}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border text-sm shadow-sm"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Chọn ảnh
                      </button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    onChange={onFilesSelected}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  {/* thumbnails - horizontal scroll (no placeholder when no images) */}
                  <div className="flex gap-3 overflow-x-auto py-2">
                    {(form.images || []).filter(Boolean).length > 0 ? (
                      (form.images || []).map((img, i) => {
                        if (!img) return null; // skip falsy entries

                        const isBlob = typeof img === "string" && img.startsWith("blob:");
                        const isString = typeof img === "string" && img.trim() !== "";

                        return (
                          <div key={i} className="relative w-28 h-28 rounded-lg overflow-hidden bg-white border shadow-sm flex-shrink-0">
                            {isBlob ? (
                              <img
                                src={img}
                                alt={`preview-${i}`}
                                className="w-full h-full object-cover"
                              />
                            ) : isString ? (
                              <img
                                src={getFullUrl(img)}
                                alt={`preview-${i}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // hide broken image instead of showing placeholder
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : null}

                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              title="Xóa ảnh"
                              className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow hover:bg-rose-600 hover:text-white transition"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })
                    ) : null}
                  </div>


                </div>
              </div>

              {/* VARIANTS SECTION */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-700">
                    Variants
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addVariant}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-400 text-white text-sm shadow-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Thêm variant
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[36vh] overflow-y-auto pr-2">
                  {form.variants.map((v, i) => (
                    <div
                      key={i}
                      className="bg-white border rounded-xl p-3 shadow-sm grid grid-cols-12 gap-2 items-center"
                    >
                      <input
                        placeholder="Màu"
                        value={v.color}
                        onChange={(e) =>
                          handleVariantChange(i, "color", e.target.value)
                        }
                        className="col-span-12 sm:col-span-3 border border-slate-200 rounded-lg px-2 py-2"
                      />
                      <input
                        placeholder="Size"
                        value={v.size}
                        onChange={(e) =>
                          handleVariantChange(i, "size", e.target.value)
                        }
                        className="col-span-12 sm:col-span-2 border border-slate-200 rounded-lg px-2 py-2"
                      />
                      <input
                        placeholder="Giá"
                        value={v.price}
                        onChange={(e) =>
                          handleVariantChange(i, "price", e.target.value)
                        }
                        className="col-span-6 sm:col-span-3 border border-slate-200 rounded-lg px-2 py-2"
                      />
                      <input
                        placeholder="Khuyến mãi"
                        value={v.discountPrice}
                        onChange={(e) =>
                          handleVariantChange(
                            i,
                            "discountPrice",
                            e.target.value
                          )
                        }
                        className="col-span-6 sm:col-span-2 border border-slate-200 rounded-lg px-2 py-2"
                      />
                      <input
                        placeholder="Tồn"
                        value={v.stock}
                        onChange={(e) =>
                          handleVariantChange(i, "stock", e.target.value)
                        }
                        className="col-span-6 sm:col-span-1 border border-slate-200 rounded-lg px-2 py-2"
                      />

                      <div className="col-span-6 sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="w-9 h-9 rounded-lg bg-white border border-slate-100 hover:bg-rose-600 hover:text-white transition flex items-center justify-center"
                          title="Xóa variant"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {form.variants.length === 0 && (
                    <div className="text-sm text-slate-400 italic">
                      Chưa có variant nào — bấm "Thêm variant"
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* FOOTER */}
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t bg-white">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-100 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={(e) => submitForm(e)}
                disabled={crudLoading}
                className="px-4 py-2 rounded-xl bg-sky-400 text-white shadow-sm hover:bg-sky-300"
              >
                {crudLoading
                  ? "Đang lưu..."
                  : editing
                  ? "Lưu thay đổi"
                  : "Tạo sản phẩm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;
