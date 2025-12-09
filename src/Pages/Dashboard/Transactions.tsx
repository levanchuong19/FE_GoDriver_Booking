/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Card, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import api from "../../Config/api";
import type { Transaction } from "../../models/Transaction";
import formatVND from "../../Utils/currency";

type PaginationState = { current: number; pageSize: number; total: number };

const typeLabels: Record<string, string> = {
  booking_income: "Thu từ chuyến",
  withdraw: "Rút tiền",
};

const statusColors: Record<string, string> = {
  Paid: "green",
  Pending: "gold",
  Failed: "red",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(
    async (page = 1, limit = pagination.pageSize) => {
      setLoading(true);
      try {
        const res = await api.get("/admin/transactions", {
          params: { page, limit },
        });

        const raw = res.data;
        const dataBlock = raw?.data ?? raw;
        const list: Transaction[] =
          dataBlock?.transactions ??
          dataBlock?.data ??
          (Array.isArray(raw) ? raw : []);
        const paginationMeta =
          dataBlock?.pagination ?? raw?.pagination ?? raw?.data?.pagination;

        setTransactions(list);
        setPagination({
          current: paginationMeta?.page ?? page,
          pageSize: paginationMeta?.limit ?? limit,
          total: paginationMeta?.total ?? list.length,
        });
      } catch (error: any) {
        const msg =
          error?.response?.data?.message ?? "Không thể tải danh sách giao dịch";
        message.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize]
  );

  useEffect(() => {
    fetchTransactions(1, pagination.pageSize);
  }, [fetchTransactions, pagination.pageSize]);

  const columns: ColumnsType<Transaction> = [
    // {
    //   title: "Mã giao dịch",
    //   dataIndex: "id",
    //   render: (_, r) => r.id || (r as any)._id || "—",
    //   width: 200,
    //   ellipsis: true,
    // },
    // {
    //   title: "Tài xế",
    //   dataIndex: "driverName",
    //   render: (_, r) => r.driverName || r.driverId || "—",
    //   width: 180,
    // },
    {
      title: "Mã booking",
      dataIndex: "bookingCode",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (v) => typeLabels[v] ?? v ?? "—",
      width: 140,
    },
    {
      title: "Kênh",
      dataIndex: "channel",
      width: 120,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      width: 140,
      render: (v) => formatVND(v ?? 0),
    },
    {
      title: "Số dư trước",
      dataIndex: "balanceBefore",
      width: 140,
      render: (v) => formatVND(v ?? 0),
    },
    {
      title: "Số dư sau",
      dataIndex: "balanceAfter",
      width: 140,
      render: (v) => formatVND(v ?? 0),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      width: 120,
      render: (v) => (
        <Tag color={statusColors[v ?? ""] || "default"}>{v ?? "—"}</Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: 180,
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "—"),
    },
    {
      title: "Rút tiền",
      dataIndex: "withdrawStatus",
      width: 120,
      render: (v) => v ?? "—",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      ellipsis: true,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<span className="font-semibold text-lg">Giao dịch</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Table<Transaction>
          rowKey={(r) => r.id || (r as any)._id}
          dataSource={transactions}
          columns={columns}
          loading={loading}
          bordered
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setPagination((p) => ({ ...p, pageSize }));
              fetchTransactions(page, pageSize);
            },
          }}
        />
      </Card>
    </div>
  );
}
