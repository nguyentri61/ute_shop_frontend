import axios from "./axios.customize";

const PreCheckout = async (cartItemIds, shippingVoucher = null, productVoucher = null) => {
    const API = "/carts/preview-checkout";
    return axios.post(API, { cartItemIds, shippingVoucher, productVoucher });
}

const UpdateQuantity = async (cartItemId, quantity) => {
    const API = "/carts/update";
    return axios.put(API, { cartItemId, quantity });
}

export { PreCheckout, UpdateQuantity }