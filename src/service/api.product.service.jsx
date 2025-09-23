import axios from "./axios.customize";

// Lấy tất cả sản phẩm
const AllProducts = async () => {
  const API = "/products/all";
  return axios.get(API);
};

const PaginatedProducts = async ({ page, limit }) => {
  const API = `/products/paginated-products?page=${page}&limit=${limit}`;
  return axios.get(API);
};

// Lấy 8 sản phẩm mới nhất
const NewestProducts = async () => {
  const API = "/products/newest";
  return axios.get(API);
};

// Lấy 6 sản phẩm bán chạy nhất
const BestSellingProducts = async () => {
  const API = "/products/best-selling";
  return axios.get(API);
};

// Lấy 8 sản phẩm được xem nhiều nhất
const MostViewedProducts = async () => {
  const API = "/products/most-viewed";
  return axios.get(API);
};

// Lấy 4 sản phẩm khuyến mãi cao nhất
const TopDiscountProducts = async () => {
  const API = "/products/top-discount";
  return axios.get(API);
};
const ProductDetail = async (id) => {
  if (!id) throw new Error("Product id is required");

  const API = `/products/${id}`;
  return axios.get(API);
};

const CreateReview = async (productId, reviewData) => {
  if (!productId) throw new Error("Product id is required");
  const API = `/products/${productId}/reviews`;
  return axios.post(API, reviewData);
};

const ProductByCategory = async ({ categoryId, page, limit }) => {
  if (!categoryId) throw new Error("Category id is required");
  const API = `/products/category/${categoryId}?page=${page}&limit=${limit}`;
  return axios.get(API);
}

const ProductsByFilter = async (filters) => {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    sortDate,
    sortPrice,
    page = 1,
    limit = 8,
  } = filters;

  // Tạo query string
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (categoryId) params.append("category", categoryId);
  if (minPrice !== undefined && minPrice >= 0) params.append("minPrice", minPrice);
  if (maxPrice !== undefined && maxPrice >= 0) params.append("maxPrice", maxPrice);
  if (sortDate) params.append("sortDate", sortDate); // "asc" | "desc"
  if (sortPrice) params.append("sortPrice", sortPrice); // "asc" | "desc"

  params.append("page", page);
  params.append("limit", limit);

  const API = `/products?${params.toString()}`;
  console.log("API with filters:", API);
  return axios.get(API);
};

export {
  AllProducts,
  ProductDetail,
  PaginatedProducts,
  NewestProducts,
  BestSellingProducts,
  MostViewedProducts,
  TopDiscountProducts,
  CreateReview,
  ProductByCategory,
  ProductsByFilter
};
