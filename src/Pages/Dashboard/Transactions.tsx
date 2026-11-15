/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import api from "../../Config/api";
import {
  approveWithdrawRequest,
  listWithdrawRequests,
  rejectWithdrawRequest,
} from "../../Config/adminApi";
import {
  getWithdrawRequestId,
  isWithdrawActionable,
  type Transaction,
} from "../../models/Transaction";
import formatVND from "../../Utils/currency";
import { unwrapList } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";

type PaginationState = { current: number; pageSize: number; total: number };

type WithdrawRow = {
  _id?: string;
  id?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  processedAt?: string;
  driver?: {
    _id?: string;
    fullName?: string;
    phone?: string;
    email?: string;
  };
};

const typeLabels: Record<string, string> = {
  booking_income: "Thu từ chuyến",
  commission_deduct: "Hoa hồng",
  withdraw: "Rút tiền",
  adjustment: "Điều chỉnh",
};

const statusColors: Record<string, string> = {
  Paid: "green",
  Pending: "gold",
  Failed: "red",
  approved: "green",
  rejected: "red",
  pending: "gold",
};

export default function TransactionsPage() {
  const [sp, setSp] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    current: Number(sp.get("page") || 1),
    pageSize: Number(sp.get("limit") || 20),
    total: 0,
  });
  const [type, setType] = useState(sp.get("type") || "");
  const [loading, setLoading] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [rejectTarget, setRejectTarget] = useState<Transaction | null>(null);
  const [withdrawRows, setWithdrawRows] = useState<WithdrawRow[]>([]);
  const [withdrawStatus, setWithdrawStatus] = useState("pending");
  const [view, setView] = useState<"transactions" | "withdraws">("transactions");

  const fetchTransactions = useCallback(
    async (page = 1, limit = pagination.pageSize, nextType = type) => {
      setLoading(true);
      try {
        const res = await api.get("/admin/transactions", {
          params: {
            page,
            limit,
            type: nextType || undefined,
          },
        });
        const parsed = unwrapList<Transaction>(res.data);
        setTransactions(parsed.items);
        setPagination({
          current: parsed.page ?? page,
          pageSize: parsed.limit ?? limit,
          total: parsed.total,
        });
      } catch (error: any) {
        notifyError(error, "Không thể tải danh sách giao dịch");
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize, type],
  );

  const fetchWithdraws = useCallback(
    async (page = 1, limit = pagination.pageSize, nextStatus = withdrawStatus) => {
      setLoading(true);
      try {
        const parsed = await listWithdrawRequests({
          status: nextStatus || undefined,
          page,
          limit,
        });
        setWithdrawRows(parsed.items as WithdrawRow[]);
        setPagination({
          current: parsed.page ?? page,
          pageSize: parsed.limit ?? limit,
          total: parsed.total,
        });
      } catch (error: any) {
        notifyError(error, "Không thể tải yêu cầu rút tiền");
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize, withdrawStatus],
  );

  useEffect(() => {
    const next = new URLSearchParams(sp);
    if (type) next.set("type", type);
    else next.delete("type");
    next.set("page", String(pagination.current));
    next.set("limit", String(pagination.pageSize));
    setSp(next, { replace: true });
  }, [type, pagination.current, pagination.pageSize, sp, setSp]);

  useEffect(() => {
    if (view === "withdraws") {
      fetchWithdraws(pagination.current, pagination.pageSize, withdrawStatus);
    } else {
      fetchTransactions(pagination.current, pagination.pageSize, type);
    }
  }, [
    fetchTransactions,
    fetchWithdraws,
    pagination.current,
    pagination.pageSize,
    type,
    view,
    withdrawStatus,
  ]);

  const handleApprove = async (requestId: string) => {
    if (!requestId) {
      notifyError("Không tìm thấy mã yêu cầu rút tiền");
      return;
    }
    setWorkingId(requestId);
    try {
      await approveWithdrawRequest(requestId);
      message.success("Đã duyệt yêu cầu rút tiền");
      if (view === "withdraws") {
        await fetchWithdraws(pagination.current, pagination.pageSize, withdrawStatus);
      } else {
        await fetchTransactions(pagination.current, pagination.pageSize, type);
      }
    } catch (error) {
      notifyError(error, "Duyệt rút tiền thất bại");
    } finally {
      setWorkingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectMessage.trim()) return;
    const requestId =
      getWithdrawRequestId(rejectTarget) ||
      String(
        (rejectTarget as Transaction & { _id?: string })._id ||
          rejectTarget.id ||
          "",
      );
    if (!requestId) {
      notifyError("Không tìm thấy mã yêu cầu rút tiền");
      return;
    }
    setWorkingId(requestId);
    try {
      await rejectWithdrawRequest(requestId, rejectMessage.trim());
      message.success("Đã từ chối và hoàn tiền");
      setRejectOpen(false);
      setRejectMessage("");
      setRejectTarget(null);
      if (view === "withdraws") {
        await fetchWithdraws(pagination.current, pagination.pageSize, withdrawStatus);
      } else {
        await fetchTransactions(pagination.current, pagination.pageSize, type);
      }
    } catch (error) {
      notifyError(error, "Từ chối rút tiền thất bại");
    } finally {
      setWorkingId(null);
    }
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: "Mã booking",
      dataIndex: "bookingCode",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Tài xế",
      dataIndex: "driverName",
      width: 160,
      render: (_, r) => r.driverName || r.driverId || "—",
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
      render: (v, row) => v || row.withdrawRequest?.status || "—",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, row) =>
        isWithdrawActionable(row) ? (
          <Space>
            <Popconfirm
              title="Duyệt yêu cầu rút tiền?"
              onConfirm={() => handleApprove(getWithdrawRequestId(row) || "")}
            >
              <Button
                type="primary"
                size="small"
                loading={workingId === getWithdrawRequestId(row)}
              >
                Duyệt
              </Button>
            </Popconfirm>
            <Button
              danger
              size="small"
              onClick={() => {
                setRejectTarget(row);
                setRejectOpen(true);
              }}
            >
              Từ chối
            </Button>
          </Space>
        ) : (
          "—"
        ),
    },
  ];

  const withdrawColumns: ColumnsType<WithdrawRow> = [
    {
      title: "Mã yêu cầu",
      render: (_, row) => String(row._id || row.id || "—"),
      width: 200,
      ellipsis: true,
    },
    {
      title: "Tài xế",
      render: (_, row) =>
        row.driver?.fullName ||
        row.driver?.phone ||
        row.driver?._id ||
        "—",
      width: 180,
    },
    {
      title: "SĐT",
      render: (_, row) => row.driver?.phone || "—",
      width: 130,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      width: 140,
      render: (v) => formatVND(Number(v ?? 0)),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (v) => (
        <Tag color={statusColors[String(v)] || "default"}>{String(v || "—")}</Tag>
      ),
    },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      width: 160,
      render: (v) => (v ? dayjs(String(v)).format("DD/MM/YYYY HH:mm") : "—"),
    },
    {
      title: "Thao tác",
      width: 180,
      render: (_, row) => {
        const id = String(row._id || row.id || "");
        if (String(row.status || "").toLowerCase() !== "pending") return "—";
        return (
          <Space>
            <Popconfirm
              title="Duyệt yêu cầu rút tiền?"
              onConfirm={() => handleApprove(id)}
            >
              <Button type="primary" size="small" loading={workingId === id}>
                Duyệt
              </Button>
            </Popconfirm>
            <Button
              danger
              size="small"
              onClick={() => {
                setRejectTarget({
                  id,
                  _id: id,
                  type: "withdraw",
                  withdrawRequest: { _id: id, status: "pending" },
                } as Transaction);
                setRejectOpen(true);
              }}
            >
              Từ chối
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<span className="font-semibold text-lg">Giao dịch / rút tiền</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <div className="mb-4 flex flex-wrap gap-3">
          <Select
            value={view}
            style={{ width: 220 }}
            onChange={(value) => {
              setView(value);
              setPagination((p) => ({ ...p, current: 1 }));
            }}
            options={[
              { value: "transactions", label: "Tất cả giao dịch" },
              { value: "withdraws", label: "Hàng đợi rút tiền" },
            ]}
          />
          {view === "transactions" ? (
            <Select
              value={type}
              style={{ width: 220 }}
              onChange={(value) => {
                setType(value);
                setPagination((p) => ({ ...p, current: 1 }));
              }}
              options={[
                { value: "", label: "Tất cả loại" },
                { value: "booking_income", label: "Thu từ chuyến" },
                { value: "commission_deduct", label: "Hoa hồng" },
                { value: "withdraw", label: "Rút tiền" },
                { value: "adjustment", label: "Điều chỉnh" },
              ]}
            />
          ) : (
            <Select
              value={withdrawStatus}
              style={{ width: 220 }}
              onChange={(value) => {
                setWithdrawStatus(value);
                setPagination((p) => ({ ...p, current: 1 }));
              }}
              options={[
                { value: "", label: "Tất cả trạng thái" },
                { value: "pending", label: "Chờ duyệt" },
                { value: "approved", label: "Đã duyệt" },
                { value: "rejected", label: "Từ chối" },
              ]}
            />
          )}
        </div>
        {view === "transactions" ? (
          <Table<Transaction>
            rowKey={(r) => r.id || r._id || `${r.type}-${r.createdAt}`}
            dataSource={transactions}
            columns={columns}
            loading={loading}
            bordered
            scroll={{ x: 1400 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setPagination((p) => ({ ...p, pageSize, current: page }));
              },
            }}
          />
        ) : (
          <Table<WithdrawRow>
            rowKey={(r) => String(r._id || r.id)}
            dataSource={withdrawRows}
            columns={withdrawColumns}
            loading={loading}
            bordered
            scroll={{ x: 1000 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setPagination((p) => ({ ...p, pageSize, current: page }));
              },
            }}
          />
        )}
      </Card>

      <Modal
        title="Từ chối yêu cầu rút tiền"
        open={rejectOpen}
        onCancel={() => {
          setRejectOpen(false);
          setRejectTarget(null);
          setRejectMessage("");
        }}
        onOk={handleReject}
        okText="Từ chối và hoàn tiền"
        okButtonProps={{
          danger: true,
          disabled: !rejectMessage.trim(),
          loading: Boolean(workingId),
        }}
      >
        <p className="text-sm text-gray-500 mb-2">
          Lý do từ chối sẽ được lưu lại và tiền được hoàn vào ví tài xế.
        </p>
        <Input.TextArea
          rows={4}
          value={rejectMessage}
          onChange={(e) => setRejectMessage(e.target.value)}
          placeholder="Nhập lý do từ chối"
        />
      </Modal>
    </div>
  );
}
