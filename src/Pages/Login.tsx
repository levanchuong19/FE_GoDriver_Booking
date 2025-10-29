import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/features/userSlice";
import api from "../Config/api";
import { useDispatch } from "react-redux";
import logo from "../assets/logo-no-br.png";

interface LoginProps {
  phone: string;
  password: string;
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("customer");
  const [customerData, setCustomerData] = useState({
    email: "",
    password: "",
  });
  const [driverData, setDriverData] = useState({
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState<LoginProps>({
    phone: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useDispatch();

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  //   if (error) setError("");
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("auth/login", formData);
      console.log("response", response.data.data.role);
      if (response.data.success === true) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        dispatch(login(response.data.data.user));
        if (response.data.data.role === "admin") {
          navigate("/dashboard", { replace: true });
        } else {
          // navigate("/", { replace: true });
        }
      } else {
        throw new Error(response.data.data);
      }
    } catch (err: any) {
      const message = "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsLoading(false);
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
          <p className="text-gray-600">Chào mừng bạn quay trở lại</p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            {/* Tabs */}
            {/* <div className="w-full grid grid-cols-2 border-b">
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
                    ? "border-b-2  border-gray-200 text-gray-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("driver")}
              >
                Tài xế
              </button>
            </div> */}

            {/* Tab Content */}
            {activeTab === "customer" && (
              <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    htmlFor="customer-phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    id="customer-phone"
                    type="phone"
                    placeholder="Số điện thoại của bạn."
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="customer-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="customer-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember-customer"
                      className="rounded"
                    />
                    <label htmlFor="remember-customer" className="text-sm">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <Link
                    to="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                  Đăng nhập
                </button>
              </form>
            )}

            {/* {activeTab === "driver" && (
              <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    htmlFor="driver-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id=""
                    type="email"
                    placeholder="example@email.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={driverData.email}
                    onChange={(e) =>
                      setDriverData({ ...driverData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="driver-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="driver-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={driverData.password}
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember-driver"
                      className="rounded"
                    />
                    <label htmlFor="remember-driver" className="text-sm">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <Link
                    to="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                  Đăng nhập
                </button>
              </form>
            )} */}

            {/* Separator */}
            <div className="mt-6 relative flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-xs text-gray-500 bg-white">Hoặc</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Social login */}
            <div className="mt-6 space-y-3">
              <button className="w-full flex items-center justify-center border border-gray-200 bg-transparent py-2 rounded hover:bg-gray-50 transition">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Đăng nhập với Google
              </button>
              <button className="w-full flex items-center justify-center border border-gray-200 bg-transparent py-2 rounded hover:bg-gray-50 transition">
                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Đăng nhập với Facebook
              </button>
            </div>

            {/* Register link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Chưa có tài khoản? </span>
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
