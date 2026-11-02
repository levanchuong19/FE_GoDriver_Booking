import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Descriptions,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  cancelSharedTrip,
  completeSharedTrip,
  getSharedTrip,
  getSharedTripDashboard,
  getSharedTripManifest,
  publishSharedTrip,
  startSharedTrip,
} from "../../Config/managementApi";
import { getErrorMessage } from "../../Utils/apiData";
import formatVND from "../../Utils/currency";

type AnyObj = Record<string, unknown>;

export default function SharedRideDetailPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [trip, setTrip] = useState<AnyObj | null>(null);
  const [dashboard, setDashboard] = useState<AnyObj | null>(null);
  const [manifest, setManifest] = useState<AnyObj[]>([]);

  const load = async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const [tripData, dashData, manifestData] = await Promise.all([
        getSharedTrip(tripId),
        getSharedTripDashboard(tripId).catch(() => null),
        getSharedTripManifest(tripId).catch(() => null),
      ]);
      setTrip((tripData as AnyObj) || null);
      setDashboard((dashData as AnyObj) || null);
      const list = Array.isArray(manifestData)
        ? manifestData
        : Array.isArray((manifestData as AnyObj)?.items)
          ? ((manifestData as AnyObj).items as AnyObj[])
          : Array.isArray((manifestData as AnyObj)?.passengers)
            ? ((manifestData as AnyObj).passengers as AnyObj[])
            : [];
      setManifest(list);
    } catch (error) {
      message.error(getErrorMessage(error, "Không tải được chi tiết chuyến"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const runAction = async (
    action: () => Promise<unknown>,
    success: string
  ) => {
    setWorking(true);
    try {
      await action();
      message.success(success);
      await load();
    } catch (error) {
      message.error(getErrorMessage(error, "Thao tác thất bại"));
    } finally {
      setWorking(false);
    }
  };

  const origin = trip?.origin as { address?: string } | undefined;
  const destination = trip?.destination as { address?: string } | undefined;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <Space wrap>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
        <h1 className="text-xl font-semibold m-0">Quản lý chuyến xe ghép</h1>
        {trip?.status != null && <Tag>{String(trip.status)}</Tag>}
      </Space>

      <Spin spinning={loading}>
        {trip && (
          <>
            <Card
              title="Thông tin chuyến"
              extra={
                <Space wrap>
                  <Button
                    loading={working}
                    onClick={() =>
                      runAction(
                        () => publishSharedTrip(tripId!),
                        "Đã đăng chuyến"
                      )
                    }
                  >
                    Publish
                  </Button>
                  <Button
                    loading={working}
                    onClick={() =>
                      runAction(
                        () => startSharedTrip(tripId!),
                        "Đã bắt đầu chuyến"
                      )
                    }
                  >
                    Start
                  </Button>
                  <Button
                    type="primary"
                    loading={working}
                    onClick={() =>
                      runAction(
                        () => completeSharedTrip(tripId!),
                        "Đã hoàn thành chuyến"
                      )
                    }
                  >
                    Complete
                  </Button>
                  <Button
                    danger
                    loading={working}
                    onClick={() =>
                      runAction(
                        () => cancelSharedTrip(tripId!),
                        "Đã hủy chuyến"
                      )
                    }
                  >
                    Cancel
                  </Button>
                </Space>
              }
            >
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Trip ID">
                  {tripId}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {String(trip.status || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm đi" span={2}>
                  {origin?.address || String(trip.originAddress || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm đến" span={2}>
                  {destination?.address ||
                    String(trip.destinationAddress || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Khởi hành">
                  {trip.departureAt
                    ? dayjs(String(trip.departureAt)).format(
                        "DD/MM/YYYY HH:mm"
                      )
                    : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Giá ghế">
                  {formatVND(
                    Number(trip.baseSeatPrice ?? trip.seatPrice ?? 0)
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Giá bao xe">
                  {formatVND(Number(trip.charterPrice ?? 0))}
                </Descriptions.Item>
                <Descriptions.Item label="Pricing mode">
                  {String(trip.pricingMode || "—")}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {dashboard && (
              <Card title="Dashboard chuyến">
                <Descriptions bordered column={2} size="small">
                  {Object.entries(dashboard)
                    .slice(0, 12)
                    .map(([key, value]) => (
                      <Descriptions.Item key={key} label={key}>
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value ?? "—")}
                      </Descriptions.Item>
                    ))}
                </Descriptions>
              </Card>
            )}

            <Card title="Manifest khách">
              <Table
                rowKey={(_, index) => String(index)}
                dataSource={manifest}
                pagination={false}
                columns={[
                  {
                    title: "Khách",
                    render: (_, row) =>
                      String(
                        row.fullName ||
                          row.passengerName ||
                          row.name ||
                          "—"
                      ),
                  },
                  {
                    title: "SĐT",
                    render: (_, row) => String(row.phone || "—"),
                  },
                  {
                    title: "Đón",
                    render: (_, row) =>
                      String(
                        (row.pickup as { address?: string } | undefined)
                          ?.address ||
                          row.pickupAddress ||
                          "—"
                      ),
                  },
                  {
                    title: "Trả",
                    render: (_, row) =>
                      String(
                        (row.dropoff as { address?: string } | undefined)
                          ?.address ||
                          row.dropoffAddress ||
                          "—"
                      ),
                  },
                  {
                    title: "Ghế",
                    render: (_, row) =>
                      String(row.seatCode || row.seat || "—"),
                  },
                ]}
              />
            </Card>
          </>
        )}
      </Spin>
    </div>
  );
}
