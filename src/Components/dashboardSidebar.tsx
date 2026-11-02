import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  IdCard,
  CarFront,
  MapPinned,
  Users,
  CircleDollarSign,
  Wallet,
  Car,
  Navigation,
  Wifi,
  ShoppingBag,
  UsersRound,
  KeyRound,
  Layers3,
  Library,
  MessageSquare,
  Bot,
  Bell,
  type LucideIcon,
} from "lucide-react";

const linkClass =
  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm";
const activeClass = "bg-green-600 text-white shadow hover:bg-green-600";
const inactiveClass = "hover:bg-gray-100 text-gray-700";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { to: "/dashboard", label: "Tổng quan", icon: LayoutDashboard, end: true },
      { to: "/dashboard/notifications", label: "Thông báo", icon: Bell },
    ],
  },
  {
    title: "Tài xế & User",
    items: [
      {
        to: "/dashboard/driver-application",
        label: "Tài xế lái hộ",
        icon: IdCard,
      },
      {
        to: "/dashboard/ride-drivers",
        label: "Tài xế Đặt xe",
        icon: CarFront,
      },
      {
        to: "/dashboard/online-drivers",
        label: "Tài xế online",
        icon: Wifi,
      },
      {
        to: "/dashboard/driver-wallets",
        label: "Ví tài xế",
        icon: Wallet,
      },
      { to: "/dashboard/user", label: "Người dùng", icon: Users },
    ],
  },
  {
    title: "Vận hành",
    items: [
      {
        to: "/dashboard/bookings",
        label: "Booking thuê tài xế",
        icon: MapPinned,
      },
      {
        to: "/dashboard/rides",
        label: "Chuyến Đặt xe",
        icon: Navigation,
      },
      {
        to: "/dashboard/shared-rides",
        label: "Xe ghép",
        icon: UsersRound,
      },
      {
        to: "/dashboard/self-drive",
        label: "Thuê xe tự lái",
        icon: KeyRound,
      },
      {
        to: "/dashboard/used-cars",
        label: "Chợ xe cũ",
        icon: ShoppingBag,
      },
      {
        to: "/dashboard/transactions",
        label: "Giao dịch / rút tiền",
        icon: Wallet,
      },
    ],
  },
  {
    title: "Giá & Catalog",
    items: [
      {
        to: "/dashboard/pricing",
        label: "Bảng giá thuê tài xế",
        icon: CircleDollarSign,
      },
      {
        to: "/dashboard/ride-categories",
        label: "Giá loại xe Đặt xe",
        icon: Car,
      },
      {
        to: "/dashboard/pricing-plans",
        label: "Pricing Engine",
        icon: Layers3,
      },
      {
        to: "/dashboard/vehicle-catalog",
        label: "Catalog xe",
        icon: Library,
      },
    ],
  },
  {
    title: "Hỗ trợ",
    items: [
      {
        to: "/dashboard/chat-support",
        label: "Chat booking",
        icon: MessageSquare,
      },
      {
        to: "/dashboard/chatbot",
        label: "Chatbot",
        icon: Bot,
      },
    ],
  },
];

function DashboardSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col overflow-hidden border-r-2 border-gray-200 bg-white shadow-md">
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-gray-200 font-bold text-2xl">
        <span className="mr-2 text-3xl text-green-600">SmartDrive</span>
      </div>
      <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto px-2 py-4">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `${linkClass} ${isActive ? activeClass : inactiveClass}`
                  }
                >
                  <span className="text-lg">
                    <Icon />
                  </span>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="shrink-0 border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-red-500 py-2 font-semibold text-red-500 hover:bg-red-50"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
export default DashboardSidebar;
