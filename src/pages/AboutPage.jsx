import React from "react";
import Footer from "../components/Footer";
import { FaGem, FaLock, FaHeadset, FaUsers } from "react-icons/fa";
import Banner from "../components/Banner";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Banner */}
      <Banner />

      {/* Mission Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Sứ mệnh của chúng tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            UTE Shop ra đời với mục tiêu mang đến những sản phẩm phụ kiện thời
            trang chất lượng, giá cả hợp lý và dịch vụ chăm sóc khách hàng tận
            tâm.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-2xl hover:scale-105 transition transform text-center">
            <FaGem className="text-indigo-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Chất lượng</h3>
            <p className="text-gray-600">
              Sản phẩm chọn lọc kỹ lưỡng, đảm bảo uy tín.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-2xl hover:scale-105 transition transform text-center">
            <FaLock className="text-indigo-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Bảo mật</h3>
            <p className="text-gray-600">
              Chuẩn bảo mật hiện đại, bảo vệ thông tin người dùng.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-2xl hover:scale-105 transition transform text-center">
            <FaHeadset className="text-indigo-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
            <p className="text-gray-600">
              Đội ngũ sẵn sàng hỗ trợ nhanh chóng, tận tâm.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { number: "1,200+", label: "Sản phẩm" },
            { number: "5,000+", label: "Khách hàng" },
            { number: "99.9%", label: "Uptime hệ thống" },
            { number: "24/7", label: "Hỗ trợ khách hàng" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow hover:translate-y-1 transition"
            >
              <h3 className="text-4xl font-bold text-indigo-600">
                {stat.number}
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Đội ngũ phát triển
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Tân", role: "Dev" },
            { name: "Trí", role: "Dev" },
            { name: "Đan", role: "Dev" },
            { name: "Kiệt", role: "Dev" },
          ].map((member, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transition flex flex-col items-center hover:scale-105 transform"
            >
              <img
                src={`/team/member${idx + 1}.jpg`}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-indigo-100 hover:border-indigo-400 transition"
              />
              <h4 className="font-semibold text-lg">{member.name}</h4>
              <p className="text-gray-500 text-sm mb-2">{member.role}</p>
              <div className="flex space-x-3 text-indigo-600">
                <a href="#">
                  <FaUsers />
                </a>
                <a href="#">
                  <FaLock />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Trải nghiệm UTE Shop ngay hôm nay
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Mua sắm thông minh, tiện lợi và an toàn chỉ với một cú click.
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-4 bg-yellow-300 text-indigo-900 font-bold rounded-xl shadow hover:bg-yellow-400 transition animate-pulse"
          >
            Bắt đầu mua sắm
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
