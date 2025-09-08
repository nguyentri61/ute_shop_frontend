import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import OrderList from "../components/OrderList";
import Input from "../components/Input";
import DropdownInput from "../components/DropdownInput";
import { fetchPreCheckout } from "../features/order/cartSlice";
import { createOrderCOD } from "../features/order/orderSlice";

const CheckoutCOD = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        items: cartItems = [],
        subTotal,
        shippingFee,
        shippingDiscount,
        productDiscount,
        total,
        loading,
        error } = useSelector((state) => state.cart);

    console.log(cartItems);

    const [form, setForm] = useState({
        address: "",
        phone: "",
        shipping: "Giao hàng nhanh",
        shippingVoucher: "",
        productVoucher: "",
        paymentMethod: "COD",
    });

    // Dữ liệu cứng cartItemIds
    const cartItemIds = React.useMemo(() => [
        "9e14bd8e-8cc8-11f0-8719-02501ad7019e",
    ], []);

    useEffect(() => {
        dispatch(fetchPreCheckout({
            cartItemIds,
            shippingVoucher: form.shippingVoucher,
            productVoucher: form.productVoucher,
        }));
    }, [dispatch]);


    if (loading) return <div>Đang tải giỏ hàng...</div>;
    if (error) return <div>Lỗi: {error}</div>;

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleVoucherBlur = () => {
        console.log("🔎 Blur voucher:", form.shippingVoucher, form.productVoucher);
        dispatch(fetchPreCheckout({
            cartItemIds,
            shippingVoucher: form.shippingVoucher,
            productVoucher: form.productVoucher,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createOrderCOD({
            address: form.address,
            phone: form.phone,
            cartItemIds,
            shippingVoucher: form.shippingVoucher,
            productVoucher: form.productVoucher,
        }))
            .unwrap()
            .then(() => {
                alert("Đặt hàng thành công!");
                navigate("/");
            })
            .catch((err) => {
                message.error(err || "Có lỗi xảy ra, vui lòng thử lại!");
            });
    };

    const mappedCartItems = cartItems.map(item => ({
        id: item.id,
        name: item.variant.product.name, // nếu có tên thật thì dùng
        price: item.variant.discountPrice ?? item.variant.price,
        qty: item.quantity,
        image: item.variant.image ?? "", // nếu chưa có, để trống hoặc default image
        description: `Size: ${item.variant.size || "-"}, Color: ${item.variant.color || "-"}`,
        variant: item.variant // giữ nguyên variant nếu muốn dùng
    }));
    console.log("cartItems", cartItems);
    console.log("shipping", shippingDiscount);
    console.log("mappedCartItems:", mappedCartItems);


    return (
        <div className="container mx-auto p-6 grid grid-cols-3 gap-6">

            <div className="col-span-2">
                <OrderList products={mappedCartItems} />
            </div>

            <form onSubmit={handleSubmit} className="col-span-1 bg-white p-4 rounded-2xl shadow flex flex-col gap-4 h-fit">
                <h2 className="text-xl font-bold mb-4">Thông tin thanh toán</h2>

                <Input label="Địa chỉ" value={form.address} onChange={handleChange} name="address" />
                <Input label="Số điện thoại" value={form.phone} onChange={handleChange} name="phone" />

                <DropdownInput
                    label="Phương thức vận chuyển"
                    value={form.shipping}
                    onChange={(e) => setForm({ ...form, shipping: e.target.value })}
                    options={[
                        { value: "Giao hàng nhanh", label: "Giao hàng nhanh" },
                        { value: "Giao hàng tiết kiệm", label: "Giao hàng tiết kiệm" },
                    ]}
                />

                <Input label="Shipping Voucher" value={form.shippingVoucher} onChange={handleChange} onBlur={handleVoucherBlur} name="shippingVoucher" />
                <Input label="Product Voucher" value={form.productVoucher} onChange={handleChange} onBlur={handleVoucherBlur} name="productVoucher" />

                <DropdownInput
                    label="Phương thức thanh toán"
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    options={[
                        { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
                    ]}
                />

                <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Tiền hàng</span><span>{subTotal.toLocaleString()} đ</span></div>
                    <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingFee.toLocaleString()} đ</span></div>
                    <div className="flex justify-between"><span>Giảm giá</span><span>-{(shippingDiscount + productDiscount).toLocaleString()} đ</span></div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Tổng cộng</span>
                        <span className="text-red-600">{total.toLocaleString()} đ</span>
                    </div>
                </div>

                <button type="submit" disabled={cartItems.length === 0} className="w-full bg-red-500 text-white py-3 rounded-xl font-bold text-lg mt-4 flex justify-between px-4 items-center disabled:bg-gray-400">
                    <span>Đặt hàng</span>
                    <span className="text-yellow-300">{total.toLocaleString()} đ</span>
                </button>
            </form>
        </div>
    );

};

export default CheckoutCOD;
