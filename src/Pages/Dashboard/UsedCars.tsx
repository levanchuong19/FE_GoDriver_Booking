import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { deleteUsedCar, listUsedCars } from "../../Config/adminApi";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";
import {
  getUsedCarId,
  type UsedCarListing,
  type UsedCarStatus,
} from "../../models/UsedCar";
import { seedMercedesS450Listing } from "../../Utils/seedMercedesListing";

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

const STATUS_OPTIONS: UsedCarStatus[] = [
  "PENDING_REVIEW",
  "PUBLISHED",
  "REJECTED",
  "HIDDEN",
  "SOLD",
  "EXPIRED",
  "DRAFT",
  "ARCHIVED",
];

export default function UsedCarsPage() {
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const [status, setStatus] = useState(sp.get("status") || "");
  const [keywordInput, setKeywordInput] = useState(sp.get("keyword") || "");
  const [keyword, setKeyword] = useState(sp.get("keyword") || "");
  const [page, setPage] = useState(Number(sp.get("page") || 1));
  const [pageSize, setPageSize] = useState(Number(sp.get("limit") || 10));
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [items, setItems] = useState<UsedCarListing[]>([]);
  const [total, setTotal] = useState(0);

  const reload = async (
    nextStatus = status,
    nextKeyword = keyword,
    nextPage = page,
    nextSize = pageSize,
  ) => {
    setLoading(true);
    try {
      const data = await listUsedCars({
        status: nextStatus || undefined,
        keyword: nextKeyword || undefined,
        page: nextPage,
        limit: nextSize,
      });
      setItems(data.items as UsedCarListing[]);
      setTotal(data.total);
    } catch (error) {
      notifyError(error, "Không thể tải tin xe cũ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const next = new URLSearchParams(sp);
    if (status) next.set("status", status);
    else next.delete("status");
    if (keyword) next.set("keyword", keyword);
    else next.delete("keyword");
    next.set("page", String(page));
    next.set("limit", String(pageSize));
    setSp(next, { replace: true });
  }, [status, keyword, page, pageSize, sp, setSp]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setKeyword(keywordInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [keywordInput]);

  useEffect(() => {
    reload(status, keyword, page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, keyword, page, pageSize]);

  const handleDelete = async (id: string) => {
    try {
      await deleteUsedCar(id);
      message.success("Đã xóa (archive) tin");
      await reload();
    } catch (error) {
      notifyError(error, "Xóa tin thất bại");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const id = await seedMercedesS450Listing({
        autoSubmit: true,
        autoApprove: true,
      });
      message.success("Đã thêm tin Mercedes S450 2019");
      navigate(`/dashboard/used-cars/${id}`);
    } catch (error) {
      notifyError(error, "Thêm tin S450 thất bại");
    } finally {
      setSeeding(false);
    }
  };

  const columns: ColumnsType<UsedCarListing> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      render: (value) => value || "—",
      ellipsis: true,
    },
    {
      title: "Loại",
      dataIndex: "vehicleType",
      width: 120,
      render: (value) => value || "—",
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 140,
      render: (value, row) =>
        row.negotiable && !value ? "Thương lượng" : formatVND(value ?? 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (value) => (
        <Tag color={statusColor[value] || "default"}>{value || "—"}</Tag>
      ),
    },
    {
      title: "Lượt xem",
      dataIndex: "viewsCount",
      width: 100,
      render: (value) => value ?? 0,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 160,
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—",
    },
    {
      title: "Thao tác",
      width: 260,
      render: (_, row) => {
        const id = getUsedCarId(row);
        return (
          <Space wrap>
            <Button onClick={() => navigate(`/dashboard/used-cars/${id}`)}>
              Xem
            </Button>
            <Button
              type="primary"
              onClick={() => navigate(`/dashboard/used-cars/${id}/edit`)}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xóa tin này?"
              description="Tin sẽ được archive (soft-delete)."
              onConfirm={() => handleDelete(id)}
            >
              <Button danger>Xóa</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Chợ xe cũ"
        extra={
          <Space wrap>
            <Button loading={seeding} onClick={handleSeed}>
              Thêm tin S450 mẫu
            </Button>
            <Button
              type="primary"
              onClick={() => navigate("/dashboard/used-cars/new")}
            >
              Thêm tin mới
            </Button>
          </Space>
        }
      >
        <Space wrap className="mb-4">
          <Select
            value={status}
            style={{ width: 200 }}
            onChange={(value) => {
              setPage(1);
              setStatus(value);
            }}
            options={[
              { value: "", label: "Tất cả" },
              ...STATUS_OPTIONS.map((item) => ({
                value: item,
                label: item,
              })),
            ]}
          />
          <Input.Search
            placeholder="Từ khóa"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            allowClear
            style={{ width: 280 }}
          />
          <Button onClick={() => navigate("/dashboard/used-car-reports")}>
            Báo cáo vi phạm
          </Button>
        </Space>
        <Table<UsedCarListing>
          rowKey={(row) => getUsedCarId(row)}
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (nextPage, nextSize) => {
              setPage(nextPage);
              setPageSize(nextSize);
            },
          }}
        />
      </Card>
    </div>
  );
}
