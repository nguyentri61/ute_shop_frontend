import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/Input';
import Button from '../components/Button';
import FormError from '../components/FormError';
import { verifyOtp, resetOtp } from '../features/auth/otpSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifyOtp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; // lấy từ register

    const { loading, error, success } = useSelector((state) => state.otp);

    const [otp, setOtp] = useState('');

    const handleVerify = () => {
        dispatch(verifyOtp({ email, otp }));
    };

    if (success) {
        navigate('/login');
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl">
                <h1 className="text-2xl font-bold mb-5">Verify OTP</h1>

                <Input
                    label="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                />

                {error && <FormError message={error} />}

                <Button onClick={handleVerify} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify'}
                </Button>
            </div>
        </div>
    );
}
