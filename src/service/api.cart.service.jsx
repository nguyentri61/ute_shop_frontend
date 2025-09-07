import axios from "./axios.customize";

const PreCheckout = async (cartItemIds, shippingVoucher = null, productVoucher = null) => {
    const API = "/carts/preview-checkout";
    return axios.post(API, { cartItemIds, shippingVoucher, productVoucher });
}

export { PreCheckout }