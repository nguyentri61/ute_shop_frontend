import { useDispatch, useSelector } from "react-redux";
import { setEmail, forgotPasswordUser } from "../features/auth/forgotPasswordSlice";
import Input from "../components/Input";
import Button from "../components/Button";
import FormError from "../components/FormError";

export default function ForgotPasswordPage() {
    const dispatch = useDispatch();
    const { email, sent, error, loading } = useSelector((state) => state.forgotPassword);

    const handleSubmit = () => {
        if (!email) return;
        dispatch(forgotPasswordUser(email));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-800">Quên mật khẩu?</h1>
                <p className="text-center text-gray-500 mb-8">
                    Nhập email để nhận liên kết đặt lại mật khẩu
                </p>

                {/* Email */}
                <div className="mb-5">
                    <Input
                        label="Email"
                        value={email}
                        onChange={(e) => dispatch(setEmail(e.target.value))}
                        placeholder="Nhập email của bạn"
                        icon={<i className="fas fa-envelope text-gray-400"></i>}
                    />
                </div>

                {/* Error */}
                {error && <FormError message={error} className="mb-4" />}

                {/* Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={loading || sent}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="inline-flex items-center gap-2">
                            <span className="h-4 w-4 inline-block animate-spin rounded-full border-2 border-white/60 border-t-white"></span>
                            Đang gửi...
                        </span>
                    ) : sent ? (
                        "Đã gửi"
                    ) : (
                        "Gửi liên kết đặt lại"
                    )}
                </Button>

                {/* Success message */}
                {sent && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        <p className="font-semibold mb-1">Kiểm tra email của bạn</p>
                        <p>
                            Nếu email <span className="font-medium">{email}</span> tồn tại trong hệ thống,
                            chúng tôi đã gửi một liên kết đặt lại mật khẩu.
                            Vui lòng kiểm tra Hộp thư đến và cả mục Spam/Quảng cáo.
                        </p>
                    </div>
                )}

                {/* Footer */}
                <p className="mt-6 text-center text-gray-500">
                    Nhớ lại mật khẩu?{" "}
                    <a href="/login" className="text-indigo-600 hover:underline font-semibold">
                        Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
}
