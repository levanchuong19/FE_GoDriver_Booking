import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Statistic, Table, Tag, Spin } from "antd";
import {
  CarOutlined,
  DollarOutlined,
  TeamOutlined,
  FileProtectOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import api from "../../Config/api";
import {
  getOnlineDriverCount,
  listRideDriverRegistrations,
} from "../../Config/adminApi";
import { listDriverApplications } from "../../Config/adminDriverApplications";
import { unwrapList } from "../../Utils/apiData";
import { notifyError, suppressErrorToast } from "../../Utils/notify";
import formatVND from "../../Utils/currency";
import type { Booking } from "../../models/Booking";
import {
  isWithdrawActionable,
  type Transaction,
} from "../../models/Transaction";

const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

const STATUS_COLORS: Record<string, string> = {
  Pending: "#f59e0b",
  Confirmed: "#3b82f6",
  Completed: "#22c55e",
  Cancelled: "#ef4444",
};

const typeLabels: Record<string, string> = {
  booking_income: "Thu từ chuyến",
  commission_deduct: "Hoa hồng",
  withdraw: "Rút tiền",
  adjustment: "Điều chỉnh",
};

interface OverviewStats {
  pendingDrivers: number;
  pendingRideDrivers: number;
  users: number;
  bookings: number;
  onlineDrivers: number;
  pendingWithdraws: number;
  todayIncome: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OverviewStats>({
    pendingDrivers: 0,
    pendingRideDrivers: 0,
    users: 0,
    bookings: 0,
    onlineDrivers: 0,
    pendingWithdraws: 0,
    todayIncome: 0,
  });
  const [bookingByStatus, setBookingByStatus] = useState<
    { name: string; value: number }[]
  >([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  useEffect(() => {
    let ignore = false;

    let failedCount = 0;
    const safe = async <T,>(promise: Promise<T>, fallback: T) => {
      try {
        return await Promise.race([
          promise,
          new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 12000)
          ),
        ]);
      } catch (error) {
        failedCount += 1;
        suppressErrorToast(error);
        return fallback;
      }
    };

    const load = async () => {
      setLoading(true);
      failedCount = 0;
      const startOfDay = dayjs().startOf("day").toISOString();
      const endOfDay = dayjs().endOf("day").toISOString();

      const [
        pendingDriversRes,
        pendingRideDrivers,
        users,
        bookings,
        onlineDrivers,
        withdraws,
        todayIncome,
        statusCounts,
        recentTx,
      ] = await Promise.all([
        safe(
          listDriverApplications({ status: "pending", page: 1, limit: 1 }),
          null
        ),
        safe(
          listRideDriverRegistrations({
            status: "pending",
            page: 1,
            limit: 1,
          }),
          { items: [], total: 0, page: undefined, limit: undefined }
        ),
        safe(api.get("/users", { params: { page: 1, limit: 1 } }), null),
        safe(
          api.get("/bookings/get-all", { params: { page: 1, limit: 5 } }),
          null
        ),
        safe(getOnlineDriverCount(), 0),
        safe(
          api.get("/admin/transactions", {
            params: { type: "withdraw", page: 1, limit: 50 },
          }),
          null
        ),
        safe(
          api.get("/admin/transactions", {
            params: {
              type: "booking_income",
              from: startOfDay,
              to: endOfDay,
              page: 1,
              limit: 100,
            },
          }),
          null
        ),
        Promise.all(
          BOOKING_STATUSES.map(async (status) => {
            const res = await safe(
              api.get(`/bookings/status/${status}`, {
                params: { page: 1, limit: 1 },
              }),
              null
            );
            const total = res ? unwrapList(res.data).total : 0;
            return { name: status, value: total };
          })
        ),
        safe(
          api.get("/admin/transactions", { params: { page: 1, limit: 8 } }),
          null
        ),
      ]);

      if (ignore) return;

      const pendingDrivers = pendingDriversRes
        ? unwrapList(pendingDriversRes)
        : { total: 0, items: [] };
      const userList = users ? unwrapList(users.data) : { total: 0, items: [] };
      const bookingList = bookings
        ? unwrapList<Booking>(bookings.data)
        : { total: 0, items: [] };
      const withdrawList = withdraws
        ? unwrapList<Transaction>(withdraws.data)
        : { items: [], total: 0 };
      const incomeList = todayIncome
        ? unwrapList<Transaction>(todayIncome.data)
        : { items: [] };
      const recentBookingData = bookingList.items;
      const recentTxData = recentTx
        ? unwrapList<Transaction>(recentTx.data).items
        : [];

      const pendingWithdrawCount = withdrawList.items.filter((item) =>
        isWithdrawActionable(item)
      ).length;

      const incomeSum = incomeList.items.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      setStats({
        pendingDrivers: pendingDrivers.total || 0,
        pendingRideDrivers: pendingRideDrivers.total || 0,
        users: userList.total,
        bookings: bookingList.total,
        onlineDrivers,
        pendingWithdraws: pendingWithdrawCount,
        todayIncome: incomeSum,
      });
      setBookingByStatus(statusCounts);
      setRecentBookings(recentBookingData);
      setRecentTransactions(recentTxData);
      if (failedCount > 0) {
        notifyError(
          `Có ${failedCount} phần dữ liệu overview không tải được. Vui lòng tải lại trang.`
        );
      }
      setLoading(false);
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const cards = [
    {
      title: "Hồ sơ lái hộ chờ duyệt",
      value: stats.pendingDrivers,
      icon: <FileProtectOutlined className="text-amber-500" />,
      onClick: () => navigate("/dashboard/driver-application?status=pending"),
    },
    {
      title: "Tài xế Đặt xe chờ duyệt",
      value: stats.pendingRideDrivers,
      icon: <CarOutlined className="text-blue-500" />,
      onClick: () => navigate("/dashboard/ride-drivers?status=pending"),
    },
    {
      title: "Tài xế đang online",
      value: stats.onlineDrivers,
      icon: <WifiOutlined className="text-green-500" />,
      onClick: () => navigate("/dashboard/online-drivers"),
    },
    {
      title: "Người dùng",
      value: stats.users,
      icon: <TeamOutlined className="text-indigo-500" />,
      onClick: () => navigate("/dashboard/user"),
    },
    {
      title: "Booking thuê tài xế",
      value: stats.bookings,
      icon: <CarOutlined className="text-cyan-500" />,
      onClick: () => navigate("/dashboard/bookings"),
    },
    {
      title: "Rút tiền chờ duyệt",
      value: stats.pendingWithdraws,
      icon: <DollarOutlined className="text-red-500" />,
      onClick: () => navigate("/dashboard/transactions?type=withdraw"),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tổng quan SmartDrive</h1>
        <p className="text-gray-500 text-sm">
          Số liệu từ hồ sơ tài xế, booking thuê tài xế, giao dịch và tài xế
          online.
        </p>
      </div>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {cards.map((card) => (
            <Col xs={24} sm={12} lg={8} xl={4} key={card.title}>
              <Card
                hoverable={Boolean(card.onClick)}
                onClick={card.onClick}
                className="h-full"
              >
                <Statistic
                  title={card.title}
                  value={card.value}
                  prefix={card.icon}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} lg={10}>
            <Card title="Doanh thu booking hôm nay">
              <div className="text-3xl font-semibold text-green-600">
                {formatVND(stats.todayIncome)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Tổng giao dịch loại booking_income trong ngày
              </div>
            </Card>
            <Card title="Booking theo trạng thái" className="mt-4">
              {bookingByStatus.some((item) => item.value > 0) ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={bookingByStatus}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                    >
                      {bookingByStatus.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_COLORS[entry.name] || "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400">
                  Chưa có dữ liệu booking
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} lg={14}>
            <Card title="Booking gần đây" className="mb-4">
              <Table<Booking>
                rowKey={(row) => row._id}
                dataSource={recentBookings}
                pagination={false}
                size="small"
                columns={[
                  {
                    title: "Khách",
                    render: (_, row) => row.customerId?.fullName || "—",
                  },
                  {
                    title: "Trạng thái",
                    dataIndex: "status",
                    render: (value) => <Tag>{value}</Tag>,
                  },
                  {
                    title: "Giá",
                    dataIndex: "price",
                    render: (value) => formatVND(value || 0),
                  },
                ]}
              />
            </Card>
            <Card title="Giao dịch gần đây">
              <Table<Transaction>
                rowKey={(row) => row.id || row._id || row.bookingCode || ""}
                dataSource={recentTransactions}
                pagination={false}
                size="small"
                columns={[
                  {
                    title: "Loại",
                    dataIndex: "type",
                    render: (value) => typeLabels[value] || value || "—",
                  },
                  {
                    title: "Số tiền",
                    dataIndex: "amount",
                    render: (value) => formatVND(value || 0),
                  },
                  {
                    title: "Thời gian",
                    dataIndex: "createdAt",
                    render: (value) =>
                      value ? dayjs(value).format("DD/MM HH:mm") : "—",
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

