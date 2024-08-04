import React, { useEffect, useState } from "react";
import { Table, Button, message, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";
import ModalAddProduct from "./ModalAddProduct";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const ListProduct = () => {
  const [keyword, setKeyword] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCurrent, setPageCurrent] = useState(1);
  const pageSize = 5;

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="Product" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã Sản phẩm",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Số lượng có sẵn",
      dataIndex: "onHand",
      key: "onHand",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Đã bán",
      dataIndex: "committed",
      key: "committed",
    },
  ];

  useEffect(() => {
    fetchData(keyword, pageCurrent, pageSize);
  }, [keyword, pageCurrent]);

  const fetchData = async (keyword, page, pageSize) => {
    // setLoading(true);
    try {
      const response = await productApi.getProducts(keyword, page, pageSize);
      setProducts(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record) => {
    navigate(`/admin/products/${record.id}`);
  };

  const handleSearch = async () => {
    setPageCurrent(1);
    await fetchData(keyword, pageCurrent, pageSize);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <div style={{ width: "50%" }}>
          <Input
            placeholder="Tìm kiếm sản phẩm theo tên, mã sản phẩm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: "100%" }}
            suffix={
              <Space>
                <SearchOutlined style={{ color: "#1890ff" }} />
              </Space>
            }
          />
        </div>
        <Button type="primary" onClick={() => setAddModalVisible(true)}>
          Thêm Sản phẩm
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={products}
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
        </>
      )}

      {addModalVisible && (
        <>
          <ModalAddProduct
            visible={addModalVisible}
            setVisible={setAddModalVisible}
            fetchData={fetchData}
            pageCurrent={pageCurrent}
            pageSize={pageSize}
          />
        </>
      )}
    </div>
  );
};

export default ListProduct;
