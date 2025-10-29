import React, { useEffect, useState } from "react";
import { Button, Descriptions, Modal, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Driver } from "../../Model/driver";
import api from "../../Config/api";

const DriverDashboard: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const driverColumns: ColumnsType<Driver> = [
    {
      title: "Họ tên",
      dataIndex: ["personal", "fullName"],
      key: "fullName",
    },
    {
      title: "Điện thoại",
      dataIndex: ["personal", "phone"],
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: ["personal", "email"],
      key: "email",
    },
    {
      title: "Biển số xe",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_, record) =>
        `${record.address.specificAddress}, ${record.address.ward}, ${record.address.district}, ${record.address.province}`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Driver) => (
        <Button onClick={() => handleViewDetails(record)}>Xem chi tiết</Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await api.get("/admin/driver-applications");
        setDrivers(response.data.data.items);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tài xế:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const handleViewDetails = (driverApplication: Driver) => {
    setSelectedDriver(driverApplication);
    setIsModalVisible(true);
  };

  console.log("selectedDriver", selectedDriver);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDriver(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách tài xế</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <Table
          columns={driverColumns}
          dataSource={drivers}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {selectedDriver && (
        <Modal
          title="Chi tiết lượt đặt sân"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="back" onClick={handleModalClose}>
              Đóng
            </Button>,
          ]}
          width={700}
        >
          <Spin spinning={!selectedDriver}>
            <Descriptions bordered column={2}>
              {/* <Descriptions.Item label="Mã Đặt Sân" span={2}>
                {selectedBooking.id}
              </Descriptions.Item> */}
              <Descriptions.Item label="Khách hàng">
                {selectedDriver.personal.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedDriver.personal.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Sân">
                {selectedDriver.personal.email}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {selectedDriver.status}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </Modal>
      )}
    </div>
  );
};

export default DriverDashboard;
