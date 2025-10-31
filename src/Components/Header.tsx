import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-no-br.png";

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

  // const handleNavigateAndScroll = (anchor: string) => {
  //   navigate("/"); // Điều hướng về Home
  //   setTimeout(() => {
  //     const element = document.getElementById(anchor);
  //     if (element) {
  //       element.scrollIntoView({ behavior: "smooth" });
  //     }
  //   }, 100); // Delay nhẹ để chắc chắn trang đã render xong
  // };
  return (
    // <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
    //   <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    //     <div className="flex items-center space-x-2">
    //       <Car className="h-8 w-8 text-blue-600" />
    //       <span
    //         onClick={() => navigate("/")}
    //         className="text-2xl font-bold text-gray-900 cursor-pointer"
    //       >
    //         SmartDrive
    //       </span>
    //     </div>
    //     <nav className="hidden md:flex items-center space-x-6">
    //       <button
    //         onClick={() => handleNavigateAndScroll("services")}
    //         className="text-gray-600 hover:text-blue-600"
    //       >
    //         Dịch vụ
    //       </button>
    //       <button
    //         onClick={() => handleNavigateAndScroll("how-it-works")}
    //         className="text-gray-600 hover:text-blue-600"
    //       >
    //         Cách hoạt động
    //       </button>
    //       <button
    //         onClick={() => handleNavigateAndScroll("services")}
    //         className="text-gray-600 hover:text-blue-600"
    //       >
    //         Bảng giá
    //       </button>

    //       <a href="/search" className="text-gray-600 hover:text-blue-600">
    //         Đặt lịch di chuyển
    //       </a>
    //       <a href="/map" className="text-gray-600 hover:text-blue-600">
    //         Tìm tài xế gần đây
    //       </a>
    //     </nav>
    //     <div className="flex items-center space-x-3">
    //       <button
    //         onClick={() => navigate("/login")}
    //         className="px-4 py-2 rounded hover:bg-gray-100 transition text-black-800 border border-transparent bg-transparent"
    //       >
    //         Đăng nhập
    //       </button>
    //       <button
    //         onClick={() => navigate("/register")}
    //         className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
    //       >
    //         Đăng ký
    //       </button>
    //     </div>
    //   </div>
    // </header>
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="SmartDrive"
            className="w-10 h-10 bg-gradient-to-r from-cyan-200 to-blue-100 rounded-full object-cover"
          />
          <span
            onClick={() => navigate("/")}
            className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent cursor-pointer"
          >
            SmartDrive
          </span>
        </div>
        <div className="hidden md:flex gap-8">
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
        <div className="flex items-center gap-4">
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
          <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-400 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition font-semibold">
            Tải ứng dụng
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-400 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition font-semibold"
          >
            Đăng Nhập
          </button>
        </div>
      </div>
    </nav>
  );
}
