import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  listCommunityAdminReports,
  moderateCommunityAdminReport,
  type CommunityAdminReport,
} from "../../Config/communityAdminApi";
import { notifyError } from "../../Utils/notify";

const statusColor: Record<string, string> = {
  OPEN: "gold",
  REVIEWING: "blue",
  RESOLVED: "green",
  DISMISSED: "default",
};

export default function CommunityReportsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("OPEN");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CommunityAdminReport[]>([]);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [target, setTarget] = useState<CommunityAdminReport | null>(null);
  const [action, setAction] = useState<
    "DISMISS" | "HIDE_POST" | "REMOVE_POST" | "HIDE_COMMENT" | "REMOVE_COMMENT"
  >("DISMISS");

  const load = async (nextStatus = status) => {
    setLoading(true);
    try {
      const data = await listCommunityAdminReports({
        status: nextStatus || undefined,
        limit: 50,
      });
      setItems(data.items);
    } catch (error) {
      notifyError(error, "Không tải được báo cáo cộng đồng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const openAction = (
    row: CommunityAdminReport,
    nextAction:
      | "DISMISS"
      | "HIDE_POST"
      | "REMOVE_POST"
      | "HIDE_COMMENT"
      | "REMOVE_COMMENT",
  ) => {
    setTarget(row);
    setAction(nextAction);
    setNote("");
    setNoteOpen(true);
  };

  const handleModerate = async () => {
    if (!target?.id) return;
    setWorkingId(target.id);
    try {
      await moderateCommunityAdminReport(target.id, {
        action,
        note: note.trim() || undefined,
      });
      message.success("Đã xử lý báo cáo");
      setNoteOpen(false);
      setTarget(null);
      await load(status);
    } catch (error) {
      notifyError(error, "Xử lý báo cáo thất bại");
    } finally {
      setWorkingId(null);
    }
  };

  const columns: ColumnsType<CommunityAdminReport> = [
    {
      title: "Loại",
      dataIndex: "targetType",
      width: 110,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      render: (value, row) => value || row.description || "—",
    },
    {
      title: "Người báo cáo",
      dataIndex: "reporter",
      render: (value) => value?.fullName || "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (value) => (
        <Tag color={statusColor[value] || "default"}>{value || "—"}</Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: 160,
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—",
    },
    {
      title: "Thao tác",
      width: 320,
      render: (_v, row) => (
        <Space wrap size="small">
          {row.targetType === "POST" ? (
            <Button
              size="small"
              onClick={() => navigate(`/dashboard/community/${row.targetId}`)}
            >
              Xem bài
            </Button>
          ) : null}
          <Button size="small" onClick={() => openAction(row, "DISMISS")}>
            Bỏ qua
          </Button>
          {row.targetType === "POST" ? (
            <>
              <Button size="small" onClick={() => openAction(row, "HIDE_POST")}>
                Ẩn bài
              </Button>
              <Button
                size="small"
                danger
                onClick={() => openAction(row, "REMOVE_POST")}
              >
                Gỡ bài
              </Button>
            </>
          ) : null}
          {row.targetType === "COMMENT" ? (
            <>
              <Button
                size="small"
                onClick={() => openAction(row, "HIDE_COMMENT")}
              >
                Ẩn BL
              </Button>
              <Button
                size="small"
                danger
                onClick={() => openAction(row, "REMOVE_COMMENT")}
              >
                Gỡ BL
              </Button>
            </>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div>
        <Typography.Title level={3} className="!mb-1">
          Báo cáo cộng đồng
        </Typography.Title>
        <Typography.Text type="secondary">
          Hàng đợi kiểm duyệt nội dung diễn đàn SmartDrive.
        </Typography.Text>
      </div>

      <Card>
        <Space className="mb-4">
          <Select
            value={status}
            style={{ width: 180 }}
            onChange={setStatus}
            options={[
              { value: "OPEN", label: "Đang mở" },
              { value: "RESOLVED", label: "Đã xử lý" },
              { value: "DISMISSED", label: "Đã bỏ qua" },
            ]}
          />
          <Button onClick={() => load(status)} loading={loading}>
            Làm mới
          </Button>
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={items}
          pagination={{ pageSize: 20 }}
        />
      </Card>

      <Modal
        open={noteOpen}
        title="Xử lý báo cáo"
        onCancel={() => setNoteOpen(false)}
        onOk={handleModerate}
        confirmLoading={workingId === target?.id}
        okText="Xác nhận"
      >
        <p className="mb-2 text-sm text-gray-600">Hành động: {action}</p>
        <Input.TextArea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú xử lý (tuỳ chọn)"
        />
      </Modal>
    </div>
  );
}
