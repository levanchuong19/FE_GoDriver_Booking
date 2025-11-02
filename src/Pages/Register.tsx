import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-no-br.png";
import { toast } from "react-toastify";
import api from "../Config/api";
import { Modal, Input } from "antd";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("customer");
  const [customerData, setCustomerData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (
      !customerData.fullName ||
      !customerData.email ||
      !customerData.phone ||
      !customerData.password ||
      !customerData.confirmPassword
    ) {
      toast.error("Vui lòng điền đầy đủ tất cả các thông tin bắt buộc.");
    }

    if (!customerData.agreeTerms) {
      toast.error("Bạn cần đồng ý với điều khoản dịch vụ để tiếp tục.");
    }

    if (customerData.fullName.length < 2) {
      toast.error("Họ và tên phải có ít nhất 2 ký tự.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.email)) {
      toast.error("Email không hợp lệ.");
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(customerData.phone)) {
      toast.error(
        "Số điện thoại không hợp lệ (phải là số điện thoại Việt Nam)."
      );
    }

    if (customerData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
    }

    if (customerData.password !== customerData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
    }

    try {
      const response = await api.post("auth/register", {
        fullName: customerData.fullName,
        email: customerData.email,
        phone: customerData.phone,
        password: customerData.password,
      });

      if (response.data?.success) {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
        );
        setRegisteredEmail(customerData.email); // lưu lại email người dùng
        setIsOtpModalVisible(true);
      } else {
        toast.error(
          response.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
        );
      }
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        "Không thể kết nối máy chủ. Vui lòng thử lại sau.";
      toast.error(errMsg);
    }
  };

  const handleVerifyEmail = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Vui lòng nhập đầy đủ 6 chữ số của mã OTP.");
      return;
    }

    try {
      const response = await api.post("auth/verify-email", {
        email: registeredEmail,
        code: otpCode,
      });

      if (response.data?.success) {
        toast.success("Xác thực email thành công! Bạn có thể đăng nhập ngay.");
        setIsOtpModalVisible(false);
        navigate("/login");
      } else {
        toast.error(response.data?.message || "Mã OTP không chính xác.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Xác thực thất bại. Vui lòng thử lại."
      );
    }
  };

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
          <p className="text-gray-600">
            Tạo tài khoản để bắt đầu sử dụng dịch vụ
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            {/* Tabs */}
            <div className="w-full grid grid-cols-2 border-b">
              <button
                className={`py-2 font-semibold ${
                  activeTab === "customer"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("customer")}
              >
                Khách hàng
              </button>
              <button
                className={`py-2 font-semibold ${
                  activeTab === "driver"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("driver")}
              >
                Tài xế
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "customer" && (
              <form className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Họ và tên *
                  </label>
                  <input
                    id="fullName"
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={customerData.fullName}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={customerData.email}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Số điện thoại *
                  </label>
                  <input
                    id="phone"
                    placeholder="0901234567"
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={customerData.phone}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mật khẩu *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tối thiểu 8 ký tự"
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={customerData.password}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          password: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Xác nhận mật khẩu *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={customerData.confirmPassword}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={customerData.agreeTerms}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        agreeTerms: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="terms" className="text-sm">
                    Tôi đồng ý với{" "}
                    <Link to="#" className="text-blue-600 hover:underline">
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link to="#" className="text-blue-600 hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </label>
                </div>
                <button
                  onClick={handleRegister}
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                  type="button"
                  disabled={!customerData.agreeTerms}
                >
                  Đăng ký tài khoản
                </button>
              </form>
            )}

            {activeTab === "driver" && (
              <div className="space-y-4 mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Đăng ký tài xế
                  </h4>
                  <p className="text-sm text-blue-700">
                    Để trở thành tài xế, bạn cần hoàn tất quy trình xác minh đầy
                    đủ. Nhấn vào nút bên dưới để bắt đầu.
                  </p>
                </div>
                <Link to="/register-partner" className="block">
                  <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                    Bắt đầu đăng ký tài xế
                  </button>
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  Quy trình đăng ký tài xế bao gồm xác minh giấy tờ và kiểm tra
                  lý lịch
                </p>
              </div>
            )}

            {/* Separator */}
            <div className="mt-6 relative flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-xs text-gray-500 bg-white">Hoặc</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Register link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Đã có tài khoản? </span>
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Xác thực Email"
        open={isOtpModalVisible}
        onCancel={() => setIsOtpModalVisible(false)}
        footer={null}
        centered
      >
        <p className="text-gray-600 mb-4">
          Nhập mã gồm 6 chữ số đã được gửi đến{" "}
          <strong>{registeredEmail}</strong>
        </p>

        <Input.OTP
          length={6}
          onChange={(value) => setOtpCode(value)}
          value={otpCode}
          size="large"
        />

        <button
          onClick={handleVerifyEmail}
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded font-semibold hover:bg-blue-700 transition"
        >
          Xác nhận
        </button>
      </Modal>
    </div>
  );
}
