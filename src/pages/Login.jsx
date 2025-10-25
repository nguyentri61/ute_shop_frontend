import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setPassword, loginUser } from '../features/auth/loginSlice';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import FormError from '../components/FormError';
import BannerImage from '../assets/logo_UTE.png';
import Logo from '../assets/logo.png';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { email, password, loading, error, isAuthenticated, user } = useSelector(state => state.login);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Vui lòng nhập email và mật khẩu');
            return;
        }
        dispatch(loginUser({ email, password }));
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(user.role === 'ADMIN' ? '/admin' : '/');
        }
    }, [isAuthenticated, user, navigate]);

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

                        {/* Tiêu đề */}
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-500 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight">
                            UTE SHOP
                        </h1>

                        {/* Mô tả */}
                        <p className="text-gray-700/80 text-lg max-w-md leading-relaxed">
                            Giải pháp thương mại điện tử hiện đại dành cho sinh viên — đơn giản, nhanh chóng và hiệu quả.
                        </p>

                        {/* Gạch phân cách */}
                        <div className="mt-8 flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-gradient-to-r from-blue-400 to-sky-400"></div>
                            <span className="uppercase text-sm tracking-widest text-gray-600/70">
                                Đăng nhập để bắt đầu
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bên phải - form đăng nhập */}
            <div className="md:w-1/3 flex items-center justify-center p-8 bg-white relative overflow-hidden">
                {/* Hiệu ứng nền trang trí */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-50 animate-pulse-slow pointer-events-none"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-40 animate-pulse-slow delay-200 pointer-events-none"></div>

                <form
                    onSubmit={handleSubmit}
                    className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl p-10 shadow-2xl flex flex-col"
                >
                    {/* Logo nhỏ */}
                    <div className="flex justify-center mb-6 animate-slide-up">
                        <img src={Logo} alt="UTE SHOP" className="w-24 h-24 rounded-full shadow-md" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800 animate-fade-in delay-100">
                        Đăng nhập
                    </h2>

                    {/* Email */}
                    <div className="mb-5 relative group">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            placeholder="Nhập email của bạn"
                            onChange={(e) => dispatch(setEmail(e.target.value))}
                            icon={<i className="fas fa-envelope text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"></i>}
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-5 relative group">
                        <Input
                            label="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            placeholder="Nhập mật khẩu"
                            onChange={(e) => dispatch(setPassword(e.target.value))}
                            icon={
                                <i
                                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}
                    transition-all duration-300 cursor-pointer transform
                    ${showPassword ? 'rotate-180 text-blue-500' : 'rotate-0 hover:text-blue-500 hover:scale-110'}`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            }
                        />
                    </div>




                    {error && <FormError message={error} className="mb-4 animate-fade-in delay-200" />}

                    {/* Nút đăng nhập */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex justify-center items-center"
                    >
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <span className="h-4 w-4 inline-block animate-spin rounded-full border-2 border-white/60 border-t-white"></span>
                                Đang đăng nhập...
                            </span>
                        ) : (
                            'Đăng nhập'
                        )}
                    </Button>

                    {/* Dòng phân cách */}
                    <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
                        <hr className="border-gray-400" />
                        <p className="text-center text-sm">HOẶC</p>
                        <hr className="border-gray-400" />
                    </div>

                    {/* Đăng nhập bằng Google */}
                    <button
                        type="button"
                        className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-blue-700"
                    >
                        <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        Đăng nhập bằng Google
                    </button>

                    {/* Quên mật khẩu */}
                    <div className="mt-5 text-xs border-b border-blue-500 py-4 text-blue-700">
                        <a href="#">Quên mật khẩu?</a>
                    </div>

                    {/* Chuyển sang đăng ký */}
                    <div className="mt-3 text-xs flex justify-between items-center text-blue-700">
                        <p>Chưa có tài khoản?</p>
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
                        >
                            Đăng ký
                        </button>
                    </div>
                </form>
            </div>

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
