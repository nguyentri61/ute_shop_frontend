import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import FormError from '../components/FormError';
import { register } from '../api/authApi';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (password !== confirm) return setError("Passwords don't match");
        try {
            await register(email, password);
            alert('Register successful! Please login.');
        } catch (err) {
            setError(err.response?.data?.message || 'Register failed');
        }
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
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        icon={<i className="fas fa-envelope text-gray-400"></i>}
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

                {/* Confirm Password */}
                <div className="mb-5">
                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Confirm your password"
                        icon={<i className="fas fa-lock text-gray-400"></i>}
                    />
                </div>

                {/* Error message */}
                {error && <FormError message={error} className="mb-4" />}

                {/* Button */}
                <Button
                    onClick={handleRegister}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl shadow-md hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                >
                    Register
                </Button>

                {/* Footer */}
                <p className="mt-6 text-center text-gray-500">
                    Already have an account?{' '}
                    <a href="/login" className="text-purple-600 hover:underline font-semibold">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );

}
