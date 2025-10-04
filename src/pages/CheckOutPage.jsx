import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import OrderList from "../components/OrderList";
import Input from "../components/Input";
import DropdownInput from "../components/DropdownInput";
import {
  clearCart,
  fetchCart,
  fetchPreCheckout,
  updateQuantity,
} from "../features/order/cartSlice";
import { createOrderCOD } from "../features/order/orderSlice";
import {
  fetchMyShippingCoupons,
  fetchMyProductCoupons,
} from "../features/products/couponSlice";
import toast from "react-hot-toast";

const CheckoutCOD = () => {
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
    dispatch(fetchCart());
    dispatch(fetchMyShippingCoupons());
    dispatch(fetchMyProductCoupons());
  }, [dispatch]);

  useEffect(() => {
    if (cartItems.length > 0 && selectedCartItemIds.length > 0) {
      dispatch(
        fetchPreCheckout({
          cartItemIds: selectedCartItemIds,
          shippingVoucher: form.shippingVoucher,
          productVoucher: form.productVoucher,
        })
      );
    }
  }, [
    dispatch,
    cartItems,
    selectedCartItemIds,
    form.shippingVoucher,
    form.productVoucher,
  ]);

  if (error) {
    return (
      <div className="text-center p-6 text-red-600 font-semibold">
        Lỗi: {error}
      </div>
    );
  }

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
    if (!form.address || !form.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin");
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
        toast.success("Đã đặt hàng");
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
      .catch((err) => message.error(err || "Có lỗi xảy ra khi tăng số lượng!"));
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
      .catch((err) => message.error(err || "Có lỗi xảy ra khi giảm số lượng!"));
  };

  // Hiển thị giỏ hàng trống
  if (selectedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <img src="/empty-cart.svg" alt="Empty Cart" className="w-40 mb-6" />
        <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg shadow"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded-2xl shadow ">
        <OrderList
          products={selectedItems.map((item) => ({
            id: item.id,
            name: item.variant.product.name,
            price: item.variant.discountPrice ?? item.variant.price,
            qty: item.quantity,
            image: item.variant.image ?? "",
            description: `Size: ${item.variant.size || "-"}, Color: ${
              item.variant.color || "-"
            }`,
            variant: item.variant,
          }))}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg sticky top-6 flex flex-col gap-4 h-fit"
      >
        <h2 className="text-xl font-bold flex items-center gap-2">
          <i className="ri-file-list-3-line text-blue-500"></i> Thông tin thanh
          toán
        </h2>

        <Input
          label="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          name="address"
          placeholder="Nhập địa chỉ nhận hàng"
          required
        />
        <Input
          label="Số điện thoại"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          name="phone"
          placeholder="VD: 0987xxxxxx"
          required
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

        <DropdownInput
          label="Mã giảm giá vận chuyển"
          value={form.shippingVoucher}
          onChange={handleChange}
          onBlur={handleVoucherBlur}
          name="shippingVoucher"
          options={[
            { value: "", label: "Chọn mã giảm giá vận chuyển" },
            ...shippingCoupons.map((c) => ({
              value: c.id,
              label: `${c.code} - Giảm ${c.discount}₫`,
            })),
          ]}
        />

        <DropdownInput
          label="Mã giảm giá sản phẩm"
          value={form.productVoucher}
          onChange={handleChange}
          onBlur={handleVoucherBlur}
          name="productVoucher"
          options={[
            { value: "", label: "Chọn mã giảm giá sản phẩm" },
            ...productCoupons.map((c) => ({
              value: c.id,
              label: `${c.code} - Giảm ${c.discount}₫`,
            })),
          ]}
        />

        <DropdownInput
          label="Phương thức thanh toán"
          value={form.paymentMethod}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
          options={[{ value: "COD", label: "Thanh toán khi nhận hàng (COD)" }]}
        />

        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Tiền hàng</span>
            <span>{subTotal.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>{shippingFee.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Giảm giá</span>
            <span>
              -{(shippingDiscount + productDiscount).toLocaleString()}₫
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Tổng cộng</span>
            <span className="text-red-600">{total.toLocaleString()}₫</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={selectedItems.length === 0 || loading}
          className="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-xl font-bold text-lg mt-4 flex justify-between px-4 items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Spin />
          ) : (
            <>
              <span>Đặt hàng</span>
              <span className="text-yellow-300">{total.toLocaleString()}₫</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutCOD;
