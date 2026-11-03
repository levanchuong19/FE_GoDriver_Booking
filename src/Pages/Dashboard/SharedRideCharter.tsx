import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  createSharedCharter,
  quoteSharedCharter,
} from "../../Config/managementApi";
import { getErrorMessage } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";

export default function SharedRideCharterPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Record<string, unknown> | null>(null);

  const buildPayload = (values: Record<string, unknown>) => ({
    origin: {
      address: values.originAddress,
      lat: values.originLat,
      lng: values.originLng,
    },
    destination: {
      address: values.destinationAddress,
      lat: values.destinationLat,
      lng: values.destinationLng,
    },
    departureAt: dayjs(values.departureAt as dayjs.Dayjs).toISOString(),
    passengerCount: values.passengerCount || 1,
    note: values.note,
  });

  const handleQuote = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      const data = (await quoteSharedCharter(buildPayload(values))) as Record<
        string,
        unknown
      >;
      setQuote(data);
      message.success("Đã lấy báo giá bao xe");
    } catch (error) {
      notifyError(error, "Báo giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      await createSharedCharter(buildPayload(values));
      message.success("Đã tạo yêu cầu bao xe");
    } catch (error) {
      notifyError(error, "Tạo bao xe thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <Space>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
        <h1 className="text-xl font-semibold m-0">Báo giá / tạo bao xe</h1>
      </Space>

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            passengerCount: 4,
            departureAt: dayjs().add(1, "day").hour(8).minute(0),
            originLat: 10.7769,
            originLng: 106.7009,
            destinationLat: 10.346,
            destinationLng: 107.0843,
            originAddress: "TP.HCM",
            destinationAddress: "Vũng Tàu",
          }}
        >
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="originAddress"
                label="Điểm đi"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="destinationAddress"
                label="Điểm đến"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="originLat" label="Origin lat" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="originLng" label="Origin lng" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="destinationLat"
                label="Dest lat"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="destinationLng"
                label="Dest lng"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="departureAt"
                label="Thời gian khởi hành"
                rules={[{ required: true }]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="passengerCount" label="Số khách">
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="note" label="Ghi chú">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button type="primary" loading={loading} onClick={handleQuote}>
              Báo giá
            </Button>
            <Button loading={loading} onClick={handleCreate}>
              Tạo yêu cầu bao xe
            </Button>
          </Space>
        </Form>
      </Card>

      {quote && (
        <Card title="Kết quả báo giá">
          <pre className="bg-gray-50 p-3 rounded overflow-auto text-sm">
            {JSON.stringify(
              {
                ...quote,
                prettyPrice: formatVND(
                  Number(
                    quote.price ??
                      quote.total ??
                      quote.charterPrice ??
                      quote.amount ??
                      0
                  )
                ),
              },
              null,
              2
            )}
          </pre>
        </Card>
      )}
    </div>
  );
}
