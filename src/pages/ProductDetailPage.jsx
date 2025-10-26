"use client";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductDetail } from "../service/api.product.service";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../features/order/cartSlice";
import { fetchSimilarProducts } from "../features/products/similarProductsSlice";
import { addToRecentlyViewed } from "../features/products/recentlyViewedSlice";
import FavoriteButton from "../components/FavoriteButton";
import ProductSection from "../components/ProductSection";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await ProductDetail(id);
        // depending on your API wrapper, res.data may be the product or wrapped
        const p = res?.data ?? res;
        setProduct(p);

        const vars = p?.variants ?? [];
        if (Array.isArray(vars) && vars.length > 0) {
          setSelectedVariant(vars[0]);
          setSelectedColor(vars[0].color ?? null);
        }

        dispatch(addToRecentlyViewed(id));
        dispatch(fetchSimilarProducts(id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id, dispatch]);

  if (!product || !selectedVariant)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <span className="text-xl text-indigo-600 font-semibold animate-pulse">
          Đang tải...
        </span>
      </div>
    );

  // normalize images array (support both productImage or images)
  const rawImages = product.productImage ?? product.images ?? [];
  // rawImages may be array of {id, url} or strings
  const images = Array.isArray(rawImages)
    ? rawImages
      .map((it) => {
        if (!it) return null;
        if (typeof it === "string") return { id: it, url: it };
        // if object, try url field
        return { id: it.id ?? it.url ?? JSON.stringify(it), url: it.url ?? it.path ?? "" };
      })
      .filter((i) => i && i.url)
    : [];

  const { name, description, category, variants = [] } = product;
  const price = selectedVariant?.price ?? 0;
  const discountPrice = selectedVariant?.discountPrice ?? null;
  const stock = selectedVariant?.stock ?? 0;

  // Danh sách màu duy nhất (filter out falsy)
  const uniqueColors = [...new Set((variants || []).map((v) => v.color).filter(Boolean))];
  // sizes for currently selected color
  const sizesByColor = (variants || []).filter((v) => v.color === selectedColor);

  const handleIncrease = () => {
    if (quantity < stock) setQuantity((q) => q + 1);
  };
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };
  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    dispatch(addToCart({ variantId: selectedVariant.id, quantity }))
      .unwrap()
      .then(() => {
        dispatch(fetchCart());
        toast.success("Đã thêm vào giỏ hàng!");
      })
      .catch((err) => {
        toast.error("Lỗi khi thêm giỏ hàng: " + (err?.message || err));
      });
  };

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

  const isOutOfStock = stock <= 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-indigo-50 to-white py-6 px-2 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Swiper hình ảnh - lớn */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 flex flex-col items-center justify-center gap-4">
          <Swiper
            modules={[Navigation, Pagination, Thumbs]}
            navigation
            pagination={{ clickable: true }}
            thumbs={{ swiper: thumbsSwiper }}
            spaceBetween={10}
            slidesPerView={1}
            className="w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-2xl overflow-hidden"
          >
            {images && images.length > 0 ? (
              images.map((img) => (
                <SwiperSlide key={img.id}>
                  <img
                    src={getFullUrl(img.url)}
                    alt={name}
                    className="w-full h-full object-contain rounded-2xl transition-transform duration-300 hover:scale-105 bg-gradient-to-br from-indigo-100 to-white"
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium bg-gray-100 rounded-2xl">
                  Không có hình ảnh
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          {/* thumbnail swiper (nếu có >1 ảnh) */}
          {images && images.length > 1 && (
            <div className="w-full max-w-xl">
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs, Navigation]}
                spaceBetween={8}
                slidesPerView={Math.min(6, images.length)}
                watchSlidesProgress
                className="h-20 mt-2"
              >
                {images.map((img) => (
                  <SwiperSlide key={"thumb-" + img.id} className="h-20">
                    <div className="w-full h-full p-1 rounded-md border border-gray-100 bg-white flex items-center justify-center">
                      <img
                        src={getFullUrl(img.url)}
                        alt={`thumb-${img.id}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex flex-col bg-white rounded-3xl shadow-xl p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-800 mb-2 sm:mb-4 flex items-center gap-2">
            {name}
            <FavoriteButton productId={id} className="ml-2" />
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mb-2">
            Danh mục:{" "}
            <span className="font-medium text-indigo-600">
              {category?.name || "N/A"}
            </span>
          </p>

          <div className="flex items-center gap-4 mb-4">
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-medium text-indigo-700">
                {product.reviewCount ?? 0}
              </span>{" "}
              lượt đánh giá
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              Đã bán:{" "}
              <span className="font-medium text-indigo-700">
                {product.totalSold ?? 0}
              </span>
            </p>
          </div>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
            {description}
          </p>

          {/* Chọn màu */}
          {uniqueColors.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Màu sắc:
              </label>
              <div className="flex flex-wrap gap-2">
                {uniqueColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedColor(c);
                      // pick first variant with this color
                      const firstSize = (variants || []).find((v) => v.color === c);
                      if (firstSize) setSelectedVariant(firstSize);
                    }}
                    className={`px-3 py-1 rounded-lg border ${selectedColor === c
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chọn size */}
          {sizesByColor != null && sizesByColor.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kích thước:
              </label>
              <div className="flex flex-wrap gap-2">
                {sizesByColor.map((v) => (
                  <button
                    key={v.id + "-size"}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-1 rounded-lg border ${selectedVariant?.id === v.id
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Giá */}
          <div className="mb-4 sm:mb-6 flex items-center gap-4">
            {discountPrice ? (
              <>
                <span className="line-through text-gray-400 text-lg sm:text-xl">
                  {Number(price).toLocaleString("vi-VN")}₫
                </span>
                <span className="text-indigo-600 text-2xl sm:text-3xl font-bold drop-shadow">
                  {Number(discountPrice).toLocaleString("vi-VN")}₫
                </span>
              </>
            ) : (
              <span className="text-indigo-600 text-2xl sm:text-3xl font-bold drop-shadow">
                {Number(price).toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>

          {/* Tồn kho */}
          <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${isOutOfStock ? "text-rose-600 font-semibold" : "text-gray-600"}`}>
            {isOutOfStock
              ? "Sản phẩm đã hết hàng"
              : `${stock} sản phẩm còn lại`}
          </p>

          {/* Selector số lượng */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <button
              onClick={handleDecrease}
              className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors text-indigo-700 font-bold text-lg disabled:opacity-50 shadow"
              disabled={quantity <= 1 || isOutOfStock}
            >
              -
            </button>
            <input
              type="text"
              value={quantity}
              readOnly
              className="w-14 text-center border-2 border-indigo-100 rounded-lg py-2 text-indigo-800 font-semibold bg-indigo-50"
            />
            <button
              onClick={handleIncrease}
              className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors text-indigo-700 font-bold text-lg disabled:opacity-50 shadow"
              disabled={quantity >= stock || isOutOfStock}
            >
              +
            </button>
          </div>

          {/* Nút Thêm giỏ hàng */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full sm:w-64 bg-gray-300 text-gray-500 font-semibold text-lg py-3 px-6 rounded-xl cursor-not-allowed shadow-inner mt-2"
            >
              Sản phẩm đã hết hàng
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-64 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold text-lg py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg mt-2"
            >
              Thêm vào giỏ hàng
            </button>
          )}
        </div>
      </div>

      {/* Phần sản phẩm tương tự */}
      <div className="mt-8">
        <SimilarProducts productId={id} />
      </div>
    </div>
  );
}

// Component sản phẩm tương tự
function SimilarProducts({ productId }) {
  const dispatch = useDispatch();
  const { products = [], loading } = useSelector((state) => state.similarProducts ?? { products: [], loading: false });

  useEffect(() => {
    if (productId) {
      dispatch(fetchSimilarProducts(productId));
    }
  }, [productId, dispatch]);

  if (loading || !products || products.length === 0) return null;

  return <ProductSection title="Sản phẩm tương tự" products={products} />;
}
