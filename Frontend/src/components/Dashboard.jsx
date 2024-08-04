import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Bar, Column } from "@ant-design/charts";
import { Line } from "@ant-design/charts";
import productApi from "../api/productApi";
import customerApi from "../api/customerApi";
import OrderApi from "../api/orderApi";
import { parseISO, format } from "date-fns";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [totalProductItems, setTotalProductItems] = useState(0);
  const [products, setProducts] = useState([]);
  const [totalCustomerItems, setTotalCustomerItems] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [totalOrderItems, setTotalOrderItems] = useState(0);
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [data, setData] = useState(0);
  const [data1, setData1] = useState([]);

  const formattedNumber = (number) => {
    return number.toLocaleString("en-US");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi API của products
      const productResponse = await productApi.getAllProducts();
      setProducts(productResponse.data);
      setTotalProductItems(productResponse.data.length);

      // Gọi API của customers
      const customerResponse = await customerApi.getAllCustomers();
      setCustomers(customerResponse.data);
      setTotalCustomerItems(customerResponse.data.length);

      // Gọi API của orders
      const orderResponse = await OrderApi.getAllOrder();

      setOrders(orderResponse.data);
      setTotalOrderItems(orderResponse.data.length);
    } catch (error) {
      console.log("Error fetching data:", error);
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Tính lại tổng doanh thu khi có thay đổi trong mảng orders
    const newTotalRevenue = orders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );
    setTotalRevenue(newTotalRevenue);
    // Lấy top 10 sản phẩm có committed cao nhất
    if (products && products.length > 0) {
      const topProduct = products
        .sort((a, b) => b.committed - a.committed)
        .slice(0, 10);
      setData(topProduct);
    }

    // Tính tổng doanh thu theo ngày
    const revenueData = orders.reduce((acc, order) => {
      const createdDate = parseISO(order.createdDate);
      const formattedDate = format(createdDate, "dd/MM/yyyy");

      // Kiểm tra xem ngày đã tồn tại trong mảng chưa
      const existingDateIndex = acc.findIndex(
        (item) => item.date === formattedDate
      );

      if (existingDateIndex !== -1) {
        // Nếu ngày đã tồn tại, thì cộng thêm vào tổng doanh thu của ngày đó
        acc[existingDateIndex].revenue += order.totalAmount;
      } else {
        // Nếu ngày chưa tồn tại, thì thêm mới vào mảng
        acc.push({ date: formattedDate, revenue: order.totalAmount });
      }

      return acc;
    }, []);

    const sortedRevenueData = revenueData
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      })
      .slice(0, 10);
    setData1(sortedRevenueData);
  }, [orders, products]);

  const config = {
    data,
    xField: "name",
    yField: "committed",
    xAxis: {
      visible: false,
      label: { autoHide: true },
    },
  };

  const configChart = {
    data: data1,
    xField: "date",
    yField: "revenue",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    xAxis: {
      title: {
        text: "Ngày",
      },
    },
    yAxis: {
      title: {
        text: "Doanh thu",
      },
      min: 0,
      max: 1000000000,
    },
  };

  return (
    <>
      <h3 className="mb-3">Trang chủ</h3>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">
              Tổng doanh thu: {formattedNumber(totalRevenue)}
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Tổng đơn hàng: {totalOrderItems}</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Người dùng: {totalCustomerItems}</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Sản phẩm: {totalProductItems}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-5 title">Top 10 sản phẩm bán chạy nhất</h3>
        <div>
          <Bar {...config} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-3">Doanh thu 10 ngày gần nhất</h3>
        <Line {...configChart} />
      </div>
    </>
  );
};

export default Dashboard;
