import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Input,
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
  listCommunityAdminPosts,
  moderateCommunityAdminPost,
  type CommunityAdminPost,
} from "../../Config/communityAdminApi";
import { notifyError } from "../../Utils/notify";

const statusColor: Record<string, string> = {
  PUBLISHED: "green",
  HIDDEN: "orange",
  REMOVED: "red",
  PENDING_REVIEW: "gold",
  DRAFT: "default",
};

export default function CommunityPostsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CommunityAdminPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>("PUBLISHED");
  const [type, setType] = useState<string | undefined>();
  const [q, setQ] = useState("");
  const [workingId, setWorkingId] = useState<string | null>(null);

  const load = async (nextPage = page) => {
    setLoading(true);
    try {
      const data = await listCommunityAdminPosts({
        page: nextPage,
        limit: 20,
        status,
        type,
        q: q.trim() || undefined,
        includeDeleted: status === "REMOVED" ? "true" : undefined,
      });
      setItems(data.items);
      setTotal(data.total);
      setPage(nextPage);
    } catch (error) {
      notifyError(error, "Không tải được bài viết cộng đồng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, type]);

  const moderate = async (
    id: string,
    action: "HIDE" | "REMOVE" | "RESTORE" | "LOCK_COMMENTS" | "UNLOCK_COMMENTS",
  ) => {
    setWorkingId(id);
    try {
      await moderateCommunityAdminPost(id, action);
      message.success("Đã cập nhật bài viết");
      await load(page);
    } catch (error) {
      notifyError(error, "Thao tác thất bại");
    } finally {
      setWorkingId(null);
    }
  };

  const columns: ColumnsType<CommunityAdminPost> = [
    {
      title: "Bài viết",
      dataIndex: "title",
      render: (_v, row) => (
        <div>
          <div className="font-semibold">
            {row.title || row.content?.slice(0, 80) || "(Không tiêu đề)"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {row.type === "QUESTION" ? "Câu hỏi" : "Bài viết"} ·{" "}
            {row.visibility || "PUBLIC"}
          </div>
        </div>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      width: 180,
      render: (author, row) =>
        row.isAnonymous
          ? "Ẩn danh"
          : author?.fullName || row.authorEmail || "—",
    },
    {
      title: "Tương tác",
      width: 120,
      render: (_v, row) => (
        <span>
          👍 {row.reactionCount || 0} · 💬 {row.commentCount || 0}
        </span>
      ),
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
      render: (_v, row) => (
        <Space wrap size="small">
          <Button size="small" onClick={() => navigate(`/dashboard/community/${row.id}`)}>
            Chi tiết
          </Button>
          {row.status === "PUBLISHED" ? (
            <Button
              size="small"
              loading={workingId === row.id}
              onClick={() => moderate(row.id, "HIDE")}
            >
              Ẩn
            </Button>
          ) : null}
          {row.status !== "REMOVED" ? (
            <Button
              size="small"
              danger
              loading={workingId === row.id}
              onClick={() => moderate(row.id, "REMOVE")}
            >
              Gỡ
            </Button>
          ) : (
            <Button
              size="small"
              type="primary"
              loading={workingId === row.id}
              onClick={() => moderate(row.id, "RESTORE")}
            >
              Khôi phục
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Typography.Title level={3} className="!mb-1">
            Cộng đồng SmartDrive
          </Typography.Title>
          <Typography.Text type="secondary">
            Quản lý bài viết, câu hỏi và kiểm duyệt nội dung diễn đàn.
          </Typography.Text>
        </div>
        <Link to="/dashboard/community-reports">
          <Button>Báo cáo cộng đồng</Button>
        </Link>
      </div>

      <Card>
        <Space wrap className="mb-4">
          <Input.Search
            allowClear
            placeholder="Tìm tiêu đề / nội dung"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onSearch={() => load(1)}
            style={{ width: 260 }}
          />
          <Select
            allowClear
            placeholder="Trạng thái"
            style={{ width: 160 }}
            value={status}
            onChange={(v) => setStatus(v)}
            options={[
              { value: "PUBLISHED", label: "Đã đăng" },
              { value: "HIDDEN", label: "Đã ẩn" },
              { value: "REMOVED", label: "Đã gỡ" },
              { value: "PENDING_REVIEW", label: "Chờ duyệt" },
            ]}
          />
          <Select
            allowClear
            placeholder="Loại"
            style={{ width: 140 }}
            value={type}
            onChange={(v) => setType(v)}
            options={[
              { value: "POST", label: "Bài viết" },
              { value: "QUESTION", label: "Câu hỏi" },
            ]}
          />
          <Button onClick={() => load(1)} loading={loading}>
            Làm mới
          </Button>
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={items}
          pagination={{
            current: page,
            total,
            pageSize: 20,
            onChange: (p) => load(p),
          }}
        />
      </Card>
    </div>
  );
}
