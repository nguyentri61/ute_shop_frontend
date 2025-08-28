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

const Badge = ({ children }) => (
    <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-100 rounded-full">
        {children}
    </span>
);

const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: profile, loading, error, editing } = useSelector(
        (state) => state.profile
    );

    const [editName, setEditName] = useState("");
    const [editAvatar, setEditAvatar] = useState("");

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const handleStartEdit = () => {
        setEditName(profile?.name ?? "");
        setEditAvatar(profile?.avatarUrl ?? "");
        dispatch(startEdit());
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        dispatch(updateProfileLocal({ name: editName, avatarUrl: editAvatar }));
    };

    return (
        <div className="min-h-[70vh] flex items-start justify-center py-10 px-4">
            <div className="w-full max-w-3xl">
                {/* Header */}
                <div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
                            <p className="text-indigo-100 mt-1">
                                Quản lý thông tin tài khoản của bạn
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => dispatch(fetchProfile())}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-md text-sm"
                            >
                                Làm mới
                            </button>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-md text-sm"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div className="flex items-center justify-center">
                                <Skeleton className="w-24 h-24 rounded-full" />
                            </div>
                            <div className="md:col-span-2">
                                <div className="mb-3">
                                    <Skeleton className="w-2/4 h-6 rounded" />
                                </div>
                                <div className="mb-2">
                                    <Skeleton className="w-1/3 h-4 rounded" />
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <Skeleton className="w-24 h-9 rounded" />
                                    <Skeleton className="w-24 h-9 rounded" />
                                </div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10">
                            <p className="text-red-600 font-medium mb-3">{error}</p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => dispatch(fetchProfile())}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                                >
                                    Thử lại
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-4 py-2 border rounded"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </div>
                    ) : profile ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div className="flex flex-col items-center">
                                <img
                                    src={profile.avatarUrl}
                                    alt="avatar"
                                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                                />
                                <div className="mt-3 flex items-center gap-2">
                                    <Badge>
                                        {profile.verified ? "Đã xác minh" : "Chưa xác minh"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-semibold">{profile.name}</h2>
                                        <p className="text-gray-500">{profile.email}</p>
                                        {profile.role && (
                                            <p className="text-sm text-gray-400 mt-1">
                                                Role: {profile.role}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleStartEdit}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Chỉnh sửa
                                        </button>
                                        <button
                                            onClick={() => dispatch(fetchProfile())}
                                            className="px-4 py-2 bg-gray-100 border rounded-md hover:bg-gray-200"
                                        >
                                            Làm mới
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-3 bg-gray-50 rounded">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="mt-1 font-medium">{profile.email}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded">
                                        <p className="text-sm text-gray-500">Tài khoản</p>
                                        <p className="mt-1 font-medium">
                                            {profile.username ?? "—"}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded">
                                        <p className="text-sm text-gray-500">Ngày tạo</p>
                                        <p className="mt-1 font-medium">
                                            {profile.createdAt
                                                ? profile.createdAt.toLocaleString()
                                                : "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => alert("Chưa hỗ trợ đổi mật khẩu")}
                                        className="px-4 py-2 bg-yellow-100 rounded-md"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-md"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Edit modal */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <form
                        onSubmit={handleSubmitEdit}
                        className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6"
                    >
                        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa thông tin</h3>

                        <label className="block mb-3">
                            <span className="text-sm text-gray-600">Họ & tên</span>
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="mt-1 block w-full border rounded px-3 py-2"
                                placeholder="Tên hiển thị"
                            />
                        </label>

                        <label className="block mb-3">
                            <span className="text-sm text-gray-600">Avatar URL</span>
                            <input
                                value={editAvatar}
                                onChange={(e) => setEditAvatar(e.target.value)}
                                className="mt-1 block w-full border rounded px-3 py-2"
                                placeholder="https://..."
                            />
                        </label>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => dispatch(cancelEdit())}
                                className="px-4 py-2 rounded border"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded"
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
