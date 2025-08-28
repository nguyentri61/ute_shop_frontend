import React from "react";

export default function Banner() {
    return (
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-96 flex items-center justify-center text-center overflow-hidden">
            {/* Background overlay hình ảnh */}
            <img
                src="https://images.unsplash.com/photo-1606813905346-7f5f2697150f?auto=format&fit=crop&w=1470&q=80"
                alt="Shop Banner"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            {/* Nội dung chính */}
            <div className="relative z-10 px-4">
                <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
                    Welcome to UTE Shop!
                </h2>
                <p className="text-lg md:text-xl text-white mb-6">
                    Discover the best products at unbeatable prices.
                </p>
                <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition">
                    Shop Now
                </button>
            </div>

            {/* Decorative shapes */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full opacity-10 animate-pulse"></div>
        </div>
    );
}
