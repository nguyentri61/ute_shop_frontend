import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setEmail, setPassword, registerUser } from "../features/auth/registerSlice";
import Input from "../components/Input";
import Button from "../components/Button";
import FormError from "../components/FormError";
import BannerImage from "../assets/logo_UTE.png";
import Logo from "../assets/logo.png";

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { email, password, loading, error, success, otpEmail } = useSelector((state) => state.register);

    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (success && otpEmail) {
            navigate("/verify-otp", { state: { email: otpEmail } });
        }
    }, [success, otpEmail, navigate]);

    const handleRegister = (e) => {
        e.preventDefault();
        if (!email || !password || !confirm) {
            setLocalError("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        if (password !== confirm) {
            setLocalError("Mật khẩu xác nhận không khớp");
            return;
        }
        setLocalError("");
        dispatch(registerUser({ email, password }));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Bên trái */}
            <div className="hidden md:flex md:w-2/3 h-screen relative overflow-hidden bg-gradient-to-br from-gray-100 via-white to-blue-50">
                {/* Hiệu ứng nền */}
                <div className="absolute top-[-10%] left-[-15%] w-[480px] h-[480px] bg-blue-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-sky-300/30 rounded-full blur-3xl animate-pulse-slower"></div>

                {/* Ánh sáng nhẹ */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.8),transparent_70%)]"></div>

                {/* Nội dung bên trái */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/40 backdrop-blur-2xl border border-white/50 shadow-[0_15px_40px_rgba(0,0,0,0.1)] rounded-[3rem] w-[85%] h-[85%] flex flex-col justify-center items-center text-center p-10 transition-transform duration-700 hover:scale-[1.02]">
                        {/* Logo lớn */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-blue-200/40 blur-2xl rounded-full animate-pulse-slow"></div>
                            <img
                                src={BannerImage}
                                alt="UTE SHOP"
                                className="relative w-40 h-40 drop-shadow-xl animate-fade-in"
                            />
                        </div>

                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-500 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight">
                            UTE SHOP
                        </h1>
                        <p className="text-gray-700/80 text-lg max-w-md leading-relaxed">
                            Mở tài khoản mới và khám phá thế giới thương mại sinh viên — tiện lợi, nhanh chóng và an toàn.
                        </p>

                        <div className="mt-8 flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-gradient-to-r from-blue-400 to-sky-400"></div>
                            <span className="uppercase text-sm tracking-widest text-gray-600/70">
                                Tạo tài khoản ngay hôm nay
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bên phải - Form đăng ký */}
            <div className="md:w-1/3 flex items-center justify-center p-8 bg-white relative overflow-hidden">
                {/* Hiệu ứng nền */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-50 animate-pulse-slow pointer-events-none"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-40 animate-pulse-slow delay-200 pointer-events-none"></div>

                <form
                    onSubmit={handleRegister}
                    className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl p-10 shadow-2xl flex flex-col"
                >
                    {/* Logo nhỏ */}
                    <div className="flex justify-center mb-6 animate-slide-up">
                        <img src={Logo} alt="Logo" className="w-24 h-24 rounded-full shadow-md" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800 animate-fade-in delay-100">
                        Đăng ký tài khoản
                    </h2>

                    {/* Email */}
                    <Input
                        label="Email"
                        value={email}
                        placeholder="Nhập email của bạn"
                        onChange={(e) => dispatch(setEmail(e.target.value))}
                        icon={<i className="fas fa-envelope text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"></i>}
                    />

                    {/* Mật khẩu */}
                    <div className="mt-5">
                        <Input
                            label="Mật khẩu"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            placeholder="Nhập mật khẩu"
                            onChange={(e) => dispatch(setPassword(e.target.value))}
                            icon={
                                <i
                                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}
                                        transition-all duration-300 cursor-pointer transform
                                        ${showPassword ? "rotate-180 text-blue-500" : "rotate-0 hover:text-blue-500 hover:scale-110"}`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            }
                        />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="mt-5">
                        <Input
                            label="Xác nhận mật khẩu"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirm}
                            placeholder="Nhập lại mật khẩu"
                            onChange={(e) => setConfirm(e.target.value)}
                            icon={
                                <i
                                    className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}
                                        transition-all duration-300 cursor-pointer transform
                                        ${showConfirmPassword ? "rotate-180 text-blue-500" : "rotate-0 hover:text-blue-500 hover:scale-110"}`}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                ></i>
                            }
                        />
                    </div>

                    {/* Thông báo lỗi */}
                    {(error || localError) && (
                        <FormError message={error || localError} className="mt-4 animate-fade-in delay-200" />
                    )}

                    {/* Nút đăng ký */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex justify-center items-center"
                    >
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <span className="h-4 w-4 inline-block animate-spin rounded-full border-2 border-white/60 border-t-white"></span>
                                Đang đăng ký...
                            </span>
                        ) : (
                            "Đăng ký"
                        )}
                    </Button>

                    {/* Chuyển sang đăng nhập */}
                    <p className="mt-6 text-center text-gray-600">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </div>

            {/* Hiệu ứng CSS */}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.8s ease forwards; }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }

                @keyframes slide-up { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
                .animate-slide-up { animation: slide-up 0.6s ease forwards; }

                @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
            `}</style>
        </div>
    );
}
