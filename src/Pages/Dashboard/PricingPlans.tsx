import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  createPricingPlan,
  createPricingQuote,
  listPricingPlans,
} from "../../Config/managementApi";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";

type Plan = Record<string, unknown> & { id?: string; _id?: string };

const SERVICES = [
  "DRIVER_BOOKING",
  "RIDE_HAILING",
  "SELF_DRIVE",
  "DELIVERY",
  "ROADSIDE_ASSISTANCE",
  "PARKING",
];

export default function PricingPlansPage() {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [quoteResult, setQuoteResult] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [createForm] = Form.useForm();
  const [quoteForm] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const data = await listPricingPlans();
      setPlans(data.items as Plan[]);
    } catch (error) {
      notifyError(error, "Không tải được pricing plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    const values = await createForm.validateFields();
    setWorking(true);
    try {
      let rules: unknown = undefined;
      if (values.rulesJson?.trim()) {
        rules = JSON.parse(values.rulesJson);
      }
      await createPricingPlan({
        service: values.service,
        name: values.name,
        version: values.version,
        baseFare: values.baseFare,
        pricePerKm: values.pricePerKm,
        pricePerMinute: values.pricePerMinute,
        minimumFare: values.minimumFare,
        platformFee: values.platformFee,
        rules,
        active: true,
      });
      message.success("Đã tạo version bảng giá mới");
      setCreateOpen(false);
      createForm.resetFields();
      await load();
    } catch (error) {
      notifyError(error, "Tạo plan thất bại (kiểm tra JSON rules nếu có)");
    } finally {
      setWorking(false);
    }
  };

  const handleQuote = async () => {
    const values = await quoteForm.validateFields();
    setWorking(true);
    try {
      let context: Record<string, unknown> = {};
      if (values.contextJson?.trim()) {
        context = JSON.parse(values.contextJson);
      }
      const data = (await createPricingQuote({
        service: values.service,
        context,
      })) as Record<string, unknown>;
      setQuoteResult(data);
      message.success("Đã tạo quote");
    } catch (error) {
      notifyError(error, "Tạo quote thất bại");
    } finally {
      setWorking(false);
    }
  };

  const columns: ColumnsType<Plan> = [
    {
      title: "Service",
      dataIndex: "service",
      render: (v) => String(v || "—"),
    },
    {
      title: "Tên",
      dataIndex: "name",
      render: (v) => String(v || "—"),
    },
    {
      title: "Version",
      dataIndex: "version",
      width: 100,
      render: (v) => String(v ?? "—"),
    },
    {
      title: "Base",
      render: (_, row) => formatVND(Number(row.baseFare ?? 0)),
      width: 120,
    },
    {
      title: "Active",
      dataIndex: "active",
      width: 100,
      render: (v) =>
        v === false ? <Tag color="red">Off</Tag> : <Tag color="green">On</Tag>,
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <Card
        title="Pricing Engine — Plans"
        extra={
          <Space>
            <Button onClick={() => setQuoteOpen(true)}>Test quote</Button>
            <Button type="primary" onClick={() => setCreateOpen(true)}>
              Tạo version mới
            </Button>
          </Space>
        }
      >
        <Table<Plan>
          rowKey={(row) => String(row.id || row._id || row.version || row.name)}
          columns={columns}
          dataSource={plans}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Tạo PricingPlan version mới"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={handleCreate}
        confirmLoading={working}
        okText="Tạo"
        width={640}
      >
        <Form
          form={createForm}
          layout="vertical"
          initialValues={{ service: "DRIVER_BOOKING", version: 1 }}
        >
          <Form.Item
            name="service"
            label="Service"
            rules={[{ required: true }]}
          >
            <Select options={SERVICES.map((s) => ({ value: s, label: s }))} />
          </Form.Item>
          <Form.Item name="name" label="Tên plan">
            <Input />
          </Form.Item>
          <Form.Item name="version" label="Version">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Space wrap className="w-full">
            <Form.Item name="baseFare" label="Base fare">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="pricePerKm" label="Price/km">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="pricePerMinute" label="Price/min">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="minimumFare" label="Minimum">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="platformFee" label="Platform fee">
              <InputNumber min={0} />
            </Form.Item>
          </Space>
          <Form.Item
            name="rulesJson"
            label="Rules JSON (tuỳ chọn)"
            tooltip="Nếu backend yêu cầu schema riêng, dán JSON rules vào đây"
          >
            <Input.TextArea rows={5} placeholder='{"...": "..."}' />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Test Pricing Quote"
        open={quoteOpen}
        onCancel={() => setQuoteOpen(false)}
        onOk={handleQuote}
        confirmLoading={working}
        okText="Tạo quote"
        width={640}
      >
        <Form
          form={quoteForm}
          layout="vertical"
          initialValues={{
            service: "DRIVER_BOOKING",
            contextJson: '{\n  "distanceKm": 10\n}',
          }}
        >
          <Form.Item
            name="service"
            label="Service"
            rules={[{ required: true }]}
          >
            <Select options={SERVICES.map((s) => ({ value: s, label: s }))} />
          </Form.Item>
          <Form.Item name="contextJson" label="Context JSON">
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
        {quoteResult && (
          <pre className="bg-gray-50 p-3 rounded overflow-auto text-sm">
            {JSON.stringify(quoteResult, null, 2)}
          </pre>
        )}
      </Modal>
    </div>
  );
}
