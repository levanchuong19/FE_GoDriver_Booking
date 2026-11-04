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
  revokeRideDriverRegistration,
} from "../../Config/adminApi";
import {
  collectKycDocuments,
  documentsToMediaEntries,
  resolveMediaUrl,
} from "../../Utils/kycDocuments";
import { notifyError, notifySuccess } from "../../Utils/notify";
import type { RideDriverRegistration } from "../../models/RideDriver";
import {
  getDriverApplicationById,
  listDriverApplications,
} from "../../Config/adminDriverApplications";
import { unwrapData } from "../../Utils/apiData";

const statusColor: Record<string, string> = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  draft: "default",
  revoked: "purple",
  locked: "volcano",
  suspended: "orange",
  blocked: "volcano",
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function extractApplicationPayload(raw: unknown): Record<string, unknown> {
  const root = asRecord(unwrapData(raw) ?? raw);
  return asRecord(root.data ?? root.app ?? root.application ?? root);
}

function hasCoreKycDocs(docs: Record<string, string>) {
  return Boolean(
    docs.idFrontUrl &&
      docs.idBackUrl &&
      docs.driverLicenseFrontUrl &&
      docs.driverLicenseBackUrl
  );
}

function mergeHireDriverDocs(
  detail: RideDriverRegistration,
  appData: Record<string, unknown>
): RideDriverRegistration {
  const kycBag = asRecord(detail.kyc);
  const merged = collectKycDocuments(kycBag, appData, detail.raw, detail.vehicle);
  return {
    ...detail,
    kyc: {
      ...kycBag,
      documents: merged,
    },
  };
}

export default function RideDriverRegistrationDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [data, setData] = useState<RideDriverRegistration | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [reason, setReason] = useState("");

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      let detail = await getRideDriverRegistration(userId);
      const kycBag = asRecord(detail.kyc);
      let docs = collectKycDocuments(kycBag, detail.raw, detail.vehicle);

      if (!hasCoreKycDocs(docs)) {
        const applicationId = [
          kycBag.applicationId,
          kycBag.driverApplicationId,
          detail.raw?.applicationId,
          detail.raw?.driverApplicationId,
          asRecord(detail.raw?.application)._id,
          asRecord(detail.raw?.driverApplication)._id,
          // only treat kyc._id as app id when it already carries documents bag
          kycBag.documents ? kycBag._id : "",
        ]
          .map((value) => (typeof value === "string" ? value.trim() : ""))
          .find(Boolean);

        if (applicationId) {
          try {
            const appRes = await getDriverApplicationById(applicationId);
            detail = mergeHireDriverDocs(
              detail,
              extractApplicationPayload(appRes)
            );
            docs = collectKycDocuments(
              detail.kyc,
              detail.raw,
              detail.vehicle
            );
          } catch {
            // fall through to search
          }
        }
      }

      if (!hasCoreKycDocs(docs)) {
        const search = detail.email || detail.phone || detail.fullName || "";
        if (search) {
          try {
            const listed = await listDriverApplications({
              search,
              status: "approved",
              limit: 10,
            });
            const payload = asRecord(listed?.data ?? listed);
            const items = Array.isArray(payload.items)
              ? payload.items
              : Array.isArray(listed?.items)
                ? listed.items
                : [];
            const matched = items.find((item: unknown) => {
              const app = asRecord(item);
              const personal = asRecord(app.personal);
              const appUserId = String(
                app.userId ?? asRecord(app.user)._id ?? ""
              );
              if (appUserId && appUserId === detail.userId) return true;
              if (
                detail.email &&
                String(personal.email || app.email || "") === detail.email
              ) {
                return true;
              }
              if (
                detail.phone &&
                String(personal.phone || app.phone || "") === detail.phone
              ) {
                return true;
              }
              return false;
            });
            if (matched) {
              detail = mergeHireDriverDocs(detail, asRecord(matched));
            }
          } catch {
            // Keep ride-driver payload if hire-driver lookup fails
          }
        }
      }

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

  const normalizedStatus = (data?.status || "").toLowerCase();
  const canDecide = ["pending", "submitted", "under_review", "in_review"].includes(
    normalizedStatus,
  );
  const canRevoke = ["pending", "submitted", "under_review", "in_review", "approved"].includes(
    normalizedStatus,
  );
  const kyc = (data?.kyc ?? {}) as Record<string, unknown>;
  const personal = (kyc.personal ?? {}) as Record<string, unknown>;
  const address = (kyc.address ?? {}) as Record<string, unknown>;
  const vehicle = data?.vehicle ?? {};
  const photos = Array.isArray(vehicle.photos) ? vehicle.photos : [];

  const mediaEntries = useMemo(() => {
    const documents = collectKycDocuments(
      kyc,
      data?.raw,
      vehicle,
      (vehicle as { documents?: unknown }).documents,
    );
    const fromDocs = documentsToMediaEntries(documents).map(
      ([label, url]) => [label, resolveMediaUrl(url)] as [string, string],
    );
    const fromPhotos = photos
      .map((url, index) => {
        const resolved = resolveMediaUrl(url);
        return resolved
          ? ([`Ảnh xe ${index + 1}`, resolved] as [string, string])
          : null;
      })
      .filter((entry): entry is [string, string] => Boolean(entry));
    return [...fromDocs, ...fromPhotos];
  }, [kyc, data?.raw, vehicle, photos]);

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

  const handleRevoke = async () => {
    if (!userId || !reason.trim()) return;
    setWorking(true);
    try {
      await revokeRideDriverRegistration(userId, reason.trim());
      notifySuccess("Đã thu hồi đăng ký Đặt xe");
      setRevokeOpen(false);
      setReason("");
      await load();
    } catch (error) {
      notifyError(error, "Thu hồi đăng ký Đặt xe thất bại");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Space wrap>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
          <h1 className="text-xl font-semibold m-0">Chi tiết tài xế Đặt xe</h1>
          {data?.status && (
            <Tag color={statusColor[data.status] || "default"}>
              {data.status.toUpperCase()}
            </Tag>
          )}
        </Space>
        <Space wrap>
          {canDecide && (
            <>
              <Button type="primary" loading={working} onClick={handleApprove}>
                Duyệt
              </Button>
              <Button
                danger
                onClick={() => {
                  setReason("");
                  setRejectOpen(true);
                }}
              >
                Từ chối
              </Button>
            </>
          )}
          {canRevoke && (
            <Button
              danger
              ghost
              loading={working}
              onClick={() => {
                setReason("");
                setRevokeOpen(true);
              }}
            >
              Thu hồi
            </Button>
          )}
        </Space>
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
                  {String(vehicle.plateNumber || vehicle.licensePlate || "—")}
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
        okButtonProps={{ disabled: !reason.trim(), loading: working, danger: true }}
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

      <Modal
        title="Thu hồi đăng ký Đặt xe"
        open={revokeOpen}
        onCancel={() => setRevokeOpen(false)}
        onOk={handleRevoke}
        okButtonProps={{ disabled: !reason.trim(), loading: working, danger: true }}
        okText="Thu hồi"
      >
        <Input.TextArea
          rows={4}
          maxLength={300}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do thu hồi"
        />
      </Modal>
    </div>
  );
}
