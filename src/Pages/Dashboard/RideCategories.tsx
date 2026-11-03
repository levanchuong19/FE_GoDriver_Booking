import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  InputNumber,
  Modal,
  Switch,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { listRideCategories, updateRideCategory } from "../../Config/adminApi";
import { getErrorMessage } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";
import type { RideCategory } from "../../models/Ride";

export default function RideCategoriesPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RideCategory[]>([]);
  const [editing, setEditing] = useState<RideCategory | null>(null);
  const [open, setOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const data = (await listRideCategories()) as RideCategory[];
      setItems(
        data.map((item) => ({
          ...item,
          code: String(item.code || item.id || ""),
          name: String(item.name || item.displayName || item.code || ""),
        }))
      );
    } catch (error) {
      notifyError(error, "Không thể tải danh mục loại xe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (row: RideCategory) => {
    setEditing(row);
    form.setFieldsValue({
      baseFare: row.baseFare,
      pricePerKm: row.pricePerKm,
      pricePerMinute: row.pricePerMinute,
      minimumFare: row.minimumFare,
      platformFee: row.platformFee,
      active: row.active ?? true,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editing?.code) return;
    const values = await form.validateFields();
    setWorking(true);
    try {
      await updateRideCategory(editing.code, values);
      message.success("Đã cập nhật bảng giá loại xe");
      setOpen(false);
      setEditing(null);
      await load();
    } catch (error) {
      notifyError(error, "Cập nhật thất bại");
    } finally {
      setWorking(false);
    }
  };

  const columns: ColumnsType<RideCategory> = [
    {
      title: "Mã",
      dataIndex: "code",
      width: 140,
    },
    {
      title: "Tên",
      dataIndex: "name",
      render: (value, row) => value || row.displayName || "—",
    },
    {
      title: "Giá mở cửa",
      dataIndex: "baseFare",
      render: (value) => formatVND(Number(value ?? 0)),
    },
    {
      title: "Giá / km",
      dataIndex: "pricePerKm",
      render: (value) => formatVND(Number(value ?? 0)),
    },
    {
      title: "Giá / phút",
      dataIndex: "pricePerMinute",
      render: (value) => formatVND(Number(value ?? 0)),
    },
    {
      title: "Tối thiểu",
      dataIndex: "minimumFare",
      render: (value) => formatVND(Number(value ?? 0)),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      width: 110,
      render: (value) =>
        value === false ? (
          <Tag color="red">Tắt</Tag>
        ) : (
          <Tag color="green">Bật</Tag>
        ),
    },
    {
      title: "Thao tác",
      width: 120,
      render: (_, row) => (
        <Button type="primary" onClick={() => openEdit(row)}>
          Sửa giá
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card title="Bảng giá loại xe Đặt xe">
        <Table<RideCategory>
          rowKey={(row) => row.code}
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={`Cập nhật ${editing?.code || ""}`}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onOk={handleSave}
        confirmLoading={working}
        okText="Lưu"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="baseFare" label="Giá mở cửa">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="pricePerKm" label="Giá / km">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="pricePerMinute" label="Giá / phút">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="minimumFare" label="Giá tối thiểu">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="platformFee" label="Phí nền tảng">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="active" label="Đang bật" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
