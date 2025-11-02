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
import chPlay from "../assets/chPlay.png";
import appStore from "../assets/appStore.png";
import banner2 from "../assets/banner2.png";
import { toast } from "react-toastify";

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

  const handleDownloadApp = () => {
    toast.warning(
      "Phiên bản đang trong thời gian nâng cấp, vui lòng quay lại sau."
    );
  };
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0f8ff] via-[#e2f3ff] to-[#f0f8ff] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-200 to-blue-200 dark:from-cyan-900/40 dark:to-blue-900/40 rounded-full blur-3xl opacity-40 animate-blob"></div>
          <div
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-cyan-200 to-blue-200 dark:from-cyan-900/40 dark:to-blue-900/40 rounded-full blur-3xl opacity-40 animate-blob"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full blur-3xl opacity-30 animate-blob"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full blur-3xl opacity-30 animate-blob"
            style={{ animationDelay: "6s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-cyan-300/20 to-transparent dark:from-cyan-500/10 dark:to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute inset-0 opacity-5 dark:opacity-10"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(110, 193, 228, 0.05) 25%, rgba(110, 193, 228, 0.05) 26%, transparent 27%, transparent 74%, rgba(110, 193, 228, 0.05) 75%, rgba(110, 193, 228, 0.05) 76%, transparent 77%, transparent),
                              linear-gradient(90deg, transparent 24%, rgba(110, 193, 228, 0.05) 25%, rgba(110, 193, 228, 0.05) 26%, transparent 27%, transparent 74%, rgba(110, 193, 228, 0.05) 75%, rgba(110, 193, 228, 0.05) 76%, transparent 77%, transparent)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center ">
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
                Ứng dụng cho thuê tài xế lái xe hộ hàng đầu Việt Nam.
              </p>
              <p className="text-3sm text-slate-600 dark:text-slate-400">
                Tìm kiếm tài xế chỉ trong vài giây, an toàn 24/7, giá cạnh
                tranh.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 -ml-6">
              <img
                src={chPlay}
                alt="Tải trên CH Play"
                className="h-24 sm:h-24 mb-2 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
              />
              <img
                src={appStore}
                alt="Tải trên App Store"
                className="h-16 sm:h-16 object-contain mt-4 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              />
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
          <div className="flex justify-center md:justify-end">
            <img
              src={banner2}
              alt="SmartDrive Banner"
              className="object-contain max-h-[600px]"
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
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
              onClick={handleDownloadApp}
              // href="https://apps.apple.com/vn/app/"
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
              onClick={handleDownloadApp}
              // href="https://play.google.com/store/apps"
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
