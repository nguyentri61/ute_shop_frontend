import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/Input';
import Button from '../components/Button';
import FormError from '../components/FormError';
import { setEmail, setPassword, registerUser } from '../features/auth/registerSlice';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { email, password, loading, error, success, otpEmail } = useSelector((state) => state.register);
    const [confirm, setConfirm] = useState('');
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (success && otpEmail) {
            navigate('/verify-otp', { state: { email: otpEmail } });
        }
    }, [success, otpEmail, navigate]);

    const handleRegister = () => {
        if (!email || !password || !confirm) {
            setLocalError('Vui lòng điền đầy đủ thông tin');
            return;
        }
        if (password !== confirm) {
            setLocalError("Passwords don't match");
            return;
        }
        setLocalError('');
        dispatch(registerUser({ email, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Create an Account</h1>

                {/* Email */}
                <div className="mb-5">
                    <Input
                        label="Email"
                        value={email}
                        onChange={(e) => dispatch(setEmail(e.target.value))}
                        placeholder="Enter your email"
                    />
                </div>

                {/* Password */}
                <div className="mb-5">
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => dispatch(setPassword(e.target.value))}
                        placeholder="Enter your password"
                    />
                </div>

                {/* Confirm Password */}
                <div className="mb-5">
                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Confirm your password"
                    />
                </div>

                {/* Error message */}
                {(error || localError) && <FormError message={error || localError} className="mb-4" />}

                {/* Button */}
                <Button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl"
                >
                    {loading ? 'Đang đăng ký...' : 'Register'}
                </Button>

                <p className="mt-6 text-center text-gray-500">
                    Already have an account? <a href="/login" className="text-purple-600 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
}
