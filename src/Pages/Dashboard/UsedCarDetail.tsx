import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Descriptions,
  Image,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Timeline,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  approveUsedCar,
  deleteUsedCar,
  getUsedCar,
  hideUsedCar,
  markUsedCarSold,
  rejectUsedCar,
  submitUsedCar,
} from "../../Config/adminApi";
import { getErrorMessage } from "../../Utils/apiData";
import formatVND from "../../Utils/currency";
import type { UsedCarListing } from "../../models/UsedCar";

const statusColor: Record<string, string> = {
  DRAFT: "default",
  PENDING_REVIEW: "gold",
  PUBLISHED: "green",
  REJECTED: "red",
  HIDDEN: "purple",
  SOLD: "blue",
  EXPIRED: "orange",
  ARCHIVED: "default",
};

export default function UsedCarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [data, setData] = useState<UsedCarListing | null>(null);
  const [reasonOpen, setReasonOpen] = useState<"reject" | "hide" | null>(null);
  const [reason, setReason] = useState("");

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const detail = (await getUsedCar(id)) as UsedCarListing;
      setData(detail);
    } catch (error) {
      message.error(getErrorMessage(error, "Không thể tải chi tiết tin"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const media = useMemo(() => {
    const list = data?.media || [];
    return list
      .map((item) => item.url)
      .filter((url): url is string => Boolean(url));
  }, [data]);

  const seller =
    data?.sellerId && typeof data.sellerId === "object" ? data.sellerId : null;

  const handleApprove = async () => {
    if (!id) return;
    setWorking(true);
    try {
      await approveUsedCar(id);
      message.success("Đã duyệt tin");
      await load();
    } catch (error) {
      message.error(getErrorMessage(error, "Duyệt tin thất bại"));
    } finally {
      setWorking(false);
    }
  };

  const handleReasonSubmit = async () => {
    if (!id || !reason.trim() || !reasonOpen) return;
    setWorking(true);
    try {
      if (reasonOpen === "reject") {
        await rejectUsedCar(id, reason.trim());
        message.success("Đã từ chối tin");
      } else {
        await hideUsedCar(id, reason.trim());
        message.success("Đã ẩn tin");
      }
      setReasonOpen(null);
      setReason("");
      await load();
    } catch (error) {
      message.error(getErrorMessage(error, "Thao tác thất bại"));
    } finally {
      setWorking(false);
    }
  };

  const canModerate =
    data?.status === "PENDING_REVIEW" || data?.status === "PUBLISHED";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Space>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
          <h1 className="text-xl font-semibold m-0">Chi tiết tin xe cũ</h1>
          {data?.status && (
            <Tag color={statusColor[data.status] || "default"}>
              {data.status}
            </Tag>
          )}
        </Space>
        <Space wrap>
          <Button onClick={() => navigate(`/dashboard/used-cars/${id}/edit`)}>
            Sửa
          </Button>
          {data?.status === "DRAFT" || data?.status === "REJECTED" ? (
            <Button
              loading={working}
              onClick={async () => {
                if (!id) return;
                setWorking(true);
                try {
                  await submitUsedCar(id);
                  message.success("Đã gửi duyệt");
                  await load();
                } catch (error) {
                  message.error(getErrorMessage(error, "Gửi duyệt thất bại"));
                } finally {
                  setWorking(false);
                }
              }}
            >
              Gửi duyệt
            </Button>
          ) : null}
          {data?.status === "PUBLISHED" && (
            <Button
              loading={working}
              onClick={async () => {
                if (!id) return;
                setWorking(true);
                try {
                  await markUsedCarSold(id);
                  message.success("Đã đánh dấu bán");
                  await load();
                } catch (error) {
                  message.error(getErrorMessage(error, "Đánh dấu bán thất bại"));
                } finally {
                  setWorking(false);
                }
              }}
            >
              Đã bán
            </Button>
          )}
          {canModerate && (
            <>
              {data?.status === "PENDING_REVIEW" && (
                <Button type="primary" loading={working} onClick={handleApprove}>
                  Duyệt
                </Button>
              )}
              <Button danger onClick={() => setReasonOpen("reject")}>
                Từ chối
              </Button>
              <Button onClick={() => setReasonOpen("hide")}>Ẩn tin</Button>
            </>
          )}
          <Popconfirm
            title="Xóa tin này?"
            description="Tin sẽ được archive (soft-delete)."
            onConfirm={async () => {
              if (!id) return;
              setWorking(true);
              try {
                await deleteUsedCar(id);
                message.success("Đã xóa tin");
                navigate("/dashboard/used-cars");
              } catch (error) {
                message.error(getErrorMessage(error, "Xóa tin thất bại"));
              } finally {
                setWorking(false);
              }
            }}
          >
            <Button danger loading={working}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <Spin spinning={loading}>
        {data && (
          <div className="space-y-4">
            <Card title={data.title || "Tin xe cũ"}>
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Loại xe">
                  {data.vehicleType || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                  {formatVND(data.price ?? 0)}
                  {data.negotiable ? " (thương lượng)" : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Năm SX">
                  {data.manufactureYear ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Số km">
                  {data.mileage ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Hộp số">
                  {data.transmission || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Nhiên liệu">
                  {data.fuelType || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Tình trạng">
                  {data.condition || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Biển số">
                  {data.plateNumber || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngoại thất">
                  {data.exteriorColor || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Nội thất">
                  {data.interiorColor || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Liên hệ">
                  {data.contactName || seller?.fullName || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="SĐT">
                  {data.contactPhone || seller?.phone || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>
                  <div className="whitespace-pre-wrap">
                    {data.description || "—"}
                  </div>
                </Descriptions.Item>
                {!!data.features?.length && (
                  <Descriptions.Item label="Điểm nổi bật" span={2}>
                    {data.features.join(" · ")}
                  </Descriptions.Item>
                )}
                {data.rejectionReason && (
                  <Descriptions.Item label="Lý do từ chối" span={2}>
                    {data.rejectionReason}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            <Card title="Ảnh / media">
              {media.length === 0 ? (
                <div className="text-gray-500">Không có media</div>
              ) : (
                <Image.PreviewGroup>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {media.map((url) => (
                      <Image key={url} src={url} className="rounded" />
                    ))}
                  </div>
                </Image.PreviewGroup>
              )}
            </Card>

            {(data.statusHistory?.length || data.moderationLogs?.length) && (
              <Card title="Lịch sử / moderation">
                <Timeline
                  items={(data.statusHistory || data.moderationLogs || []).map(
                    (item, index) => ({
                      key: index,
                      children: (
                        <div>
                          <div className="font-medium">
                            {String(
                              item.status ||
                                item.action ||
                                item.type ||
                                "Cập nhật"
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.createdAt
                              ? dayjs(String(item.createdAt)).format(
                                  "DD/MM/YYYY HH:mm"
                                )
                              : "—"}
                          </div>
                          {Boolean(item.reason || item.note || item.message) && (
                            <div className="text-sm">
                              {String(
                                item.reason || item.note || item.message
                              )}
                            </div>
                          )}
                        </div>
                      ),
                    })
                  )}
                />
              </Card>
            )}
          </div>
        )}
      </Spin>

      <Modal
        title={reasonOpen === "hide" ? "Ẩn tin" : "Từ chối tin"}
        open={Boolean(reasonOpen)}
        onCancel={() => {
          setReasonOpen(null);
          setReason("");
        }}
        onOk={handleReasonSubmit}
        okButtonProps={{ disabled: !reason.trim(), loading: working, danger: true }}
        okText="Xác nhận"
      >
        <Input.TextArea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do"
        />
      </Modal>
    </div>
  );
}
