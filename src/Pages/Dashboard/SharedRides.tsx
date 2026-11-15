import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
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
  cancelAdminSharedBooking,
  listAdminSharedBookings,
  listAdminSharedTrips,
  updateAdminSharedTripStatus,
} from "../../Config/adminApi";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";

type AnyRow = Record<string, unknown> & { id?: string; _id?: string };

function rowId(row: AnyRow) {
  return String(row.id || row._id || row.tripId || row.bookingId || "");
}

const statusColor: Record<string, string> = {
  DRAFT: "default",
  PUBLISHED: "green",
  OPEN: "green",
  FULL: "blue",
  STARTED: "cyan",
  IN_PROGRESS: "cyan",
  COMPLETED: "purple",
  CANCELLED: "red",
  CONFIRMED: "green",
  PENDING: "gold",
  HELD: "gold",
};

export default function SharedRidesPage() {
  const navigate = useNavigate();
  const [tripStatus, setTripStatus] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [tripPage, setTripPage] = useState(1);
  const [bookingPage, setBookingPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [trips, setTrips] = useState<AnyRow[]>([]);
  const [tripTotal, setTripTotal] = useState(0);
  const [bookings, setBookings] = useState<AnyRow[]>([]);
  const [bookingTotal, setBookingTotal] = useState(0);

  const loadTrips = async (
    status = tripStatus,
    page = tripPage,
    limit = pageSize,
  ) => {
    setTripsLoading(true);
    try {
      const data = await listAdminSharedTrips({
        status: status || undefined,
        page,
        limit,
      });
      setTrips(data.items as AnyRow[]);
      setTripTotal(data.total);
    } catch (error) {
      notifyError(error, "Không tải được danh sách chuyến xe ghép");
    } finally {
      setTripsLoading(false);
    }
  };

  const loadBookings = async (
    status = bookingStatus,
    page = bookingPage,
    limit = pageSize,
  ) => {
    setBookingsLoading(true);
    try {
      const data = await listAdminSharedBookings({
        status: status || undefined,
        page,
        limit,
      });
      setBookings(data.items as AnyRow[]);
      setBookingTotal(data.total);
    } catch (error) {
      notifyError(error, "Không tải được booking xe ghép");
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripStatus, tripPage, pageSize]);

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingStatus, bookingPage, pageSize]);

  const runTripAction = async (
    id: string,
    label: string,
    fn: () => Promise<unknown>,
  ) => {
    setWorkingId(id);
    try {
      await fn();
      message.success(label);
      await loadTrips();
    } catch (error) {
      notifyError(error, `${label} thất bại`);
    } finally {
      setWorkingId(null);
    }
  };

  const tripColumns: ColumnsType<AnyRow> = [
    {
      title: "Mã chuyến",
      render: (_, row) => rowId(row) || "—",
      width: 170,
      ellipsis: true,
    },
    {
      title: "Đi",
      render: (_, row) =>
        String(
          (row.origin as { address?: string } | undefined)?.address ||
            row.originAddress ||
            "—",
        ),
      ellipsis: true,
    },
    {
      title: "Đến",
      render: (_, row) =>
        String(
          (row.destination as { address?: string } | undefined)?.address ||
            row.destinationAddress ||
            "—",
        ),
      ellipsis: true,
    },
    {
      title: "Khởi hành",
      render: (_, row) =>
        row.departureAt
          ? dayjs(String(row.departureAt)).format("DD/MM/YYYY HH:mm")
          : "—",
      width: 160,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (value) => (
        <Tag color={statusColor[String(value)] || "default"}>
          {String(value || "—")}
        </Tag>
      ),
    },
    {
      title: "Giá ghế",
      render: (_, row) =>
        formatVND(Number(row.baseSeatPrice ?? row.seatPrice ?? 0)),
      width: 120,
    },
    {
      title: "Thao tác",
      width: 280,
      render: (_, row) => {
        const id = rowId(row);
        const status = String(row.status || "").toUpperCase();
        return (
          <Space wrap>
            <Button
              onClick={() => navigate(`/dashboard/shared-rides/${id}`)}
              disabled={!id}
            >
              Chi tiết
            </Button>
            {status === "DRAFT" && (
              <Button
                type="primary"
                loading={workingId === id}
                onClick={() =>
                  runTripAction(id, "Đã mở chuyến", () =>
                    updateAdminSharedTripStatus(id, { status: "OPEN" }),
                  )
                }
              >
                Mở (OPEN)
              </Button>
            )}
            {(status === "OPEN" || status === "FULL" || status === "PUBLISHED") && (
              <Button
                loading={workingId === id}
                onClick={() =>
                  runTripAction(id, "Đã bắt đầu", () =>
                    updateAdminSharedTripStatus(id, { status: "IN_PROGRESS" }),
                  )
                }
              >
                Start
              </Button>
            )}
            {(status === "STARTED" || status === "IN_PROGRESS") && (
              <Button
                type="primary"
                loading={workingId === id}
                onClick={() =>
                  runTripAction(id, "Đã hoàn thành", () =>
                    updateAdminSharedTripStatus(id, { status: "COMPLETED" }),
                  )
                }
              >
                Complete
              </Button>
            )}
            {!["COMPLETED", "CANCELLED"].includes(status) && (
              <Button
                danger
                loading={workingId === id}
                onClick={() => {
                  const reason =
                    window.prompt("Lý do hủy chuyến?") || "Admin hủy chuyến";
                  runTripAction(id, "Đã hủy", () =>
                    updateAdminSharedTripStatus(id, {
                      status: "CANCELLED",
                      reason,
                    }),
                  );
                }}
              >
                Hủy
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const bookingColumns: ColumnsType<AnyRow> = [
    {
      title: "Mã booking",
      render: (_, row) => rowId(row) || "—",
      width: 170,
      ellipsis: true,
    },
    {
      title: "Chuyến",
      render: (_, row) =>
        String(row.tripId || (row.trip as { _id?: string } | undefined)?._id || "—"),
      width: 160,
      ellipsis: true,
    },
    {
      title: "Khách",
      render: (_, row) => {
        const passenger = row.passenger as
          | { fullName?: string; phone?: string }
          | undefined;
        return String(
          passenger?.fullName ||
            passenger?.phone ||
            row.passengerName ||
            row.customerName ||
            "—",
        );
      },
      ellipsis: true,
    },
    {
      title: "Ghế",
      render: (_, row) =>
        String(
          row.seatCount ||
            (Array.isArray(row.seats) ? row.seats.length : row.quantity) ||
            "—",
        ),
      width: 80,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (value) => (
        <Tag color={statusColor[String(value)] || "default"}>
          {String(value || "—")}
        </Tag>
      ),
    },
    {
      title: "Tổng tiền",
      render: (_, row) =>
        formatVND(Number(row.totalAmount ?? row.amount ?? row.fare ?? 0)),
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
    {
      title: "Thao tác",
      width: 120,
      render: (_, row) => {
        const id = rowId(row);
        const status = String(row.status || "").toUpperCase();
        if (!id || ["CANCELLED", "COMPLETED", "REFUNDED"].includes(status)) {
          return null;
        }
        return (
          <Button
            danger
            size="small"
            loading={workingId === id}
            onClick={async () => {
              setWorkingId(id);
              try {
                await cancelAdminSharedBooking(id);
                message.success("Đã hủy booking");
                await loadBookings();
              } catch (error) {
                notifyError(error, "Hủy booking thất bại");
              } finally {
                setWorkingId(null);
              }
            }}
          >
            Hủy
          </Button>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <Card
        title="Quản trị Xe ghép"
        extra={
          <Space>
            <Button onClick={() => navigate("/dashboard/shared-rides/charter")}>
              Báo giá bao xe
            </Button>
            <Button
              onClick={() => {
                loadTrips();
                loadBookings();
              }}
            >
              Làm mới
            </Button>
          </Space>
        }
      >
        <Tabs
          items={[
            {
              key: "trips",
              label: "Chuyến (admin)",
              children: (
                <div className="space-y-4">
                  <Select
                    value={tripStatus}
                    style={{ width: 220 }}
                    onChange={(value) => {
                      setTripPage(1);
                      setTripStatus(value);
                    }}
                    options={[
                      { value: "", label: "Tất cả trạng thái" },
                      { value: "DRAFT", label: "DRAFT" },
                      { value: "PUBLISHED", label: "PUBLISHED" },
                      { value: "OPEN", label: "OPEN" },
                      { value: "STARTED", label: "STARTED" },
                      { value: "COMPLETED", label: "COMPLETED" },
                      { value: "CANCELLED", label: "CANCELLED" },
                    ]}
                  />
                  <Table<AnyRow>
                    rowKey={(row) => rowId(row)}
                    columns={tripColumns}
                    dataSource={trips}
                    loading={tripsLoading}
                    pagination={{
                      current: tripPage,
                      pageSize,
                      total: tripTotal,
                      showSizeChanger: true,
                      onChange: (nextPage, nextSize) => {
                        setTripPage(nextPage);
                        setPageSize(nextSize);
                      },
                    }}
                  />
                </div>
              ),
            },
            {
              key: "bookings",
              label: "Booking (admin)",
              children: (
                <div className="space-y-4">
                  <Select
                    value={bookingStatus}
                    style={{ width: 220 }}
                    onChange={(value) => {
                      setBookingPage(1);
                      setBookingStatus(value);
                    }}
                    options={[
                      { value: "", label: "Tất cả trạng thái" },
                      { value: "PENDING", label: "PENDING" },
                      { value: "HELD", label: "HELD" },
                      { value: "CONFIRMED", label: "CONFIRMED" },
                      { value: "CANCELLED", label: "CANCELLED" },
                      { value: "COMPLETED", label: "COMPLETED" },
                    ]}
                  />
                  <Table<AnyRow>
                    rowKey={(row) => rowId(row)}
                    columns={bookingColumns}
                    dataSource={bookings}
                    loading={bookingsLoading}
                    pagination={{
                      current: bookingPage,
                      pageSize,
                      total: bookingTotal,
                      showSizeChanger: true,
                      onChange: (nextPage, nextSize) => {
                        setBookingPage(nextPage);
                        setPageSize(nextSize);
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
