import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { listAdminRides } from "../../Config/adminApi";
import { getErrorMessage } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";
import { getRideId, type RideRecord } from "../../models/Ride";

const statusColor: Record<string, string> = {
  REQUESTED: "gold",
  SEARCHING: "gold",
  OFFERED: "blue",
  ASSIGNED: "blue",
  ARRIVING: "purple",
  IN_PROGRESS: "cyan",
  COMPLETED: "green",
  CANCELLED: "red",
  Pending: "gold",
  Completed: "green",
  Cancelled: "red",
};

function personName(
  value: RideRecord["customer"] | RideRecord["customerId"] | RideRecord["driver"] | RideRecord["driverId"]
) {
  if (!value) return "—";
  if (typeof value === "string") return value;
  return value.fullName || value.phone || "—";
}

function pickup(row: RideRecord) {
  return (
    row.pickupAddress ||
    row.pickupLocation ||
    String(row.pickup || "") ||
    "—"
  );
}

function dropoff(row: RideRecord) {
  return (
    row.dropoffAddress ||
    row.dropoffLocation ||
    String(row.dropoff || "") ||
    "—"
  );
}

export default function AdminRidesPage() {
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const [status, setStatus] = useState(sp.get("status") || "");
  const [page, setPage] = useState(Number(sp.get("page") || 1));
  const [pageSize, setPageSize] = useState(Number(sp.get("limit") || 10));
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RideRecord[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const next = new URLSearchParams(sp);
    if (status) next.set("status", status);
    else next.delete("status");
    next.set("page", String(page));
    next.set("limit", String(pageSize));
    setSp(next, { replace: true });
  }, [status, page, pageSize, sp, setSp]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await listAdminRides({
          status: status || undefined,
          page,
          limit: pageSize,
        });
        if (!ignore) {
          setItems(data.items as RideRecord[]);
          setTotal(data.total);
        }
      } catch (error) {
        if (!ignore) {
          notifyError(error, "Không thể tải danh sách chuyến");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [status, page, pageSize]);

  const columns: ColumnsType<RideRecord> = [
    {
      title: "Mã",
      render: (_, row) => row.rideCode || getRideId(row),
      width: 160,
      ellipsis: true,
    },
    {
      title: "Khách",
      render: (_, row) => personName(row.customer || row.customerId),
      width: 160,
    },
    {
      title: "Tài xế",
      render: (_, row) => personName(row.driver || row.driverId),
      width: 160,
    },
    {
      title: "Đón",
      render: (_, row) => pickup(row),
      ellipsis: true,
    },
    {
      title: "Trả",
      render: (_, row) => dropoff(row),
      ellipsis: true,
    },
    {
      title: "Loại xe",
      dataIndex: "categoryCode",
      width: 120,
      render: (value) => value || "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (value) => (
        <Tag color={statusColor[value] || "default"}>{value || "—"}</Tag>
      ),
    },
    {
      title: "Giá",
      width: 120,
      render: (_, row) => formatVND(Number(row.fare ?? row.price ?? 0)),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: 150,
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—",
    },
    {
      title: "Thao tác",
      width: 100,
      render: (_, row) => (
        <Button
          type="primary"
          onClick={() => navigate(`/dashboard/rides/${getRideId(row)}`)}
          disabled={!getRideId(row)}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Chuyến Đặt xe"
        extra={
          <Space>
            <Button onClick={() => navigate("/dashboard/ride-categories")}>
              Bảng giá loại xe
            </Button>
            <span className="text-gray-500 text-sm">Tổng: {total}</span>
          </Space>
        }
      >
        <div className="mb-4">
          <Select
            value={status}
            style={{ width: 220 }}
            onChange={(value) => {
              setPage(1);
              setStatus(value);
            }}
            options={[
              { value: "", label: "Tất cả trạng thái" },
              { value: "REQUESTED", label: "REQUESTED" },
              { value: "SEARCHING", label: "SEARCHING" },
              { value: "ASSIGNED", label: "ASSIGNED" },
              { value: "IN_PROGRESS", label: "IN_PROGRESS" },
              { value: "COMPLETED", label: "COMPLETED" },
              { value: "CANCELLED", label: "CANCELLED" },
            ]}
          />
        </div>
        <Table<RideRecord>
          rowKey={(row) => getRideId(row)}
          columns={columns}
          dataSource={items}
          loading={loading}
          scroll={{ x: 1200 }}
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
