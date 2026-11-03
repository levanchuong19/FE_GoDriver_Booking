import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Descriptions, Space, Spin, Tag, Timeline } from "antd";
import dayjs from "dayjs";
import { getAdminRide } from "../../Config/adminApi";
import { getErrorMessage } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";
import type { RideRecord } from "../../models/Ride";

const statusColor: Record<string, string> = {
  REQUESTED: "gold",
  SEARCHING: "gold",
  OFFERED: "blue",
  ASSIGNED: "blue",
  ARRIVING: "purple",
  IN_PROGRESS: "cyan",
  COMPLETED: "green",
  CANCELLED: "red",
};

function personName(value: unknown) {
  if (!value) return "—";
  if (typeof value === "string") return value;
  const obj = value as { fullName?: string; phone?: string; email?: string };
  return obj.fullName || obj.phone || obj.email || "—";
}

export default function AdminRideDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RideRecord | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const detail = (await getAdminRide(id)) as RideRecord;
        if (!ignore) setData(detail);
      } catch (error) {
        if (!ignore) {
          notifyError(error, "Không thể tải chi tiết chuyến");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <Space>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
        <h1 className="text-xl font-semibold m-0">Chi tiết chuyến Đặt xe</h1>
        {data?.status && (
          <Tag color={statusColor[data.status] || "default"}>{data.status}</Tag>
        )}
      </Space>

      <Spin spinning={loading}>
        {data && (
          <div className="space-y-4">
            <Card>
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Mã chuyến">
                  {data.rideCode || data.id || data._id || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Loại xe">
                  {data.categoryCode || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Khách">
                  {personName(data.customer || data.customerId)}
                </Descriptions.Item>
                <Descriptions.Item label="Tài xế">
                  {personName(data.driver || data.driverId)}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm đón" span={2}>
                  {data.pickupAddress || data.pickupLocation || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm trả" span={2}>
                  {data.dropoffAddress || data.dropoffLocation || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                  {formatVND(Number(data.fare ?? data.price ?? 0))}
                </Descriptions.Item>
                <Descriptions.Item label="Thanh toán">
                  {data.paymentStatus || data.paymentMethod || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Tạo lúc">
                  {data.createdAt
                    ? dayjs(data.createdAt).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật">
                  {data.updatedAt
                    ? dayjs(data.updatedAt).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Lịch sử trạng thái">
              {Array.isArray(data.statusHistory) && data.statusHistory.length ? (
                <Timeline
                  items={data.statusHistory.map((item, index) => ({
                    key: index,
                    children: (
                      <div>
                        <div className="font-medium">
                          {String(item.status || item.to || item.action || "—")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.createdAt || item.at
                            ? dayjs(
                                String(item.createdAt || item.at)
                              ).format("DD/MM/YYYY HH:mm")
                            : "—"}
                        </div>
                        {Boolean(item.note || item.message) && (
                          <div className="text-sm">
                            {String(item.note || item.message)}
                          </div>
                        )}
                      </div>
                    ),
                  }))}
                />
              ) : (
                <div className="text-gray-500">Chưa có lịch sử trạng thái</div>
              )}
            </Card>
          </div>
        )}
      </Spin>
    </div>
  );
}
