"use client";
import React from "react";
import Footer from "../components/Footer";
import { FaGem, FaLock, FaHeadset, FaUsers, FaFacebook, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import Banner from "../components/Banner";

export default function AboutPage() {
  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6, ease: "easeOut" },
    viewport: { once: true },
  });

  const features = [
    {
      icon: <FaGem className="text-indigo-500 text-5xl mb-4 mx-auto" />,
      title: "Chất lượng hàng đầu",
      desc: "Sản phẩm được chọn lọc tỉ mỉ, mang đến trải nghiệm hoàn hảo nhất.",
    },
    {
      icon: <FaLock className="text-indigo-500 text-5xl mb-4 mx-auto" />,
      title: "Bảo mật tối đa",
      desc: "Cam kết bảo vệ tuyệt đối thông tin khách hàng theo chuẩn quốc tế.",
    },
    {
      icon: <FaHeadset className="text-indigo-500 text-5xl mb-4 mx-auto" />,
      title: "Hỗ trợ 24/7",
      desc: "Đội ngũ chăm sóc khách hàng sẵn sàng mọi lúc mọi nơi.",
    },
  ];

  const stats = [
    { number: "1,200+", label: "Sản phẩm độc quyền" },
    { number: "5,000+", label: "Khách hàng thân thiết" },
    { number: "99.9%", label: "Uptime hệ thống" },
    { number: "24/7", label: "Hỗ trợ liên tục" },
  ];

  const team = [
    { name: "Tân", role: "Backend Developer", img: "/team/member1.jpg" },
    { name: "Trí", role: "Frontend Developer", img: "/team/member2.jpg" },
    { name: "Đan", role: "UI/UX Designer", img: "/team/member3.jpg" },
    { name: "Kiệt", role: "Tester", img: "/team/member4.jpg" },
  ];

  return (
    <div className="bg-gray-50 text-gray-800 flex flex-col min-h-screen overflow-x-hidden">
      {/* 🌈 Banner */}
      <Banner />

      {/* 🧭 Mission Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-20">
        <motion.div {...fadeIn(0.1)} className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Sứ mệnh của chúng tôi
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            UTE Shop hướng đến việc trở thành nền tảng mua sắm sinh viên hàng đầu —
            nơi kết hợp giữa chất lượng, giá trị, và trải nghiệm hiện đại.
          </p>
        </motion.div>

        {/* ✨ Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              {...fadeIn(0.2 + i * 0.15)}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                         hover:-translate-y-2 hover:rotate-[1deg] text-center border border-transparent hover:border-indigo-200"
            >
              <div className="group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📊 Stats Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-16 relative overflow-hidden">
        <motion.div
          {...fadeIn(0.1)}
          className="max-w-[1000px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              {...fadeIn(0.15 + i * 0.1)}
              className="bg-white/80 backdrop-blur-md border border-indigo-100 p-8 rounded-xl shadow 
                         hover:shadow-lg transition hover:-translate-y-1"
            >
              <h3 className="text-4xl font-extrabold text-indigo-600 mb-2">{s.number}</h3>
              <p className="text-gray-700">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 👩‍💻 Team Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-20">
        <motion.h2
          {...fadeIn(0.1)}
          className="text-4xl font-bold text-center text-gray-900 mb-12"
        >
          Đội ngũ phát triển
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {team.map((m, i) => (
            <motion.div
              key={i}
              {...fadeIn(0.2 + i * 0.15)}
              className="relative group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={m.img}
                alt={m.name}
                className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-white">
                <h4 className="text-xl font-semibold">{m.name}</h4>
                <p className="text-sm opacity-80">{m.role}</p>
                <div className="flex mt-3 space-x-4 text-lg">
                  <FaFacebook className="hover:text-blue-400 cursor-pointer" />
                  <FaGithub className="hover:text-gray-300 cursor-pointer" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
        <div className="absolute inset-0 backdrop-blur-sm opacity-20 bg-white"></div>

        <motion.div
          {...fadeIn(0.2)}
          className="relative max-w-[800px] mx-auto text-center text-white z-10"
        >
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            Trải nghiệm UTE Shop ngay hôm nay
          </h2>
          <p className="mb-10 text-lg opacity-90 max-w-2xl mx-auto">
            Khám phá thế giới mua sắm hiện đại — nhanh chóng, an toàn và đậm chất sinh viên.
          </p>
          <a
            href="/products"
            className="inline-block px-10 py-4 bg-white text-indigo-700 font-bold rounded-2xl shadow-md 
                       hover:bg-yellow-300 hover:text-indigo-900 transition-all duration-300"
          >
            Bắt đầu mua sắm
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
