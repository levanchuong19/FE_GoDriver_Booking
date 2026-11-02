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
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  listUsedCarReports,
  resolveUsedCarReport,
} from "../../Config/adminApi";
import { getErrorMessage } from "../../Utils/apiData";
import { getUsedCarId, type UsedCarReport } from "../../models/UsedCar";

const statusColor: Record<string, string> = {
  OPEN: "gold",
  RESOLVED: "green",
  DISMISSED: "default",
};

export default function UsedCarReportsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("OPEN");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<UsedCarReport[]>([]);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [target, setTarget] = useState<UsedCarReport | null>(null);
  const [dismiss, setDismiss] = useState(false);

  const load = async (nextStatus = status) => {
    setLoading(true);
    try {
      const data = await listUsedCarReports({
        status: nextStatus || undefined,
      });
      setItems(data.items as UsedCarReport[]);
    } catch (error) {
      message.error(getErrorMessage(error, "Không thể tải báo cáo"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const openResolve = (row: UsedCarReport, nextDismiss: boolean) => {
    setTarget(row);
    setDismiss(nextDismiss);
    setNote("");
    setNoteOpen(true);
  };

  const handleResolve = async () => {
    const id = target ? getUsedCarId(target) : "";
    if (!id) return;
    setWorkingId(id);
    try {
      await resolveUsedCarReport(id, {
        dismiss,
        adminNote: note.trim() || undefined,
      });
      message.success(dismiss ? "Đã bỏ qua báo cáo" : "Đã xử lý báo cáo");
      setNoteOpen(false);
      setTarget(null);
      await load(status);
    } catch (error) {
      message.error(getErrorMessage(error, "Xử lý báo cáo thất bại"));
    } finally {
      setWorkingId(null);
    }
  };

  const columns: ColumnsType<UsedCarReport> = [
    {
      title: "Lý do",
      dataIndex: "reason",
      render: (value, row) => value || row.description || "—",
    },
    {
      title: "Tin",
      dataIndex: "listingId",
      render: (value) => {
        if (!value) return "—";
        if (typeof value === "string") return value;
        return value.title || getUsedCarId(value) || "—";
      },
    },
    {
      title: "Người báo cáo",
      dataIndex: "reporterId",
      render: (value) => {
        if (!value) return "—";
        if (typeof value === "string") return value;
        return value.fullName || value.phone || "—";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
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
      width: 260,
      render: (_, row) => {
        const listingId =
          typeof row.listingId === "string"
            ? row.listingId
            : row.listingId
              ? getUsedCarId(row.listingId)
              : "";
        return (
          <Space wrap>
            {listingId && (
              <Button
                onClick={() => navigate(`/dashboard/used-cars/${listingId}`)}
              >
                Xem tin
              </Button>
            )}
            {row.status === "OPEN" && (
              <>
                <Button
                  type="primary"
                  loading={workingId === getUsedCarId(row)}
                  onClick={() => openResolve(row, false)}
                >
                  Xử lý
                </Button>
                <Button onClick={() => openResolve(row, true)}>Bỏ qua</Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <Card title="Báo cáo tin xe cũ">
        <div className="mb-4">
          <Select
            value={status}
            style={{ width: 200 }}
            onChange={setStatus}
            options={[
              { value: "", label: "Tất cả" },
              { value: "OPEN", label: "OPEN" },
              { value: "RESOLVED", label: "RESOLVED" },
              { value: "DISMISSED", label: "DISMISSED" },
            ]}
          />
        </div>
        <Table<UsedCarReport>
          rowKey={(row) => getUsedCarId(row)}
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={dismiss ? "Bỏ qua báo cáo" : "Xử lý báo cáo"}
        open={noteOpen}
        onCancel={() => setNoteOpen(false)}
        onOk={handleResolve}
        okText="Xác nhận"
        confirmLoading={Boolean(workingId)}
      >
        <Input.TextArea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú admin (không bắt buộc)"
        />
      </Modal>
    </div>
  );
}
