import {
  Star,
  Clock,
  MapPin,
  Wrench,
  Truck,
  Calendar,
  ChevronDown,
  ArrowRight,
  Car,
  Map,
  Zap,
  ShieldCheck,
  CircleDollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import fast from "../assets/fast.png";
import unnamed from "../assets/unnamed.jpg";
import cheap from "../assets/cheap.png";

export default function HomePage() {
  const [, setScrollY] = useState(0);
  const [isDark] = useState(false);

  const navigate = useNavigate();

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
  return (
    // <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    //   {/* Hero Section */}
    //   <section className="py-20 px-4">
    //     <div className="container mx-auto text-center">
    //       <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
    //         Thuê tài xế chuyên nghiệp
    //         <span className="text-blue-600 block">an toàn & tiện lợi</span>
    //       </h1>
    //       <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
    //         Kết nối bạn với những tài xế có kinh nghiệm, được xác minh và đánh
    //         giá cao. Dịch vụ lái xe hộ 24/7 trên toàn quốc.
    //       </p>
    //       <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
    //         <Link to="/map">
    //           <button className="text-lg px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center">
    //             <MapPin className="mr-2 h-5 w-5" />
    //             Tìm tài xế ngay
    //           </button>
    //         </Link>
    //         <Link to="/register-partner">
    //           <button className="text-lg px-6 py-3 rounded border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 flex items-center justify-center">
    //             <Users className="mr-2 h-5 w-5" />
    //             Trở thành tài xế
    //           </button>
    //         </Link>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Stats Section */}
    //   <section className="py-16 bg-blue-600 text-white">
    //     <div className="container mx-auto px-4">
    //       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    //         <div>
    //           <div className="text-4xl font-bold mb-2">10,000+</div>
    //           <div className="text-blue-100">Tài xế đã đăng ký</div>
    //         </div>
    //         <div>
    //           <div className="text-4xl font-bold mb-2">50,000+</div>
    //           <div className="text-blue-100">Chuyến đi hoàn thành</div>
    //         </div>
    //         <div>
    //           <div className="text-4xl font-bold mb-2">4.9/5</div>
    //           <div className="text-blue-100">Đánh giá trung bình</div>
    //         </div>
    //         <div>
    //           <div className="text-4xl font-bold mb-2">24/7</div>
    //           <div className="text-blue-100">Hỗ trợ khách hàng</div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Services Section */}
    //   <section id="services" className="py-20 px-4">
    //     <div className="container mx-auto">
    //       <div className="text-center mb-16">
    //         <h2 className="text-4xl font-bold text-gray-900 mb-4">
    //           Dịch vụ của chúng tôi
    //         </h2>
    //         <p className="text-xl text-gray-600">
    //           Đa dạng dịch vụ phù hợp với mọi nhu cầu
    //         </p>
    //       </div>
    //       <div className="grid md:grid-cols-3 gap-8">
    //         {/* Card 1 */}
    //         <div className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow p-8">
    //           <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
    //           <div className="text-2xl font-bold mb-2">Lái xe theo giờ</div>
    //           <div className="text-gray-600 mb-2">
    //             Thuê tài xế theo giờ cho các chuyến đi ngắn
    //           </div>
    //           <div className="text-2xl font-bold text-blue-600 mb-2">
    //             ~ 150,000đ/giờ
    //           </div>
    //           {/* <p className="text-gray-600">Tối thiểu 2 giờ</p> */}
    //         </div>
    //         {/* Card 2 */}
    //         <div className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow p-8">
    //           <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
    //           <div className="text-2xl font-bold mb-2">Lái xe đường dài</div>
    //           <div className="text-gray-600 mb-2">
    //             Dịch vụ lái xe cho các chuyến đi xa
    //           </div>
    //           <div className="text-2xl font-bold text-blue-600 mb-2">
    //             ~ 2,000đ/km
    //           </div>
    //           <p className="text-gray-600">Bao gồm phí nghỉ đêm</p>
    //         </div>
    //         {/* Card 3 */}
    //         <div className="bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow p-8">
    //           <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
    //           <div className="text-2xl font-bold mb-2">Lái xe VIP</div>
    //           <div className="text-gray-600 mb-2">
    //             Tài xế chuyên nghiệp cho khách VIP
    //           </div>
    //           <div className="text-2xl font-bold text-blue-600 mb-2">
    //             ~ 300,000đ/giờ
    //           </div>
    //           <p className="text-gray-600">Dịch vụ cao cấp</p>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* How it works */}
    //   <section id="how-it-works" className="py-20 px-4 bg-gray-50">
    //     <div className="container mx-auto">
    //       <div className="text-center mb-16">
    //         <h2 className="text-4xl font-bold text-gray-900 mb-4">
    //           Cách thức hoạt động
    //         </h2>
    //         <p className="text-xl text-gray-600">Đơn giản chỉ với 3 bước</p>
    //       </div>
    //       <div className="grid md:grid-cols-3 gap-8">
    //         <div className="text-center">
    //           <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
    //             1
    //           </div>
    //           <h3 className="text-xl font-semibold mb-2">Tìm kiếm tài xế</h3>
    //           <p className="text-gray-600">
    //             Nhập địa điểm và thời gian cần thuê tài xế
    //           </p>
    //         </div>
    //         <div className="text-center">
    //           <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
    //             2
    //           </div>
    //           <h3 className="text-xl font-semibold mb-2">Chọn tài xế</h3>
    //           <p className="text-gray-600">
    //             Xem hồ sơ, đánh giá và chọn tài xế phù hợp
    //           </p>
    //         </div>
    //         <div className="text-center">
    //           <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
    //             3
    //           </div>
    //           <h3 className="text-xl font-semibold mb-2">Đặt lịch</h3>
    //           <p className="text-gray-600">
    //             Xác nhận đặt lịch và thanh toán an toàn
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Featured Drivers */}
    //   <section className="py-20 px-4">
    //     <div className="container mx-auto">
    //       <div className="text-center mb-16">
    //         <h2 className="text-4xl font-bold text-gray-900 mb-4">
    //           Tài xế nổi bật
    //         </h2>
    //         <p className="text-xl text-gray-600">
    //           Những tài xế được đánh giá cao nhất
    //         </p>
    //       </div>
    //       <div className="grid md:grid-cols-3 gap-8">
    //         {[1, 2, 3].map((i) => (
    //           <div
    //             key={i}
    //             className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 text-center"
    //           >
    //             <img
    //               src="https://cdn.santino.com.vn/storage/upload/news/2023/10/trang-phuc-lich-su-cho-nam-anh10.jpg"
    //               alt="Driver"
    //               width={80}
    //               height={80}
    //               className=" w-20 h-20 rounded-full object-cover mx-auto mb-4 "
    //             />
    //             <div className="text-2xl font-bold mb-2">Nguyễn Văn A</div>
    //             <div className="text-gray-600 mb-2">
    //               Tài xế chuyên nghiệp • 5 năm kinh nghiệm
    //             </div>
    //             <div className="flex items-center justify-center mb-2">
    //               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    //               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    //               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    //               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    //               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    //               <span className="ml-2 text-sm text-gray-600">
    //                 4.9 (127 đánh giá)
    //               </span>
    //             </div>
    //             <div className="flex flex-wrap gap-1 justify-center mb-4">
    //               <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
    //                 Lái xe an toàn
    //               </span>
    //               <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
    //                 Đúng giờ
    //               </span>
    //             </div>
    //             {/* <p className="text-2xl font-bold text-blue-600">15,000đ/km</p> */}
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </section>

    //   {/* CTA Section */}
    //   <section className="py-20 px-4 bg-blue-600 text-white">
    //     <div className="container mx-auto text-center">
    //       <h2 className="text-4xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
    //       <p className="text-xl mb-8 text-blue-100">
    //         Tìm tài xế phù hợp ngay hôm nay
    //       </p>
    //       <div className="flex flex-col sm:flex-row gap-4 justify-center">
    //         <Link to="/map">
    //           <button className="text-lg px-6 py-3 rounded bg-white text-blue-600 hover:bg-blue-100 font-semibold">
    //             Tìm tài xế ngay
    //           </button>
    //         </Link>
    //         <Link to="/register-partner">
    //           <button className="text-lg px-6 py-3 rounded border border-white text-white hover:bg-white hover:text-blue-600 bg-transparent font-semibold">
    //             Đăng ký làm tài xế
    //           </button>
    //         </Link>
    //       </div>
    //     </div>
    //   </section>
    // </div>
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 animate-pulse"></div>

          {/* Floating blob 1 - Top left */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-200 to-blue-200 dark:from-cyan-900/40 dark:to-blue-900/40 rounded-full blur-3xl opacity-40 animate-blob"></div>

          {/* Floating blob 2 - Bottom right */}
          <div
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-cyan-200 to-blue-200 dark:from-cyan-900/40 dark:to-blue-900/40 rounded-full blur-3xl opacity-40 animate-blob"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Floating blob 3 - Top right */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full blur-3xl opacity-30 animate-blob"
            style={{ animationDelay: "4s" }}
          ></div>

          {/* Floating blob 4 - Bottom left */}
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full blur-3xl opacity-30 animate-blob"
            style={{ animationDelay: "6s" }}
          ></div>

          {/* Center glow effect */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-cyan-300/20 to-transparent dark:from-cyan-500/10 dark:to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>

          {/* Animated grid pattern */}
          <div
            className="absolute inset-0 opacity-5 dark:opacity-10"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(110, 193, 228, 0.05) 25%, rgba(110, 193, 228, 0.05) 26%, transparent 27%, transparent 74%, rgba(110, 193, 228, 0.05) 75%, rgba(110, 193, 228, 0.05) 76%, transparent 77%, transparent),
                              linear-gradient(90deg, transparent 24%, rgba(110, 193, 228, 0.05) 25%, rgba(110, 193, 228, 0.05) 26%, transparent 27%, transparent 74%, rgba(110, 193, 228, 0.05) 75%, rgba(110, 193, 228, 0.05) 76%, transparent 77%, transparent)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  Đi lại thông minh
                </span>
                <br />
                với SmartDrive
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                Ứng dụng cho thuê tài xế lái xe hộ hàng đầu. Tìm kiếm tài xế chỉ
                trong vài giây, an toàn 24/7, giá cạnh tranh.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-400 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105">
                Bắt đầu ngay
              </button>
              <button className="px-8 py-4 border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400 rounded-lg font-bold text-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition">
                Xem demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="space-y-2">
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                  5K+
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Chuyến đi hàng ngày
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                  98%
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Độ hài lòng khách
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                  24/7
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Hỗ trợ khách hàng
                </p>
              </div>
            </div>
          </div>

          {/* Right - Car visualization */}
          <div className="relative h-96 md:h-full flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-80 h-64 animate-float">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full filter drop-shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(110, 193, 228, 0.4))",
                  }}
                >
                  {/* Car body */}
                  <rect
                    x="80"
                    y="120"
                    width="240"
                    height="100"
                    rx="20"
                    fill="url(#carGradientSmart)"
                    stroke="#6EC1E4"
                    strokeWidth="3"
                  />

                  {/* Windows */}
                  <rect
                    x="100"
                    y="100"
                    width="60"
                    height="50"
                    rx="8"
                    fill="#4a9eff"
                    opacity="0.6"
                    stroke="#6EC1E4"
                    strokeWidth="2"
                  />
                  <rect
                    x="240"
                    y="100"
                    width="60"
                    height="50"
                    rx="8"
                    fill="#4a9eff"
                    opacity="0.6"
                    stroke="#6EC1E4"
                    strokeWidth="2"
                  />

                  {/* Wheels */}
                  <circle
                    cx="130"
                    cy="230"
                    r="25"
                    fill="#1a1a2e"
                    stroke="#6EC1E4"
                    strokeWidth="3"
                  />
                  <circle
                    cx="270"
                    cy="230"
                    r="25"
                    fill="#1a1a2e"
                    stroke="#6EC1E4"
                    strokeWidth="3"
                  />

                  {/* Wheel details */}
                  <circle
                    cx="130"
                    cy="230"
                    r="15"
                    fill="none"
                    stroke="#6EC1E4"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                  <circle
                    cx="270"
                    cy="230"
                    r="15"
                    fill="none"
                    stroke="#6EC1E4"
                    strokeWidth="2"
                    opacity="0.7"
                  />

                  {/* Headlights */}
                  <circle
                    cx="85"
                    cy="145"
                    r="12"
                    fill="#6EC1E4"
                    opacity="0.8"
                  />
                  <circle
                    cx="85"
                    cy="175"
                    r="12"
                    fill="#6EC1E4"
                    opacity="0.8"
                  />

                  {/* Autonomous indicator */}
                  <circle
                    cx="200"
                    cy="80"
                    r="20"
                    fill="none"
                    stroke="#6EC1E4"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <circle
                    cx="200"
                    cy="80"
                    r="15"
                    fill="none"
                    stroke="#6EC1E4"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <text
                    x="200"
                    y="85"
                    textAnchor="middle"
                    fill="#6EC1E4"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    SmartDrive
                  </text>

                  <defs>
                    <linearGradient
                      id="carGradientSmart"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#6EC1E4" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6EC1E4" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Glow effect */}
                <div
                  className="absolute inset-0 animate-glow rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(110, 193, 228, 0.2) 0%, transparent 70%)",
                  }}
                ></div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg backdrop-blur-md border border-cyan-300 dark:border-cyan-700 flex items-center justify-center animate-pulse">
                <MapPin className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
              </div>
              <div
                className="absolute bottom-10 left-10 w-20 h-20 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg backdrop-blur-md border border-cyan-300 dark:border-cyan-700 flex items-center justify-center animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <Clock className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
        </div>
      </section>
      {/* Services Section */}
      <section
        id="services"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Dịch vụ{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                đa dạng
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              SmartDrive cung cấp nhiều dịch vụ để đáp ứng mọi nhu cầu của bạn
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 - By Distance */}
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Theo km</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Thanh toán theo quãng đường, giá cạnh tranh
              </p>
            </div>

            {/* Service 2 - By Hour */}
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Theo giờ</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Thuê tài xế theo giờ, linh hoạt và tiện lợi
              </p>
            </div>

            {/* Service 3 - By Day */}
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Theo ngày</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Thuê tài xế cả ngày với giá ưu đãi đặc biệt
              </p>
            </div>

            {/* Service 4 - Delivery */}
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Map className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tài xế đi tỉnh</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Đặt tài xế cho chuyến đi dài
              </p>
            </div>

            {/* Service 5 - Roadside Assistance */}
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cứu hộ ô tô</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Hỗ trợ cứu hộ 24/7 khi xe gặp sự cố
              </p>
            </div>

            {/* Service 6 - Food Delivery */}
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Thuê xe tự lái</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Cung cấp mọi loại xe theo yêu cầu và minh bạch.
              </p>
            </div>

            {/* Service 7 - Become Partner */}
            <div
              onClick={() => navigate("/register-partner")}
              className="group p-6 rounded-xl bg-cyan-100 dark:from-cyan-900/30 to-cyan-100 dark:to-cyan-900/30 border border-cyan-300 dark:border-cyan-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <Link
                className="text-xl font-bold dark:text-slate-800 mb-2"
                to="/register-partner"
              >
                Trở thành đối tác
              </Link>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Kiếm thu nhập thêm bằng cách trở thành đối tác làm tài xế
              </p>
            </div>

            {/* Service 8 - Planned Route */}
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Giao hàng</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Giao hàng nhanh chóng, an toàn và đáng tin cậy
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      {/* <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tính năng{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                nổi bật
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Công nghệ tiên tiến kết hợp với trải nghiệm người dùng tuyệt vời
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Đặt xe siêu nhanh</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Chỉ cần 3 giây để đặt xe. Công nghệ AI tìm tài xế gần nhất cho
                bạn.
              </p>
            </div>
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">An toàn tuyệt đối</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Tài xế được tuyển chọn với số kinh nghiệm dài hạn.
              </p>
            </div>
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Định vị chính xác</h3>
              <p className="text-slate-600 dark:text-slate-400">
                GPS độ chính xác cm, hoạt động trong mọi điều kiện thời tiết.
              </p>
            </div>
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cộng đồng lớn</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Hơn 5k người dùng tin tưởng SmartDrive mỗi ngày.
              </p>
            </div>
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ứng dụng thông minh</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Giao diện trực quan, dễ sử dụng cho mọi lứa tuổi.
              </p>
            </div>
            <div className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Giá cạnh tranh</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Giá rẻ nhất thị trường với chất lượng dịch vụ cao nhất.
              </p>
            </div>
          </div>
        </div>
      </section> */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tính năng{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                nổi bật
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Công nghệ tiên tiến, dễ sử dụng, an toàn tuyệt đối
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                title: "Đặt xe siêu nhanh",
                desc: "Chỉ cần 3 giây để đặt xe. Công nghệ AI tìm tài xế gần nhất cho bạn.",
                features: [
                  "Giao diện trực quan",
                  "Tìm kiếm thông minh",
                  "Xác nhận tức thì",
                ],
                emoji: <Zap />,
                image: fast,
              },
              {
                title: "An toàn tuyệt đối",
                desc: "Tất cả tài xế được xác minh danh tính, có bằng lái hợp lệ, được đào tạo chuyên nghiệp.",
                features: [
                  "Xác minh danh tính",
                  "Bảo hiểm toàn diện",
                  "Theo dõi realtime",
                ],
                emoji: <ShieldCheck />,
                image: unnamed,
              },
              {
                title: "Giá cạnh tranh",
                desc: "Giá rẻ nhất thị trường với chất lượng dịch vụ cao nhất, không phí ẩn.",
                features: [
                  "Giá minh bạch",
                  "Không phí ẩn",
                  "Ưu đãi hàng tháng",
                ],
                emoji: <CircleDollarSign />,
                image: cheap,
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                {idx % 2 === 0 ? (
                  <>
                    {/* Nội dung bên trái */}
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl">
                        {feature.emoji}
                      </div>
                      <h3 className="text-3xl font-bold">{feature.title}</h3>
                      <p className="text-lg text-muted-foreground">
                        {feature.desc}
                      </p>
                      <ul className="space-y-2">
                        {feature.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <span className="text-accent">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ảnh bên phải */}
                    <div className=" rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Ảnh bên trái */}
                    <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden order-2 md:order-1">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Nội dung bên phải */}
                    <div className="space-y-4 order-1 md:order-2">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl">
                        {feature.emoji}
                      </div>
                      <h3 className="text-3xl font-bold">{feature.title}</h3>
                      <p className="text-lg text-muted-foreground">
                        {feature.desc}
                      </p>
                      <ul className="space-y-2">
                        {feature.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <span className="text-accent">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      ;{/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Khách hàng{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                yêu thích
              </span>{" "}
              chúng tôi
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Hàng triệu người dùng đã tin tưởng SmartDrive
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Nguyễn Văn Đồng",
                role: "Doanh nhân",
                text: "SmartDrive thay đổi cách tôi di chuyển. Nhanh, an toàn và tiện lợi!",
                rating: 5,
              },
              {
                name: "Trần Thị Bích",
                role: "Sinh viên",
                text: "Giá rẻ, dịch vụ tốt. Tôi sẽ suy nghĩ tới việc sử dụng SmartDrive mỗi ngày.",
                rating: 5,
              },
              {
                name: "Lê Vũ Trường",
                role: "Nhân viên văn phòng",
                text: "Tác phong tài xế thực sự tuyệt vời. Tôi có thể thoải mái thư giãn trên xe!",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Bảng giá{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                minh bạch
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Chọn gói phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "Cơ bản",
                price: "50.000đ",
                desc: "Cho chuyến đi thường xuyên chỉ từ ",
                features: ["Theo giờ", "Hỗ trợ 24/7", "Thanh toán linh hoạt"],
              },
              {
                name: "Tiêu chuẩn",
                price: "13.000đ",
                desc: "Cho chuyến đi ngắn giá chỉ từ",
                features: [
                  "Theo quãng đường (km)",
                  "Ưu đãi hàng tháng",
                  "Hỗ trợ ưu tiên",
                ],
                popular: true,
              },
              {
                name: "Gói Nâng Cao",
                price: "300.000đ",
                desc: "Cho chuyến đi theo ngày giá chỉ từ",
                features: ["Theo ngày", "Giảm giá 20%", "Tài xế riêng"],
                popular: true,
              },
              {
                name: "Premium",
                price: "8.000đ",
                desc: "Cho chuyến đi dài giá chỉ từ",
                features: ["Liên tỉnh", "Giảm giá 20%", "Hỗ trợ đặt lịch"],
              },
            ].map((plan, idx) => {
              let unit = "/km";
              if (plan.features.some((f) => f.toLowerCase().includes("giờ"))) {
                unit = "/giờ";
              } else if (
                plan.features.some((f) => f.toLowerCase().includes("ngày"))
              ) {
                unit = "/ngày";
              }

              return (
                <div
                  key={idx}
                  className={`p-8 rounded-xl border transition-all ${
                    plan.popular
                      ? "bg-gradient-to-br from-cyan-100 dark:from-cyan-900/30 to-cyan-100 dark:to-cyan-900/30 border-cyan-500 dark:border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-400 text-white text-sm font-bold rounded-full mb-4">
                      Phổ biến nhất
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {plan.desc}
                  </p>
                  <p className="text-4xl font-bold mb-6">
                    {plan.price}
                    <span className="text-lg text-slate-600 dark:text-slate-400">
                      {unit}
                    </span>
                  </p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded-lg font-bold transition ${
                      plan.popular
                        ? "bg-gradient-to-r from-cyan-500 to-blue-400 text-white hover:shadow-lg hover:shadow-cyan-500/50"
                        : "border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
                    }`}
                  >
                    Chọn gói
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Cách{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                hoạt động
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Mở ứng dụng",
                desc: "Tải SmartDrive và đăng ký tài khoản",
              },
              {
                step: "2",
                title: "Chọn dịch vụ",
                desc: "Chọn loại dịch vụ phù hợp với nhu cầu",
              },
              {
                step: "3",
                title: "Tài xế đến ngay",
                desc: "Tài xế sẽ tới trong 2-5 phút",
              },
              {
                step: "4",
                title: "Thưởng thức",
                desc: "Thưởng thức chuyến đi trên chính chiếc xe của mình",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center mx-auto text-2xl font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Câu hỏi{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                thường gặp
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "SmartDrive có an toàn không?",
                a: "Hoàn toàn an toàn! Tất cả tài xế của SmartDrive đều được xác minh danh tính, có bằng lái hợp lệ và được đào tạo kỹ năng lái xe chuyên nghiệp. Mọi chuyến đi đều được theo dõi thời gian thực để đảm bảo an toàn tối đa cho khách hàng.",
              },
              {
                q: "Giá thuê tài xế được tính như thế nào?",
                a: "Bạn có thể chọn thanh toán linh hoạt theo giờ, theo ngày hoặc theo quãng đường (km) và chuyến đi dài. SmartDrive luôn hiển thị giá rõ ràng trước khi bạn xác nhận chuyến đi, không phụ phí ẩn.",
              },
              {
                q: "Làm sao để đặt tài xế lái xe hộ?",
                a: "Rất đơn giản! Chỉ cần mở ứng dụng SmartDrive, nhập địa điểm đón và điểm đến, chọn gói dịch vụ phù hợp — tài xế gần nhất sẽ được điều tới trong vài phút.",
              },
              {
                q: "SmartDrive có hỗ trợ 24/7 không?",
                a: "Có! Đội ngũ chăm sóc khách hàng của SmartDrive luôn sẵn sàng hỗ trợ bạn 24/7 qua tổng đài, email hoặc chat trực tiếp trên ứng dụng.",
              },
              {
                q: "Tôi có thể đặt trước tài xế không?",
                a: "Có thể! Bạn có thể đặt trước tài xế theo khung giờ hoặc ngày mong muốn. Hệ thống sẽ tự động nhắc nhở và gửi thông tin tài xế khi đến thời gian khởi hành.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 transition"
              >
                <h3 className="text-lg font-bold mb-2">{item.q}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-500 to-blue-400">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Sẵn sàng cho <span className="text-white">tương lai</span>?
          </h2>
          <p className="text-xl text-white/90">
            Tải SmartDrive ngay hôm nay và nhận ưu đãi 30% cho chuyến đi đầu
            tiên
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* App Store */}
            {/* <button className="flex items-center gap-3 px-8 py-4 bg-white text-cyan-600 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-black/20 transition transform hover:scale-105"> */}
            <a
              href="https://apps.apple.com/vn/app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-white text-cyan-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-black/20 transition transform hover:scale-105"
            >
              <FaApple size={28} />
              <span>Tải trên iOS</span>
            </a>
            {/* </button> */}

            {/* Google Play */}
            <a
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-black/20 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition transform hover:scale-105"
            >
              <FaGooglePlay size={26} />
              <span>Tải trên Android</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
