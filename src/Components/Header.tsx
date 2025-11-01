import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-no-br.png";
import { toast } from "react-toastify";

export default function Header() {
  const navigate = useNavigate();
  const [, setScrollY] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleDownloadApp = () => {
    toast.warning(
      "Phiên bản đang trong thời gian nâng cấp, vui lòng quay lại sau."
    );
  };
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="SmartDrive"
            className="w-9 h-9 bg-gradient-to-r from-cyan-200 to-blue-100 rounded-full object-cover"
          />
          <span
            onClick={() => navigate("/")}
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent cursor-pointer"
          >
            SmartDrive
          </span>
        </div>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#services"
            className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
          >
            Dịch vụ
          </a>
          <a
            href="#features"
            className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
          >
            Tính năng
          </a>
          <a
            href="#testimonials"
            className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
          >
            Đánh giá
          </a>
          <a
            href="#pricing"
            className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
          >
            Giá cả
          </a>
        </div>

        {/* Nút hành động */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleDownloadApp}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-400 text-white rounded-lg font-semibold text-sm"
          >
            Tải ứng dụng
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold text-sm"
          >
            Đăng nhập
          </button>
        </div>

        {/* Menu mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="p-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-400 text-white font-medium"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </header>
  );
}
