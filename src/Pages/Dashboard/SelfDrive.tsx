import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Image,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  approveSelfDriveVehicle,
  hideSelfDriveVehicle,
  listAdminSelfDriveBookings,
  listAdminSelfDriveVehicles,
  rejectSelfDriveVehicle,
} from "../../Config/adminApi";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";

type AnyRow = Record<string, unknown> & { id?: string; _id?: string };

function rowId(row: AnyRow) {
  return String(row.id || row._id || row.vehicleId || row.bookingId || "");
}

const vehicleStatusColor: Record<string, string> = {
  DRAFT: "default",
  PENDING_REVIEW: "gold",
  PUBLISHED: "green",
  REJECTED: "red",
  HIDDEN: "purple",
  UNPUBLISHED: "default",
  SUSPENDED: "orange",
};

const bookingStatusColor: Record<string, string> = {
  PENDING: "gold",
  PENDING_OWNER_APPROVAL: "gold",
  PENDING_PAYMENT: "gold",
  AWAITING_PAYMENT: "gold",
  CONFIRMED: "blue",
  ACTIVE: "cyan",
  IN_USE: "cyan",
  IN_PROGRESS: "cyan",
  COMPLETED: "green",
  CANCELLED: "red",
  REJECTED: "red",
};

export default function SelfDrivePage() {
  const [tab, setTab] = useState("vehicles");

  const [vehicleStatus, setVehicleStatus] = useState("PENDING_REVIEW");
  const [keyword, setKeyword] = useState("");
  const [vehiclePage, setVehiclePage] = useState(1);
  const [vehiclePageSize, setVehiclePageSize] = useState(10);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<AnyRow[]>([]);
  const [vehicleTotal, setVehicleTotal] = useState(0);

  const [bookingStatus, setBookingStatus] = useState("");
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingPageSize, setBookingPageSize] = useState(10);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookings, setBookings] = useState<AnyRow[]>([]);
  const [bookingTotal, setBookingTotal] = useState(0);

  const loadVehicles = async (
    status = vehicleStatus,
    page = vehiclePage,
    limit = vehiclePageSize,
    kw = keyword,
  ) => {
    setVehiclesLoading(true);
    try {
      const data = await listAdminSelfDriveVehicles({
        status: status || undefined,
        keyword: kw || undefined,
        page,
        limit,
      });
      setVehicles(data.items as AnyRow[]);
      setVehicleTotal(data.total);
    } catch (error) {
      notifyError(error, "Không tải được danh sách xe tự lái");
    } finally {
      setVehiclesLoading(false);
    }
  };

  const loadBookings = async (
    status = bookingStatus,
    page = bookingPage,
    limit = bookingPageSize,
  ) => {
    setBookingsLoading(true);
    try {
      const data = await listAdminSelfDriveBookings({
        status: status || undefined,
        page,
        limit,
      });
      setBookings(data.items as AnyRow[]);
      setBookingTotal(data.total);
    } catch (error) {
      notifyError(error, "Không tải được booking thuê xe tự lái");
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "vehicles") loadVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, vehicleStatus, vehiclePage, vehiclePageSize, keyword]);

  useEffect(() => {
    if (tab === "bookings") loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, bookingStatus, bookingPage, bookingPageSize]);

  const handleApprove = async (id: string) => {
    setWorkingId(id);
    try {
      await approveSelfDriveVehicle(id);
      message.success("Đã duyệt xe — xe sẽ hiện trên app");
      await loadVehicles();
    } catch (error) {
      notifyError(error, "Duyệt xe thất bại");
    } finally {
      setWorkingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Lý do từ chối xe?");
    if (!reason?.trim()) return;
    setWorkingId(id);
    try {
      await rejectSelfDriveVehicle(id, reason.trim());
      message.success("Đã từ chối xe");
      await loadVehicles();
    } catch (error) {
      notifyError(error, "Từ chối xe thất bại");
    } finally {
      setWorkingId(null);
    }
  };

  const handleHide = async (id: string) => {
    const reason = window.prompt("Lý do ẩn xe khỏi app?");
    if (!reason?.trim()) return;
    setWorkingId(id);
    try {
      await hideSelfDriveVehicle(id, reason.trim());
      message.success("Đã ẩn xe");
      await loadVehicles();
    } catch (error) {
      notifyError(error, "Ẩn xe thất bại");
    } finally {
      setWorkingId(null);
    }
  };

  const vehicleColumns: ColumnsType<AnyRow> = [
    {
      title: "Ảnh",
      width: 80,
      render: (_, row) => {
        const photos = Array.isArray(row.photos) ? (row.photos as string[]) : [];
        const url = String(row.image || photos[0] || "");
        return url ? (
          <Image src={url} width={56} height={42} style={{ objectFit: "cover", borderRadius: 6 }} />
        ) : (
          "—"
        );
      },
    },
    {
      title: "Xe",
      render: (_, row) =>
        String(
          [row.make || row.brand, row.model, row.year].filter(Boolean).join(" ") || "—",
        ),
      ellipsis: true,
    },
    {
      title: "Biển số",
      render: (_, row) => String(row.plateNumber || row.plate || "—"),
      width: 120,
    },
    {
      title: "Chủ xe",
      render: (_, row) => {
        const owner = row.owner as { fullName?: string; phone?: string } | undefined;
        return String(owner?.fullName || owner?.phone || row.ownerId || "—");
      },
      ellipsis: true,
    },
    {
      title: "Giá/ngày",
      render: (_, row) =>
        formatVND(Number(row.pricePerDay ?? row.dailyPrice ?? 0)),
      width: 130,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: (value) => (
        <Tag color={vehicleStatusColor[String(value)] || "default"}>
          {String(value || "—")}
        </Tag>
      ),
    },
    {
      title: "Ghi chú",
      render: (_, row) =>
        String(row.rejectionReason || row.hiddenReason || "—"),
      ellipsis: true,
      width: 180,
    },
    {
      title: "Cập nhật",
      render: (_, row) =>
        row.updatedAt
          ? dayjs(String(row.updatedAt)).format("DD/MM/YYYY HH:mm")
          : "—",
      width: 150,
    },
    {
      title: "Thao tác",
      width: 280,
      render: (_, row) => {
        const id = rowId(row);
        const status = String(row.status || "");
        return (
          <Space wrap>
            {status === "PENDING_REVIEW" || status === "REJECTED" || status === "HIDDEN" ? (
              <Button
                type="primary"
                loading={workingId === id}
                onClick={() => handleApprove(id)}
              >
                Duyệt
              </Button>
            ) : null}
            {status === "PENDING_REVIEW" || status === "PUBLISHED" ? (
              <Button danger loading={workingId === id} onClick={() => handleReject(id)}>
                Từ chối
              </Button>
            ) : null}
            {status === "PUBLISHED" ? (
              <Button loading={workingId === id} onClick={() => handleHide(id)}>
                Ẩn
              </Button>
            ) : null}
          </Space>
        );
      },
    },
  ];

  const bookingColumns: ColumnsType<AnyRow> = [
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
      width: 160,
      render: (value) => (
        <Tag color={bookingStatusColor[String(value)] || "default"}>
          {String(value || "—")}
        </Tag>
      ),
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
  ];

  return (
    <div className="p-6">
      <Card title="Quản trị thuê xe tự lái">
        <Tabs
          activeKey={tab}
          onChange={setTab}
          items={[
            {
              key: "vehicles",
              label: "Duyệt xe",
              children: (
                <div className="space-y-4">
                  <Space wrap>
                    <Select
                      value={vehicleStatus}
                      style={{ width: 220 }}
                      onChange={(value) => {
                        setVehiclePage(1);
                        setVehicleStatus(value);
                      }}
                      options={[
                        { value: "", label: "Tất cả trạng thái" },
                        { value: "PENDING_REVIEW", label: "Chờ duyệt" },
                        { value: "PUBLISHED", label: "Đang hiển thị" },
                        { value: "REJECTED", label: "Từ chối" },
                        { value: "HIDDEN", label: "Đã ẩn" },
                        { value: "DRAFT", label: "Nháp" },
                        { value: "UNPUBLISHED", label: "Ngưng đăng" },
                      ]}
                    />
                    <Input.Search
                      placeholder="Hãng, model, biển số"
                      allowClear
                      style={{ width: 260 }}
                      onSearch={(value) => {
                        setVehiclePage(1);
                        setKeyword(value.trim());
                      }}
                    />
                    <Button onClick={() => loadVehicles()}>Làm mới</Button>
                  </Space>
                  <Table<AnyRow>
                    rowKey={(row) => rowId(row)}
                    columns={vehicleColumns}
                    dataSource={vehicles}
                    loading={vehiclesLoading}
                    pagination={{
                      current: vehiclePage,
                      pageSize: vehiclePageSize,
                      total: vehicleTotal,
                      showSizeChanger: true,
                      onChange: (nextPage, nextSize) => {
                        setVehiclePage(nextPage);
                        setVehiclePageSize(nextSize);
                      },
                    }}
                  />
                </div>
              ),
            },
            {
              key: "bookings",
              label: "Booking",
              children: (
                <div className="space-y-4">
                  <Space wrap>
                    <Select
                      value={bookingStatus}
                      style={{ width: 240 }}
                      onChange={(value) => {
                        setBookingPage(1);
                        setBookingStatus(value);
                      }}
                      options={[
                        { value: "", label: "Tất cả trạng thái" },
                        { value: "PENDING_OWNER_APPROVAL", label: "PENDING_OWNER_APPROVAL" },
                        { value: "AWAITING_PAYMENT", label: "AWAITING_PAYMENT" },
                        { value: "CONFIRMED", label: "CONFIRMED" },
                        { value: "IN_USE", label: "IN_USE" },
                        { value: "COMPLETED", label: "COMPLETED" },
                        { value: "CANCELLED", label: "CANCELLED" },
                      ]}
                    />
                    <Button onClick={() => loadBookings()}>Làm mới</Button>
                  </Space>
                  <Table<AnyRow>
                    rowKey={(row) => rowId(row)}
                    columns={bookingColumns}
                    dataSource={bookings}
                    loading={bookingsLoading}
                    pagination={{
                      current: bookingPage,
                      pageSize: bookingPageSize,
                      total: bookingTotal,
                      showSizeChanger: true,
                      onChange: (nextPage, nextSize) => {
                        setBookingPage(nextPage);
                        setBookingPageSize(nextSize);
                      },
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
