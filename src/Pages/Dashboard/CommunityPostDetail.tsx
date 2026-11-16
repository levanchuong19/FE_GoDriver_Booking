import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Descriptions,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  getCommunityAdminPost,
  moderateCommunityAdminPost,
  type CommunityAdminPost,
} from "../../Config/communityAdminApi";
import { notifyError } from "../../Utils/notify";

export default function CommunityPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [post, setPost] = useState<CommunityAdminPost | null>(null);
  const [comments, setComments] = useState<
    Array<{
      id: string;
      content: string;
      author?: { fullName?: string };
      createdAt?: string;
      deleted?: boolean;
    }>
  >([]);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getCommunityAdminPost(id);
      setPost(data.post);
      setComments(data.comments || []);
    } catch (error) {
      notifyError(error, "Không tải được chi tiết bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const moderate = async (
    action: "HIDE" | "REMOVE" | "RESTORE" | "LOCK_COMMENTS" | "UNLOCK_COMMENTS",
  ) => {
    if (!id) return;
    setWorking(true);
    try {
      await moderateCommunityAdminPost(id, action);
      message.success("Đã cập nhật");
      await load();
    } catch (error) {
      notifyError(error, "Thao tác thất bại");
    } finally {
      setWorking(false);
    }
  };

  if (!post && !loading) {
    return (
      <div className="p-6">
        <Typography.Text>Không tìm thấy bài viết.</Typography.Text>
        <Button className="ml-3" onClick={() => navigate("/dashboard/community")}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <Space>
        <Button onClick={() => navigate("/dashboard/community")}>Quay lại</Button>
        <Typography.Title level={3} className="!mb-0">
          Chi tiết bài cộng đồng
        </Typography.Title>
      </Space>

      <Card loading={loading}>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Loại">
            {post?.type === "QUESTION" ? "Câu hỏi" : "Bài viết"}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag>{post?.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Hiển thị">{post?.visibility}</Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {post?.isAnonymous
              ? "Ẩn danh"
              : post?.author?.fullName || post?.authorEmail || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Tiêu đề">{post?.title || "—"}</Descriptions.Item>
          <Descriptions.Item label="Nội dung">
            <div className="whitespace-pre-wrap">{post?.content || "—"}</div>
          </Descriptions.Item>
          <Descriptions.Item label="Ảnh">
            <div className="flex flex-wrap gap-2">
              {(post?.media || []).map((m, i) =>
                m.url ? (
                  <img
                    key={i}
                    src={m.url}
                    alt=""
                    className="w-28 h-28 object-cover rounded"
                  />
                ) : null,
              )}
              {!post?.media?.length ? "—" : null}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Tạo lúc">
            {post?.createdAt
              ? dayjs(post.createdAt).format("DD/MM/YYYY HH:mm")
              : "—"}
          </Descriptions.Item>
        </Descriptions>

        <Space wrap className="mt-4">
          {post?.status === "PUBLISHED" ? (
            <Button loading={working} onClick={() => moderate("HIDE")}>
              Ẩn bài
            </Button>
          ) : null}
          {post?.status !== "REMOVED" ? (
            <Button danger loading={working} onClick={() => moderate("REMOVE")}>
              Gỡ bài
            </Button>
          ) : (
            <Button type="primary" loading={working} onClick={() => moderate("RESTORE")}>
              Khôi phục
            </Button>
          )}
          <Button loading={working} onClick={() => moderate("LOCK_COMMENTS")}>
            Khóa bình luận
          </Button>
          <Button loading={working} onClick={() => moderate("UNLOCK_COMMENTS")}>
            Mở bình luận
          </Button>
        </Space>
      </Card>

      <Card title={`Bình luận gần đây (${comments.length})`} loading={loading}>
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="border rounded-lg p-3">
              <div className="text-sm font-semibold">
                {c.author?.fullName || "Thành viên"}
                <span className="text-gray-400 font-normal ml-2">
                  {c.createdAt
                    ? dayjs(c.createdAt).format("DD/MM/YYYY HH:mm")
                    : ""}
                </span>
              </div>
              <div className="text-sm mt-1 whitespace-pre-wrap">
                {c.deleted ? "(Đã xóa)" : c.content}
              </div>
            </div>
          ))}
          {!comments.length ? (
            <Typography.Text type="secondary">Chưa có bình luận.</Typography.Text>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
