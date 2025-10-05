import { useState } from "react";
import { FaGift, FaClock, FaTag, FaCheckCircle, FaTimes } from "react-icons/fa";

export default function VoucherSelector({
    label,
    name,
    value,
    onChange,
    options = [],
    subTotal = 0,
}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(value || "");

    const handleApply = () => {
        onChange({ target: { name, value: selected } });
        setOpen(false);
    };

    const handleClear = () => {
        setSelected("");
        onChange({ target: { name, value: "" } });
        setOpen(false);
    };

    console.log(subTotal);

    return (
        <div className="w-full">
            {label && (
                <label className="block text-gray-800 font-semibold mb-2">
                    {label}
                </label>
            )}

            {/* Nút mở popup chọn voucher */}
            <button
                onClick={() => setOpen(true)}
                className="w-full flex justify-between items-center border border-gray-300 bg-white rounded-lg px-4 py-3 text-gray-700 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
                {value ? (
                    <span className="flex items-center gap-2 text-blue-600 font-medium">
                        <FaGift /> {value}
                    </span>
                ) : (
                    <span className="text-gray-500 flex items-center gap-2">
                        <FaGift /> Chọn mã giảm giá
                    </span>
                )}
                <span className="text-sm text-gray-500">▼</span>
            </button>

            {/* Popup chọn voucher */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-lg p-6 relative">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes size={18} />
                        </button>

                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            🎟️ Chọn mã giảm giá
                        </h2>

                        <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                            {/* Option: Không chọn */}
                            <div
                                onClick={() => setSelected("")}
                                className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer transition ${selected === ""
                                    ? "bg-red-50 border-red-400 text-red-600"
                                    : "hover:bg-gray-50 border-gray-300"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <FaTimes className="text-red-500" />
                                    <span>Không áp dụng mã giảm giá</span>
                                </div>
                                {selected === "" && (
                                    <FaCheckCircle className="text-red-500" />
                                )}
                            </div>

                            {/* Các voucher */}
                            {options.length > 0 ? (
                                options.map((opt, idx) => {
                                    const isActive = selected === opt.value;
                                    const isDisabled =
                                        subTotal < (opt.minOrderValue || 0);

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() =>
                                                !isDisabled &&
                                                setSelected(opt.value)
                                            }
                                            className={`border rounded-lg p-4 relative transition ${isActive
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-blue-300"
                                                } ${isDisabled
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer"
                                                }`}
                                        >
                                            {isActive && !isDisabled && (
                                                <FaCheckCircle className="absolute top-3 right-3 text-blue-500" />
                                            )}

                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                                                    <FaGift /> {opt.code}
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-700 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <FaTag className="text-green-500" />
                                                    <span>
                                                        Giảm{" "}
                                                        {opt.discount.toLocaleString()}₫
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-yellow-500" />
                                                    <span>
                                                        HSD:{" "}
                                                        {new Date(
                                                            opt.expiredAt
                                                        ).toLocaleDateString(
                                                            "vi-VN"
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Đơn tối thiểu:{" "}
                                                    {opt.minOrderValue?.toLocaleString() ||
                                                        0}
                                                    ₫
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-gray-500 py-6">
                                    Không có mã giảm giá khả dụng
                                </div>
                            )}
                        </div>

                        {/* Nút hành động */}
                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                            >
                                Bỏ chọn
                            </button>
                            <button
                                onClick={handleApply}
                                disabled={
                                    selected &&
                                    options.find(
                                        (o) =>
                                            o.value === selected &&
                                            subTotal < o.minOrderValue
                                    )
                                }
                                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
