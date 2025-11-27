import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import api from "../Config/api";
import { toast } from "react-toastify";
import { logout } from "../redux/features/userSlice";
import logo from "../assets/logo-no-br.png";

export default function DeleteAccount() {
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [otpCode, setOtpCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warning("Vui lòng đăng nhập để truy cập trang này.");
      navigate("/login");
      return;
    }

    // Lấy thông tin user từ localStorage hoặc Redux
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserEmail(userData.email || userData.user?.email || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else if (user?.email) {
      setUserEmail(user.email);
    }
  }, [navigate, user]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestOTP = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("delete-account/request-otp");

      if (response.data?.success) {
        toast.success(
          "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư."
        );
        setStep("verify");
        setCountdown(300); // 5 phút
      } else {
        toast.error(
          response.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại."
        );
      }
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        "Không thể kết nối máy chủ. Vui lòng thử lại sau.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) {
      toast.warning(
        `Vui lòng đợi ${Math.floor(countdown / 60)}:${String(
          countdown % 60
        ).padStart(2, "0")} trước khi gửi lại.`
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("delete-account/request-otp");

      if (response.data?.success) {
        toast.success("Mã OTP mới đã được gửi đến email của bạn.");
        setCountdown(300); // Reset countdown
      } else {
        toast.error(response.data?.message || "Không thể gửi lại mã OTP.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Không thể gửi lại mã OTP. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndDelete = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Vui lòng nhập đầy đủ 6 chữ số của mã OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("delete-account/confirm", {
        otpCode: otpCode,
      });

      if (response.data?.success) {
        toast.success("Tài khoản của bạn đã được xóa thành công.");
        setStep("success");

        // Xóa thông tin đăng nhập
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        dispatch(logout());

        // Chuyển về trang chủ sau 3 giây
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 3000);
      } else {
        toast.error(
          response.data?.message || "Mã OTP không chính xác hoặc đã hết hạn."
        );
      }
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        "Xóa tài khoản thất bại. Vui lòng thử lại.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tài khoản đã được xóa thành công
            </h2>
            <p className="text-gray-600 mb-6">
              Tài khoản của bạn đã được xóa vĩnh viễn. Bạn sẽ được chuyển về
              trang chủ trong giây lát.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-400 text-white rounded-lg font-semibold hover:opacity-90 transition"
            >
              Về trang chủ ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <img
              src={logo}
              alt="SmartDrive"
              className="w-10 h-10 bg-gradient-to-r from-cyan-200 to-blue-100 rounded-full object-cover"
            />
            <span className="text-3xl font-bold text-gray-900">SmartDrive</span>
          </Link>
          <p className="text-gray-600">Xóa tài khoản</p>
        </div>

        {step === "request" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start gap-4 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">
                  Cảnh báo quan trọng
                </h3>
                <p className="text-sm text-red-700">
                  Việc xóa tài khoản là không thể hoàn tác. Tất cả dữ liệu của
                  bạn bao gồm:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                  <li>Thông tin cá nhân</li>
                  <li>Lịch sử đặt xe</li>
                  <li>Đánh giá và phản hồi</li>
                  <li>Tất cả dữ liệu liên quan khác</li>
                </ul>
                <p className="text-sm text-red-700 mt-2">
                  sẽ bị xóa vĩnh viễn và không thể khôi phục.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-600">Email tài khoản</p>
                  <p className="font-semibold text-slate-900">
                    {userEmail || "Đang tải..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">
                    Để xác nhận việc xóa tài khoản, chúng tôi sẽ gửi mã OTP đến
                    email của bạn. Vui lòng nhập mã OTP để hoàn tất quá trình
                    xóa tài khoản.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleRequestOTP}
                disabled={isLoading || !userEmail}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Gửi mã OTP qua email</span>
                  </>
                )}
              </button>

              <Link
                to="/"
                className="block w-full py-3 text-center text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Hủy bỏ
              </Link>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Xác nhận xóa tài khoản
              </h2>
              <p className="text-gray-600">
                Vui lòng nhập mã OTP đã được gửi đến email của bạn
              </p>
              <p className="text-sm text-gray-500 mt-2">{userEmail}</p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mã OTP (6 chữ số)
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setOtpCode(value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                autoFocus
              />
            </div>

            {countdown > 0 && (
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600">
                  Mã OTP còn hiệu lực trong:{" "}
                  <span className="font-semibold text-red-600">
                    {formatCountdown(countdown)}
                  </span>
                </p>
              </div>
            )}

            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 text-center">
                <strong>Lưu ý:</strong> Sau khi xác nhận, tài khoản của bạn sẽ
                bị xóa vĩnh viễn và không thể khôi phục.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleVerifyAndDelete}
                disabled={isLoading || otpCode.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>Xác nhận và xóa tài khoản</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResendOTP}
                disabled={isLoading || countdown > 0}
                className="w-full py-3 text-center text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countdown > 0
                  ? `Gửi lại sau ${formatCountdown(countdown)}`
                  : "Gửi lại mã OTP"}
              </button>

              <Link
                to="/"
                className="block w-full py-3 text-center text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Hủy bỏ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
