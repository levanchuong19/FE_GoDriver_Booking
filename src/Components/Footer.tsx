import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import facebook from "../assets/Facebook.svg.webp";
import zalo from "../assets/Zalo.svg.webp";
import tiktok from "../assets/tiktok.png";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--sd-line)] pt-16 pb-10 bg-[var(--sd-card)]">
      <div className="sd-wrap grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src="/landing/icon.png"
              className="w-9 h-9 rounded-[10px]"
              alt="SmartDrive"
            />
            <span className="font-bold text-[var(--sd-ink)]">SmartDrive</span>
          </div>
          <p className="mt-4 text-sm text-[var(--sd-mut)] max-w-[300px]">
            Gọi tài xế lái hộ, thuê xe tự lái, giao hàng và cứu hộ ô tô. Phát
            triển bởi SmartDriveApp.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=61582173127418"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <img src={facebook} alt="Facebook" className="w-8 h-8" />
            </a>
            <a
              href="https://zalo.me/0867845622"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zalo"
            >
              <img src={zalo} alt="Zalo" className="w-8 h-8" />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <img src={tiktok} alt="TikTok" className="w-8 h-8" />
            </a>
          </div>
        </div>

        <div>
          <div className="font-semibold text-sm text-[var(--sd-ink)]">
            Dịch vụ
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--sd-mut)]">
            <li>
              <a href="/#services">Lái hộ</a>
            </li>
            <li>
              <a href="/#services">Thuê xe tự lái</a>
            </li>
            <li>
              <a href="/#services">Giao hàng</a>
            </li>
            <li>
              <a href="/#services">Cứu hộ ô tô</a>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-sm text-[var(--sd-ink)]">
            Công ty
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--sd-mut)]">
            <li>
              <Link to="/register-partner">Tài xế đối tác</Link>
            </li>
            <li>
              <a href="/#faq">Hỏi đáp</a>
            </li>
            <li>
              <Link to="/login">Đăng nhập</Link>
            </li>
            <li>
              <Link to="/register">Đăng ký</Link>
            </li>
            <li>
              <a
                href="https://smartdrive.io.vn/"
                target="_blank"
                rel="noopener noreferrer"
              >
                smartdrive.io.vn
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-sm text-[var(--sd-ink)]">
            Pháp lý & liên hệ
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--sd-mut)]">
            <li>
              <Link to="/privacy-policy">Quyền riêng tư</Link>
            </li>
            <li>
              <Link to="/delete-account">Xóa tài khoản</Link>
            </li>
            <li className="flex gap-2 items-center">
              <Phone className="w-4 h-4" />
              0867845622
            </li>
            <li className="flex gap-2 items-center">
              <Mail className="w-4 h-4" />
              support@smartdrive.io.vn
            </li>
            <li className="flex gap-2 items-center">
              <MapPin className="w-4 h-4" />
              Việt Nam
            </li>
          </ul>
        </div>
      </div>

      <div className="sd-wrap mt-12 pt-6 border-t border-[var(--sd-line)] flex flex-wrap justify-between gap-4 text-xs text-[var(--sd-mut)]">
        <div>© {new Date().getFullYear()} SmartDrive. Tất cả quyền được bảo lưu.</div>
        <div>
          <Link to="/privacy-policy" className="underline mr-3">
            Privacy
          </Link>
          <Link to="/delete-account" className="underline">
            Xóa tài khoản
          </Link>
        </div>
      </div>
    </footer>
  );
}
