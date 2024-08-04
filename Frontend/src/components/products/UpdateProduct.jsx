import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  message,
  Input,
  Space,
  InputNumber,
  Col,
  Row,
} from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";
import ModalAddProduct from "./ModalAddProduct";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import ReactSelect from "react-select";
import customerApi from "../../api/customerApi.jsx";

const UpdateProduct = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [reactSelectKey, setReactSelectKey] = useState(0); // Thêm state để quản lý key

  const pageSize = 5;

  const productColumns = [
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
      title: "Đã bán",
      dataIndex: "committed",
      key: "committed",
    },
    {
      title: "Số lượng có sẵn",
      dataIndex: "onHand",
      key: "onHand",
    },
    {
      title: "Số Lượng hàng nhập",
      dataIndex: "id",
      key: "updateQuantity",
      render: (text, record) => (
        <InputNumber
          min={1}
          value={record.updateQuantity}
          onChange={(newQuantity) => {
            handleUpdateQuantity(record.id, newQuantity);
          }}
        />
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      render: (text, record) => (
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteProduct(record.id)}
          style={{ color: "#ff4d4f" }}
        />
      ),
      flex: 1,
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const updatedOrderProducts = orderProducts.map((product) =>
      product.id === productId
        ? { ...product, updateQuantity: newQuantity }
        : product
    );

    setOrderProducts(updatedOrderProducts);
  };

  //select product from search
  const handleProductSelect = (selectedOption) => {
    if (selectedOption.value === "add") {
      setAddModalVisible(true);
    } else {
      const selectedProduct = products.find(
        (product) => product.id === selectedOption.value
      );
      if (selectedProduct) {
        addProductToOrder(selectedProduct);
      }
    }
  };

  const handleDeleteProduct = (productId) => {
    setOrderProducts((prevProducts) => {
      return prevProducts.filter((product) => product.id !== productId);
    });
  };

  const addProductToOrder = (selectedProduct) => {
    const updatedOrderProducts = [...orderProducts];

    // Kiểm tra xem sản phẩm đã tồn tại trong đơn hàng chưa
    const existingProductIndex = updatedOrderProducts.findIndex(
      (product) => product.id === selectedProduct.id
    );

    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng
      updatedOrderProducts[existingProductIndex].quantity += 1;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới vào đơn hàng
      updatedOrderProducts.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        image: selectedProduct.image,
        committed: selectedProduct.committed,
        onHand: selectedProduct.onHand,
        updateQuantity: 0, // Số lượng mặc định khi thêm mới
      });
    }

    setOrderProducts(updatedOrderProducts);
  };

  const handleUpdateQuantities = async () => {
    if (
      orderProducts.length === 0 ||
      orderProducts.every((product) => product.updateQuantity === 0)
    ) {
      message.warning("Vui lòng chọn sản phẩm và số lượng muốn cập nhật.");
      return;
    }
    const updates = orderProducts.map((product) => ({
      id: product.id,
      quantity: product.updateQuantity,
    }));

    try {
      // Gửi yêu cầu cập nhật số lượng
      const response = await productApi.updateQuantity(updates);
      message.success(response.data); // Hiển thị thông báo thành công
      navigate(`/admin/products`);
    } catch (error) {
      console.error("Error updating quantities:", error);
      message.error("Lỗi khi cập nhật số lượng");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProducts(keyword || "", 1, 5);
        setProducts(response.data.content);
      } catch (error) {
        console.error("Failed to fetch customer list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  const proOptions = [
    { value: "add", label: "🌟 Thêm mới khách hàng" },
    ...products.map((products) => ({
      value: products.id,
      label: products.name,
    })),
  ];

  const fetchData = async (keyword, page, pageSize) => {
    // setLoading(true);
    try {
      const response = await productApi.getProducts(keyword, page, pageSize);
      setProducts(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>
        <span className="icon-back" onClick={handleBack}>
          <IoArrowBack />
        </span>
        Nhập kho
      </h2>
      <Row className="d-flex justify-content-between align-items-center">
        <Col xs={24} sm={24} md={15}>
          <ReactSelect
            className="custom-select"
            options={proOptions}
            isSearchable
            placeholder="Chọn sản phẩm"
            onInputChange={setKeyword}
            onChange={handleProductSelect}
          />
        </Col>

        <Col>
          <Button type="primary" onClick={handleUpdateQuantities}>
            Cập nhật
          </Button>
        </Col>
      </Row>
      <div>
        <Table
          columns={productColumns}
          dataSource={orderProducts}
          rowKey="id"
          //   pagination={{
          //     current: pageCurrent,
          //     pageSize: pageSize,
          //     total: totalItems,
          //     onChange: (page) => setPageCurrent(page),
          //   }}
          style={{ marginBottom: 20, marginTop: 20 }}
        />
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
    </>
  );
};

export default UpdateProduct;
