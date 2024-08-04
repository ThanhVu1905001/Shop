import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineBars,
} from "react-icons/ai";
import { RiAdminFill } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import AuthApi from "../api/authApi";
import "../style.css";

const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const currentUser = AuthApi.getCurrentUser();
    setUser(currentUser);
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const storedSelectedKey = localStorage.getItem("selectedKey");
    if (storedSelectedKey) {
      setSelectedKey(storedSelectedKey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedKey", selectedKey);
  }, [selectedKey]);

  const navigate = useNavigate();

  const handleLogout = () => {
    AuthApi.logout();
    navigate("/");
  };

  const getMenuItems = () => {
    const userRoles = user ? user.roles : [];
    const commonItems = [
      {
        key: "logout",
        icon: <AiOutlineLogout className="fs-4" />,
        label: "Đăng xuất",
      },
    ];

    const adminItems = [
      {
        key: "",
        icon: <AiOutlineHome className="fs-4" />,
        label: "Tổng quan",
      },
      {
        key: "users",
        icon: <RiAdminFill className="fs-4" />,
        label: "Nhân viên",
      },
      {
        key: "order",
        icon: <FaClipboardList className="fs-4" />,
        label: "Đơn hàng",
        children: [
          {
            key: "orders/create",
            label: "Tạo đơn hàng",
          },
          {
            key: "orders",
            label: "Danh sách đơn hàng",
          },
        ],
      },
      {
        key: "customer",
        icon: <AiOutlineUser className="fs-4" />,
        label: "Khách hàng",
        children: [
          {
            key: "customers",
            label: "Danh sách khách hàng",
          },
        ],
      },
      {
        key: "warehouse",
        icon: <AiOutlineShoppingCart className="fs-4" />,
        label: "Kho hàng",
        children: [
          {
            key: "products",
            label: "Danh sách sản phẩm",
          },
          {
            key: "products/update",
            label: "Nhập kho",
          },
        ],
      },
    ];

    const customerServiceItems = [
      {
        key: "customer",
        icon: <AiOutlineUser className="fs-4" />,
        label: "Khách hàng",
        children: [
          {
            key: "customers",
            label: "Danh sách khách hàng",
          },
        ],
      },
    ];

    const sellerItems = [
      {
        key: "order",
        icon: <FaClipboardList className="fs-4" />,
        label: "Đơn hàng",
        children: [
          {
            key: "orders/create",
            label: "Tạo đơn hàng",
          },
          {
            key: "orders",
            label: "Danh sách đơn hàng",
          },
        ],
      },
    ];

    const warehouseStaffItems = [
      {
        key: "warehouse",
        icon: <AiOutlineShoppingCart className="fs-4" />,
        label: "Kho hàng",
        children: [
          {
            key: "products",
            label: "Danh sách sản phẩm",
          },
          {
            key: "products/update",
            label: "Nhập kho",
          },
        ],
      },
    ];

    let userItems = [];

    if (userRoles.includes("ROLE_ADMIN")) {
      userItems = userItems.concat(adminItems);
    }

    if (userRoles.includes("ROLE_CUSTOMERSERVICE")) {
      userItems = userItems.concat(customerServiceItems);
    }

    if (userRoles.includes("ROLE_SELLER")) {
      userItems = userItems.concat(sellerItems);
    }

    if (userRoles.includes("ROLE_WAREHOUSESTAFF")) {
      userItems = userItems.concat(warehouseStaffItems);
    }

    // Include common items for all roles
    userItems = userItems.concat(commonItems);

    return userItems;
  };

  return (
    <>
      <div className="container-main">
        <Layout /* onContextMenu={(e) => e.preventDefault()} */>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo d-flex justify-content-center align-items-center">
              <h2 className="text-white fs-5 text-center py-3 mb-0">
                <span
                  className="sm-logo"
                  role="button"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  <AiOutlineBars className="fs-4" />
                </span>
                <span
                  className={`lg-logo ${collapsed ? "collapsed" : ""}`}
                  role="button"
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ display: "inline-block", padding: "5px" }}
                >
                  <img
                    className="logo-img"
                    src="/img/sapo.png" // Đường dẫn tương đối từ thư mục public
                    alt="Logo"
                    style={{
                      height: "auto",
                      maxWidth: "100px",
                      display: collapsed ? "none" : "block", // Kiểm soát hiển thị của ảnh
                    }}
                  />
                </span>
              </h2>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={({ key }) => {
                if (key === "logout") {
                  localStorage.removeItem(selectedKey);
                  handleLogout();
                } else {
                  setSelectedKey(key);
                  localStorage.removeItem(key);
                  navigate(key);
                }
              }}
              items={getMenuItems()}
            />
          </Sider>
          <Layout className="site-layout">
            <Header
              className="d-flex justify-content-end ps-1 pe-5"
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
            >
              {/* {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                }
              )} */}
              <div className="d-flex gap-4 align-items-center">
                <div className="d-flex gap-3 align-items-center dropdown">
                  <div
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <h5 className="mb-0">{user.username}</h5>
                    {user ? <p className="mb-0">{user.roles[0]}</p> : null}
                  </div>
                </div>
              </div>
            </Header>
            <Content
              style={{
                margin: "0px 16px",
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </div>
    </>
  );
};
export default MainLayout;
