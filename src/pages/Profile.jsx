import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProfile,
    updateProfile,
    logout,
    startEdit,
    cancelEdit,
    clearUpdateStatus,
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

const ActionButton = ({ onClick, variant = "primary", icon, children, className = "", disabled = false, loading = false }) => {
    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
        danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500",
        warning: "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ) : icon}
            {children}
        </button>
    );
};

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        data: profile,
        loading,
        editing,
        updating,
        updateError,
        updateSuccess,
    } = useSelector((state) => state.profile);

    const [editData, setEditData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        gender: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    // Clear success/error messages after 3 seconds
    useEffect(() => {
        if (updateSuccess || updateError) {
            const timer = setTimeout(() => {
                dispatch(clearUpdateStatus());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [updateSuccess, updateError, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const handleStartEdit = () => {
        setEditData({
            fullName: profile?.fullName ?? "",
            email: profile?.email ?? "",
            phone: profile?.phone ?? "",
            address: profile?.address ?? "",
            gender: profile?.gender ?? ""
        });
        setErrors({});
        dispatch(startEdit());
    };

    const validateForm = () => {
        const newErrors = {};

        if (!editData.fullName.trim()) {
            newErrors.fullName = "Họ và tên không được để trống";
        }

        if (!editData.email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (editData.phone && !/^[0-9+\-\s()]{10,15}$/.test(editData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const result = await dispatch(updateProfile(editData));

        if (updateProfile.fulfilled.match(result)) {
            // Success - modal sẽ đóng tự động qua extraReducers
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            {/* Thông báo thành công */}
            {updateSuccess && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in">
                    <div className="bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Cập nhật thông tin thành công!</span>
                    </div>
                </div>
            )}

            {/* Thông báo lỗi */}
            {updateError && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in">
                    <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{updateError}</span>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* Header với hiệu ứng nổi */}
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


                {/* Nội dung chính */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Phần Avatar */}
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <div className="relative group">
                                    <img
                                        src={profile?.avatarUrl || "https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png"}
                                        alt="avatar"
                                        className="relative w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Badge
                                        variant={profile?.verified ? "verified" : "unverified"}
                                    >
                                        {profile?.verified ? "Đã xác minh" : "Chưa xác minh"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Thông tin Profile */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                            {profile?.fullName || "Chưa cập nhật"}
                                        </h2>
                                        <p className="text-lg text-gray-600 mb-1">{profile?.email || "Chưa cập nhật"}</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <ActionButton
                                            onClick={handleStartEdit}
                                            variant="primary"
                                            disabled={updating || loading}
                                            loading={loading}
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            }
                                        >
                                            Chỉnh sửa
                                        </ActionButton>
                                    </div>
                                </div>

                                {/* Thẻ thông tin */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                    <InfoCard
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        }
                                        label="Email"
                                        value={profile?.email || "—"}
                                    />
                                    <InfoCard
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        }
                                        label="Số điện thoại"
                                        value={profile?.phone || "—"}
                                    />
                                    <InfoCard
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        }
                                        label="Địa chỉ"
                                        value={profile?.address || "—"}
                                    />
                                    <InfoCard
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        }
                                        label="Giới tính"
                                        value={profile?.gender ? (profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : 'Khác') : "—"}
                                    />
                                    <InfoCard
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        }
                                        label="Tài khoản"
                                        value={profile?.username || "—"}
                                    />
                                    <InfoCard
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h0z" />
                                            </svg>
                                        }
                                        label="Ngày tạo"
                                        value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : "—"}
                                    />
                                </div>

                                {/* Nút hành động */}
                                <div className="flex flex-wrap gap-4">
                                    <ActionButton
                                        onClick={() => navigate('/change-password')}
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
                </div>
            </div>

            {/* Modal chỉnh sửa với backdrop blur */}
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
                                        Họ và tên *
                                    </span>
                                    <input
                                        value={editData.fullName}
                                        onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                        className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm`}
                                        placeholder="Nhập họ và tên đầy đủ"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </label>

                                {/* Email */}
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                        Email *
                                    </span>
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm`}
                                        placeholder="example@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                                        className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm`}
                                        placeholder="0123 456 789"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <ActionButton
                                    onClick={() => dispatch(cancelEdit())}
                                    variant="secondary"
                                    type="button"
                                    disabled={updating}
                                >
                                    Hủy
                                </ActionButton>
                                <ActionButton
                                    variant="primary"
                                    type="submit"
                                    loading={updating}
                                    disabled={updating}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    }
                                >
                                    {updating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                                </ActionButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}