/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table,
  Drawer,
  Descriptions,
  Tag,
  Space,
  Button,
  message,
  Card,
} from "antd";
import { EyeOutlined, CarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import type { Booking, PaginationMeta } from "../../models/Booking";
import api from "../../Config/api";

type Row = Booking & { key?: string };

export default function BookingPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Booking | null>(null);

  const fetchAll = useCallback(
    async (p = 1, ps = pageSize) => {
      setLoading(true);
      try {
        const res = await api.get("/bookings/get-all", {
          params: { page: p, limit: ps },
        });

        const raw = res.data;
        const list: Booking[] =
          (Array.isArray(raw) && raw) ||
          (Array.isArray(raw?.data) && raw.data) ||
          (Array.isArray(raw?.data?.data) && raw.data.data) ||
          [];

        const pagination: PaginationMeta | undefined =
          raw?.pagination ??
          raw?.data?.pagination ??
          raw?.data?.data?.pagination;

        setData(list.map((b) => ({ ...b, key: b._id })));
        setTotal(pagination?.total ?? list.length);
        setPage(pagination?.page ?? p);
        setPageSize(pagination?.limit ?? ps);
      } catch {
        message.error("Không thể tải danh sách bookings");
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchAll(1, pageSize);
  }, [fetchAll, pageSize]);

  const columns: ColumnsType<Row> = [
    {
      title: "Khách hàng",
      dataIndex: ["customerId", "fullName"],
      render: (_, r) => r.customerId?.fullName ?? "—",
      width: 180,
    },
    { title: "Điểm đón", dataIndex: "pickupLocation", ellipsis: true },
    { title: "Điểm đến", dataIndex: "dropoffLocation", ellipsis: true },
    {
      title: "Thời gian",
      dataIndex: "startTime",
      render: (_, r) =>
        r.startTime
          ? `${dayjs(r.startTime).format("DD/MM HH:mm")} → ${
              r.endTime ? dayjs(r.endTime).format("DD/MM HH:mm") : "—"
            }`
          : "—",
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => {
        const colors: Record<string, string> = {
          Confirmed: "blue",
          Completed: "green",
          Cancelled: "red",
          Pending: "gold",
        };
        return <Tag color={colors[v] || "default"}>{v}</Tag>;
      },
      width: 120,
    },
    {
      title: "Giá (đ)",
      dataIndex: "price",
      width: 120,
      render: (v) => v?.toLocaleString() ?? "—",
    },
    {
      title: "Hành động",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, row) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setCurrent(row);
              setOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <span className="font-semibold text-lg">Danh sách Bookings</span>
        }
        bordered={false}
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Table<Row>
          rowKey={(r) => r._id}
          dataSource={data}
          columns={columns}
          loading={loading}
          bordered
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => fetchAll(p, ps),
          }}
        />
      </Card>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <CarOutlined className="text-blue-600" />
            <span>Chi tiết Booking</span>
          </div>
        }
        open={open}
        width={720}
        onClose={() => setOpen(false)}
        styles={{
          body: { backgroundColor: "#fafafa" },
          header: { borderBottom: "1px solid #e5e5e5" },
        }}
      >
        {current ? (
          <Card bordered={false}>
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item span={2} label="Mã Booking">
                {current._id}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {current.customerId?.fullName ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {current.customerId?.email ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm đón" span={2}>
                {current.pickupLocation}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm đến" span={2}>
                {current.dropoffLocation}
              </Descriptions.Item>
              <Descriptions.Item label="Bắt đầu">
                {current.startTime
                  ? dayjs(current.startTime).format("DD/MM/YYYY HH:mm")
                  : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Kết thúc">
                {current.endTime
                  ? dayjs(current.endTime).format("DD/MM/YYYY HH:mm")
                  : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Khoảng cách (km)">
                {current.distance ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Thời lượng (phút)">
                {current.duration ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    current.status === "Completed"
                      ? "green"
                      : current.status === "Cancelled"
                      ? "red"
                      : current.status === "Confirmed"
                      ? "blue"
                      : "gold"
                  }
                >
                  {current.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Giá (đ)">
                {current.price?.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                {current.paymentStatus ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Tạo lúc">
                {current.createdAt
                  ? dayjs(current.createdAt).format("DD/MM/YYYY HH:mm")
                  : "—"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ) : (
          "Đang tải…"
        )}
      </Drawer>
    </div>
  );
}
