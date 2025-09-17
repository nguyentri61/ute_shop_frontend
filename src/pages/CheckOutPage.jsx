import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import OrderList from "../components/OrderList";
import Input from "../components/Input";
import DropdownInput from "../components/DropdownInput";
import { clearCart, fetchCart, fetchPreCheckout, updateQuantity } from "../features/order/cartSlice";
import { createOrderCOD } from "../features/order/orderSlice";

const CheckoutCOD = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        items: cartItems = [],
        selectedCartItemIds = [],
        subTotal,
        shippingFee,
        shippingDiscount,
        productDiscount,
        total,
        loading,
        error,
    } = useSelector((state) => state.cart);

    const [form, setForm] = useState({
        address: "",
        phone: "",
        shipping: "Giao hàng nhanh",
        shippingVoucher: "",
        productVoucher: "",
        paymentMethod: "COD",
    });

    const selectedItems = useMemo(() => {
        return cartItems.filter((i) => selectedCartItemIds.includes(i.id));
    }, [cartItems, selectedCartItemIds]);

    useEffect(() => {
        if (cartItems.length > 0 && selectedCartItemIds.length > 0) {
            dispatch(fetchPreCheckout({
                cartItemIds: selectedCartItemIds,
                shippingVoucher: form.shippingVoucher,
                productVoucher: form.productVoucher,
            }));
        }
    }, [dispatch, cartItems, selectedCartItemIds, form.shippingVoucher, form.productVoucher]);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    loading & <p className="text-gray-500">Đang cập nhật...</p>;
    if (error) return <div>Lỗi: {error}</div>;

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleVoucherBlur = () => {
        dispatch(
            fetchPreCheckout({
                cartItemIds: selectedCartItemIds,
                shippingVoucher: form.shippingVoucher,
                productVoucher: form.productVoucher,
            })
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCartItemIds.length === 0) {
            message.error("Vui lòng chọn ít nhất 1 sản phẩm");
            return;
        }
        dispatch(
            createOrderCOD({
                address: form.address,
                phone: form.phone,
                cartItemIds: selectedCartItemIds,
                shippingVoucher: form.shippingVoucher,
                productVoucher: form.productVoucher,
            })
        )
            .unwrap()
            .then(() => {
                message.success("Đặt hàng thành công!");
                dispatch(clearCart());
                localStorage.removeItem("selectedCartItemIds");
                navigate("/");
            })
            .catch((err) => {
                message.error(err || "Có lỗi xảy ra, vui lòng thử lại!");
            });
    };

    const handleIncrease = (id) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item) return;

        dispatch(updateQuantity({ cartItemId: id, quantity: item.quantity + 1 }))
            .unwrap()
            .then(() => {
                dispatch(
                    fetchPreCheckout({
                        cartItemIds: selectedCartItemIds,
                        shippingVoucher: form.shippingVoucher,
                        productVoucher: form.productVoucher,
                    })
                );
            })
            .catch((err) =>
                message.error(err || "Có lỗi xảy ra khi tăng số lượng!")
            );
    };

    const handleDecrease = (id) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item) return;

        const newQty = item.quantity - 1;
        dispatch(updateQuantity({ cartItemId: id, quantity: newQty }))
            .unwrap()
            .then(() => {
                dispatch(
                    fetchPreCheckout({
                        cartItemIds: selectedCartItemIds,
                        shippingVoucher: form.shippingVoucher,
                        productVoucher: form.productVoucher,
                    })
                );
            })
            .catch((err) =>
                message.error(err || "Có lỗi xảy ra khi giảm số lượng!")
            );
    };

    return (
        <div className="container mx-auto p-6 grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <OrderList
                    products={selectedItems.map((item) => ({
                        id: item.id,
                        name: item.variant.product.name,
                        price: item.variant.discountPrice ?? item.variant.price,
                        qty: item.quantity,
                        image: item.variant.image ?? "",
                        description: `Size: ${item.variant.size || "-"}, Color: ${item.variant.color || "-"
                            }`,
                        variant: item.variant,
                    }))}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                />
            </div>

            <form
                onSubmit={handleSubmit}
                className="col-span-1 bg-white p-4 rounded-2xl shadow flex flex-col gap-4 h-fit"
            >
                <h2 className="text-xl font-bold mb-4">Thông tin thanh toán</h2>

                <Input
                    label="Địa chỉ"
                    value={form.address}
                    onChange={handleChange}
                    name="address"
                />
                <Input
                    label="Số điện thoại"
                    value={form.phone}
                    onChange={handleChange}
                    name="phone"
                />

                <DropdownInput
                    label="Phương thức vận chuyển"
                    value={form.shipping}
                    onChange={(e) => setForm({ ...form, shipping: e.target.value })}
                    options={[
                        { value: "Giao hàng nhanh", label: "Giao hàng nhanh" },
                        { value: "Giao hàng tiết kiệm", label: "Giao hàng tiết kiệm" },
                    ]}
                />

                <Input
                    label="Shipping Voucher"
                    value={form.shippingVoucher}
                    onChange={handleChange}
                    onBlur={handleVoucherBlur}
                    name="shippingVoucher"
                />
                <Input
                    label="Product Voucher"
                    value={form.productVoucher}
                    onChange={handleChange}
                    onBlur={handleVoucherBlur}
                    name="productVoucher"
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

                <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Tiền hàng</span>
                        <span>{subTotal.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Phí vận chuyển</span>
                        <span>{shippingFee.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Giảm giá</span>
                        <span>-{(shippingDiscount + productDiscount).toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Tổng cộng</span>
                        <span className="text-red-600">{total.toLocaleString()} đ</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={selectedItems.length === 0}
                    className="w-full bg-red-500 text-white py-3 rounded-xl font-bold text-lg mt-4 flex justify-between px-4 items-center disabled:bg-gray-400"
                >
                    <span>Đặt hàng</span>
                    <span className="text-yellow-300">{total.toLocaleString()} đ</span>
                </button>
            </form>
        </div>
    );
};

export default CheckoutCOD;
