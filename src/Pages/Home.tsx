import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Bike,
  Car,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Disc,
  Headset,
  Images,
  Info,
  Map,
  MapPin,
  MapPinned,
  MessageCircle,
  MessagesSquare,
  Navigation,
  Route,
  SearchCheck,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Smile,
  Star,
  Timer,
  Truck,
  UserPlus,
  Wallet,
  Zap,
} from "lucide-react";
import {
  formatCompactVnd,
  loadLandingPricing,
  type LandingPriceCard,
} from "../Utils/landingPricing";
import chPlayBadge from "../assets/badge-google-play.svg";
import appStoreBadge from "../assets/badge-app-store.svg";

const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.anonymous.smartdrive";

const A = "/landing";

const COVERAGE_MAP_EMBED =
  "https://www.google.com/maps?q=Việt+Nam&hl=vi&z=5&output=embed";

function Reveal({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={style}
      className={`sd-reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[var(--sd-line)]">
      <button
        type="button"
        className="py-5 flex justify-between items-center gap-4 font-semibold text-lg w-full text-left text-[var(--sd-ink)]"
        onClick={onToggle}
      >
        {q}
        <span
          className={`text-2xl leading-none transition-transform ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && <div className="pb-5 text-[var(--sd-mut)]">{a}</div>}
    </div>
  );
}

export default function HomePage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [faqOpen, setFaqOpen] = useState(0);
  const [priceCards, setPriceCards] = useState<LandingPriceCard[]>([]);
  const [fromPrice, setFromPrice] = useState(0);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [pricingError, setPricingError] = useState(false);
  const [rideVehicle, setRideVehicle] = useState("Xe máy");
  const [ridePickup, setRidePickup] = useState("");
  const [rideDropoff, setRideDropoff] = useState("");

  const rideVehicles = [
    { id: "Xe máy", icon: Bike },
    { id: "Ô tô 4 chỗ", icon: Car },
    { id: "Ô tô 6 chỗ", icon: Car },
    { id: "Xe điện 2 chỗ", icon: Zap },
    { id: "Xe điện 4 chỗ", icon: Zap },
    { id: "Xe điện 6 chỗ", icon: Zap },
  ] as const;

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setPricingLoading(true);
      setPricingError(false);
      try {
        const data = await loadLandingPricing();
        if (ignore) return;
        setPriceCards(data.cards);
        setFromPrice(data.fromPrice);
        setPricingError(data.cards.length === 0);
      } catch {
        if (!ignore) {
          setPriceCards([]);
          setFromPrice(0);
          setPricingError(true);
        }
      } finally {
        if (!ignore) setPricingLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const scrollTrack = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <main className="sd-landing min-h-screen overflow-x-clip">
      {/* HERO */}
      <section
        id="hero"
        className="relative pt-[110px] pb-20 overflow-x-clip overflow-y-visible"
      >
        <div className="sd-wrap grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border border-[var(--sd-line)] bg-[var(--sd-card)]">
              <span className="w-2 h-2 rounded-full bg-[var(--sd-green)]" />
              Hệ sinh thái di chuyển thông minh
            </div>
            <h1
              className="mt-6 font-bold tracking-[-.03em] leading-[1.05] text-[var(--sd-ink)]"
              style={{ fontSize: "clamp(40px,5.4vw,72px)" }}
            >
              Một ứng dụng{" "}
              <span className="font-serif-display italic font-medium text-[var(--sd-navy)]">
                Muôn hành trình.
              </span>
            </h1>
            <p className="mt-6 text-lg text-[var(--sd-mut)] max-w-[560px] leading-relaxed">
              <span className="font-semibold text-[var(--sd-ink)]">
                HỆ SINH THÁI DI CHUYỂN THÔNG MINH
              </span>{" "}
              tích hợp Đặt xe, thuê tài xế lái hộ, xe ghép, thuê xe tự lái, giao
              hàng, cứu hộ, tìm bãi đậu xe và mua bán xe cũ. Tất cả trong một
              ứng dụng.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={PLAY_STORE}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tải trên Google Play"
                className="sd-store-badge"
              >
                <img src={chPlayBadge} alt="Tải trên Google Play" />
              </a>
              <a
                href="#download"
                aria-label="Tải trên App Store"
                className="sd-store-badge"
              >
                <img src={appStoreBadge} alt="Tải trên App Store" />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[var(--sd-mut)]">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-[var(--sd-green)]" />
                Tài xế xác minh
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--sd-green)]" />
                Theo dõi realtime
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[var(--sd-green)]" />
                Thanh toán Online
              </div>
            </div>
          </div>

          <div className="relative min-h-[560px] md:min-h-[640px] pb-8">
            <div className="sd-photo sd-photo-portrait absolute right-0 top-6 w-[86%] h-[72%] shadow-xl">
              <img
                src={`${A}/render/hero.webp`}
                alt="Tài xế SmartDrive mở cửa xe đón khách"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg,rgba(13,25,45,0),rgba(13,25,45,.25))",
                }}
              />
            </div>
            <div className="absolute left-[2%] top-2 w-[190px] md:w-[220px] sd-phone rotate-[-5deg] z-10">
              <img
                src={`${A}/promo/hero-app.jpg`}
                alt="SmartDrive — một app cho mọi hành trình"
              />
            </div>
            <div className="absolute right-[4%] bottom-2 w-[130px] md:w-[150px] sd-phone rotate-[4deg] hidden sm:block z-10">
              <img src={`${A}/shot2.png`} alt="Màn hình thuê xe tự lái" />
            </div>
            <div className="absolute left-[42%] bottom-[8%] sd-card px-4 py-3 flex items-center gap-3 shadow-lg z-20">
              <div className="sd-ico sd-ico-g !w-9 !h-9">
                <img src={`${A}/render/ic-track.webp`} alt="" />
              </div>
              <div>
                <div className="text-xs text-[var(--sd-mut)]">
                  Tài xế đang đến
                </div>
                <div className="font-semibold text-sm">Còn 4 phút · 1,2 km</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-[var(--sd-line)] bg-[var(--sd-card)] py-6 overflow-hidden">
        <div className="sd-wrap grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          {[
            { icon: Route, value: "5K+", label: "chuyến mỗi ngày*" },
            { icon: Smile, value: "98%", label: "khách hàng hài lòng*" },
            { icon: Timer, value: "2–5 phút", label: "tài xế đến nơi*" },
            { icon: Headset, value: "24/7", label: "Chatbot AI & tổng đài" },
          ].map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <Icon className="w-5 h-5 text-[var(--sd-navy)]" />
              <div>
                <div className="font-bold text-xl">{value}</div>
                <div className="text-xs text-[var(--sd-mut)]">{label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 overflow-hidden">
          <div className="sd-marq text-sm font-semibold text-[#9aa2ae] uppercase tracking-[.12em]">
            {[
              "Lái hộ theo km",
              "Theo giờ",
              "Theo ngày",
              "Đi tỉnh",
              "Thuê xe tự lái",
              "Giao hàng xe van",
              "Giao hàng xe máy",
              "Cứu hộ ô tô",
            ]
              .concat([
                "Lái hộ theo km",
                "Theo giờ",
                "Theo ngày",
                "Đi tỉnh",
                "Thuê xe tự lái",
                "Giao hàng xe van",
                "Giao hàng xe máy",
                "Cứu hộ ô tô",
              ])
              .map((t, i) => (
                <span key={`${t}-${i}`}>{t}</span>
              ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24">
        <div className="sd-wrap">
          <Reveal className="max-w-[640px]">
            <div className="sd-eyebrow">Dịch vụ</div>
            <h2 className="sd-h2 mt-3">
              Một ứng dụng cho mọi nhu cầu di chuyển
            </h2>
            <p className="mt-4 text-[var(--sd-mut)] text-lg">
              Từ thuê tài xế đưa bạn về nhà an toàn đến thuê xe cuối tuần hay
              giao hàng nội thành.
            </p>
          </Reveal>

          {/* ĐẶT XE — panel giới thiệu (landing v5); đặt chuyến trên app */}
          <div id="ride" className="mt-14 scroll-mt-24">
            <div className="sd-ride-panel p-6 md:p-10 lg:p-12">
              <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-9 items-center relative z-10">
                <Reveal>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-2 bg-white/15 border border-white/20">
                    <Navigation className="w-4 h-4" /> SMARTDRIVE ĐẶT XE
                  </span>
                  <h3
                    className="mt-6 font-bold tracking-tight leading-tight"
                    style={{ fontSize: "clamp(29px,3.7vw,49px)" }}
                  >
                    Đi đâu cũng tiện.
                    <br />
                    <span className="font-serif-display italic text-[#cce5ff]">
                      Có SmartDrive.
                    </span>
                  </h3>
                  <p className="mt-5 text-white/80 text-base leading-relaxed max-w-[430px]">
                    Tương tự trải nghiệm gọi xe quen thuộc: chọn điểm đón, điểm
                    đến và loại xe. Xem thông tin chuyến đi, giá và xác nhận
                    trực tiếp trong ứng dụng.
                  </p>
                  <div className="mt-7 grid grid-cols-2 gap-3 text-sm text-white/90">
                    {[
                      "Xe máy & ô tô",
                      "Xe điện đa dạng",
                      "Chọn điểm đón/trả",
                      "Theo dõi hành trình",
                    ].map((t) => (
                      <div key={t} className="flex gap-2 items-center">
                        <CheckCircle2 className="w-4 h-4 text-[#a8e5bc] shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                  <a
                    className="sd-btn mt-9 bg-white !text-[var(--sd-navy)] hover:-translate-y-0.5"
                    href="#download"
                  >
                    <Smartphone className="w-4 h-4" />
                    Đặt xe trên ứng dụng
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Reveal>
                <Reveal className="rounded-[25px] bg-white text-[var(--sd-ink)] shadow-2xl p-4 sm:p-5">
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <div className="text-xs font-semibold text-[var(--sd-green)] uppercase tracking-wider">
                        Trải nghiệm dịch vụ
                      </div>
                      <h4 className="font-bold text-xl mt-1">
                        Bạn muốn đi đâu?
                      </h4>
                    </div>
                    <div className="rounded-xl p-3 bg-[#edf4ff] text-[var(--sd-navy)]">
                      <Route className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
                    <label className="sd-ride-field">
                      <span className="sd-ride-dot" />
                      <input
                        aria-label="Điểm đón"
                        placeholder="Nhập điểm đón"
                        autoComplete="street-address"
                        value={ridePickup}
                        onChange={(e) => setRidePickup(e.target.value)}
                      />
                    </label>
                    <label className="sd-ride-field">
                      <span className="sd-ride-dot end" />
                      <input
                        aria-label="Điểm đến"
                        placeholder="Nhập điểm đến"
                        value={rideDropoff}
                        onChange={(e) => setRideDropoff(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-between mt-5 mb-3 gap-2">
                    <span className="text-sm font-bold">Chọn phương tiện</span>
                    <span className="text-xs text-[var(--sd-mut)]">
                      6 lựa chọn
                    </span>
                  </div>
                  <div
                    className="grid grid-cols-3 sm:grid-cols-6 gap-2"
                    role="group"
                    aria-label="Loại phương tiện"
                  >
                    {rideVehicles.map(({ id, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        className={`sd-ride-vehicle${rideVehicle === id ? " is-active" : ""}`}
                        aria-pressed={rideVehicle === id}
                        onClick={() => setRideVehicle(id)}
                      >
                        <Icon className="w-[26px] h-[26px]" />
                        <span>{id.replace("Xe điện ", "Điện ")}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2 text-sm bg-[#f3f7fc] rounded-xl p-3">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--sd-green)]" />
                      Đã chọn: <strong>{rideVehicle}</strong>
                    </span>
                    <span className="text-xs text-[var(--sd-mut)]">
                      Giá xem trong app
                    </span>
                  </div>
                  <a
                    href="#download"
                    className="sd-btn sd-btn-p w-full justify-center mt-4"
                  >
                    Tiếp tục trên SmartDrive
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <p
                    role="status"
                    className="text-center text-xs text-[var(--sd-mut)] mt-3"
                  >
                    Đây là giao diện giới thiệu. Đặt chuyến và báo giá được thực
                    hiện trong app.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
          <div className="mt-7 grid md:grid-cols-2 gap-5">
            <Reveal className="sd-ride-service-card flex gap-4 items-start">
              <div className="sd-ico shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Tùy chọn phù hợp từng hành trình</h4>
                <p className="text-sm text-[var(--sd-mut)] mt-1">
                  Đi một mình, đi gia đình hoặc ưu tiên phương tiện điện — lựa
                  chọn nhanh trong một ứng dụng.
                </p>
              </div>
            </Reveal>
            <Reveal className="sd-ride-service-card flex gap-4 items-start">
              <div className="sd-ico sd-ico-g shrink-0">
                <MapPinned className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Quản lý hành trình trong app</h4>
                <p className="text-sm text-[var(--sd-mut)] mt-1">
                  Xem thông tin tài xế, theo dõi chuyến đi và nhận cập nhật
                  trạng thái ngay trên điện thoại.
                </p>
              </div>
            </Reveal>
          </div>
          {/* <Reveal className="mt-8 overflow-hidden rounded-[24px] border border-[#e6e1d7]">
            <img
              src={`${A}/promo/ride.jpg`}
              alt="SmartDrive Đặt xe nhanh chóng — xe máy, ô tô, xe điện"
              className="w-full h-auto object-cover max-h-[520px]"
            />
          </Reveal> */}

          <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
            <Reveal className="sd-feat-visual">
              <div className="sd-photo sd-photo-portrait absolute inset-0 w-[78%] h-[88%]">
                <img src={`${A}/render/laiho.webp`} alt="Tài xế cầm lái" />
              </div>
              <div className="absolute right-0 bottom-0 w-[200px] md:w-[220px] sd-phone z-10">
                <img src={`${A}/shot1.png`} alt="Thuê tài xế lái hộ" />
              </div>
            </Reveal>
            <Reveal>
              <div className="sd-ico">
                <img src={`${A}/render/ic-laiho.webp`} alt="" />
              </div>
              <h3 className="text-3xl font-bold mt-5 tracking-tight">
                Thuê tài xế lái hộ
              </h3>
              <p className="mt-4 text-[var(--sd-mut)] text-lg leading-relaxed">
                Tài xế chuyên nghiệp lái chính xe của bạn — sau buổi tiệc, đưa
                đón công việc hay những chuyến đi dài. Đặt trước dễ dàng, phục
                vụ tận tâm.
              </p>
              <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-[15px]">
                {["Theo km", "Theo giờ", "Theo ngày", "Đi liên tỉnh"].map(
                  (item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="w-5 h-5 text-[var(--sd-green)] shrink-0" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-6 text-sm text-[var(--sd-mut)]">
                Giá từ{" "}
                <b className="text-[var(--sd-ink)] text-base">
                  {pricingLoading
                    ? "…"
                    : fromPrice > 0
                      ? `${formatCompactVnd(fromPrice)}/km`
                      : "theo app"}
                </b>
              </div>
            </Reveal>
          </div>

          <div className="mt-28 grid lg:grid-cols-2 gap-12 items-center">
            <Reveal className="lg:order-2 sd-feat-visual">
              <div className="sd-photo absolute inset-0 left-[18%] w-[82%] h-[88%]">
                <img src={`${A}/render/selfdrive.webp`} alt="Chìa khóa xe" />
              </div>
              <div className="absolute left-0 bottom-0 w-[190px] md:w-[210px] sd-phone z-10">
                <img src={`${A}/shot4.png`} alt="Thuê xe tự lái du lịch" />
              </div>
              <div className="absolute left-[48%] top-4 w-[140px] md:w-[150px] sd-phone hidden sm:block z-10">
                <img src={`${A}/shot2.png`} alt="Thuê xe tự lái đô thị" />
              </div>
            </Reveal>
            <Reveal className="lg:order-1">
              <div className="sd-ico">
                <img src={`${A}/render/ic-selfdrive.webp`} alt="" />
              </div>
              <h3 className="text-3xl font-bold mt-5 tracking-tight">
                Thuê xe tự lái
              </h3>
              <p className="mt-4 text-[var(--sd-mut)] text-lg leading-relaxed">
                Xe đô thị nhỏ gọn cho ngày bận rộn, xe 7 chỗ rộng rãi cho chuyến
                du lịch gia đình. Chủ động hành trình theo cách của bạn.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="sd-card p-4">
                  <div className="text-sm text-[var(--sd-mut)]">Xe đô thị</div>
                  <div className="font-semibold mt-1">Ưu đãi đến 20%</div>
                </div>
                <div className="sd-card p-4">
                  <div className="text-sm text-[var(--sd-mut)]">Xe du lịch</div>
                  <div className="font-semibold mt-1">Ưu đãi đến 20%</div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-28 grid lg:grid-cols-2 gap-12 items-center">
            <Reveal className="sd-feat-visual">
              <div className="sd-photo absolute inset-0 w-[78%] h-[88%]">
                <img src={`${A}/render/delivery.webp`} alt="Đường phố" />
              </div>
              <div className="absolute right-[16%] bottom-0 w-[170px] md:w-[190px] sd-phone z-10">
                <img src={`${A}/shot3.png`} alt="Giao hàng xe van" />
              </div>
              <div className="absolute right-0 top-6 w-[140px] md:w-[150px] sd-phone hidden sm:block z-10">
                <img src={`${A}/shot5.png`} alt="Giao hàng xe máy" />
              </div>
            </Reveal>
            <Reveal>
              <div className="sd-ico sd-ico-g">
                <img src={`${A}/render/ic-delivery.webp`} alt="" />
              </div>
              <h3 className="text-3xl font-bold mt-5 tracking-tight">
                Giao hàng xe máy & xe van
              </h3>
              <p className="mt-4 text-[var(--sd-mut)] text-lg leading-relaxed">
                Tài liệu, hàng nhỏ giao bằng xe máy; hàng cồng kềnh dùng xe van.
                Theo dõi đơn trên bản đồ, nhận thông báo từng bước.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="sd-tag !bg-[#e6f2e6] !text-[#2d7a39]">
                  Ưu đãi 15%
                </span>
                <span className="sd-tag !bg-[#e8eef8] !text-[var(--sd-navy)]">
                  Theo dõi realtime
                </span>
              </div>
            </Reveal>
          </div>

          <div className="mt-28 grid lg:grid-cols-2 gap-12 items-center">
            <Reveal className="lg:order-2 relative min-h-[420px] overflow-visible">
              <div className="sd-photo absolute inset-0">
                <img src={`${A}/render/rescue.webp`} alt="Xe cứu hộ" />
              </div>
              <div className="absolute left-5 bottom-5 sd-card px-4 py-3 flex items-center gap-3">
                <div className="sd-ico !w-9 !h-9">
                  <img src={`${A}/render/ic-rescue.webp`} alt="" />
                </div>
                <div>
                  <div className="text-xs text-[var(--sd-mut)]">
                    Yêu cầu cứu hộ
                  </div>
                  <div className="font-semibold text-sm">
                    Đã tiếp nhận · đang điều phối
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal className="lg:order-1">
              <div className="sd-ico">
                <img src={`${A}/render/ic-rescue.webp`} alt="" />
              </div>
              <h3 className="text-3xl font-bold mt-5 tracking-tight">
                Cứu hộ ô tô
              </h3>
              <p className="mt-4 text-[var(--sd-mut)] text-lg leading-relaxed">
                Xe chết máy, thủng lốp hay cần kéo xe — gửi vị trí và tình
                trạng, đội cứu hộ gần nhất sẽ liên hệ ngay.
              </p>
              <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
                <div className="sd-card p-3 flex items-center gap-2">
                  <BatteryCharging className="w-4 h-4" />
                  Kích bình
                </div>
                <div className="sd-card p-3 flex items-center gap-2">
                  <Disc className="w-4 h-4" />
                  Thay lốp
                </div>
                <div className="sd-card p-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Kéo xe
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TÌM BÃI ĐẬU XE + CHỢ XE CŨ (landing v6 feature layout) */}
      <section className="py-24">
        <div className="sd-wrap">
          <div
            id="parking"
            className="grid lg:grid-cols-2 gap-12 items-center scroll-mt-24"
          >
            <Reveal className="sd-feat-visual !min-h-[380px] sm:!min-h-[420px]">
              <div className="sd-photo absolute inset-0 w-[82%] h-[86%] shadow-sm">
                <img
                  src={`${A}/render/parking.webp`}
                  alt="Khu vực bãi đậu xe, biển chỉ dẫn P và lối vào bãi đỗ"
                  loading="lazy"
                />
              </div>
              <div className="absolute right-0 top-6 bg-[var(--sd-card)] rounded-[18px] border border-[var(--sd-line)] shadow-xl px-4 py-3 flex gap-3 items-center z-10">
                <div className="sd-ico sd-ico-g !w-10 !h-10">
                  <MapPinned className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[var(--sd-mut)]">
                    Tìm quanh khu vực
                  </div>
                  <div className="font-semibold text-sm">Bãi đỗ gần bạn</div>
                </div>
              </div>
              <div className="absolute right-0 bottom-8 sd-card px-4 py-3 flex gap-3 items-center shadow-lg z-10">
                <div className="sd-ico !w-10 !h-10">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[var(--sd-mut)]">
                    Tra cứu trên ứng dụng
                  </div>
                  <div className="font-semibold text-sm">
                    Xem vị trí & chỉ đường
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="sd-ico">
                <img src={`${A}/render/ic-parking.webp`} alt="" />
              </div>
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <span className="sd-eyebrow">Tiện ích tìm bãi đỗ xe</span>
                <span className="sd-ride-status">
                  <CheckCircle2 className="w-[15px] h-[15px]" />
                  Đã sẵn sàng
                </span>
              </div>
              <h3 className="text-3xl font-bold mt-3 tracking-tight">
                Tìm bãi đậu xe
              </h3>
              <p className="mt-4 text-[var(--sd-mut)] text-lg leading-relaxed">
                Không còn phải mất thời gian vòng quanh tìm chỗ đỗ. Khám phá các
                bãi đậu xe gần vị trí của bạn, xem thông tin địa điểm và lựa
                chọn đường đi phù hợp ngay trong SmartDrive.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3 text-[15px]">
                <div className="flex gap-2 items-center">
                  <MapPin className="w-4 h-4 text-[var(--sd-green)] shrink-0" />
                  Tìm bãi đỗ gần bạn
                </div>
                <div className="flex gap-2 items-center">
                  <Map className="w-4 h-4 text-[var(--sd-green)] shrink-0" />
                  Xem trên bản đồ
                </div>
                <div className="flex gap-2 items-center">
                  <Info className="w-4 h-4 text-[var(--sd-green)] shrink-0" />
                  Thông tin bãi xe
                </div>
                <div className="flex gap-2 items-center">
                  <Navigation className="w-4 h-4 text-[var(--sd-green)] shrink-0" />
                  Chỉ đường thuận tiện
                </div>
              </div>
              <a href="#download" className="sd-btn sd-btn-p mt-8">
                <Smartphone className="w-4 h-4" />
                Khám phá bãi đậu xe
                <ArrowRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>

          <div
            id="used-cars"
            className="mt-28 grid lg:grid-cols-2 gap-12 items-center scroll-mt-24"
          >
            <Reveal className="lg:order-2 sd-feat-visual !min-h-[380px] sm:!min-h-[420px]">
              <div className="sd-photo absolute inset-0 left-[12%] w-[88%] h-[86%] shadow-sm">
                <img
                  src={`${A}/render/usedcar.webp`}
                  alt="Nhiều mẫu ô tô đã qua sử dụng trưng bày tại khu vực bán xe"
                  loading="lazy"
                />
              </div>
              <div className="absolute left-0 top-6 sd-card px-4 py-3 flex gap-3 items-center shadow-lg z-10">
                <div className="sd-ico sd-ico-g !w-10 !h-10">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[var(--sd-mut)]">
                    Khám phá tin đăng
                  </div>
                  <div className="font-semibold text-sm">Ô tô & xe máy cũ</div>
                </div>
              </div>
              <div className="absolute left-0 bottom-8 sd-card px-4 py-3 flex gap-3 items-center shadow-xl z-10">
                <div className="sd-ico !w-10 !h-10">
                  <SearchCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[var(--sd-mut)]">
                    Tìm theo nhu cầu
                  </div>
                  <div className="font-semibold text-sm">
                    Xem xe · liên hệ người bán
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal className="lg:order-1">
              <div className="sd-ico sd-ico-g">
                <img src={`${A}/render/ic-usedcar.webp`} alt="" />
              </div>
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <span className="sd-eyebrow">Mua bán phương tiện</span>
                <span className="sd-ride-status">
                  <CheckCircle2 className="w-[15px] h-[15px]" />
                  Đã sẵn sàng
                </span>
              </div>
              <h3 className="text-3xl font-bold mt-3 tracking-tight">
                Chợ xe cũ SmartDrive
              </h3>
              <p className="mt-4 text-[var(--sd-mut)] text-lg leading-relaxed">
                Một nơi để khám phá, đăng bán và tìm mua xe đã qua sử dụng. Dễ
                dàng xem hình ảnh, thông tin xe, so sánh các tin đăng và kết nối
                với người bán ngay trên ứng dụng.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3 text-[15px]">
                <div className="flex gap-2 items-center">
                  <Car className="w-4 h-4 text-[var(--sd-green)] shrink-0" />Ô
                  tô & xe máy đã qua sử dụng
                </div>
                <div className="flex gap-2 items-center">
                  <SlidersHorizontal className="w-4 h-4 text-[var(--sd-green)] shrink-0" />
                  Lọc xe theo nhu cầu
                </div>
                <div className="flex gap-2 items-center">
                  <Images className="w-4 h-4 text-[var(--sd-green)] shrink-0" />
                  Xem hình ảnh & thông tin
                </div>
                <div className="flex gap-2 items-center">
                  <MessagesSquare className="w-4 h-4 text-[var(--sd-green)] shrink-0" />
                  Liên hệ người bán
                </div>
              </div>
              <a href="#download" className="sd-btn sd-btn-p mt-8">
                <Smartphone className="w-4 h-4" />
                Khám phá chợ xe cũ
                <ArrowRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="py-24 bg-[var(--sd-sand)]">
        <div className="sd-wrap">
          <Reveal className="text-center max-w-[600px] mx-auto">
            <div className="sd-eyebrow">Cách hoạt động</div>
            <h2 className="sd-h2 mt-3">Bốn bước, vài phút</h2>
          </Reveal>
          <div className="mt-14 grid md:grid-cols-4 gap-5">
            {[
              {
                ic: "ic-book.webp",
                n: "01",
                t: "Mở ứng dụng",
                d: "Đăng nhập, cho phép định vị.",
              },
              {
                ic: "ic-chat.webp",
                n: "02",
                t: "Chọn dịch vụ",
                d: "Theo km, giờ, ngày hay đi tỉnh.",
              },
              {
                ic: "ic-safety.webp",
                n: "03",
                t: "Tài xế đến ngay",
                d: "Thường trong 2–5 phút, xem hồ sơ trước.",
              },
              {
                ic: "ic-pay.webp",
                n: "04",
                t: "Thư thái tận hưởng",
                d: "Thanh toán PayOS, đánh giá chuyến đi.",
                g: true,
              },
            ].map((s) => (
              <Reveal key={s.n} className="sd-card p-6">
                <div className="flex justify-between items-start">
                  <div className={`sd-ico ${s.g ? "sd-ico-g" : ""}`}>
                    <img src={`${A}/render/${s.ic}`} alt="" />
                  </div>
                  <span className="font-serif-display text-3xl text-[#c8c2b3]">
                    {s.n}
                  </span>
                </div>
                <h4 className="font-semibold mt-5">{s.t}</h4>
                <p className="text-sm text-[var(--sd-mut)] mt-2">{s.d}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="sd-btn sd-btn-p">
              Tạo tài khoản
            </Link>
            <Link to="/login" className="sd-btn sd-btn-g">
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <div className="sd-wrap">
          <Reveal className="flex flex-wrap justify-between items-end gap-6">
            <div className="max-w-[560px]">
              <div className="sd-eyebrow">Bảng giá</div>
              <h2 className="sd-h2 mt-3">Minh bạch trước khi đặt</h2>
              <p className="mt-4 text-[var(--sd-mut)]">
                Giá lấy từ hệ thống SmartDrive đang áp dụng. Giá cuối cùng vẫn
                hiển thị trong app trước khi xác nhận.
              </p>
            </div>
            <span className="sd-tag">
              <Info className="w-3.5 h-3.5" />
              Giá tham khảo
            </span>
          </Reveal>

          {pricingLoading ? (
            <div className="mt-12 grid md:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="sd-card p-7 h-[220px] animate-pulse bg-[var(--sd-sand)]/60"
                />
              ))}
            </div>
          ) : pricingError || priceCards.length === 0 ? (
            <div className="mt-12 sd-card p-8 text-center">
              <p className="text-[var(--sd-mut)]">
                Tạm thời chưa lấy được bảng giá từ API. Vui lòng thử lại hoặc
                xem giá trực tiếp trên ứng dụng.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a
                  href={PLAY_STORE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sd-btn sd-btn-p"
                >
                  Xem trên app
                </a>
                <a href="#download" className="sd-btn sd-btn-g">
                  Tải SmartDrive
                </a>
              </div>
            </div>
          ) : (
            <div
              className={`mt-12 grid gap-5 ${
                priceCards.length === 1
                  ? "md:grid-cols-1 max-w-md mx-auto"
                  : priceCards.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-3"
              }`}
            >
              {priceCards.map((card) => (
                <Reveal
                  key={card.id}
                  className={`sd-card p-7 relative ${
                    card.popular ? "border-[var(--sd-navy)]" : ""
                  }`}
                  style={
                    card.popular
                      ? { boxShadow: "0 20px 40px -24px rgba(13,59,140,.45)" }
                      : undefined
                  }
                >
                  {card.popular && (
                    <span className="absolute -top-3 left-7 text-xs font-semibold px-3 py-1 rounded-full bg-[var(--sd-navy)] text-white">
                      Phổ biến
                    </span>
                  )}
                  <div className="text-sm font-semibold text-[var(--sd-mut)]">
                    {card.title}
                  </div>
                  <div className="mt-3">
                    <span className="text-4xl font-bold">
                      {formatCompactVnd(
                        (card.rateAmount ?? 0) > 0
                          ? card.rateAmount
                          : card.amount,
                      )}
                    </span>
                    {card.rateUnit || card.unit ? (
                      <span className="text-[var(--sd-mut)]">
                        {card.rateUnit || card.unit}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-[var(--sd-mut)] mt-2">
                    {card.description}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm">
                    {(card.baseFare ?? 0) > 0 && (
                      <li className="flex gap-2">
                        <Check className="w-4 h-4 text-[var(--sd-green)] shrink-0 mt-0.5" />
                        <span>
                          Giá mở cửa{" "}
                          <strong className="font-semibold text-[var(--sd-ink)]">
                            {formatCompactVnd(card.baseFare)}
                          </strong>
                        </span>
                      </li>
                    )}
                    {(card.rateAmount ?? 0) > 0 && (
                      <li className="flex gap-2">
                        <Check className="w-4 h-4 text-[var(--sd-green)] shrink-0 mt-0.5" />
                        <span>
                          Giá tính{" "}
                          <strong className="font-semibold text-[var(--sd-ink)]">
                            {formatCompactVnd(card.rateAmount)}
                            {card.rateUnit || card.unit}
                          </strong>
                        </span>
                      </li>
                    )}
                    {(card.waitingFeePerMin ?? 0) > 0 && (
                      <li className="flex gap-2">
                        <Check className="w-4 h-4 text-[var(--sd-green)] shrink-0 mt-0.5" />
                        <span>
                          Giá chờ{" "}
                          <strong className="font-semibold text-[var(--sd-ink)]">
                            {formatCompactVnd(card.waitingFeePerMin)}/phút
                          </strong>
                        </span>
                      </li>
                    )}
                    {(card.baseFare ?? 0) <= 0 &&
                      (card.rateAmount ?? 0) <= 0 &&
                      (card.waitingFeePerMin ?? 0) <= 0 &&
                      (card.bullets ?? []).map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <Check className="w-4 h-4 text-[var(--sd-green)] shrink-0" />
                          {bullet}
                        </li>
                      ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SAFETY */}
      <section
        id="safety"
        className="py-24 bg-[#12213b] text-white relative overflow-x-clip overflow-y-visible"
      >
        <div className="sd-wrap grid lg:grid-cols-2 gap-14 items-center">
          <Reveal className="sd-photo sd-photo-portrait h-[460px] md:h-[520px]">
            <img src={`${A}/render/safety.webp`} alt="Tay lái" />
            <div
              className="absolute inset-x-4 bottom-4 rounded-2xl p-4 flex items-center gap-4"
              style={{
                background: "rgba(255,255,255,.94)",
                color: "var(--sd-ink)",
              }}
            >
              <img
                src={`${A}/icon.png`}
                className="w-11 h-11 rounded-xl"
                alt=""
              />
              <div className="flex-1">
                <div className="font-semibold">
                  Nguyễn Văn A{" "}
                  <span className="text-xs font-normal text-[var(--sd-mut)]">
                    · hồ sơ mẫu
                  </span>
                </div>
                <div className="text-xs text-[var(--sd-mut)]">
                  Bằng B2 · 8 năm kinh nghiệm · 4,9 ★
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-[var(--sd-green)]" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <div className="sd-eyebrow !text-[#8fd19a]">
                An toàn & bảo mật
              </div>
              <h2 className="sd-h2 mt-3">
                Bạn biết rõ ai đang cầm lái xe của mình
              </h2>
            </Reveal>
            <div className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {[
                [
                  "ic-safety.webp",
                  "Tài xế xác minh",
                  "Hồ sơ minh bạch: bằng lái, kinh nghiệm, đánh giá.",
                ],
                [
                  "ic-track.webp",
                  "Theo dõi realtime",
                  "Xem vị trí trên bản đồ và nhắn tin trực tiếp với tài xế.",
                ],
                [
                  "ic-insure.webp",
                  "Bảo hiểm chuyến đi",
                  "Quyền lợi bảo hiểm trong suốt hành trình (theo chính sách).",
                ],
                [
                  "ic-lock.webp",
                  "Bảo mật dữ liệu",
                  "Không lưu vị trí lâu dài, không chia sẻ cho bên thứ ba.",
                ],
                [
                  "ic-bell.webp",
                  "Thông báo từng bước",
                  "Khi tài xế đến, bắt đầu và kết thúc chuyến.",
                ],
                [
                  "ic-chat.webp",
                  "Chatbot AI 24/7",
                  "Giải đáp tức thì, chuyển tổng đài viên khi cần.",
                ],
              ].map(([ic, t, d]) => (
                <Reveal key={t}>
                  <img
                    src={`${A}/render/${ic}`}
                    alt=""
                    className="w-12 h-12 rounded-xl"
                  />
                  <h4 className="font-semibold mt-3">{t}</h4>
                  <p className="text-sm text-white/65 mt-1.5">{d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER */}
      <section id="partner" className="py-24">
        <div className="sd-wrap">
          <div className="sd-card overflow-hidden grid lg:grid-cols-2">
            <Reveal className="p-8 md:p-14">
              <div className="sd-eyebrow">Trở thành đối tác</div>
              <h2 className="sd-h2 mt-3">
                Lái xe giỏi? Kiếm thêm thu nhập cùng SmartDrive
              </h2>
              <p className="mt-4 text-[var(--sd-mut)] text-lg">
                Chủ động thời gian, nhận chuyến gần bạn, thu nhập minh bạch hằng
                tuần.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  [
                    "ic-calendar.webp",
                    "Giờ giấc linh hoạt",
                    "Chủ động nhận chuyến theo lịch của bạn.",
                  ],
                  [
                    "ic-income.webp",
                    "Thanh toán nhanh qua PayOS",
                    "Lịch sử giao dịch rõ ràng.",
                  ],
                  [
                    "ic-lock.webp",
                    "Đào tạo & hỗ trợ",
                    "Yêu cầu: bằng B2 trở lên, 2+ năm kinh nghiệm.",
                  ],
                ].map(([ic, t, d]) => (
                  <div key={t} className="flex gap-4">
                    <div className="sd-ico sd-ico-g shrink-0">
                      <img src={`${A}/render/${ic}`} alt="" />
                    </div>
                    <div>
                      <div className="font-semibold">{t}</div>
                      <div className="text-sm text-[var(--sd-mut)]">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-[var(--sd-mut)]">
                Hồ sơ đăng ký nộp trên web — không cần tải app trước.
              </p>
              <Link to="/register-partner" className="sd-btn sd-btn-p mt-4">
                <UserPlus className="w-4 h-4" />
                Đăng ký làm tài xế
              </Link>
            </Reveal>
            <div className="sd-photo !rounded-none min-h-[380px]">
              <img src={`${A}/render/partner.webp`} alt="Đường phố mưa" />
            </div>
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section id="coverage" className="py-24 bg-[var(--sd-sand)]">
        <div className="sd-wrap grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <Reveal>
            <div className="sd-eyebrow">Khu vực phục vụ</div>
            <h2 className="sd-h2 mt-3">Đang có mặt tại các thành phố lớn</h2>
            <p className="mt-4 text-[var(--sd-mut)]">
              Và hỗ trợ tài xế đi tỉnh trên toàn quốc.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                ["Hà Nội", "Đang hoạt động", true],
                ["TP. Hồ Chí Minh", "Đang hoạt động", true],
                ["Thanh Hóa · Nghệ An · Hà Tĩnh", "Đang hoạt động", true],
                ["Đà Nẵng", "Đang hoạt động", true],
              ].map(([city, st, active]) => (
                <div
                  key={String(city)}
                  className="sd-card p-4 flex items-center gap-3"
                >
                  <MapPin
                    className={`w-4 h-4 ${
                      active ? "text-[var(--sd-green)]" : "text-[#b9b2a2]"
                    }`}
                  />
                  <div>
                    <div className="font-semibold">{city}</div>
                    <div className="text-xs text-[var(--sd-mut)]">{st}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="sd-photo relative h-[520px] bg-[#dce8f5]">
            <iframe
              title="Bản đồ khu vực phục vụ SmartDrive"
              src={COVERAGE_MAP_EMBED}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg,rgba(13,25,45,.04),rgba(13,25,45,.28))",
              }}
            />
            {[
              { name: "Hà Nội", left: "48%", top: "18%" },
              { name: "Thanh Hóa", left: "50%", top: "28%" },
              { name: "Nghệ An", left: "52%", top: "34%" },
              { name: "Hà Tĩnh", left: "53%", top: "39%" },
              { name: "Đà Nẵng", left: "58%", top: "48%" },
              { name: "TP.HCM", left: "46%", top: "78%" },
            ].map((city) => (
              <div
                key={city.name}
                className="sd-city text-[var(--sd-ink)] pointer-events-none"
                style={{ left: city.left, top: city.top }}
              >
                <div className="dot" />
                <div className="absolute left-5 -top-2 text-sm font-semibold whitespace-nowrap drop-shadow-sm">
                  {city.name}
                </div>
              </div>
            ))}
            <div className="absolute right-5 bottom-5 sd-card px-4 py-3 text-sm z-10">
              <div className="font-semibold">Đi tỉnh toàn quốc</div>
              <div className="text-xs text-[var(--sd-mut)]">63 tỉnh thành</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="py-24 overflow-x-clip overflow-y-visible"
      >
        <div className="sd-wrap">
          <Reveal className="flex justify-between items-end gap-6">
            <div>
              <div className="sd-eyebrow">Ứng dụng</div>
              <h2 className="sd-h2 mt-3">Bên trong SmartDrive</h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="sd-btn sd-btn-g !p-3"
                aria-label="Trước"
                onClick={() => scrollTrack(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="sd-btn sd-btn-g !p-3"
                aria-label="Sau"
                onClick={() => scrollTrack(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
          <div ref={trackRef} className="sd-track mt-10">
            {[
              { src: `${A}/shot1.png`, alt: "Thuê tài xế lái hộ" },
              { src: `${A}/shot2.png`, alt: "Thuê xe tự lái đô thị" },
              { src: `${A}/shot3.png`, alt: "Giao hàng xe van" },
              { src: `${A}/shot4.png`, alt: "Thuê xe tự lái du lịch" },
              {
                src: `${A}/promo/ride.jpg`,
                alt: "Đặt xe SmartDrive",
              },
              {
                src: `${A}/promo/parking.png`,
                alt: "Tìm bãi đậu xe",
              },
              {
                src: `${A}/promo/usedcar.png`,
                alt: "Chợ xe cũ SmartDrive",
              },
            ].map((item) => (
              <div key={item.src} className="sd-phone shrink-0">
                <img src={item.src} alt={item.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-[var(--sd-sand)]">
        <div className="sd-wrap">
          <Reveal className="flex flex-wrap justify-between items-end gap-4">
            <div>
              <div className="sd-eyebrow">Khách hàng nói gì</div>
              <h2 className="sd-h2 mt-3">Những chuyến đi an tâm</h2>
            </div>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              {
                text: "“Đi tiệc công ty về muộn, gọi tài xế chỉ 5 phút đã tới. Lái cẩn thận, giá báo trước rõ ràng.”",
                ini: "MH",
                name: "Minh Hoàng",
                meta: "Hà Nội · Lái hộ theo giờ",
                bg: "#dbe5f4",
                color: "var(--sd-navy)",
                stars: 5,
              },
              {
                text: "“Thuê tài xế đi Đà Lạt 3 ngày, anh tài xế quen đường, cả nhà được nghỉ ngơi trọn vẹn.”",
                ini: "TL",
                name: "Thu Linh",
                meta: "TP.HCM · Đi tỉnh",
                bg: "#e2f0e2",
                color: "#2d7a39",
                stars: 5,
              },
              {
                text: "“Theo dõi được vị trí xe trên bản đồ, thanh toán qua ví rất tiện. Chatbot trả lời nhanh.”",
                ini: "QA",
                name: "Quốc Anh",
                meta: "Đà Nẵng · Thuê xe tự lái",
                bg: "#f1e6d4",
                color: "#8a5a00",
                stars: 4,
              },
            ].map((r) => (
              <Reveal key={r.name}>
                <figure className="sd-card p-7 h-full">
                  <div className="flex gap-1 text-[#e3a008]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < r.stars ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 leading-relaxed">
                    {r.text}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-full grid place-items-center font-semibold"
                      style={{ background: r.bg, color: r.color }}
                    >
                      {r.ini}
                    </span>
                    <div>
                      <div className="font-semibold text-sm">{r.name}</div>
                      <div className="text-xs text-[var(--sd-mut)]">
                        {r.meta}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="sd-wrap grid lg:grid-cols-[1fr_1.4fr] gap-12">
          <Reveal>
            <div className="sd-eyebrow">Hỏi đáp</div>
            <h2 className="sd-h2 mt-3">Câu hỏi thường gặp</h2>
            <p className="mt-4 text-[var(--sd-mut)]">
              Chưa thấy câu trả lời? Chatbot AI và tổng đài hỗ trợ 24/7.
            </p>
            <a
              href="mailto:support@smartdrive.io.vn"
              className="sd-btn sd-btn-g mt-6"
            >
              <MessageCircle className="w-4 h-4" />
              Chat với hỗ trợ
            </a>
          </Reveal>
          <Reveal className="border-y border-[var(--sd-line)]">
            {[
              [
                "Dịch vụ có an toàn không?",
                "Tài xế được xác minh bằng lái, kinh nghiệm và có đánh giá công khai. Bạn theo dõi chuyến đi realtime và nhắn tin trực tiếp với tài xế.",
              ],
              [
                "Giá được tính như thế nào?",
                "Theo km, giờ, ngày hoặc chuyến đi tỉnh. Giá hiển thị trước khi bạn xác nhận đặt.",
              ],
              [
                "Làm sao để đặt tài xế?",
                "Tải app, chọn dịch vụ, nhập điểm đón – điểm đến và xác nhận. Tài xế thường đến trong 2–5 phút. Hoặc đăng ký tài khoản trên web để quản lý hồ sơ.",
              ],
              [
                "Có thể đặt trước không?",
                "Có, bạn có thể hẹn giờ đón trước cho công việc, sự kiện hoặc chuyến đi xa.",
              ],
              [
                "Thanh toán bằng cách nào?",
                "Qua ví điện tử PayOS ngay trong app, lịch sử giao dịch minh bạch.",
              ],
            ].map(([q, a], i) => (
              <FaqItem
                key={q}
                q={q}
                a={a}
                open={faqOpen === i}
                onToggle={() => setFaqOpen(faqOpen === i ? -1 : i)}
              />
            ))}
          </Reveal>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section id="download" className="py-24">
        <div className="sd-wrap">
          <div className="rounded-[28px] bg-[var(--sd-navy)] text-white overflow-visible grid lg:grid-cols-[1.2fr_1fr] relative">
            <Reveal className="p-8 md:p-14">
              <img
                src={`${A}/icon.png`}
                className="w-14 h-14 rounded-2xl"
                alt=""
              />
              <h2 className="sd-h2 mt-6">
                Tải SmartDrive – đặt tài xế trong vài chạm
              </h2>
              <p className="mt-4 text-white/70 text-lg max-w-[460px]">
                Miễn phí trên Google Play. Đăng ký / đăng nhập trên web để quản
                lý tài khoản và hồ sơ tài xế.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={PLAY_STORE}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Tải trên Google Play"
                  className="sd-store-badge"
                >
                  <img src={chPlayBadge} alt="Tải trên Google Play" />
                </a>
                <a
                  href="#download"
                  aria-label="Tải trên App Store"
                  className="sd-store-badge"
                >
                  <img src={appStoreBadge} alt="Tải trên App Store" />
                </a>
                <Link
                  to="/register"
                  className="sd-btn sd-btn-g !bg-transparent !text-white !border-white/40"
                >
                  Đăng ký tài khoản
                </Link>
                <Link
                  to="/register-partner"
                  className="sd-btn sd-btn-g !bg-transparent !text-white !border-white/40"
                >
                  Đăng ký làm tài xế
                </Link>
              </div>
            </Reveal>
            <div className="relative hidden lg:flex items-end justify-center gap-4 px-6 pt-10 pb-6 min-h-[480px] overflow-visible">
              <div className="w-[180px] sd-phone rotate-[-4deg] shrink-0">
                <img src={`${A}/shot4.png`} alt="" />
              </div>
              <div className="w-[200px] sd-phone rotate-[5deg] shrink-0 -mb-2">
                <img src={`${A}/shot1.png`} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
