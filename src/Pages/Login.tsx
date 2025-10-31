import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import api from "../config/axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", loginData);
      if (res.data.success) {
        toast.success("Đăng nhập thành công");
        const token = res.data.data.accessToken;
        const role = res.data.data.role;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(res.data.data));

        // ✅ Chuyển hướng theo role
        if (role === "admin") navigate("/dashboard/users");
        else if (role === "driver") navigate("/dashboard/driver");
        else navigate("/dashboard/customer");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              className="w-full border px-3 py-2 rounded"
              value={loginData.phone}
              onChange={(e) =>
                setLoginData({ ...loginData, phone: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="w-full border px-3 py-2 rounded"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
