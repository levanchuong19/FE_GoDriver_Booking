/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Select,
  Drawer,
  Descriptions,
  Card,
  Tag,
  Avatar,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";
import type { User } from "../../models/User";

type PaginationState = { current: number; pageSize: number; total: number };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");

  // Drawer + Modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // --- Fetch Users ---
  const fetchUsers = useCallback(
    async (page = 1, searchQuery = "") => {
      setLoading(true);
      try {
        const res = await api.get(`/users`, {
          params: { page, limit: pagination.pageSize, search: searchQuery },
        });

        const list: User[] =
          res.data?.users ??
          res.data?.data ??
          (Array.isArray(res.data) ? res.data : []);

        setUsers(list);
        setPagination((prev) => ({
          ...prev,
          total: res.data?.total ?? res.data?.meta?.total ?? list.length,
          current: page,
        }));
      } catch {
        message.error("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- View detail ---
  const handleView = async (id: string) => {
    try {
      const res = await api.get(`/users/${id}`);
      const data: User = res.data?.user ?? res.data?.data ?? res.data;
      setDetailUser(data);
      setDetailOpen(true);
    } catch {
      message.error("Không thể tải thông tin người dùng");
    }
  };

  // --- Edit ---
  const handleEdit = async (u: User) => {
    try {
      const res = await api.get(`/users/${u._id}`);
      const data: User = res.data?.user ?? res.data?.data ?? res.data;
      setEditingUser(data);
      form.setFieldsValue(data);
      setEditOpen(true);
    } catch {
      message.error("Không thể tải dữ liệu để chỉnh sửa");
    }
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (!editingUser) return;
    try {
      await api.put(`/users/${editingUser._id}`, values);
      message.success("Cập nhật thành công");
      setEditOpen(false);
      setEditingUser(null);
      fetchUsers(pagination.current, search);
    } catch {
      message.error("Lưu thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      message.success("Xóa thành công");
      const nextPage =
        users.length === 1 && pagination.current > 1
          ? pagination.current - 1
          : pagination.current;
      fetchUsers(nextPage, search);
    } catch {
      message.error("Không thể xóa người dùng");
    }
  };

  // --- Table columns ---
  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <span>{text}</span>
        </Space>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (r: string) => {
        const color =
          r === "admin" ? "volcano" : r === "staff" ? "geekblue" : "green";
        return <Tag color={color}>{r.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (user: User) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(user._id)}
            type="default"
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(user)}
            type="primary"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa người dùng?"
            onConfirm={() => handleDelete(user._id)}
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 230,
    },
  ];

  // --- Search ---
  const handleSearch = (value: string) => {
    setSearch(value);
    fetchUsers(1, value);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <span className="font-semibold text-lg"> Quản lý người dùng</span>
        }
        bordered={false}
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <div className="flex justify-between items-center mb-4">
          <Input.Search
            placeholder="Tìm kiếm theo tên hoặc email..."
            onSearch={handleSearch}
            allowClear
            style={{ width: 340 }}
          />
        </div>

        <Table
          rowKey="_id"
          dataSource={users}
          columns={columns as any}
          loading={loading}
          bordered
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setPagination((p) => ({ ...p, pageSize }));
              fetchUsers(page, search);
            },
          }}
        />
      </Card>

      {/* Drawer xem chi tiết */}
      <Drawer
        title={
          <Space>
            <Avatar size={48} icon={<UserOutlined />} />
            <span>{detailUser?.fullName}</span>
          </Space>
        }
        width={480}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      >
        {detailUser ? (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Tên">
              {detailUser.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {detailUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {detailUser.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              {detailUser.role}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {detailUser.gender}
            </Descriptions.Item>
            <Descriptions.Item label="Xác thực">
              {detailUser.verified ? (
                <Tag color="green">Đã xác thực</Tag>
              ) : (
                <Tag color="red">Chưa xác thực</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {detailUser.createdAt
                ? new Date(detailUser.createdAt).toLocaleString()
                : "Không có dữ liệu"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          "Đang tải…"
        )}
      </Drawer>

      {/* Modal chỉnh sửa */}
      <Modal
        title=" Chỉnh sửa người dùng"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
        onOk={handleSave}
        okText="Lưu thay đổi"
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select
              options={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
                { value: "staff", label: "Staff" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
