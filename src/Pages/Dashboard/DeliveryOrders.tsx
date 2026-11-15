import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  cancelAdminDeliveryOrder,
  listAdminDeliveryOrders,
  updateAdminDeliveryStatus,
} from "../../Config/adminApi";
import { listPricingPlans } from "../../Config/managementApi";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";

type AnyRow = Record<string, unknown> & { id?: string; _id?: string; code?: string };

function rowId(row: AnyRow) {
  return String(row.id || row._id || row.orderId || "");
}

const DELIVERY_STATUSES = [
  "WAITING_PAYMENT",
  "FINDING_DRIVER",
  "ACCEPTED",
  "PICKED_UP",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
] as const;

const statusColor: Record<string, string> = {
  WAITING_PAYMENT: "gold",
  FINDING_DRIVER: "gold",
  ACCEPTED: "blue",
  PICKED_UP: "purple",
  DELIVERING: "cyan",
  COMPLETED: "green",
  CANCELLED: "red",
};

const statusLabel: Record<string, string> = {
  WAITING_PAYMENT: "Chờ thanh toán",
  FINDING_DRIVER: "Đang tìm tài xế",
  ACCEPTED: "Đã nhận đơn",
  PICKED_UP: "Đã lấy hàng",
  DELIVERING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export default function DeliveryOrdersPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [moduleReady, setModuleReady] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
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
      setModuleReady(orders.ready);
      setItems(orders.items as AnyRow[]);
      setTotal(orders.total);
    } catch (error) {
      setModuleReady(false);
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

  const runAction = async (
    id: string,
    label: string,
    fn: () => Promise<unknown>,
  ) => {
    setWorkingId(id);
    try {
      await fn();
      message.success(label);
      await load();
    } catch (error) {
      notifyError(error, `${label} thất bại`);
    } finally {
      setWorkingId(null);
    }
  };

  const columns: ColumnsType<AnyRow> = [
    {
      title: "Mã",
      render: (_, row) => String(row.code || rowId(row) || "—"),
      width: 140,
      ellipsis: true,
    },
    {
      title: "Xe",
      render: (_, row) => String(row.vehicle || row.vehicleType || "—"),
      width: 100,
    },
    {
      title: "Lấy hàng",
      render: (_, row) =>
        String(
          (row.pickup as { address?: string } | undefined)?.address ||
            row.pickupAddress ||
            "—",
        ),
      ellipsis: true,
    },
    {
      title: "Giao hàng",
      render: (_, row) =>
        String(
          (row.dropoff as { address?: string } | undefined)?.address ||
            row.dropoffAddress ||
            "—",
        ),
      ellipsis: true,
    },
    {
      title: "Khách",
      render: (_, row) => {
        const customer = row.customer as
          | { name?: string; phone?: string }
          | undefined;
        return String(
          customer?.name ||
            customer?.phone ||
            row.senderName ||
            row.recipientName ||
            "—",
        );
      },
      width: 140,
      ellipsis: true,
    },
    {
      title: "Tài xế",
      render: (_, row) => {
        const driver = row.driver as
          | { name?: string; phone?: string }
          | undefined;
        return String(driver?.name || driver?.phone || "—");
      },
      width: 120,
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (value) => {
        const key = String(value || "");
        return (
          <Tag color={statusColor[key] || "default"}>
            {statusLabel[key] || key || "—"}
          </Tag>
        );
      },
    },
    {
      title: "Cước",
      render: (_, row) =>
        formatVND(Number(row.quotedFare ?? row.totalFare ?? row.fare ?? 0)),
      width: 120,
    },
    {
      title: "Tạo lúc",
      render: (_, row) =>
        row.createdAt
          ? dayjs(String(row.createdAt)).format("DD/MM/YYYY HH:mm")
          : "—",
      width: 150,
    },
    {
      title: "Thao tác",
      width: 320,
      fixed: "right",
      render: (_, row) => {
        const id = rowId(row);
        const current = String(row.status || "").toUpperCase();
        if (!id || !moduleReady) return null;
        return (
          <Space wrap>
            <Select
              size="small"
              placeholder="Đổi TT"
              style={{ width: 150 }}
              disabled={workingId === id}
              value={undefined}
              options={DELIVERY_STATUSES.filter((s) => s !== current).map(
                (s) => ({
                  value: s,
                  label: statusLabel[s] || s,
                }),
              )}
              onChange={(next) => {
                if (next === "CANCELLED") {
                  const reason =
                    window.prompt("Lý do hủy đơn?") || "Admin hủy đơn";
                  runAction(id, "Đã hủy đơn", () =>
                    cancelAdminDeliveryOrder(id, reason),
                  );
                  return;
                }
                runAction(id, "Đã cập nhật trạng thái", () =>
                  updateAdminDeliveryStatus(id, { status: next }),
                );
              }}
            />
            {current !== "CANCELLED" && current !== "COMPLETED" && (
              <Popconfirm
                title="Hủy đơn giao hàng?"
                onConfirm={() => {
                  const reason =
                    window.prompt("Lý do hủy đơn?") || "Admin hủy đơn";
                  runAction(id, "Đã hủy đơn", () =>
                    cancelAdminDeliveryOrder(id, reason),
                  );
                }}
              >
                <Button danger size="small" loading={workingId === id}>
                  Hủy
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
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
            : "Chưa kết nối được /api/delivery/admin/orders"
        }
        description={
          moduleReady
            ? "Có thể lọc, đổi trạng thái và hủy đơn giao hàng."
            : "Kiểm tra BE đã mount delivery routes và token admin/staff còn hiệu lực."
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
                ...DELIVERY_STATUSES.map((s) => ({
                  value: s,
                  label: statusLabel[s] || s,
                })),
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
          scroll={{ x: 1200 }}
          locale={{ emptyText: "Chưa có đơn giao hàng" }}
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
