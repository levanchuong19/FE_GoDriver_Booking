import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Space,
  Statistic,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  getDriverWallet,
  getOnlineDriverCount,
  getOnlineDrivers,
} from "../../Config/adminApi";
import { getErrorMessage } from "../../Utils/apiData";
import formatVND from "../../Utils/currency";
import type {
  DriverWalletInfo,
  OnlineDriver,
} from "../../models/OnlineDriver";

function normalizeDrivers(raw: unknown[]): OnlineDriver[] {
  return raw.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      driverId: String(row.driverId || row._id || row.id || ""),
      lat: typeof row.lat === "number" ? row.lat : undefined,
      lng: typeof row.lng === "number" ? row.lng : undefined,
      lastSeen: typeof row.lastSeen === "string" ? row.lastSeen : undefined,
      fullName:
        typeof row.fullName === "string"
          ? row.fullName
          : typeof (row.driver as { fullName?: string } | undefined)?.fullName ===
              "string"
            ? (row.driver as { fullName?: string }).fullName
            : undefined,
      phone:
        typeof row.phone === "string"
          ? row.phone
          : typeof (row.driver as { phone?: string } | undefined)?.phone ===
              "string"
            ? (row.driver as { phone?: string }).phone
            : undefined,
      availability:
        typeof row.availability === "string" ? row.availability : "online",
    };
  });
}

export default function OnlineDriversPage() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<OnlineDriver[]>([]);
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [wallet, setWallet] = useState<DriverWalletInfo | null>(null);
  const [selected, setSelected] = useState<OnlineDriver | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [onlineCount, drivers] = await Promise.all([
        getOnlineDriverCount(),
        getOnlineDrivers(),
      ]);
      setCount(onlineCount);
      setItems(normalizeDrivers(drivers as unknown[]));
    } catch (error) {
      message.error(getErrorMessage(error, "Không thể tải tài xế online"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, []);

  const openWallet = async (row: OnlineDriver) => {
    if (!row.driverId) return;
    setSelected(row);
    setWalletOpen(true);
    setWalletLoading(true);
    try {
      const data = (await getDriverWallet(row.driverId)) as DriverWalletInfo;
      setWallet(data);
    } catch (error) {
      setWallet(null);
      message.error(getErrorMessage(error, "Không thể tải ví tài xế"));
    } finally {
      setWalletLoading(false);
    }
  };

  const columns: ColumnsType<OnlineDriver> = [
    {
      title: "Driver ID",
      dataIndex: "driverId",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Tên",
      dataIndex: "fullName",
      render: (value) => value || "—",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      render: (value) => value || "—",
    },
    {
      title: "Vị trí",
      render: (_, row) =>
        row.lat != null && row.lng != null
          ? `${row.lat.toFixed(5)}, ${row.lng.toFixed(5)}`
          : "—",
    },
    {
      title: "Last seen",
      dataIndex: "lastSeen",
      width: 170,
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm:ss") : "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "availability",
      width: 120,
      render: (value) => <Tag color="green">{value || "online"}</Tag>,
    },
    {
      title: "Thao tác",
      width: 120,
      render: (_, row) => (
        <Button type="primary" onClick={() => openWallet(row)}>
          Xem ví
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <Card>
        <Space size="large" wrap>
          <Statistic title="Tài xế đang online" value={count} />
          <Button onClick={load} loading={loading}>
            Làm mới
          </Button>
        </Space>
      </Card>

      <Card title="Danh sách tài xế online (real-time)">
        <Table<OnlineDriver>
          rowKey={(row) => row.driverId}
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{ pageSize: 20 }}
        />
      </Card>

      <Drawer
        title={`Ví tài xế ${selected?.fullName || selected?.driverId || ""}`}
        open={walletOpen}
        onClose={() => {
          setWalletOpen(false);
          setSelected(null);
          setWallet(null);
        }}
        width={480}
      >
        {walletLoading ? (
          "Đang tải…"
        ) : wallet ? (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Số dư">
              {formatVND(wallet.balance ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Nợ hoa hồng">
              {formatVND(wallet.debt ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng thu nhập">
              {formatVND(wallet.totalEarnings ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Đã rút">
              {formatVND(wallet.totalWithdrawn ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Khóa ví">
              {wallet.isLocked ? (
                <Tag color="red">Đã khóa</Tag>
              ) : (
                <Tag color="green">Đang mở</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngân hàng">
              {wallet.bankAccount?.bankName || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Số tài khoản">
              {wallet.bankAccount?.numberBank || "—"}
            </Descriptions.Item>
            {wallet.lockReason && (
              <Descriptions.Item label="Lý do khóa">
                {wallet.lockReason}
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <div className="text-gray-500">Không có dữ liệu ví</div>
        )}
      </Drawer>
    </div>
  );
}
