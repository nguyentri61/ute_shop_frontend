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

export {
    AllProducts,
    PaginatedProducts,
    NewestProducts,
    BestSellingProducts,
    MostViewedProducts,
    TopDiscountProducts,
};
