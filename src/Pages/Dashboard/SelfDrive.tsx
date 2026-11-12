import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { listAdminSelfDriveBookings } from "../../Config/adminApi";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";

type AnyRow = Record<string, unknown> & { id?: string; _id?: string };

function rowId(row: AnyRow) {
  return String(row.id || row._id || row.bookingId || "");
}

const statusColor: Record<string, string> = {
  DRAFT: "default",
  PENDING: "gold",
  PENDING_PAYMENT: "gold",
  CONFIRMED: "blue",
  ACTIVE: "cyan",
  IN_PROGRESS: "cyan",
  COMPLETED: "green",
  CANCELLED: "red",
  REJECTED: "red",
};

export default function SelfDrivePage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AnyRow[]>([]);
  const [total, setTotal] = useState(0);

  const load = async (
    nextStatus = status,
    nextPage = page,
    nextSize = pageSize,
  ) => {
    setLoading(true);
    try {
      const data = await listAdminSelfDriveBookings({
        status: nextStatus || undefined,
        page: nextPage,
        limit: nextSize,
      });
      setItems(data.items as AnyRow[]);
      setTotal(data.total);
    } catch (error) {
      notifyError(error, "Không tải được booking thuê xe tự lái");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page, pageSize]);

  const columns: ColumnsType<AnyRow> = [
    {
      title: "Mã booking",
      render: (_, row) => rowId(row) || "—",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Xe",
      render: (_, row) => {
        const vehicle = row.vehicle as
          | { name?: string; plate?: string; brand?: string; model?: string }
          | undefined;
        return String(
          vehicle?.name ||
            [vehicle?.brand, vehicle?.model].filter(Boolean).join(" ") ||
            vehicle?.plate ||
            row.vehicleId ||
            "—",
        );
      },
      ellipsis: true,
    },
    {
      title: "Khách",
      render: (_, row) => {
        const customer = row.customer as
          | { fullName?: string; phone?: string }
          | undefined;
        return String(
          customer?.fullName ||
            customer?.phone ||
            row.customerName ||
            row.customerId ||
            "—",
        );
      },
      ellipsis: true,
    },
    {
      title: "Nhận xe",
      render: (_, row) =>
        row.startAt
          ? dayjs(String(row.startAt)).format("DD/MM/YYYY HH:mm")
          : "—",
      width: 160,
    },
    {
      title: "Trả xe",
      render: (_, row) =>
        row.endAt ? dayjs(String(row.endAt)).format("DD/MM/YYYY HH:mm") : "—",
      width: 160,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: (value) => (
        <Tag color={statusColor[String(value)] || "default"}>
          {String(value || "—")}
        </Tag>
      ),
    },
    {
      title: "Thanh toán",
      render: (_, row) =>
        String(row.paymentStatus || row.payStatus || "—"),
      width: 120,
    },
    {
      title: "Tổng tiền",
      render: (_, row) =>
        formatVND(
          Number(
            row.totalAmount ??
              row.finalFare ??
              row.amountPayableNow ??
              row.amount ??
              0,
          ),
        ),
      width: 140,
    },
    {
      title: "Tạo lúc",
      render: (_, row) =>
        row.createdAt
          ? dayjs(String(row.createdAt)).format("DD/MM/YYYY HH:mm")
          : "—",
      width: 160,
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Quản trị thuê xe tự lái"
        extra={
          <Space>
            <Select
              value={status}
              style={{ width: 220 }}
              onChange={(value) => {
                setPage(1);
                setStatus(value);
              }}
              options={[
                { value: "", label: "Tất cả trạng thái" },
                { value: "PENDING", label: "PENDING" },
                { value: "PENDING_PAYMENT", label: "PENDING_PAYMENT" },
                { value: "CONFIRMED", label: "CONFIRMED" },
                { value: "ACTIVE", label: "ACTIVE" },
                { value: "IN_PROGRESS", label: "IN_PROGRESS" },
                { value: "COMPLETED", label: "COMPLETED" },
                { value: "CANCELLED", label: "CANCELLED" },
              ]}
            />
            <Button onClick={() => load()}>Làm mới</Button>
          </Space>
        }
      >
        <Table<AnyRow>
          rowKey={(row) => rowId(row)}
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (nextPage, nextSize) => {
              setPage(nextPage);
              setPageSize(nextSize);
            },
          }}
        />
      </Card>
    </div>
  );
}
