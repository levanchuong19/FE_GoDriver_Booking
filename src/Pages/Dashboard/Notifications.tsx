import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Popconfirm,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../Config/managementApi";
import { getErrorMessage } from "../../Utils/apiData";

type NotificationRow = {
  _id?: string;
  id?: string;
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
};

function getId(row: NotificationRow) {
  return row._id || row.id || "";
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const load = async (nextPage = page, nextSize = pageSize) => {
    setLoading(true);
    try {
      const data = await listNotifications({
        page: nextPage,
        limit: nextSize,
      });
      setItems(data.items as NotificationRow[]);
      setTotal(data.total);
      setPage(nextPage);
      setPageSize(nextSize);
    } catch (error) {
      message.error(getErrorMessage(error, "Không tải được thông báo"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnsType<NotificationRow> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      render: (v) => v || "—",
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      ellipsis: true,
      render: (v) => v || "—",
    },
    {
      title: "Loại",
      dataIndex: "type",
      width: 140,
      render: (v) => v || "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "isRead",
      width: 120,
      render: (v) =>
        v ? <Tag color="default">Đã đọc</Tag> : <Tag color="green">Mới</Tag>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: 160,
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "—"),
    },
    {
      title: "Thao tác",
      width: 200,
      render: (_, row) => (
        <Space>
          {!row.isRead && (
            <Button
              size="small"
              onClick={async () => {
                try {
                  await markNotificationRead(getId(row));
                  await load(page, pageSize);
                } catch (error) {
                  message.error(getErrorMessage(error, "Đánh dấu đọc thất bại"));
                }
              }}
            >
              Đã đọc
            </Button>
          )}
          <Popconfirm
            title="Xóa thông báo?"
            onConfirm={async () => {
              try {
                await deleteNotification(getId(row));
                message.success("Đã xóa");
                await load(page, pageSize);
              } catch (error) {
                message.error(getErrorMessage(error, "Xóa thất bại"));
              }
            }}
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Thông báo"
        extra={
          <Space>
            <Button
              onClick={async () => {
                try {
                  await markAllNotificationsRead();
                  message.success("Đã đánh dấu tất cả đã đọc");
                  await load(page, pageSize);
                } catch (error) {
                  message.error(getErrorMessage(error, "Thao tác thất bại"));
                }
              }}
            >
              Đọc tất cả
            </Button>
            <Button onClick={() => load(page, pageSize)}>Làm mới</Button>
          </Space>
        }
      >
        <Table<NotificationRow>
          rowKey={(row) => getId(row)}
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => load(p, ps),
          }}
        />
      </Card>
    </div>
  );
}
