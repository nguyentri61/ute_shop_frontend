import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import FormError from '../components/FormError';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { login } from '../api/authApi';

export default function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        dispatch(loginStart());
        try {
            const res = await login(email, password);
            dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            dispatch(loginFailure(msg));
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Welcome Back!</h1>

                {/* Email */}
                <div className="mb-5">
                    <Input
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        icon={<i className="fas fa-envelope text-gray-400"></i>} // nếu dùng FontAwesome
                    />
                </div>

                {/* Password */}
                <div className="mb-5">
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        icon={<i className="fas fa-lock text-gray-400"></i>}
                    />
                </div>

                {/* Error message */}
                {error && <FormError message={error} className="mb-4" />}

                {/* Button */}
                <Button
                    onClick={handleLogin}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all duration-300"
                >
                    Login
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
