import axios from "./axios.customize";

const GetMyCoupons = async (type) => {
    const API = "/coupons/my-coupons?type=" + type;
    return axios.get(API);
}

export { GetMyCoupons }