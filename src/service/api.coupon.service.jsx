import axios from "./axios.customize";

const GetMyCoupons = async (type) => {
    const API = "/coupons/my-coupons?type=" + type;
    return axios.get(API);
}

const GetCouponStats = async () => {
    const API = "/admin/coupons/stats";
    return axios.get(API);
};

const GetCouponDistribution = async () => {
    const API = "/admin/coupons/distribution";
    return axios.get(API);
};

const GetExpiringCoupons = async () => {
    const API = "/admin/coupons/expiring";
    return axios.get(API);
};

const CreateCoupon = async (data) => {
    const API = "/admin/coupons";
    return axios.post(API, data);
};

const GetCoupons = (params) => {
    const API = "/admin/coupons";
    return axios.get(API, { params });
}
export {
    GetMyCoupons,
    GetCouponStats,
    GetCouponDistribution,
    GetExpiringCoupons,
    CreateCoupon,
    GetCoupons,
}