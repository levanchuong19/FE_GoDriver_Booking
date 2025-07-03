import { Car } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleNavigateAndScroll = (anchor: string) => {
    navigate("/"); // Điều hướng về Home
    setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Delay nhẹ để chắc chắn trang đã render xong
  };
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Car className="h-8 w-8 text-blue-600" />
          <span
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-gray-900 cursor-pointer"
          >
            SmartDrive
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => handleNavigateAndScroll("services")}
            className="text-gray-600 hover:text-blue-600"
          >
            Dịch vụ
          </button>
          <button
            onClick={() => handleNavigateAndScroll("how-it-works")}
            className="text-gray-600 hover:text-blue-600"
          >
            Cách hoạt động
          </button>
          <button
            onClick={() => handleNavigateAndScroll("services")}
            className="text-gray-600 hover:text-blue-600"
          >
            Bảng giá
          </button>

          <a href="/search" className="text-gray-600 hover:text-blue-600">
            Đặt lịch di chuyển
          </a>
          <a href="/map" className="text-gray-600 hover:text-blue-600">
            Tìm tài xế gần đây
          </a>
        </nav>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded hover:bg-gray-100 transition text-black-800 border border-transparent bg-transparent"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </header>
  );
}
