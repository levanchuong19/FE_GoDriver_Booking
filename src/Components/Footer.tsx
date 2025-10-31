import logo from "../assets/logo-no-br.png";
import facebook from "../assets/Facebook.svg.webp";
import zalo from "../assets/Zalo.svg.webp";
import tiktok from "../assets/tiktok.png";

export default function Footer() {
  return (
    // <footer className="bg-gray-900 text-white py-16">
    //   <div className="container mx-auto px-4">
    //     <div className="grid md:grid-cols-4 gap-8">
    //       <div>
    //         <div className="flex items-center space-x-2 mb-4">
    //           <Car className="h-8 w-8 text-blue-400" />
    //           <span className="text-2xl font-bold">DriveHire</span>
    //         </div>
    //         <p className="text-gray-400">
    //           Nền tảng thuê tài xế lái xe hộ hàng đầu Việt Nam
    //         </p>
    //       </div>
    //       <div>
    //         <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
    //         <ul className="space-y-2 text-gray-400">
    //           <li>
    //             <a href="#" className="hover:text-white">
    //               Lái xe theo giờ
    //             </a>
    //           </li>
    //           <li>
    //             <a href="#" className="hover:text-white">
    //               Lái xe đường dài
    //             </a>
    //           </li>
    //           <li>
    //             <a href="#" className="hover:text-white">
    //               Lái xe VIP
    //             </a>
    //           </li>
    //         </ul>
    //       </div>
    //       <div>
    //         <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
    //         <ul className="space-y-2 text-gray-400">
    //           <li>
    //             <a href="#" className="hover:text-white">
    //               Trung tâm trợ giúp
    //             </a>
    //           </li>
    //           <li>
    //             <a href="#" className="hover:text-white">
    //               Liên hệ
    //             </a>
    //           </li>
    //           <li>
    //             <a href="#" className="hover:text-white">
    //               Điều khoản
    //             </a>
    //           </li>
    //         </ul>
    //       </div>
    //       <div>
    //         <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
    //         <div className="space-y-2 text-gray-400">
    //           <div className="flex items-center">
    //             <Phone className="h-4 w-4 mr-2" />
    //             1900-1234
    //           </div>
    //           <div className="flex items-center">
    //             <Mail className="h-4 w-4 mr-2" />
    //             support@drivehire.vn
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
    //       <p>&copy; 2024 DriveHire. Tất cả quyền được bảo lưu.</p>
    //     </div>
    //   </div>
    // </footer>

    <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={logo}
                alt="SmartDrive"
                className="w-10 h-10 bg-gradient-to-r from-cyan-200 to-blue-100 rounded-full object-cover"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
                SmartDrive
              </span>
            </div>
            <p className="text-2sm text-slate-600 dark:text-slate-400">
              Tương lai của giao thông bắt đầu từ đây.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a
                href="https://www.facebook.com/profile.php?id=61582173127418"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={facebook}
                  alt="Facebook"
                  className="w-8 h-8 hover:scale-110 transition-transform duration-200"
                />
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={zalo}
                  alt="Zalo"
                  className="w-8 h-8 hover:scale-110 transition-transform duration-200"
                />
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={tiktok}
                  alt="Tiktok"
                  className="w-8 h-8 hover:scale-110 transition-transform duration-200"
                />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-xl">Sản phẩm</h4>
            <ul className="space-y-2 text-2sm text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
                >
                  Tính năng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
                >
                  Giá cả
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
                >
                  Bảo mật
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-xl">Công ty</h4>
            <ul className="space-y-2 text-2sm text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
                >
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-xl">Pháp lý</h4>
            <ul className="space-y-2 text-2sm text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
                >
                  Điều khoản
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
                >
                  Quyền riêng tư
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-3sm text-slate-600 dark:text-slate-400">
          <p>&copy; 2025 SmartDrive. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
