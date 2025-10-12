import axios from "./axios.customize";

// Xem trước khi thanh toán
const PreCheckout = async (cartItemIds, shippingVoucher = null, productVoucher = null, lat, lng) => {
    const API = "/carts/preview-checkout";
    return axios.post(API, { cartItemIds, shippingVoucher, productVoucher, lat, lng });
};

// Cập nhật số lượng sản phẩm trong giỏ
const UpdateQuantity = async (cartItemId, quantity) => {
    const API = "/carts/update";
    return axios.put(API, { cartItemId, quantity });
};

// Thêm sản phẩm vào giỏ
const AddToCart = async (variantId, quantity = 1) => {
    const API = "/carts/add";
    return axios.post(API, { variantId, quantity });
};

// Xóa 1 item trong giỏ
const RemoveFromCart = async (cartItemId) => {
    const API = `/carts/remove/${cartItemId}`;
    return axios.delete(API);
};

// Lấy giỏ hàng hiện tại
const GetCart = async () => {
    const API = "/carts";
    return axios.get(API);
};

// Xóa hết giỏ hàng
const ClearCart = async () => {
    const API = "/carts/clear";
    return axios.delete(API);
};

export {
    PreCheckout,
    UpdateQuantity,
    AddToCart,
    RemoveFromCart,
    GetCart,
    ClearCart,
};
