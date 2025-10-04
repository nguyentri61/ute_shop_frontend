import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../features/auth/profileSlice";
import { logout } from "../features/auth/loginSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { data: profile } = useSelector((state) => state.profile);
    const [openMenu, setOpenMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(fetchProfile());
        }
    }, [dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = [
        { name: 'Trang chủ', path: '/' },
        { name: 'Sản phẩm', path: '/products' },
        { name: 'Giới thiệu', path: '/about' },
        { name: 'Liên hệ', path: '/contact' }
    ];

    const isActivePath = (path) => location.pathname === path;

    return (
        <nav
            className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20'
                    : 'bg-white/90 backdrop-blur-sm'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center group">
                        <Link
                            to="/"
                            className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105"
                        >
                            <div className="relative">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_H%E1%BB%8Dc_S%C6%B0_Ph%E1%BA%A1m_K%E1%BB%B9_Thu%E1%BA%ADt_TP_H%E1%BB%93_Ch%C3%AD_Minh.png"
                                    className="h-10 w-10 rounded-lg shadow-sm"
                                    alt="UTE Logo"
                                />
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                UTE Shop
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`relative px-4 py-2 font-medium rounded-lg transition-all duration-200 group ${isActivePath(item.path)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100/50'
                                    }`}
                            >
                                {item.name}
                                <span
                                    className={`absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-300 ${isActivePath(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}
                                ></span>
                            </Link>
                        ))}
                    </div>

                    {/* User Menu & Mobile Toggle */}
                    <div className="flex items-center space-x-3">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
                            <NotificationBell />
                        </button>
                        {profile ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setOpenMenu(!openMenu)}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:bg-gray-100"
                                >
                                    <span className="font-medium text-gray-900 hidden sm:block">
                                        {profile.fullName ? profile.fullName : "Account"}
                                    </span>
                                    <div className="relative">
                                        <img
                                            src="https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png"
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30 bg-white"
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openMenu ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 origin-top-right ${openMenu ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                                        }`}
                                >
                                    <div className="p-3 border-b border-gray-100">
                                        <p className="font-medium text-gray-900">{profile.name}</p>
                                        <p className="text-sm text-gray-500">Người dùng</p>
                                    </div>
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setOpenMenu(false)}
                                            className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                        >
                                            Hồ sơ cá nhân
                                        </Link>
                                        <Link
                                            to="/cart"
                                            onClick={() => setOpenMenu(false)}
                                            className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                        >
                                            Giỏ hàng
                                        </Link>
                                        <Link
                                            to="/orders"
                                            onClick={() => setOpenMenu(false)}
                                            className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                        >
                                            Đơn hàng của tôi
                                        </Link>
                                        <Link
                                            to="/favorites"
                                            onClick={() => setOpenMenu(false)}
                                            className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                        >
                                            Sản phẩm yêu thích
                                        </Link>
                                        <Link
                                            to="/recently-viewed"
                                            onClick={() => setOpenMenu(false)}
                                            className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                        >
                                            Sản phẩm đã xem
                                        </Link>
                                    </div>
                                    <div className="py-2 border-t border-gray-100">
                                        <button
                                            onClick={() => {
                                                dispatch(logout());
                                                setOpenMenu(false);
                                                navigate("/login");
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-150"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <span className="relative z-10">Đăng nhập</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                            </button>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="py-4 space-y-1 border-t border-gray-200">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-3 font-medium rounded-lg transition-colors duration-200 ${isActivePath(item.path)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
