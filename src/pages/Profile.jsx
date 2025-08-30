// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProfile,
    logout,
    startEdit,
    cancelEdit,
    updateProfileLocal,
} from "../features/auth/profileSlice";
import { useNavigate } from "react-router-dom";

const Badge = ({ children, variant = "default" }) => {
    const variants = {
        default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700",
        verified: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700",
        unverified: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700"
    };

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${variants[variant]}`}>
            {variant === "verified" && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            )}
            {children}
        </span>
    );
};

const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded ${className}`} />
);

const InfoCard = ({ icon, label, value }) => (
    <div className="group p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
            </div>
        </div>
    </div>
);

const ActionButton = ({ onClick, variant = "primary", icon, children, className = "" }) => {
    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
        danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700",
        warning: "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600"
    };

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${variants[variant]} ${className}`}
        >
            {icon}
            {children}
        </button>
    );
};

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: profile, loading, error, editing } = useSelector(
        (state) => state.profile
    );

    const [editData, setEditData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        avatarUrl: ""
    });

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const handleStartEdit = () => {
        setEditData({
            fullName: profile?.fullName ?? profile?.name ?? "",
            email: profile?.email ?? "",
            phone: profile?.phone ?? "",
            address: profile?.address ?? "",
            gender: profile?.gender ?? "",
            avatarUrl: profile?.avatarUrl ?? ""
        });
        dispatch(startEdit());
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        dispatch(updateProfileLocal(editData));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header with floating effect */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-3xl opacity-20 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                                    Hồ sơ cá nhân
                                </h1>
                                <p className="text-indigo-100 mt-2 text-lg">
                                    Quản lý và cập nhật thông tin tài khoản của bạn
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <ActionButton
                                    onClick={() => dispatch(fetchProfile())}
                                    variant="secondary"
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    }
                                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                                >
                                    Làm mới
                                </ActionButton>
                                <ActionButton
                                    onClick={handleLogout}
                                    variant="danger"
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    }
                                    className="bg-white/20 text-white border-white/30 hover:bg-red-500/80"
                                >
                                    Đăng xuất
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {loading ? (
                        <div className="p-8">
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-shrink-0 flex flex-col items-center">
                                    <Skeleton className="w-32 h-32 rounded-full" />
                                    <Skeleton className="w-24 h-6 rounded-full mt-4" />
                                </div>
                                <div className="flex-1">
                                    <Skeleton className="w-3/4 h-8 rounded mb-4" />
                                    <Skeleton className="w-1/2 h-5 rounded mb-6" />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="h-20 rounded-xl" />
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <Skeleton className="w-32 h-11 rounded-lg" />
                                        <Skeleton className="w-32 h-11 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
                            <p className="text-red-600 font-medium mb-6">{error}</p>
                            <div className="flex justify-center gap-4">
                                <ActionButton
                                    onClick={() => dispatch(fetchProfile())}
                                    variant="primary"
                                >
                                    Thử lại
                                </ActionButton>
                                <ActionButton
                                    onClick={() => navigate("/login")}
                                    variant="secondary"
                                >
                                    Đăng nhập
                                </ActionButton>
                            </div>
                        </div>
                    ) : profile ? (
                        <div className="p-8">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Avatar Section */}
                                <div className="flex-shrink-0 flex flex-col items-center">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                        <img
                                            src={profile.avatarUrl}
                                            alt="avatar"
                                            className="relative w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <Badge
                                            variant={profile.verified ? "verified" : "unverified"}
                                        >
                                            {profile.verified ? "Đã xác minh" : "Chưa xác minh"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                                {profile.fullName || profile.name}
                                            </h2>
                                            <p className="text-lg text-gray-600 mb-1">{profile.email}</p>
                                            {profile.role && (
                                                <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block">
                                                    {profile.role}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <ActionButton
                                                onClick={handleStartEdit}
                                                variant="primary"
                                                icon={
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                }
                                            >
                                                Chỉnh sửa
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() => dispatch(fetchProfile())}
                                                variant="secondary"
                                                icon={
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                }
                                            >
                                                Làm mới
                                            </ActionButton>
                                        </div>
                                    </div>

                                    {/* Info Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                        <InfoCard
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            }
                                            label="Email"
                                            value={profile.email}
                                        />
                                        <InfoCard
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            }
                                            label="Số điện thoại"
                                            value={profile.phone ?? "—"}
                                        />
                                        <InfoCard
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            }
                                            label="Địa chỉ"
                                            value={profile.address ?? "—"}
                                        />
                                        <InfoCard
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            }
                                            label="Giới tính"
                                            value={profile.gender ? (profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác') : "—"}
                                        />
                                        <InfoCard
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            }
                                            label="Tài khoản"
                                            value={profile.username ?? "—"}
                                        />
                                        <InfoCard
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h0z" />
                                                </svg>
                                            }
                                            label="Ngày tạo"
                                            value={profile.createdAt ? profile.createdAt.toLocaleString() : "—"}
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-4">
                                        <ActionButton
                                            onClick={() => alert("Chưa hỗ trợ đổi mật khẩu")}
                                            variant="warning"
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            }
                                        >
                                            Đổi mật khẩu
                                        </ActionButton>
                                        <ActionButton
                                            onClick={handleLogout}
                                            variant="danger"
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            }
                                        >
                                            Đăng xuất
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Edit Modal với backdrop blur */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
                        <form
                            onSubmit={handleSubmitEdit}
                            className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin</h3>
                                <button
                                    type="button"
                                    onClick={() => dispatch(cancelEdit())}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Họ và tên */}
                                <label className="block md:col-span-2">
                                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Họ và tên
                                    </span>
                                    <input
                                        value={editData.fullName}
                                        onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                        placeholder="Nhập họ và tên đầy đủ"
                                    />
                                </label>

                                {/* Email */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                        Email
                                    </span>
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                        placeholder="example@email.com"
                                    />
                                </label>

                                {/* Số điện thoại */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Số điện thoại
                                    </span>
                                    <input
                                        type="tel"
                                        value={editData.phone}
                                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                        placeholder="0123 456 789"
                                    />
                                </label>

                                {/* Địa chỉ */}
                                <label className="block md:col-span-2">
                                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Địa chỉ
                                    </span>
                                    <textarea
                                        value={editData.address}
                                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                                        placeholder="Nhập địa chỉ đầy đủ"
                                    />
                                </label>

                                {/* Giới tính */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        Giới tính
                                    </span>
                                    <select
                                        value={editData.gender}
                                        onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </label>

                                {/* Avatar URL */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Avatar URL
                                    </span>
                                    <input
                                        type="url"
                                        value={editData.avatarUrl}
                                        onChange={(e) => setEditData({ ...editData, avatarUrl: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <ActionButton
                                    onClick={() => dispatch(cancelEdit())}
                                    variant="secondary"
                                    type="button"
                                >
                                    Hủy
                                </ActionButton>
                                <ActionButton
                                    variant="primary"
                                    type="submit"
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    }
                                >
                                    Lưu thay đổi
                                </ActionButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                @keyframes tilt {
                    0%, 50%, 100% {
                        transform: rotate(0deg);
                    }
                    25% {
                        transform: rotate(0.5deg);
                    }
                    75% {
                        transform: rotate(-0.5deg);
                    }
                }
                
                .animate-tilt {
                    animation: tilt 10s infinite linear;
                }
            `}</style>
        </div>
    );
}