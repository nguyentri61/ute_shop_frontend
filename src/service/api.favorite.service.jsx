import axios from "./axios.customize";

// Lấy danh sách sản phẩm yêu thích
const GetFavorites = async () => {
  const API = "/favorites";
  return axios.get(API);
};

// Thêm sản phẩm vào danh sách yêu thích
const AddToFavorites = async (productId) => {
  const API = "/favorites/add";
  return axios.post(API, { productId });
};

// Xóa sản phẩm khỏi danh sách yêu thích
const RemoveFromFavorites = async (productId) => {
  const API = `/favorites/remove/${productId}`;
  return axios.delete(API);
};

// Kiểm tra sản phẩm có trong danh sách yêu thích không
const CheckIsFavorite = async (productId) => {
  const API = `/favorites/check/${productId}`;
  return axios.get(API);
};

// Lấy sản phẩm tương tự
const GetSimilarProducts = async (productId, limit = 8) => {
  const API = `/products/${productId}/similar?limit=${limit}`;
  return axios.get(API);
};

// Lấy danh sách sản phẩm đã xem
const GetRecentlyViewedProducts = async (limit = 8) => {
  const API = `/recently-viewed?limit=${limit}`;
  return axios.get(API);
};

// Thêm sản phẩm vào danh sách đã xem
const AddToRecentlyViewed = async (productId) => {
  const API = "/recently-viewed/add";
  return axios.post(API, { productId });
};

export {
  GetFavorites,
  AddToFavorites,
  RemoveFromFavorites,
  CheckIsFavorite,
  GetSimilarProducts,
  GetRecentlyViewedProducts,
  AddToRecentlyViewed
};