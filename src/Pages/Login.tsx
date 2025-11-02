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
  const [activeTab] = useState("customer");
  const [formData, setFormData] = useState<LoginProps>({
    phone: "",
    password: "",
  });
  const navigate = useNavigate();
  const [, setError] = useState<string>("");
  const [, setIsLoading] = useState<boolean>(false);
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
        } else if (response.data.data.role === "renter") {
          navigate("/", { replace: true });
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
                    inputMode="numeric"
                    pattern="[0-9]*"
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
