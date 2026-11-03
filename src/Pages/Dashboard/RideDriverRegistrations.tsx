import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, Input, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { listRideDriverRegistrations } from "../../Config/adminApi";
import { notifyError } from "../../Utils/notify";
import type { RideDriverRegistration } from "../../models/RideDriver";

const statusColor: Record<string, string> = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  draft: "default",
};

export default function RideDriverRegistrations() {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(sp.get("status") || "pending");
  const [searchInput, setSearchInput] = useState(sp.get("search") || "");
  const [search, setSearch] = useState(sp.get("search") || "");
  const [page, setPage] = useState(Number(sp.get("page") || 1));
  const [pageSize, setPageSize] = useState(Number(sp.get("limit") || 10));
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RideDriverRegistration[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const next = new URLSearchParams(sp);
    if (status) next.set("status", status);
    else next.delete("status");
    if (search) next.set("search", search);
    else next.delete("search");
    next.set("page", String(page));
    next.set("limit", String(pageSize));
    setSp(next, { replace: true });
  }, [status, search, page, pageSize, sp, setSp]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await listRideDriverRegistrations({
          status: status || undefined,
          search: search || undefined,
          page,
          limit: pageSize,
        });
        if (!ignore) {
          setItems(data.items);
          setTotal(data.total);
        }
      } catch (error) {
        if (!ignore) {
          notifyError(error, "Không thể tải danh sách tài xế Đặt xe");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [status, search, page, pageSize]);

  const columns: ColumnsType<RideDriverRegistration> = useMemo(
    () => [
      {
        title: "Họ tên",
        dataIndex: "fullName",
        render: (value) => value || "—",
      },
      { title: "Email", dataIndex: "email", render: (value) => value || "—" },
      { title: "SĐT", dataIndex: "phone", render: (value) => value || "—" },
      {
        title: "KYC",
        dataIndex: "kycStatus",
        render: (value) => (
          <Tag color={statusColor[value] || "default"}>
            {(value || "—").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Đặt xe",
        dataIndex: "status",
        render: (value) => (
          <Tag color={statusColor[value] || "default"}>
            {(value || "—").toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Xe",
        render: (_, row) =>
          row.vehicle?.plateNumber ||
          row.vehicle?.licensePlate ||
          row.vehicle?.categoryCode ||
          "—",
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        render: (value) =>
          value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—",
      },
      {
        title: "Thao tác",
        width: 120,
        render: (_, row) => (
          <Button
            type="primary"
            onClick={() => navigate(`/dashboard/ride-drivers/${row.userId}`)}
            disabled={!row.userId}
          >
            Xem
          </Button>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="p-6">
      <Card
        title="Đăng ký tài xế Đặt xe"
        extra={<span className="text-gray-500 text-sm">Tổng: {total}</span>}
      >
        <Space wrap className="mb-4">
          <Select
            value={status}
            style={{ width: 180 }}
            onChange={(value) => {
              setPage(1);
              setStatus(value);
            }}
            options={[
              { value: "", label: "Tất cả" },
              { value: "pending", label: "Chờ duyệt" },
              { value: "approved", label: "Đã duyệt" },
              { value: "rejected", label: "Từ chối" },
            ]}
          />
          <Input.Search
            placeholder="Tên / email / SĐT"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            allowClear
            style={{ width: 280 }}
          />
        </Space>
        <Table<RideDriverRegistration>
          rowKey={(row) =>
            row.userId || `${row.email}-${row.phone}-${row.createdAt}`
          }
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
