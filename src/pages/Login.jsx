import Input from '../components/Input';
import Button from '../components/Button';
import FormError from '../components/FormError';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setPassword, loginUser } from '../features/auth/loginSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { email, password, loading, error, isAuthenticated } = useSelector((state) => state.login);

    const handleSubmit = () => {
        if (!email || !password) {
            alert('Vui lòng nhập email và mật khẩu');
            return;
        }
        dispatch(loginUser({ email, password }));
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit();
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Welcome Back!</h1>


                <div className="mb-5">
                    <Input
                        label="Email"
                        name="email"
                        value={email}
                        onChange={(e) => dispatch(setEmail(e.target.value))}
                        onKeyDown={onKeyDown}
                        placeholder="Enter your email"
                        icon={<i className="fas fa-envelope text-gray-400"></i>}
                    />
                </div>

                <div className="mb-5">
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => dispatch(setPassword(e.target.value))}
                        onKeyDown={onKeyDown}
                        placeholder="Enter your password"
                        icon={<i className="fas fa-lock text-gray-400"></i>}
                    />
                </div>


                {/* Error message */}
                {error && <FormError message={error} className="mb-4" />}

                {/* Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-60"
                >
                    {loading ? (
                        <span className="inline-flex items-center gap-2">
                            <span className="h-4 w-4 inline-block animate-spin rounded-full border-2 border-white/60 border-t-white"></span>
                            Đang đăng nhập...
                        </span>
                    ) : (
                        'Login'
                    )}
                </Button>

                {/* Footer */}
                <p className="mt-6 text-center text-gray-500">
                    Don't have an account?{' '}
                    <a href="/register" className="text-indigo-600 hover:underline font-semibold">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}
