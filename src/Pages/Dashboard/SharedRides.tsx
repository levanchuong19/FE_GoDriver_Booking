import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  listSeatTemplates,
  listSharedTripsMine,
  listSharedVehiclesMine,
  searchSharedTrips,
} from "../../Config/managementApi";
import { getErrorMessage } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";
import formatVND from "../../Utils/currency";

type AnyRow = Record<string, unknown> & { id?: string; _id?: string };

function rowId(row: AnyRow) {
  return String(row.id || row._id || row.tripId || "");
}

export default function SharedRidesPage() {
  const navigate = useNavigate();
  const [searchLoading, setSearchLoading] = useState(false);
  const [mineLoading, setMineLoading] = useState(false);
  const [trips, setTrips] = useState<AnyRow[]>([]);
  const [mineTrips, setMineTrips] = useState<AnyRow[]>([]);
  const [vehicles, setVehicles] = useState<AnyRow[]>([]);
  const [templates, setTemplates] = useState<AnyRow[]>([]);
  const [form] = Form.useForm();

  const handleSearch = async () => {
    const values = await form.validateFields();
    setSearchLoading(true);
    try {
      const data = await searchSharedTrips({
        pickupLat: values.pickupLat,
        pickupLng: values.pickupLng,
        dropoffLat: values.dropoffLat,
        dropoffLng: values.dropoffLng,
        date: dayjs(values.date).format("YYYY-MM-DD"),
        passengerCount: values.passengerCount || 1,
      });
      setTrips(data.items as AnyRow[]);
      message.success(`Tìm thấy ${data.total} chuyến`);
    } catch (error) {
      notifyError(error, "Tìm chuyến thất bại");
    } finally {
      setSearchLoading(false);
    }
  };

  const loadMine = async () => {
    setMineLoading(true);
    try {
      const [tripData, vehicleData, templateData] = await Promise.all([
        listSharedTripsMine(),
        listSharedVehiclesMine(),
        listSeatTemplates(),
      ]);
      setMineTrips(tripData.items as AnyRow[]);
      setVehicles(vehicleData.items as AnyRow[]);
      setTemplates(templateData.items as AnyRow[]);
    } catch (error) {
      notifyError(error, "Không tải được dữ liệu xe ghép");
    } finally {
      setMineLoading(false);
    }
  };

  const tripColumns: ColumnsType<AnyRow> = [
    {
      title: "Mã",
      render: (_, row) => rowId(row) || "—",
      width: 160,
      ellipsis: true,
    },
    {
      title: "Đi",
      render: (_, row) =>
        String(
          (row.origin as { address?: string } | undefined)?.address ||
            row.originAddress ||
            "—"
        ),
      ellipsis: true,
    },
    {
      title: "Đến",
      render: (_, row) =>
        String(
          (row.destination as { address?: string } | undefined)?.address ||
            row.destinationAddress ||
            "—"
        ),
      ellipsis: true,
    },
    {
      title: "Khởi hành",
      render: (_, row) =>
        row.departureAt
          ? dayjs(String(row.departureAt)).format("DD/MM/YYYY HH:mm")
          : "—",
      width: 160,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (value) => <Tag>{String(value || "—")}</Tag>,
    },
    {
      title: "Giá ghế",
      render: (_, row) =>
        formatVND(Number(row.baseSeatPrice ?? row.seatPrice ?? 0)),
      width: 120,
    },
    {
      title: "Thao tác",
      width: 100,
      render: (_, row) => (
        <Button
          type="primary"
          disabled={!rowId(row)}
          onClick={() => navigate(`/dashboard/shared-rides/${rowId(row)}`)}
        >
          Quản lý
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <Card
        title="Xe ghép / Shared Rides"
        extra={
          <Space>
            <Button onClick={() => navigate("/dashboard/shared-rides/charter")}>
              Báo giá bao xe
            </Button>
          </Space>
        }
      >
        <Tabs
          items={[
            {
              key: "search",
              label: "Tìm chuyến",
              children: (
                <div className="space-y-4">
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                      passengerCount: 1,
                      date: dayjs(),
                      pickupLat: 10.7769,
                      pickupLng: 106.7009,
                      dropoffLat: 10.8231,
                      dropoffLng: 106.6297,
                    }}
                  >
                    <Row gutter={12}>
                      <Col xs={24} md={6}>
                        <Form.Item
                          name="pickupLat"
                          label="Pickup lat"
                          rules={[{ required: true }]}
                        >
                          <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6}>
                        <Form.Item
                          name="pickupLng"
                          label="Pickup lng"
                          rules={[{ required: true }]}
                        >
                          <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6}>
                        <Form.Item
                          name="dropoffLat"
                          label="Dropoff lat"
                          rules={[{ required: true }]}
                        >
                          <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6}>
                        <Form.Item
                          name="dropoffLng"
                          label="Dropoff lng"
                          rules={[{ required: true }]}
                        >
                          <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item
                          name="date"
                          label="Ngày"
                          rules={[{ required: true }]}
                        >
                          <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item name="passengerCount" label="Số khách">
                          <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8} className="flex items-end">
                        <Form.Item>
                          <Button
                            type="primary"
                            loading={searchLoading}
                            onClick={handleSearch}
                          >
                            Tìm chuyến
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <Table<AnyRow>
                    rowKey={(row) => rowId(row)}
                    columns={tripColumns}
                    dataSource={trips}
                    loading={searchLoading}
                    pagination={{ pageSize: 10 }}
                  />
                </div>
              ),
            },
            {
              key: "mine",
              label: "Chuyến / xe của tài khoản",
              children: (
                <div className="space-y-4">
                  <Button type="primary" onClick={loadMine} loading={mineLoading}>
                    Tải dữ liệu
                  </Button>
                  <Card type="inner" title="Chuyến của tôi" size="small">
                    <Table<AnyRow>
                      rowKey={(row) => rowId(row)}
                      columns={tripColumns}
                      dataSource={mineTrips}
                      loading={mineLoading}
                      pagination={{ pageSize: 8 }}
                    />
                  </Card>
                  <Card type="inner" title="Xe của tôi" size="small">
                    <Table<AnyRow>
                      rowKey={(row) => rowId(row)}
                      loading={mineLoading}
                      dataSource={vehicles}
                      pagination={false}
                      columns={[
                        {
                          title: "Tên",
                          dataIndex: "name",
                          render: (v) => String(v || "—"),
                        },
                        {
                          title: "Biển số",
                          dataIndex: "plate",
                          render: (v) => String(v || "—"),
                        },
                        {
                          title: "Loại",
                          dataIndex: "vehicleType",
                          render: (v) => String(v || "—"),
                        },
                        {
                          title: "Màu",
                          dataIndex: "color",
                          render: (v) => String(v || "—"),
                        },
                      ]}
                    />
                  </Card>
                  <Card type="inner" title="Seat templates" size="small">
                    <Table<AnyRow>
                      rowKey={(row, index) =>
                        String(row.vehicleType || row.code || index)
                      }
                      loading={mineLoading}
                      dataSource={templates}
                      pagination={false}
                      columns={[
                        {
                          title: "Loại xe",
                          render: (_, row) =>
                            String(row.vehicleType || row.type || row.code || "—"),
                        },
                        {
                          title: "Số ghế",
                          render: (_, row) =>
                            String(
                              row.seatCount ||
                                (Array.isArray(row.seats)
                                  ? row.seats.length
                                  : "—")
                            ),
                        },
                      ]}
                    />
                  </Card>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
