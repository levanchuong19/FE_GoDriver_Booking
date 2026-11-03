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
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";
import { getUsedCarId, type UsedCarListing } from "../../models/UsedCar";

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

function display(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

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
      const detail = await getUsedCar(id);
      setData(detail);
    } catch (error) {
      setData(null);
      notifyError(error, "Không thể tải chi tiết tin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const media = useMemo(() => {
    return (data?.media || [])
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
      notifyError(error, "Duyệt tin thất bại");
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
      notifyError(error, "Thao tác thất bại");
    } finally {
      setWorking(false);
    }
  };

  const canModerate =
    data?.status === "PENDING_REVIEW" || data?.status === "PUBLISHED";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Space wrap>
          <Button onClick={() => navigate("/dashboard/used-cars")}>
            Quay lại
          </Button>
          <h1 className="text-xl font-semibold m-0">Chi tiết tin xe cũ</h1>
          {data?.status && (
            <Tag color={statusColor[data.status] || "default"}>
              {data.status}
            </Tag>
          )}
        </Space>
        {data && (
          <Space wrap>
            <Button
              type="primary"
              onClick={() =>
                navigate(`/dashboard/used-cars/${getUsedCarId(data) || id}/edit`)
              }
            >
              Sửa
            </Button>
            {(data.status === "DRAFT" || data.status === "REJECTED") && (
              <Button
                loading={working}
                onClick={async () => {
                  if (!id) return;
                  setWorking(true);
                  try {
                    const photoCount = (data.media || []).filter((item) =>
                      Boolean(item.url)
                    ).length;
                    if (photoCount < 5) {
                      notifyError(
                        `Cần tối thiểu 5 ảnh (hiện có ${photoCount}).`
                      );
                      return;
                    }
                    await submitUsedCar(id);
                    message.success("Đã gửi duyệt");
                    await load();
                  } catch (error) {
                    notifyError(error, "Gửi duyệt thất bại");
                  } finally {
                    setWorking(false);
                  }
                }}
              >
                Gửi duyệt
              </Button>
            )}
            {data.status === "PUBLISHED" && (
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
                    notifyError(error, "Đánh dấu bán thất bại");
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
                {data.status === "PENDING_REVIEW" && (
                  <Button
                    type="primary"
                    loading={working}
                    onClick={handleApprove}
                  >
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
                  notifyError(error, "Xóa tin thất bại");
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
        )}
      </div>

      <Spin spinning={loading}>
        {!loading && !data && (
          <Card>
            <div className="text-gray-500">Không tải được dữ liệu tin.</div>
          </Card>
        )}

        {data && (
          <div className="space-y-4">
            <Card title={data.title || "Tin xe cũ"}>
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Mã tin">
                  {display(getUsedCarId(data))}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusColor[data.status || ""] || "default"}>
                    {display(data.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Loại xe">
                  {display(data.vehicleType)}
                </Descriptions.Item>
                <Descriptions.Item label="Kiểu dáng">
                  {display(data.bodyType)}
                </Descriptions.Item>
                <Descriptions.Item label="Hãng">
                  {display(data.brandName || data.brandId)}
                </Descriptions.Item>
                <Descriptions.Item label="Dòng xe">
                  {display(data.modelName || data.modelId)}
                </Descriptions.Item>
                <Descriptions.Item label="Phiên bản">
                  {display(data.variantName || data.variantId)}
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                  {data.negotiable && !data.price
                    ? "Thương lượng"
                    : `${formatVND(data.price ?? 0)}${
                        data.negotiable ? " (thương lượng)" : ""
                      }`}
                </Descriptions.Item>
                <Descriptions.Item label="Năm SX">
                  {display(data.manufactureYear)}
                </Descriptions.Item>
                <Descriptions.Item label="Số km">
                  {display(data.mileage)}
                </Descriptions.Item>
                <Descriptions.Item label="Hộp số">
                  {display(data.transmission)}
                </Descriptions.Item>
                <Descriptions.Item label="Nhiên liệu">
                  {display(data.fuelType)}
                </Descriptions.Item>
                <Descriptions.Item label="Tình trạng">
                  {display(data.condition)}
                </Descriptions.Item>
                <Descriptions.Item label="Biển số">
                  {display(data.plateNumber)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngoại thất">
                  {display(data.exteriorColor)}
                </Descriptions.Item>
                <Descriptions.Item label="Nội thất">
                  {display(data.interiorColor)}
                </Descriptions.Item>
                <Descriptions.Item label="Tỉnh/TP">
                  {display(data.provinceName || data.provinceCode)}
                </Descriptions.Item>
                <Descriptions.Item label="Quận/Huyện">
                  {display(data.districtName || data.districtCode)}
                </Descriptions.Item>
                <Descriptions.Item label="Người liên hệ">
                  {display(data.contactName || seller?.fullName)}
                </Descriptions.Item>
                <Descriptions.Item label="SĐT liên hệ">
                  {display(data.contactPhone || seller?.phone)}
                </Descriptions.Item>
                <Descriptions.Item label="Lượt xem">
                  {display(data.viewsCount ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Yêu thích">
                  {display(data.favoritesCount ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Liên hệ">
                  {display(data.contactsCount ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {data.createdAt
                    ? dayjs(data.createdAt).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật">
                  {data.updatedAt
                    ? dayjs(data.updatedAt).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Gửi duyệt">
                  {data.submittedAt
                    ? dayjs(data.submittedAt).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Đăng công khai">
                  {data.publishedAt
                    ? dayjs(data.publishedAt).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>
                  <div className="whitespace-pre-wrap">
                    {display(data.description)}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Điểm nổi bật" span={2}>
                  {data.features?.length ? (
                    <Space wrap>
                      {data.features.map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </Space>
                  ) : (
                    "—"
                  )}
                </Descriptions.Item>
                {data.rejectionReason && (
                  <Descriptions.Item label="Lý do từ chối" span={2}>
                    {data.rejectionReason}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            <Card title={`Ảnh / media (${media.length})`}>
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

            {(data.statusHistory?.length || data.moderationLogs?.length) ? (
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
            ) : null}
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
        okButtonProps={{
          disabled: !reason.trim(),
          loading: working,
          danger: true,
        }}
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
