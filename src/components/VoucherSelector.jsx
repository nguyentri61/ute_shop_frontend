import { useState } from "react";
import {
    FaGift,
    FaClock,
    FaCheckCircle,
    FaTimes,
    FaInfoCircle,
} from "react-icons/fa";

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

    const formatCurrency = (v) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(v || 0);

    return (
        <div className="w-full">
            {label && (
                <label className="block text-gray-800 font-semibold mb-2">
                    {label}
                </label>
            )}

            {/* Nút mở popup */}
            <button
                onClick={() => setOpen(true)}
                className="w-full flex justify-between items-center border border-gray-200 bg-white rounded-xl px-4 py-3 text-gray-700 shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                <span className="text-gray-400 text-sm">▼</span>
            </button>

            {/* Popup chọn voucher */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 relative animate-fadeIn">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                        >
                            <FaTimes size={18} />
                        </button>

                        <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center gap-2">
                            <FaGift className="text-blue-500" />
                            Chọn mã giảm giá
                        </h2>

                        <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
                            {/* Không áp dụng */}
                            <div
                                onClick={() => setSelected("")}
                                className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer transition ${selected === ""
                                        ? "bg-red-50 border-red-400 text-red-600"
                                        : "hover:bg-gray-50 border-gray-200"
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

                            {/* Các voucher thật */}
                            {options.length > 0 ? (
                                options.map((opt, idx) => {
                                    const isActive = selected === opt.value;
                                    const isDisabled =
                                        subTotal < (opt.minOrderValue || 0);

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => !isDisabled && setSelected(opt.value)}
                                            className={`relative border rounded-2xl p-4 transition-all duration-200 flex justify-between gap-3 ${isDisabled
                                                    ? "opacity-60 bg-gray-50 border-dashed border-gray-300 cursor-not-allowed"
                                                    : isActive
                                                        ? "border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm cursor-pointer"
                                                        : "border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer bg-white"
                                                }`}
                                        >
                                            {/* Check icon */}
                                            {isActive && !isDisabled && (
                                                <FaCheckCircle className="absolute top-3 right-3 text-blue-500" />
                                            )}

                                            {/* Left side */}
                                            <div>
                                                <p className="text-blue-700 font-bold text-lg flex items-center gap-2">
                                                    <FaGift /> {opt.code}
                                                </p>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    Giảm {formatCurrency(opt.discount)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Đơn tối thiểu:{" "}
                                                    {formatCurrency(opt.minOrderValue || 0)}
                                                </p>
                                            </div>

                                            {/* Right side */}
                                            <div className="flex flex-col items-end justify-between">
                                                <div className="text-xs text-gray-600 flex items-center gap-1">
                                                    <FaClock className="text-yellow-500" />
                                                    {new Date(opt.expiredAt).toLocaleDateString("vi-VN")}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Còn {opt.remaining} mã
                                                </div>
                                                {isDisabled && (
                                                    <div className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                                                        <FaInfoCircle /> Chưa đủ điều kiện
                                                    </div>
                                                )}
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

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
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
                                className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
