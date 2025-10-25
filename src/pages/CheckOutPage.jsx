import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import toast from "react-hot-toast";
import { Package, MapPin, FileText } from "lucide-react";

import OrderList from "../components/OrderList";
import Input from "../components/Input";
import DropdownInput from "../components/DropdownInput";
import VoucherSelector from "../components/VoucherSelector";
import AddressPicker from "../components/AddressPicker";

import {
    clearCart,
    fetchCart,
    fetchPreCheckout,
} from "../features/order/cartSlice";
import { createOrderCOD } from "../features/order/orderSlice";
import {
    fetchMyShippingCoupons,
    fetchMyProductCoupons,
} from "../features/products/couponSlice";

export default function CheckoutCOD() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        items: cartItems = [],
        selectedCartItemIds = [],
        subTotal = 0,
        shippingFee = 0,
        shippingDiscount = 0,
        productDiscount = 0,
        total = 0,
        loading,
        error,
    } = useSelector((state) => state.cart);

    const { shippingCoupons = [], productCoupons = [] } = useSelector(
        (state) => state.coupons
    );

    const defaultLat = parseFloat(import.meta.env.VITE_HCMUTE_LAT) || 10.850721;
    const defaultLng = parseFloat(import.meta.env.VITE_HCMUTE_LNG) || 106.771395;

    const [form, setForm] = useState({
        address: "",
        phone: "",
        shipping: "Giao hàng nhanh",
        shippingVoucher: "",
        productVoucher: "",
        paymentMethod: "COD",
        lat: defaultLat,
        lng: defaultLng,
    });

    const selectedItems = useMemo(
        () => cartItems.filter((i) => selectedCartItemIds.includes(i.id)),
        [cartItems, selectedCartItemIds]
    );

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(fetchMyShippingCoupons());
        dispatch(fetchMyProductCoupons());
    }, [dispatch]);

    useEffect(() => {
        if (selectedItems.length) {
            dispatch(
                fetchPreCheckout({
                    cartItemIds: selectedItems.map((i) => i.id),
                    shippingVoucher: form.shippingVoucher,
                    productVoucher: form.productVoucher,
                    lat: form.lat,
                    lng: form.lng,
                })
            );
        }
    }, [
        dispatch,
        selectedItems,
        form.shippingVoucher,
        form.productVoucher,
        form.lat,
        form.lng,
    ]);

    if (error) {
        return (
            <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
        );
    }

    const handleChange = (e) => {
        console.log("🔹 onChange:", e.target.name, e.target.value);
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedItems.length) {
            message.error("Không có sản phẩm nào trong đơn hàng");
            return;
        }

        dispatch(
            createOrderCOD({
                address: form.address,
                phone: form.phone,
                cartItemIds: selectedItems.map((i) => i.id),
                shippingVoucher: form.shippingVoucher,
                productVoucher: form.productVoucher,
                lat: form.lat,
                lng: form.lng,
            })
        )
            .unwrap()
            .then(() => {
                toast.success("Đặt hàng thành công!");
                dispatch(clearCart());
                localStorage.removeItem("selectedCartItemIds");
                navigate("/orders");
            })
            .catch((err) => {
                toast.error(String(err));
                message.error(err || "Có lỗi xảy ra, vui lòng thử lại!");
            });
    };

    if (!selectedItems.length) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center">
                <img src="/empty-cart.svg" alt="Empty cart" className="w-40 mb-4" />
                <p className="text-gray-600">Giỏ hàng của bạn đang trống</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        );
    }

    console.log("shippingVoucher:", form.shippingVoucher);
    console.log("productVoucher:", form.productVoucher);


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Danh sách sản phẩm */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            Sản phẩm trong đơn
                        </h2>

                        <OrderList
                            products={selectedItems.map((item) => ({
                                id: item.id,
                                name: item.variant.product.name,
                                price: item.variant.discountPrice ?? item.variant.price,
                                qty: item.quantity,
                                image: item.variant.image ?? "",
                                description: `Size: ${item.variant.size || "-"}, Màu: ${item.variant.color || "-"
                                    }`,
                                variant: item.variant,
                            }))}
                        />
                    </div>

                    {/* Tổng kết đơn hàng */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-3">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            Tóm tắt đơn hàng
                        </h2>

                        <div className="flex justify-between text-gray-600">
                            <span>Tạm tính</span>
                            <span>{subTotal.toLocaleString()}₫</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Phí vận chuyển</span>
                            <span>{shippingFee.toLocaleString()}₫</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Giảm giá</span>
                            <span>
                                -{(shippingDiscount + productDiscount).toLocaleString()}₫
                            </span>
                        </div>
                        <div className="border-t pt-3 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
                            <span className="text-2xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {total.toLocaleString()}₫
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-5 h-fit sticky top-10"
                >
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        Thông tin giao hàng
                    </h2>

                    <AddressPicker
                        onAddressChange={(data) =>
                            setForm({
                                ...form,
                                address: data.address,
                                lat: data.lat,
                                lng: data.lng,
                            })
                        }
                    />

                    <Input
                        label="Địa chỉ nhận hàng"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ cụ thể hoặc chọn trên bản đồ"
                        required
                    />

                    <Input
                        label="Số điện thoại"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="VD: 0987xxxxxx"
                        required
                    />

                    <DropdownInput
                        label="Phương thức vận chuyển"
                        value={form.shipping}
                        onChange={(e) => setForm({ ...form, shipping: e.target.value })}
                        options={[
                            { value: "Giao hàng nhanh", label: "Giao hàng nhanh" },
                        ]}
                    />

                    <VoucherSelector
                        label="Mã giảm giá vận chuyển"
                        name="shippingVoucher"
                        value={form.shippingVoucher || ""}
                        onChange={handleChange}
                        subTotal={subTotal}
                        options={shippingCoupons}
                    />


                    <VoucherSelector
                        label="Mã giảm giá sản phẩm"
                        name="productVoucher"
                        value={form.productVoucher || ""}
                        onChange={handleChange}
                        subTotal={subTotal}
                        options={productCoupons}
                    />

                    <DropdownInput
                        label="Phương thức thanh toán"
                        value={form.paymentMethod}
                        onChange={(e) =>
                            setForm({ ...form, paymentMethod: e.target.value })
                        }
                        options={[
                            { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
                        ]}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex justify-between items-center px-4 hover:opacity-90 disabled:opacity-50 transition"
                    >
                        {loading ? (
                            <Spin />
                        ) : (
                            <>
                                <span>Xác nhận đặt hàng</span>
                                <span className="text-yellow-300">
                                    {total.toLocaleString()}₫
                                </span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
