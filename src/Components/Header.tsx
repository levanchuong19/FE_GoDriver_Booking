import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, Headset, LogOut, Menu, X } from "lucide-react";
import { toast } from "react-toastify";

const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.anonymous.smartdrive";

const NAV = [
  { href: "/#services", label: "Dịch vụ" },
  { href: "/#pricing", label: "Bảng giá" },
  { href: "/#safety", label: "An toàn" },
  { href: "/register-partner", label: "Tài xế đối tác" },
  { href: "/#faq", label: "Hỏi đáp" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công!");
    setToken(null);
    navigate("/");
  };

  const goNav = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location.pathname !== "/") {
        navigate("/" + href.slice(1));
        return;
      }
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate(href);
  };

  return (
    <header
      id="top"
      className="fixed top-0 inset-x-0 z-50 transition-all"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(247,245,240,.82)",
        borderBottom: scrolled
          ? "1px solid var(--sd-line)"
          : "1px solid transparent",
      }}
    >
      <nav className="sd-wrap flex items-center justify-between h-[70px]">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/landing/icon.png"
            alt="SmartDrive"
            className="w-9 h-9 rounded-[10px]"
          />
          <span className="font-bold text-[17px] text-[var(--sd-ink)]">
            SmartDrive
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => (
            <button
              key={item.href}
              type="button"
              className="sd-nav-link"
              onClick={() => goNav(item.href)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="mailto:support@smartdrive.io.vn"
            className="hidden lg:flex items-center gap-2 text-sm font-medium text-[var(--sd-mut)]"
          >
            <Headset className="w-4 h-4" />
            Hỗ trợ 24/7
          </a>
          {token ? (
            <button
              type="button"
              onClick={handleLogout}
              className="sd-btn sd-btn-g !py-2.5 !px-4 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="sd-btn sd-btn-g !py-2.5 !px-4 text-sm"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="sd-btn sd-btn-g !py-2.5 !px-4 text-sm hidden xl:inline-flex"
              >
                Đăng ký
              </button>
            </>
          )}
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="sd-btn sd-btn-p !py-2.5 !px-4 text-sm"
          >
            <Download className="w-4 h-4" />
            Tải app
          </a>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg border border-[var(--sd-line)] bg-[var(--sd-card)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[var(--sd-line)] bg-[var(--sd-card)] px-6 py-4 space-y-3">
          {NAV.map((item) => (
            <button
              key={item.href}
              type="button"
              className="block w-full text-left sd-nav-link py-2"
              onClick={() => goNav(item.href)}
            >
              {item.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            {token ? (
              <button
                type="button"
                onClick={handleLogout}
                className="sd-btn sd-btn-g justify-center"
              >
                Đăng xuất
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="sd-btn sd-btn-g justify-center"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/register");
                  }}
                  className="sd-btn sd-btn-g justify-center"
                >
                  Đăng ký
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/register-partner");
              }}
              className="sd-btn sd-btn-p justify-center"
            >
              Đăng ký làm tài xế
            </button>
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="sd-btn sd-btn-g justify-center"
            >
              Tải app
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
