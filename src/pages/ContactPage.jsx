import React, { useState } from "react";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaClock,
} from "react-icons/fa";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.");
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Banner */}
            <Banner
                title="Liên hệ với chúng tôi"
                subtitle="UTE Shop luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7"
                buttonText="Khám phá sản phẩm"
                link="/products"
            />

            {/* Thông tin liên hệ */}
            <section className="max-w-[1200px] mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Thông tin liên hệ
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg transition">
                        <FaMapMarkerAlt className="text-indigo-600 text-4xl mb-3 mx-auto" />
                        <h3 className="font-semibold text-lg mb-1">Địa chỉ</h3>
                        <p className="text-gray-600">01 Võ Văn Ngân, Thủ Đức, TP.HCM</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg transition">
                        <FaPhoneAlt className="text-indigo-600 text-4xl mb-3 mx-auto" />
                        <h3 className="font-semibold text-lg mb-1">Hotline</h3>
                        <p className="text-gray-600">+84 987 654 321</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg transition">
                        <FaEnvelope className="text-indigo-600 text-4xl mb-3 mx-auto" />
                        <h3 className="font-semibold text-lg mb-1">Email</h3>
                        <p className="text-gray-600">support@uteshop.com</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg transition">
                        <FaClock className="text-indigo-600 text-4xl mb-3 mx-auto" />
                        <h3 className="font-semibold text-lg mb-1">Giờ làm việc</h3>
                        <p className="text-gray-600">Thứ 2 - CN: 08:00 - 20:00</p>
                    </div>
                </div>
            </section>

            {/* Form liên hệ */}
            <section className="max-w-[900px] mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                    Gửi tin nhắn cho chúng tôi
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow rounded-xl p-8 space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">Họ và tên</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Nguyễn Văn A"
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="example@email.com"
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Số điện thoại</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="0123 456 789"
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Chủ đề</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Yêu cầu hỗ trợ..."
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Nội dung</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            required
                            placeholder="Nhập nội dung tin nhắn..."
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Gửi tin nhắn
                    </button>
                </form>
            </section>

            {/* FAQ Section */}
            <section className="bg-gray-100 py-20">
                <div className="max-w-[900px] mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                        Câu hỏi thường gặp
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "Tôi có thể hủy đơn hàng sau khi đặt không?",
                                a: "Bạn có thể hủy đơn trong vòng 24h sau khi đặt bằng cách liên hệ hotline hoặc email hỗ trợ.",
                            },
                            {
                                q: "Thời gian giao hàng là bao lâu?",
                                a: "Thời gian giao hàng trung bình từ 2-5 ngày tùy khu vực. Với TP.HCM sẽ có giao trong ngày.",
                            },
                            {
                                q: "UTE Shop có hỗ trợ đổi trả không?",
                                a: "Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả.",
                            },
                            {
                                q: "Tôi có thể thanh toán bằng phương thức nào?",
                                a: "Bạn có thể thanh toán bằng thẻ ngân hàng, ví điện tử (Momo, ZaloPay) hoặc COD (trả tiền khi nhận hàng).",
                            },
                        ].map((faq, idx) => (
                            <details
                                key={idx}
                                className="bg-white p-4 rounded-lg shadow cursor-pointer"
                            >
                                <summary className="font-semibold">{faq.q}</summary>
                                <p className="mt-2 text-gray-600">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="w-full h-[400px]">
                <iframe
                    title="Google Maps"
                    src="https://maps.app.goo.gl/icxrignSE4t7hL747"
                    className="w-full h-full border-0 rounded-lg shadow"
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </section>


            <Footer />
        </div>
    );
}
