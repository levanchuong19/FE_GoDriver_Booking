import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content, Footer } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="dark"
        width={220}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "16px 0",
        }}
      >
        <div className="text-white text-center text-xl font-semibold mb-4">
          Smart Drive
        </div>

        {/* Menu chính */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["users"]}
          style={{ flex: 1 }}
        >
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/dashboard/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="pricing" icon={<DollarOutlined />}>
            <Link to="/dashboard/pricing">Pricing</Link>
          </Menu.Item>
        </Menu>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.15)",
            padding: "12px 16px",
          }}
        >
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="text-white w-full flex items-center justify-start"
            style={{
              color: "#fff",
              width: "100%",
              textAlign: "left",
              paddingLeft: 0,
            }}
          >
            Đăng xuất
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2 className="text-lg font-semibold mb-0">Admin Dashboard</h2>
        </Header>

        <Content
          style={{
            margin: 16,
            background: "#fff",
            padding: 24,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center", background: "#f9f9f9" }}>
          © {new Date().getFullYear()} Smart Drive Admin Panel
        </Footer>
      </Layout>
    </Layout>
  );
}
