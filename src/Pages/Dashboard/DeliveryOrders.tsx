import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  listAdminDeliveryOrders,
  listAdminRides,
} from "../../Config/adminApi";
import { listPricingPlans } from "../../Config/managementApi";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";

type AnyRow = Record<string, unknown> & { id?: string; _id?: string };

function rowId(row: AnyRow) {
  return String(row.id || row._id || row.orderId || row.rideId || "");
}

const statusColor: Record<string, string> = {
  REQUESTED: "gold",
  SEARCHING: "gold",
  OFFERED: "blue",
  ASSIGNED: "blue",
  ARRIVING: "purple",
  IN_PROGRESS: "cyan",
  COMPLETED: "green",
  CANCELLED: "red",
  PENDING: "gold",
  DELIVERING: "cyan",
  DELIVERED: "green",
};

export default function DeliveryOrdersPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [moduleReady, setModuleReady] = useState(false);
  const [items, setItems] = useState<AnyRow[]>([]);
  const [total, setTotal] = useState(0);
  const [plans, setPlans] = useState<AnyRow[]>([]);

  const load = async (
    nextStatus = status,
    nextPage = page,
    nextSize = pageSize,
  ) => {
    setLoading(true);
    try {
      const orders = await listAdminDeliveryOrders({
        status: nextStatus || undefined,
        page: nextPage,
        limit: nextSize,
      });
      if (orders.items.length || orders.total > 0) {
        setModuleReady(true);
        setItems(orders.items as AnyRow[]);
        setTotal(orders.total);
        return;
      }

      // Fallback: lọc chuyến đặt xe có category giao hàng (nếu seed có).
      const rides = await listAdminRides({
        status: nextStatus || undefined,
        page: nextPage,
        limit: nextSize,
      });
      const deliveryLike = (rides.items as AnyRow[]).filter((row) => {
        const code = String(row.categoryCode || row.serviceType || "").toUpperCase();
        return (
          code.includes("DELIVERY") ||
          code.includes("VAN") ||
          code.includes("PACKAGE") ||
          code.includes("CARGO")
        );
      });
      setModuleReady(false);
      setItems(deliveryLike);
      setTotal(deliveryLike.length);
    } catch (error) {
      notifyError(error, "Không tải được đơn giao hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page, pageSize]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listPricingPlans();
        setPlans(
          (data.items as AnyRow[]).filter((p) =>
            String(p.serviceType || p.code || "")
              .toUpperCase()
              .includes("DELIVERY"),
          ),
        );
      } catch {
        setPlans([]);
      }
    })();
  }, []);

  const columns: ColumnsType<AnyRow> = [
    {
      title: "Mã",
      render: (_, row) => rowId(row) || "—",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Loại",
      render: (_, row) =>
        String(row.categoryCode || row.serviceType || row.vehicleType || "—"),
      width: 140,
    },
    {
      title: "Lấy hàng",
      render: (_, row) =>
        String(
          row.pickupAddress ||
            row.pickupLocation ||
            (row.pickup as { address?: string } | undefined)?.address ||
            "—",
        ),
      ellipsis: true,
    },
    {
      title: "Giao hàng",
      render: (_, row) =>
        String(
          row.dropoffAddress ||
            row.dropoffLocation ||
            (row.dropoff as { address?: string } | undefined)?.address ||
            "—",
        ),
      ellipsis: true,
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
      title: "Cước",
      render: (_, row) =>
        formatVND(Number(row.totalFare ?? row.fare ?? row.amount ?? 0)),
      width: 130,
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
    <div className="p-6 space-y-4">
      <Alert
        type={moduleReady ? "success" : "warning"}
        showIcon
        message={
          moduleReady
            ? "Đã kết nối API giao hàng admin"
            : "Module giao hàng trên BE chưa có CRUD orders — đang dùng fallback từ chuyến/pricing"
        }
        description={
          moduleReady
            ? undefined
            : "App mobile đang dùng mock/upload tạm. Khi BE mount POST /api/delivery/orders và GET /api/delivery/admin/orders, bảng này sẽ hiện đơn thật để duyệt/kiểm soát."
        }
      />

      {plans.length > 0 && (
        <Card title="Pricing DELIVERY đã cấu hình" size="small">
          <Space wrap>
            {plans.map((plan) => (
              <Tag key={rowId(plan) || String(plan.code)}>
                {String(plan.name || plan.code || rowId(plan))}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      <Card
        title="Quản trị Giao hàng"
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
                { value: "SEARCHING", label: "SEARCHING" },
                { value: "ASSIGNED", label: "ASSIGNED" },
                { value: "IN_PROGRESS", label: "IN_PROGRESS" },
                { value: "DELIVERING", label: "DELIVERING" },
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
          locale={{
            emptyText: moduleReady
              ? "Chưa có đơn giao hàng"
              : "Chưa có đơn / category giao hàng trên hệ thống",
          }}
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
