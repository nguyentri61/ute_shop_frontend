import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../components/Input";
import Button from "../components/Button";
import FormError from "../components/FormError";
import { verifyOtp, resetOtp } from "../features/auth/otpSlice";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // lấy từ register

  const { loading, error, success } = useSelector((state) => state.otp);

  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    dispatch(verifyOtp({ email, otp }));
  };

  if (success) {
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-semibold">
              ✓
            </div>
            <div>
              <h1 className="text-white text-2xl font-semibold">
                Xác thực mã OTP
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                Nhập mã OTP đã gửi tới email{" "}
                <span className="font-medium">{email || "..."}.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Mã OTP</label>
            {/* giữ Input component để không thay đổi logic */}
            <Input
              label={null}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập mã OTP"
              className="text-lg font-medium tracking-widest text-center"
            />
          </div>

          {error && (
            <div className="mb-4">
              <FormError message={error} />
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Không nhận được mã? Kiểm tra thư rác hoặc thử lại sau vài phút.
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                className="px-4 py-2 rounded-full text-sm"
              >
                Quay lại
              </Button>

              <Button
                onClick={handleVerify}
                disabled={loading}
                className="px-5 py-2 rounded-full"
              >
                {loading ? "Đang xác thực..." : "Xác thực"}
              </Button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            Bằng việc xác thực bạn đồng ý với điều khoản sử dụng.
          </div>
        </div>
      </div>
    </div>
  );
}
