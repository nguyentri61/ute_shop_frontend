import React from "react";

export default function Banner() {
    return (
        <section className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white py-20 relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-4 text-center relative z-10">
                <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 drop-shadow-lg animate-fade-in">
                    Chào mừng đến với <span className="text-yellow-300">UTE Shop</span>
                </h1>
                <p className="text-lg max-w-2xl mx-auto opacity-90 mb-6">
                    Trải nghiệm mua sắm phụ kiện thời trang trực tuyến tiện lợi, hiện đại
                    và an toàn.
                </p>
                <a
                    href="/products"
                    className="inline-block px-8 py-4 bg-yellow-300 text-indigo-900 font-bold rounded-xl shadow hover:bg-yellow-400 transition transform hover:scale-105 animate-bounce"
                >
                    Khám phá ngay
                </a>
            </div>
            {/* Hiệu ứng overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </section>
    );
}
