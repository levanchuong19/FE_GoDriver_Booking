import { useState } from "react";
import { Button, Card, Descriptions, Form, Input, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getDriverWallet } from "../../Config/adminApi";
import { listDriverWalletTransactions } from "../../Config/managementApi";
import { getErrorMessage } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";
import type { DriverWalletInfo } from "../../models/OnlineDriver";

type Tx = Record<string, unknown> & {
  _id?: string;
  id?: string;
  amount?: number;
  type?: string;
  createdAt?: string;
};

export default function DriverWalletsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<DriverWalletInfo | null>(null);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [driverId, setDriverId] = useState("");
  const [type, setType] = useState<"booking_income" | "withdraw">(
    "booking_income"
  );

  const handleLookup = async () => {
    const values = await form.validateFields();
    const id = String(values.driverId || "").trim();
    if (!id) return;
    setLoading(true);
    setDriverId(id);
    try {
      const [walletData, txData] = await Promise.all([
        getDriverWallet(id),
        listDriverWalletTransactions(id, type, { page: 1, limit: 50 }),
      ]);
      setWallet(walletData as DriverWalletInfo);
      setTransactions(txData.items as Tx[]);
    } catch (error) {
      setWallet(null);
      setTransactions([]);
      notifyError(error, "Không tải được ví / giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const reloadTx = async (nextType: "booking_income" | "withdraw") => {
    if (!driverId) return;
    setType(nextType);
    setLoading(true);
    try {
      const txData = await listDriverWalletTransactions(driverId, nextType, {
        page: 1,
        limit: 50,
      });
      setTransactions(txData.items as Tx[]);
    } catch (error) {
      notifyError(error, "Không tải được giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Tx> = [
    {
      title: "Loại",
      dataIndex: "type",
      width: 140,
      render: (v) => v || type,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      width: 140,
      render: (v) => formatVND(Number(v ?? 0)),
    },
    {
      title: "Số dư trước",
      dataIndex: "balanceBefore",
      width: 140,
      render: (v) => formatVND(Number(v ?? 0)),
    },
    {
      title: "Số dư sau",
      dataIndex: "balanceAfter",
      width: 140,
      render: (v) => formatVND(Number(v ?? 0)),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      ellipsis: true,
      render: (v) => String(v || "—"),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: 160,
      render: (v) => (v ? dayjs(String(v)).format("DD/MM/YYYY HH:mm") : "—"),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <Card title="Ví tài xế">
        <Form form={form} layout="inline" onFinish={handleLookup}>
          <Form.Item
            name="driverId"
            rules={[{ required: true, message: "Nhập driverId" }]}
          >
            <Input
              placeholder="Driver ID"
              style={{ width: 320 }}
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tra cứu
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {wallet && (
        <Card title={`Ví ${driverId}`}>
          <Descriptions bordered column={2} size="middle">
            <Descriptions.Item label="Số dư">
              {formatVND(wallet.balance ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Nợ">
              {formatVND(wallet.debt ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng thu nhập">
              {formatVND(wallet.totalEarnings ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Đã rút">
              {formatVND(wallet.totalWithdrawn ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {wallet.isLocked ? (
                <Tag color="red">Khóa</Tag>
              ) : (
                <Tag color="green">Mở</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngân hàng">
              {wallet.bankAccount?.bankName || "—"} /{" "}
              {wallet.bankAccount?.numberBank || "—"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {driverId && (
        <Card
          title="Giao dịch ví"
          extra={
            <Space>
              <Select
                value={type}
                style={{ width: 200 }}
                onChange={reloadTx}
                options={[
                  { value: "booking_income", label: "booking_income" },
                  { value: "withdraw", label: "withdraw" },
                ]}
              />
            </Space>
          }
        >
          <Table<Tx>
            rowKey={(row) => String(row._id || row.id)}
            columns={columns}
            dataSource={transactions}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </div>
  );
}
