import { useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Row,
  Space,
  Table,
  Tabs,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  createSelfDriveBooking,
  listSelfDriveVehiclesMine,
  quoteSelfDriveVehicle,
  searchSelfDriveVehicles,
} from "../../Config/managementApi";
import { getErrorMessage } from "../../Utils/apiData";
import formatVND from "../../Utils/currency";

type AnyRow = Record<string, unknown> & { id?: string; _id?: string };

function rowId(row: AnyRow) {
  return String(row.id || row._id || row.vehicleId || "");
}

export default function SelfDrivePage() {
  const [searchForm] = Form.useForm();
  const [quoteForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mineLoading, setMineLoading] = useState(false);
  const [vehicles, setVehicles] = useState<AnyRow[]>([]);
  const [mineVehicles, setMineVehicles] = useState<AnyRow[]>([]);
  const [selected, setSelected] = useState<AnyRow | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteResult, setQuoteResult] = useState<Record<string, unknown> | null>(
    null
  );
  const [working, setWorking] = useState(false);

  const handleSearch = async () => {
    const values = await searchForm.validateFields();
    setLoading(true);
    try {
      const data = await searchSelfDriveVehicles({
        startAt: dayjs(values.range[0]).toISOString(),
        endAt: dayjs(values.range[1]).toISOString(),
        lat: values.lat,
        lng: values.lng,
        seatCount: values.seatCount,
        minPrice: values.minPrice,
        maxPrice: values.maxPrice,
      });
      setVehicles(data.items as AnyRow[]);
      message.success(`Tìm thấy ${data.total} xe`);
    } catch (error) {
      message.error(getErrorMessage(error, "Tìm xe thất bại"));
    } finally {
      setLoading(false);
    }
  };

  const loadMine = async () => {
    setMineLoading(true);
    try {
      const data = await listSelfDriveVehiclesMine();
      setMineVehicles(data.items as AnyRow[]);
    } catch (error) {
      message.error(getErrorMessage(error, "Không tải được xe của tôi"));
    } finally {
      setMineLoading(false);
    }
  };

  const openQuote = (row: AnyRow) => {
    setSelected(row);
    setQuoteResult(null);
    quoteForm.setFieldsValue({
      range: [
        dayjs().add(1, "day").hour(8).minute(0),
        dayjs().add(2, "day").hour(8).minute(0),
      ],
    });
    setQuoteOpen(true);
  };

  const handleQuote = async () => {
    if (!selected) return;
    const values = await quoteForm.validateFields();
    setWorking(true);
    try {
      const data = (await quoteSelfDriveVehicle(rowId(selected), {
        startAt: dayjs(values.range[0]).toISOString(),
        endAt: dayjs(values.range[1]).toISOString(),
      })) as Record<string, unknown>;
      setQuoteResult(data);
      message.success("Đã lấy báo giá");
    } catch (error) {
      message.error(getErrorMessage(error, "Báo giá thất bại"));
    } finally {
      setWorking(false);
    }
  };

  const handleBook = async () => {
    if (!selected) return;
    const values = await quoteForm.validateFields();
    setWorking(true);
    try {
      await createSelfDriveBooking({
        vehicleId: rowId(selected),
        startAt: dayjs(values.range[0]).toISOString(),
        endAt: dayjs(values.range[1]).toISOString(),
      });
      message.success("Đã tạo booking thuê xe tự lái");
      setQuoteOpen(false);
    } catch (error) {
      message.error(getErrorMessage(error, "Tạo booking thất bại"));
    } finally {
      setWorking(false);
    }
  };

  const columns: ColumnsType<AnyRow> = [
    {
      title: "Xe",
      render: (_, row) =>
        String(row.name || row.title || row.model || rowId(row) || "—"),
    },
    {
      title: "Biển số",
      render: (_, row) => String(row.plateNumber || row.plate || "—"),
      width: 140,
    },
    {
      title: "Ghế",
      render: (_, row) => String(row.seatCount || row.seats || "—"),
      width: 80,
    },
    {
      title: "Giá/ngày",
      render: (_, row) =>
        formatVND(Number(row.pricePerDay || row.dailyPrice || row.price || 0)),
      width: 140,
    },
    {
      title: "Trạng thái",
      render: (_, row) => String(row.status || "—"),
      width: 120,
    },
    {
      title: "Thao tác",
      width: 160,
      render: (_, row) => (
        <Button type="primary" onClick={() => openQuote(row)}>
          Báo giá / đặt
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <Card title="Thuê xe tự lái / Self Drive">
        <Tabs
          items={[
            {
              key: "search",
              label: "Tìm xe trống",
              children: (
                <div className="space-y-4">
                  <Form
                    form={searchForm}
                    layout="vertical"
                    initialValues={{
                      range: [
                        dayjs().add(1, "day").hour(8).minute(0),
                        dayjs().add(3, "day").hour(8).minute(0),
                      ],
                      lat: 10.7769,
                      lng: 106.7009,
                    }}
                  >
                    <Row gutter={12}>
                      <Col xs={24} md={10}>
                        <Form.Item
                          name="range"
                          label="Khoảng thời gian"
                          rules={[{ required: true }]}
                        >
                          <DatePicker.RangePicker
                            showTime
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={12} md={4}>
                        <Form.Item name="lat" label="Lat">
                          <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={12} md={4}>
                        <Form.Item name="lng" label="Lng">
                          <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={12} md={3}>
                        <Form.Item name="seatCount" label="Ghế">
                          <InputNumber min={2} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={12} md={3} className="flex items-end">
                        <Form.Item>
                          <Button
                            type="primary"
                            loading={loading}
                            onClick={handleSearch}
                          >
                            Tìm
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <Table<AnyRow>
                    rowKey={(row) => rowId(row)}
                    columns={columns}
                    dataSource={vehicles}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                  />
                </div>
              ),
            },
            {
              key: "mine",
              label: "Xe của tài khoản",
              children: (
                <div className="space-y-4">
                  <Button type="primary" loading={mineLoading} onClick={loadMine}>
                    Tải danh sách xe
                  </Button>
                  <Table<AnyRow>
                    rowKey={(row) => rowId(row)}
                    columns={columns}
                    dataSource={mineVehicles}
                    loading={mineLoading}
                    pagination={{ pageSize: 10 }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={`Báo giá / đặt xe ${selected ? rowId(selected) : ""}`}
        open={quoteOpen}
        onCancel={() => setQuoteOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setQuoteOpen(false)}>Đóng</Button>
            <Button loading={working} onClick={handleQuote}>
              Báo giá
            </Button>
            <Button type="primary" loading={working} onClick={handleBook}>
              Tạo booking
            </Button>
          </Space>
        }
      >
        <Form form={quoteForm} layout="vertical">
          <Form.Item
            name="range"
            label="Thời gian thuê"
            rules={[{ required: true }]}
          >
            <DatePicker.RangePicker showTime style={{ width: "100%" }} />
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
