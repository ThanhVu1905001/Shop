import { useState, useEffect } from "react";
import { Table, Button, message, Input, Space } from "antd";
import orderApi from "../../api/orderApi.jsx";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import customerApi from "../../api/customerApi.jsx";
import userApi from "../../api/userApi.jsx";
import { parseISO, format } from "date-fns";

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [keyWord, setKeyWord] = useState("");
  const pageSize = 5;
  const navigate = useNavigate();

  const columns = [
    {
      title: "Ngày tạo đơn",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text, record) => format(new Date(text), "dd/MM/yyyy HH:mm:ss"),
    },
    {
      title: "Mã đơn",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Ghi chú",
      dataIndex: "orderNote",
      key: "orderNote",
      width: 200,
    },
  ];

  useEffect(() => {
    fetchData(keyWord, pageCurrent, pageSize);
  }, [keyWord, pageCurrent]);

  const fetchData = async (keyWord, page, pageSize) => {
    setLoading(true);
    try {
      let orderResponse;

      if (keyWord) {
        orderResponse = await orderApi.searchOrders(
          { searchString: keyWord },
          page,
          pageSize
        );
      } else {
        orderResponse = await orderApi.getAllOrders(page-1);
      }


      const orders = orderResponse.content ? orderResponse.content : [];

      const fetchedOrders = await Promise.all(orders.map(async (order) => {
        const cusResponse = await customerApi.getById(order.customerId);
        const customerName = cusResponse.data ? cusResponse.data.name : "";
  
        const userResponse = await userApi.getById(order.userId);
        const userName = userResponse.data ? userResponse.data.username : "";
  
        const noteResponse = await orderApi.getOrderDetailsById(order.id);
        const orderNote = noteResponse ? noteResponse.notes : "";
  
        return {
          id: order.id,
          code: order.code,
          createdDate: order.createdDate,
          totalAmount: order.totalAmount,
          customerName,
          userName,
          orderNote,
        };
      }));
      // Check if totalElements is defined before setting the state
      const totalElements = orderResponse
        ? orderResponse.totalElements
        : 0;
      setOrders(fetchedOrders);
      setTotalItems(totalElements);
    } catch (error) {
      message.error("Failed to fetch Orders");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record) => {
    navigate(`/admin/orders/${record.id}`);
  };

  const handleCreateOrderClick = () => {
    navigate(`/admin/orders/create`);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
  
      const orderResponse = await orderApi.searchOrders(
        { searchString: keyWord },
        pageCurrent,
        pageSize
      );
  
      const orders = orderResponse.content ? orderResponse.content : [];
  
      const fetchedOrders = [];
  
      for (const order of orders) {
        const cusResponse = await customerApi.getById(order.customerId);
        const customerName = cusResponse.data ? cusResponse.data.name : "";
  
        const userResponse = await userApi.getById(order.userId);
        const userName = userResponse.data ? userResponse.data.username : "";
  
        const noteResponse = await orderApi.getOrderDetailsById(order.id);
        const orderNote = noteResponse ? noteResponse.notes : "";
  
        fetchedOrders.push({
          id: order.id,
          code: order.code,
          createdDate: order.createdDate,
          totalAmount: order.totalAmount,
          customerName,
          userName,
          orderNote,
        });
      }
  
      const totalElements = orderResponse
        ? orderResponse.totalElements
        : 0;
  
      setOrders(fetchedOrders);
      setTotalItems(totalElements);
    } catch (error) {
      console.error("Error searching data:", error);
      message.error("Failed to search Orders");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Button type="primary" onClick={handleCreateOrderClick}>
        Tạo đơn hàng
      </Button>
      <div style={{ marginBottom: 10, marginTop: 10 }}>
        <Input
          placeholder="Tìm kiếm theo tên khách hàng, tên nhân viên, mã đơn hàng"
          value={keyWord}
          onChange={(e) => setKeyWord(e.target.value)}
          style={{ width: "50%" }}
          suffix={
            <Space>
              <SearchOutlined
                style={{ color: "#1890ff" }}
                onClick={handleSearch}
              />
            </Space>
          }
          onPressEnter={handleSearch}
        />
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pageCurrent,
          pageSize: pageSize,
          total: totalItems,
          onChange: (page) => setPageCurrent(page),
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        style={{ marginBottom: 20, marginTop: 20 }}
      />

    </div>
  );
};

export default ListOrder;
