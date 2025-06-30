import { Car, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">DriveHire</span>
            </div>
            <p className="text-gray-400">
              Nền tảng thuê tài xế lái xe hộ hàng đầu Việt Nam
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Lái xe theo giờ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Lái xe đường dài
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Lái xe VIP
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Điều khoản
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                1900-1234
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                support@drivehire.vn
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 DriveHire. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
