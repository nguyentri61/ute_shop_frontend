import React from "react";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Chào mừng đến với <span className="text-yellow-300">UTE Shop</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Nền tảng mua sắm phụ kiện thời trang trực tuyến được phát triển bởi
            sinh viên UTE — nơi mang đến trải nghiệm mua sắm tiện lợi, hiện đại
            và bảo mật cho mọi người.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Sứ mệnh của chúng tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            UTE Shop ra đời với mục tiêu mang đến những sản phẩm phụ kiện thời
            trang chất lượng, giá cả hợp lý và dịch vụ chăm sóc khách hàng tận
            tâm. Chúng tôi không chỉ tạo ra một website bán hàng, mà còn tạo ra
            một hệ thống hoàn chỉnh cho sinh viên học tập và thực hành.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-center">
              Chất lượng
            </h3>
            <p className="text-gray-600 text-center">
              Sản phẩm được chọn lọc kỹ lưỡng, đảm bảo chất lượng cao và thông
              tin rõ ràng.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-center">Bảo mật</h3>
            <p className="text-gray-600 text-center">
              UTE Shop áp dụng chuẩn bảo mật đảm bảo an toàn cho thông tin người
              dùng.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-center">
              Hỗ trợ 24/7
            </h3>
            <p className="text-gray-600 text-center">
              Đội ngũ sẵn sàng hỗ trợ khách hàng nhanh chóng qua nhiều kênh liên
              lạc.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <h3 className="text-3xl font-bold text-indigo-600">1,200+</h3>
            <p className="text-gray-600">Sản phẩm</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-indigo-600">5,000+</h3>
            <p className="text-gray-600">Khách hàng</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-indigo-600">99.9%</h3>
            <p className="text-gray-600">Uptime hệ thống</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-indigo-600">24/7</h3>
            <p className="text-gray-600">Hỗ trợ khách hàng</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Đội ngũ phát triển
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Tân", role: "Dev" },
            { name: "Trí", role: "Dev" },
            { name: "Đan", role: "Dev" },
            { name: "Kiệt", role: "Dev" },
          ].map((member, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center"
            >
              <img
                src={`/team/member${idx + 1}.jpg`}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
              <h4 className="font-semibold">{member.name}</h4>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-12">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Trải nghiệm UTE Shop ngay hôm nay
          </h2>
          <p className="mb-6 text-lg opacity-90">
            Mua sắm thông minh, tiện lợi và an toàn chỉ với một cú click.
          </p>
          <a
            href="/products"
            className="inline-block px-6 py-3 bg-yellow-300 text-indigo-900 font-bold rounded-lg shadow hover:bg-yellow-400 transition"
          >
            Bắt đầu mua sắm
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
