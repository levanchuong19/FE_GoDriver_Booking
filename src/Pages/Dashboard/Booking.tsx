import { useCallback, useEffect, useState } from "react";
import {
  Table,
  Drawer,
  Descriptions,
  Tag,
  Space,
  Button,
  message,
  Card,
  Select,
} from "antd";
import { EyeOutlined, CarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import type { Booking, BookingStatus, PaymentStatus } from "../../models/Booking";
import api from "../../Config/api";
import {
  updateBookingPaymentStatus,
  updateBookingStatus,
} from "../../Config/adminApi";
import { getErrorMessage, unwrapList } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";

type Row = Booking & { key?: string };

const BOOKING_STATUSES: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "Ongoing",
  "Completed",
  "Cancelled",
];

const PAYMENT_STATUSES: PaymentStatus[] = ["Pending", "Paid", "Failed"];

const statusColors: Record<string, string> = {
  Confirmed: "blue",
  Ongoing: "purple",
  Completed: "green",
  Cancelled: "red",
  Pending: "gold",
  Paid: "green",
  Failed: "red",
};

export default function BookingPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Booking | null>(null);

  const fetchAll = useCallback(
    async (p = 1, ps = pageSize, nextStatus = status) => {
      setLoading(true);
      try {
        const res = nextStatus
          ? await api.get(`/bookings/status/${nextStatus}`, {
              params: { page: p, limit: ps },
            })
          : await api.get("/bookings/get-all", {
              params: { page: p, limit: ps },
            });

        const parsed = unwrapList<Booking>(res.data);
        setData(parsed.items.map((b) => ({ ...b, key: b._id })));
        setTotal(parsed.total);
        setPage(parsed.page ?? p);
        setPageSize(parsed.limit ?? ps);
      } catch (error) {
        notifyError(error, "Không thể tải danh sách bookings");
      } finally {
        setLoading(false);
      }
    },
    [pageSize, status]
  );

  useEffect(() => {
    fetchAll(1, pageSize, status);
  }, [fetchAll, pageSize, status]);

  const refreshCurrent = async (id: string) => {
    try {
      const res = await api.get(`/bookings/get/${id}`);
      const detail = (res.data?.data ?? res.data) as Booking;
      setCurrent(detail);
      setData((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...detail } : item))
      );
    } catch {
      await fetchAll(page, pageSize, status);
    }
  };

  const handleStatusChange = async (id: string, next: string) => {
    setWorking(true);
    try {
      await updateBookingStatus(id, next);
      message.success("Đã cập nhật trạng thái booking");
      await refreshCurrent(id);
    } catch (error) {
      notifyError(error, "Cập nhật trạng thái thất bại");
    } finally {
      setWorking(false);
    }
  };

  const handlePaymentChange = async (id: string, next: string) => {
    setWorking(true);
    try {
      await updateBookingPaymentStatus(id, next);
      message.success("Đã cập nhật trạng thái thanh toán");
      await refreshCurrent(id);
    } catch (error) {
      notifyError(error, "Cập nhật thanh toán thất bại");
    } finally {
      setWorking(false);
    }
  };

  const columns: ColumnsType<Row> = [
    {
      title: "Khách hàng",
      dataIndex: ["customerId", "fullName"],
      render: (_, r) => r.customerId?.fullName ?? "—",
      width: 180,
    },
    { title: "Điểm đón", dataIndex: "pickupLocation", ellipsis: true },
    { title: "Điểm đến", dataIndex: "dropoffLocation", ellipsis: true },
    {
      title: "Thời gian",
      dataIndex: "startTime",
      render: (_, r) =>
        r.startTime
          ? `${dayjs(r.startTime).format("DD/MM HH:mm")} → ${
              r.endTime ? dayjs(r.endTime).format("DD/MM HH:mm") : "—"
            }`
          : "—",
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => <Tag color={statusColors[v] || "default"}>{v}</Tag>,
      width: 120,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      render: (v) => <Tag color={statusColors[v] || "default"}>{v || "—"}</Tag>,
      width: 120,
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 120,
      render: (v) => formatVND(v ?? 0),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, row) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setCurrent(row);
            setOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<span className="font-semibold text-lg">Booking thuê tài xế</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <div className="mb-4">
          <Select
            value={status}
            style={{ width: 220 }}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={[
              { value: "", label: "Tất cả trạng thái" },
              ...BOOKING_STATUSES.map((item) => ({
                value: item,
                label: item,
              })),
            ]}
          />
        </div>
        <Table<Row>
          rowKey={(r) => r._id}
          dataSource={data}
          columns={columns}
          loading={loading}
          bordered
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => fetchAll(p, ps, status),
          }}
        />
      </Card>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <CarOutlined className="text-blue-600" />
            <span>Chi tiết Booking</span>
          </div>
        }
        open={open}
        width={720}
        onClose={() => setOpen(false)}
      >
        {current ? (
          <Space direction="vertical" size="large" className="w-full">
            <Card bordered={false}>
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item span={2} label="Mã Booking">
                  {current._id}
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {current.customerId?.fullName ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {current.customerId?.email ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm đón" span={2}>
                  {current.pickupLocation}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm đến" span={2}>
                  {current.dropoffLocation}
                </Descriptions.Item>
                <Descriptions.Item label="Bắt đầu">
                  {current.startTime
                    ? dayjs(current.startTime).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Kết thúc">
                  {current.endTime
                    ? dayjs(current.endTime).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Khoảng cách (km)">
                  {current.distance ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Thời lượng (phút)">
                  {current.duration ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                  {formatVND(current.price ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Tạo lúc">
                  {current.createdAt
                    ? dayjs(current.createdAt).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Cập nhật trạng thái" size="small">
              <Space wrap>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Booking</div>
                  <Select
                    value={current.status}
                    style={{ width: 180 }}
                    loading={working}
                    options={BOOKING_STATUSES.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    onChange={(value) => handleStatusChange(current._id, value)}
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Thanh toán</div>
                  <Select
                    value={current.paymentStatus}
                    style={{ width: 180 }}
                    loading={working}
                    options={PAYMENT_STATUSES.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    onChange={(value) =>
                      handlePaymentChange(current._id, value)
                    }
                  />
                </div>
              </Space>
            </Card>
          </Space>
        ) : (
          "Đang tải…"
        )}
      </Drawer>
    </div>
  );
}
