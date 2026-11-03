import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Descriptions,
  Image,
  Modal,
  Space,
  Spin,
  Tag,
  Input,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  approveRideDriverRegistration,
  getRideDriverRegistration,
  rejectRideDriverRegistration,
} from "../../Config/adminApi";
import { getErrorMessage } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";
import type { RideDriverRegistration } from "../../models/RideDriver";

const statusColor: Record<string, string> = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  draft: "default",
};

export default function RideDriverRegistrationDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [data, setData] = useState<RideDriverRegistration | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const detail = await getRideDriverRegistration(userId);
      setData(detail);
    } catch (error) {
      notifyError(error, "Không thể tải chi tiết đăng ký");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const canDecide = data?.status === "pending";
  const kyc = (data?.kyc ?? {}) as Record<string, unknown>;
  const personal = (kyc.personal ?? {}) as Record<string, unknown>;
  const address = (kyc.address ?? {}) as Record<string, unknown>;
  const documents = (kyc.documents ?? {}) as Record<string, string>;
  const vehicle = data?.vehicle ?? {};
  const vehicleDocs = (vehicle.documents ?? {}) as Record<string, string>;
  const photos = Array.isArray(vehicle.photos) ? vehicle.photos : [];

  const mediaEntries = useMemo(() => {
    const fromDocs = Object.entries({ ...documents, ...vehicleDocs }).filter(
      ([, url]) => Boolean(url)
    );
    const fromPhotos = photos.map((url, index) => [`Ảnh xe ${index + 1}`, url]);
    return [...fromDocs, ...fromPhotos] as [string, string][];
  }, [documents, vehicleDocs, photos]);

  const handleApprove = async () => {
    if (!userId) return;
    setWorking(true);
    try {
      await approveRideDriverRegistration(userId);
      message.success("Đã duyệt tài xế Đặt xe");
      await load();
    } catch (error) {
      notifyError(error, "Duyệt thất bại");
    } finally {
      setWorking(false);
    }
  };

  const handleReject = async () => {
    if (!userId || !reason.trim()) return;
    setWorking(true);
    try {
      await rejectRideDriverRegistration(userId, reason.trim());
      message.success("Đã từ chối đăng ký Đặt xe");
      setRejectOpen(false);
      setReason("");
      await load();
    } catch (error) {
      notifyError(error, "Từ chối thất bại");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Space>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
          <h1 className="text-xl font-semibold m-0">Chi tiết tài xế Đặt xe</h1>
          {data?.status && (
            <Tag color={statusColor[data.status] || "default"}>
              {data.status.toUpperCase()}
            </Tag>
          )}
        </Space>
        {canDecide && (
          <Space>
            <Button type="primary" loading={working} onClick={handleApprove}>
              Duyệt
            </Button>
            <Button danger onClick={() => setRejectOpen(true)}>
              Từ chối
            </Button>
          </Space>
        )}
      </div>

      <Spin spinning={loading}>
        {data && (
          <div className="space-y-4">
            <Card title="Thông tin đăng ký">
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="User ID">
                  {data.userId || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="KYC">
                  {(data.kycStatus || "—").toString().toUpperCase()}
                </Descriptions.Item>
                <Descriptions.Item label="Họ tên">
                  {data.fullName || String(personal.fullName || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {data.email || String(personal.email || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="SĐT">
                  {data.phone || String(personal.phone || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {data.createdAt
                    ? dayjs(data.createdAt).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Descriptions.Item>
                {data.rejectionReason && (
                  <Descriptions.Item label="Lý do từ chối" span={2}>
                    {data.rejectionReason}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            <Card title="Địa chỉ KYC">
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Tỉnh/Thành">
                  {String(address.province || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Quận/Huyện">
                  {String(address.district || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Phường/Xã">
                  {String(address.ward || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {String(address.specificAddress || "—")}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Xe Đặt xe">
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Loại xe">
                  {String(vehicle.categoryCode || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Biển số">
                  {String(
                    vehicle.plateNumber || vehicle.licensePlate || "—"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Hãng">
                  {String(vehicle.brand || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Dòng">
                  {String(vehicle.model || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Màu">
                  {String(vehicle.color || "—")}
                </Descriptions.Item>
                <Descriptions.Item label="Đã xác minh xe">
                  {vehicle.verified ? "Có" : "Chưa"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Giấy tờ / ảnh">
              {mediaEntries.length === 0 ? (
                <div className="text-gray-500">Không có tài liệu</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaEntries.map(([label, url]) => (
                    <div key={`${label}-${url}`} className="border rounded p-2">
                      <div className="text-xs text-gray-500 mb-2">{label}</div>
                      <Image src={url} alt={label} className="rounded" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </Spin>

      <Modal
        title="Lý do từ chối"
        open={rejectOpen}
        onCancel={() => setRejectOpen(false)}
        onOk={handleReject}
        okButtonProps={{ disabled: !reason.trim(), loading: working }}
        okText="Gửi"
      >
        <Input.TextArea
          rows={4}
          maxLength={300}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do từ chối"
        />
      </Modal>
    </div>
  );
}
