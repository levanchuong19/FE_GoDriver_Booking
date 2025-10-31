/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/admin/PricingPage.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
  Select,
  DatePicker,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import api from "../../config/axios";
import type {
  FareBracket,
  FarePolicy,
  FarePolicyInput,
} from "../../models/Pricing";
import type { ColumnsType } from "antd/es/table";

type PricingRow = FarePolicy & { key?: string };

const isoOrUndefined = (d?: Dayjs | null) =>
  d && dayjs.isDayjs(d) ? d.toISOString() : undefined;

export default function PricingPage() {
  const [data, setData] = useState<PricingRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Drawer xem chi tiết
  const [openDetail, setOpenDetail] = useState(false);
  const [detail, setDetail] = useState<FarePolicy | null>(null);

  // Modal tạo/sửa
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<FarePolicy | null>(null);
  const [form] = Form.useForm<
    FarePolicyInput & { effectiveRange?: [Dayjs, Dayjs] }
  >();

  // Lấy danh sách
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/pricing/getAll");
      const list: FarePolicy[] =
        res.data?.data ??
        res.data?.items ??
        (Array.isArray(res.data) ? res.data : []);
      setData(list.map((x) => ({ ...x, key: x._id ?? x.serviceType })));
    } catch {
      message.error("Không thể tải danh sách bảng giá");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Xem chi tiết
  const handleView = async (id: string) => {
    try {
      const res = await api.get(`/pricing/getById/${id}`);
      const item: FarePolicy = res.data?.data ?? res.data;
      setDetail(item);
      setOpenDetail(true);
    } catch {
      message.error("Không thể tải chi tiết bảng giá");
    }
  };

  // Mở tạo mới
  const handleCreateOpen = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      serviceType: "per_km",
      baseFare: 0,
      fareBrackets: [{ from: 0, to: 10, pricePerKm: 0 }],
      multipliers: { after21h: 1, after23h: 1, weekend: 1, holiday: 1 },
      waitingFeePerMin: 0,
      platformFee: 0,
    } as any);
    setOpenEdit(true);
  };

  // Mở chỉnh sửa (load detail theo id để dữ liệu chắc chắn mới)
  const handleEditOpen = async (row: PricingRow) => {
    try {
      const res = await api.get(`/pricing/getById/${row._id}`);
      const item: FarePolicy = res.data?.data ?? res.data;

      setEditing(item);
      form.setFieldsValue({
        serviceType: item.serviceType,
        baseFare: item.baseFare,
        fareBrackets: item.fareBrackets,
        multipliers: item.multipliers,
        waitingFeePerMin: item.waitingFeePerMin,
        platformFee: item.platformFee,
        effectiveRange:
          item.effectiveFrom && item.effectiveTo
            ? [dayjs(item.effectiveFrom), dayjs(item.effectiveTo)]
            : undefined,
      } as any);
      setOpenEdit(true);
    } catch {
      message.error("Không thể tải dữ liệu để chỉnh sửa");
    }
  };

  // Lưu (create/update)
  const handleSave = async () => {
    const values = await form.validateFields();
    const payload: FarePolicyInput = {
      serviceType: values.serviceType,
      baseFare: values.baseFare,
      fareBrackets: values.fareBrackets,
      multipliers: values.multipliers,
      waitingFeePerMin: values.waitingFeePerMin,
      platformFee: values.platformFee,
      effectiveFrom: isoOrUndefined(values.effectiveRange?.[0]),
      effectiveTo: isoOrUndefined(values.effectiveRange?.[1]),
    };

    try {
      if (editing?._id) {
        await api.put(`/pricing/update/${editing._id}`, payload);
        message.success("Cập nhật bảng giá thành công");
      } else {
        await api.post(`/pricing/create`, payload);
        message.success("Tạo bảng giá thành công");
      }
      setOpenEdit(false);
      setEditing(null);
      await fetchAll();
    } catch {
      message.error("Lưu bảng giá thất bại");
    }
  };

  // Xoá
  const handleDelete = async (row: PricingRow) => {
    try {
      await api.delete(`/pricing/delete/${row._id}`);
      message.success("Đã xoá bảng giá");
      await fetchAll();
    } catch {
      message.error("Không thể xoá bảng giá");
    }
  };

  // Cột Table
  const columns: ColumnsType<PricingRow> = useMemo(
    () => [
      {
        title: "Loại dịch vụ",
        dataIndex: "serviceType",
        render: (v) => <Tag color="blue">{v}</Tag>,
      },
      { title: "Giá mở cửa", dataIndex: "baseFare" },
      {
        title: "Hiệu lực từ",
        dataIndex: "effectiveFrom",
        render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "—"),
      },
      {
        title: "Đến",
        dataIndex: "effectiveTo",
        render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "—"),
      },
      {
        title: "Hành động",
        dataIndex: "actions",
        width: 240,
        render: (_, row) => (
          <Space>
            <Tooltip title="Xem chi tiết">
              <Button
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => handleView(String(row._id))}
              />
            </Tooltip>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditOpen(row)}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xoá bảng giá này?"
              onConfirm={() => handleDelete(row)}
            >
              <Button danger icon={<DeleteOutlined />}>
                Xoá
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Quản lý bảng giá</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateOpen}
        >
          Tạo bảng giá
        </Button>
      </div>

      <Table<PricingRow>
        rowKey={(r) => String(r._id ?? r.key)}
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Drawer chi tiết */}
      <Drawer
        title="Chi tiết bảng giá"
        width={680}
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      >
        {detail ? (
          <>
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Loại dịch vụ" span={2}>
                <Tag color="blue">{detail.serviceType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Giá mở cửa">
                {detail.baseFare}
              </Descriptions.Item>
              <Descriptions.Item label="Phí nền tảng">
                {detail.platformFee ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Phí chờ / phút">
                {detail.waitingFeePerMin ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Hiệu lực từ">
                {detail.effectiveFrom
                  ? dayjs(detail.effectiveFrom).format("DD/MM/YYYY HH:mm")
                  : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Đến">
                {detail.effectiveTo
                  ? dayjs(detail.effectiveTo).format("DD/MM/YYYY HH:mm")
                  : "—"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <h3 className="font-semibold mb-2">Bảng giá theo khoảng km</h3>
            <Table<FareBracket>
              size="small"
              rowKey={(_, i) => String(i)}
              dataSource={detail.fareBrackets}
              pagination={false}
              columns={[
                { title: "Từ (km)", dataIndex: "from", width: 120 },
                {
                  title: "Đến (km)",
                  dataIndex: "to",
                  width: 120,
                  render: (v) => (v === null || v === undefined ? "∞" : v),
                },
                { title: "Giá / km", dataIndex: "pricePerKm", width: 160 },
              ]}
            />

            <Divider />

            <h3 className="font-semibold mb-2">Hệ số nhân</h3>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="after21h">
                {detail.multipliers?.after21h ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="after23h">
                {detail.multipliers?.after23h ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="weekend">
                {detail.multipliers?.weekend ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="holiday">
                {detail.multipliers?.holiday ?? "—"}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : (
          "Đang tải…"
        )}
      </Drawer>

      {/* Modal tạo / chỉnh sửa */}
      <Modal
        title={editing ? "Chỉnh sửa bảng giá" : "Tạo bảng giá"}
        open={openEdit}
        onCancel={() => {
          setOpenEdit(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleSave}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
          initialValues={{
            serviceType: "per_km",
            multipliers: { after21h: 1, after23h: 1, weekend: 1, holiday: 1 },
          }}
        >
          <Form.Item
            label="Loại dịch vụ"
            name="serviceType"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "per_km", label: "per_km" },
                { value: "other", label: "other" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Giá mở cửa"
            name="baseFare"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={1000} />
          </Form.Item>

          <Form.Item label="Hiệu lực" name="effectiveRange">
            <DatePicker.RangePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Divider>Fare Brackets</Divider>
          <Form.List
            name="fareBrackets"
            rules={[
              {
                validator: async (_, v) =>
                  !v || v.length
                    ? Promise.resolve()
                    : Promise.reject(new Error("Cần ít nhất 1 khoảng giá")),
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    align="baseline"
                    style={{ display: "flex", marginBottom: 8 }}
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "from"]}
                      label="Từ (km)"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "to"]}
                      label="Đến (km)"
                      tooltip="Để trống hoặc null = không giới hạn"
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "pricePerKm"]}
                      label="Giá/km"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={500} />
                    </Form.Item>
                    <Button danger onClick={() => remove(field.name)}>
                      Xoá
                    </Button>
                  </Space>
                ))}
                <Button
                  onClick={() => add({ from: 0, to: undefined, pricePerKm: 0 })}
                  icon={<PlusOutlined />}
                >
                  Thêm khoảng giá
                </Button>
              </>
            )}
          </Form.List>

          <Divider>Multipliers</Divider>
          <Space size="large" wrap>
            <Form.Item label="after21h" name={["multipliers", "after21h"]}>
              <InputNumber min={0} step={0.01} />
            </Form.Item>
            <Form.Item label="after23h" name={["multipliers", "after23h"]}>
              <InputNumber min={0} step={0.01} />
            </Form.Item>
            <Form.Item label="weekend" name={["multipliers", "weekend"]}>
              <InputNumber min={0} step={0.01} />
            </Form.Item>
            <Form.Item label="holiday" name={["multipliers", "holiday"]}>
              <InputNumber min={0} step={0.01} />
            </Form.Item>
          </Space>

          <Divider>Phí khác</Divider>
          <Space size="large" wrap>
            <Form.Item label="waitingFeePerMin" name="waitingFeePerMin">
              <InputNumber min={0} step={100} />
            </Form.Item>
            <Form.Item label="platformFee" name="platformFee">
              <InputNumber min={0} step={100} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
