import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Table, Spin, message } from "antd";
import ReactSelect from "react-select";
import customerApi from "../../api/customerApi.jsx";
import productApi from "../../api/productApi.jsx";
import orderApi from "../../api/orderApi.jsx";
import AuthApi from "../../api/authApi.jsx";
import ModalAddCustomer from "../customers/ModalAddCustomer.jsx";
import { useNavigate } from "react-router-dom";
import { Row, Col, Empty } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import PrintComponent from "./PrintComponent.jsx";

const ModalAddOrder = ({ setOrderCreated }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchProductTerm, setSearchProductTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [customerPayment, setCustomerPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [orderNote, setOrderNote] = useState("");
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  const handleOrderNoteChange = (e) => {
    setOrderNote(e.target.value);
  };  

  const handleCreateOrder = async () => {
    if (!selectedCustomer) {
      message.warning("Vui lòng chọn khách hàng trước khi tạo đơn hàng.");
      return;
    }
    if (orderProducts.length === 0) {
      // Nếu danh sách sản phẩm trống, hiển thị thông báo và ngăn chặn tiếp tục xử lý
      message.warning(
        "Danh sách sản phẩm trống. Vui lòng thêm sản phẩm vào đơn hàng."
      );
      return;
    }
    if (customerPayment < totalPayment) {
      // Nếu tiền khách đưa nhỏ hơn tổng tiền thanh toán, hiển thị thông báo và ngăn chặn tiếp tục xử lý
      message.warning(
        "Tiền khách đưa không đủ để thanh toán. Vui lòng kiểm tra lại."
      );
      return;
    }
    const userId = AuthApi.getUserId(); // Lấy ID của người dùng đăng nhập từ AuthApi
    const orderData = {
      customerId: selectedCustomer.id,
      userId: userId,
      totalAmount: totalPayment,
      orderDetails: orderProducts.map((product) => ({
        productId: product.id,
        onHand: product.onHand,
        price: product.price,
      })),
      notes: orderNote,
    };

    try {
      const createdOrder = await orderApi.createOrder(orderData);
      
      // navigate(`/admin/orders/${createdOrder.id}`);
      message.success("Đơn hàng đã được tạo thành công");
      setPrintModalVisible(true);
      setOrderId(createdOrder.id);
    } catch (error) {
      console.error("Có lỗi khi tạo đơn hàng:", error);
      message.error("Đã xảy ra lỗi khi tạo đơn hàng");
      // Thêm xử lý lỗi nếu cần
    }
  };

  const productColumns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      flex: 1,
      key: "image",
      render: (image) => (
        <img src={image} alt="Product" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      flex: 1,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
      flex: 1,
    },
    {
      title: "Số lượng",
      dataIndex: "onHand",
      flex: 1,
      key: "onHand",
      render: (text, record) => (
    <InputNumber
      min={1}
      value={text}
      onChange={(newOnHand) =>
        handleOnHandChange(record.id, newOnHand)
      }
      onBlur={(e) => {
        const newOnHand = parseInt(e.target.value, 10);
        handleOnHandChange(record.id, newOnHand);
      }}
    />
      ),
      width: 100,
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      flex: 1,
    },
    {
      title: "Xóa",
      key: "delete",
      render: (text, record) => (
        <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(record.id)} style={{ color: '#ff4d4f' }} />
      ),
      flex: 1,
    },
  ];

  //product

  const handleDeleteProduct = (productId) => {
    setOrderProducts((prevProducts) => {
      return prevProducts.filter((product) => product.id !== productId);
    });
  };
  const addProductToOrder = async (selectedProduct) => {
    const availableQuantity = selectedProduct.onHand;
  
    if (availableQuantity === 0) {
      // Handle case where product is out of stock
      message.warning("Sản phẩm này đã hết hàng.");
      return;
    }
  
    const existingProduct = orderProducts.find(
      (orderProduct) => orderProduct.id === selectedProduct.id
    );
  
    if (existingProduct) {
      const newQuantity = existingProduct.onHand + 1;
  
      if (newQuantity > availableQuantity) {
        // Handle case where requested quantity exceeds available quantity
        message.warning(
          `Số lượng yêu cầu vượt quá số lượng hiện có (${availableQuantity}). Vui lòng nhập lại.`
        );
        return;
      }
  
      setOrderProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? {
                ...product,
                onHand: newQuantity,
                total: newQuantity * product.price,
              }
            : product
        )
      );
    } else {
      if (selectedProduct.onHand === 0) {
        // Handle case where product is out of stock
        message.warning("Sản phẩm này đã hết hàng.");
        return;
      }
  
      if (selectedProduct.onHand < 1) {
        // Handle case where requested quantity is less than 1
        message.warning("Số lượng yêu cầu phải lớn hơn 0. Vui lòng nhập lại.");
        return;
      }
  
      setOrderProducts((prevProducts) => [
        ...prevProducts,
        {
          ...selectedProduct,
          onHand: 1,
          total: selectedProduct.price,
        },
      ]);
    }
  };
  
  // Xử lý chọn sản phẩm từ danh sách
  const handleProductSelect = (selectedOption) => {
    const selectedProduct = products.find(
      (product) => product.id === selectedOption.value
    );
    if (selectedProduct) {
      addProductToOrder(selectedProduct);
    }
  };

  const getProductById = async (productId) => {
    try {
      const response = await productApi.getById(productId);
      return response.data; // Trả về dữ liệu chi tiết sản phẩm
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      return null;
    }
  };

  // Xử lý thay đổi số lượng sản phẩm trong đơn hàng
  const handleOnHandChange = async (productId, newOnHand) => {
    const productDetails = await getProductById(productId);
  
    if (!Number.isInteger(newOnHand) || newOnHand < 1) {
      // Handle case where entered quantity is not a positive integer
      message.warning("Số lượng phải là số nguyên dương. Vui lòng nhập lại.");
      return;
    }
  
    if (productDetails && newOnHand <= productDetails.onHand) {
      setOrderProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                onHand: newOnHand,
                total: newOnHand * product.price,
              }
            : product
        )
      );
    } else {
      message.warning(
        `Số lượng mặt hàng này hiện có là ${productDetails.onHand}. Vui lòng chọn số lượng phù hợp.`
      );
    }
  };
  

  // Xử lý logic tính tổng số tiền của đơn hàng
  useEffect(() => {
    const total = orderProducts.reduce(
      (sum, product) => sum + product.total,
      0
    );
    setTotalPayment(total);
  }, [orderProducts]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProducts(
          searchTerm || "",
          1,
          10
        );
        setProducts(response.data.content);
      } catch (error) {
        console.error("Failed to fetch product list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchProductTerm]);

  const productOptions = products?.map((product) => ({
    value: product.id,
    label: (
      <div className="custom-select-option" style={{display: 'flex' ,justifyContent: "space-between", width: "100%"}}>
        <span className="product-name" style={{flex: '1'}}>{product.name}</span>
        <span className="quantity" style={{flexShrink: '0'}}>(Số lượng: {product.onHand})</span>
      </div>
    ),
  }));
  

  //customer
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await customerApi.getCustomers(
          searchTerm || "",
          1,
          10
        );
        setCustomers(response.data.content);
      } catch (error) {
        console.error("Failed to fetch customer list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [searchTerm]);

  const cusOptions = [
    { value: "add", label: "🌟 Thêm mới khách hàng" }, // Added a star emoji before the label
    ...customers.map((customer) => ({
      value: customer.id,
      label: customer.name,
    })),
  ];
  
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.label.startsWith("🌟") ? '#007bff' : 'white', 
      color: state.label.startsWith("🌟") ? 'white' : 'black', 
      cursor: 'pointer',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black', 
    }),
  };

  const customerCardStyles = {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ccc",
    padding: "10px",
    margin: "10px",
    maxWidh: "100%",
    borderRadius: "5px",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",

  };

  const customerInfoStyles = {
    marginBottom: "10px",
  };

  const fetchData = async (keyWord, page, pageSize) => {
    setLoading(true);
    try {
      const response = await customerApi.getCustomers(keyWord, page, pageSize);
      setCustomers(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };
  const renderCustomerCard = () => {
    return (
      <div style={customerCardStyles}>
        <div style={customerInfoStyles}>
          <h3>{selectedCustomer.name}</h3>
          <p>Code: {selectedCustomer.code}</p>
          <p>Phone Number: {selectedCustomer.phone}</p>
          <p>Address: {selectedCustomer.address}</p>
          {/* Thêm các thông tin khác của khách hàng */}
        </div>
        <Button onClick={() => setSelectedCustomer(null)} style={{backgroundColor: 'white', color: '#ff7f7f', borderColor: '#ff7f7f'}}>Xóa</Button>
      </div>
    );
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={15}>
        <label style={{ marginTop: "20px" }}>Danh sách sản phẩm</label>
        <ReactSelect
          options={productOptions}
          isSearchable
          placeholder="Chọn sản phẩm"
          onInputChange={setSearchProductTerm}
          onChange={handleProductSelect}
          menuPortalTarget={document.body}
          menuPlacement="bottom"
          maxMenuHeight={250}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
        />

        <Table
          dataSource={orderProducts}
          columns={productColumns}
          rowKey="id"
          pagination={false}
          style={{ marginTop: "20px" }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có sản phẩm nào được chọn"
              />
            ),
          }}
        />

        {addModalVisible && (
          <>
            <ModalAddCustomer
              visible={addModalVisible}
              setVisible={setAddModalVisible}
              fetchData={fetchData}
            />
          </>
        )}
      </Col>
      <Col xs={24} sm={24} md={9}>
        <label style={{ marginTop: "20px" }}>Chọn khách hàng</label>
        <ReactSelect
          options={cusOptions}
          isSearchable
          placeholder="Chọn khách hàng"
          onInputChange={setSearchTerm}
          onChange={(selectedOption) => {
            if (selectedOption.value === "add") {
              setAddModalVisible(true);
            } else {
              setSelectedCustomer(
                customers.find(
                  (customer) => customer.id === selectedOption.value
                )
              );
            }
          }}
          menuPortalTarget={document.body}
          menuPlacement="bottom"
          maxMenuHeight={200}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            ...customStyles,
          }}
        />

        {loading && <Spin />}

        {selectedCustomer && (
          <div style={{ marginTop: "20px" }}>{renderCustomerCard()}</div>
        )}

        <div style={{ marginTop: "20px" }}>
          <label style={{ marginTop: "20px" }}>Ghi chú đơn hàng</label>
          <Form.Item>
            <Input.TextArea
              value={orderNote}
              onChange={handleOrderNoteChange}
              placeholder="Nhập ghi chú cho đơn hàng"
              style={{ boxShadow: "0 0 8px rgba(0,0,0,0.1)", display: "block", width: "100%",marginTop: "8px" }}
            />
          </Form.Item>
        </div>


        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 0 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Hóa đơn</h2>
          <Form>
            {/* Other form fields... */}
            <Form.Item label="Tổng tiền thanh toán">
              <Input
                disabled
                value={totalPayment}
                style={{
                  border: "none",
                  boxShadow: "none",
                  color: "#000",
                  background: "inherit",
                  textAlign: "right",
                  borderBottom: "1px solid #ccc",
                }}
              />
            </Form.Item>
            <Form.Item label="Tiền khách phải trả">
              <Input
                disabled
                value={totalPayment}
                style={{
                  border: "none",
                  boxShadow: "none",
                  color: "#000",
                  background: "inherit",
                  textAlign: "right",
                  borderBottom: "1px solid #ccc",
                }}
              />
            </Form.Item>
            <Form.Item label="Tiền khách đưa">
              <Input
                value={customerPayment === 0 ? "" : customerPayment}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomerPayment(value);
                }}
                style={{
                  border: "none",
                  boxShadow: "none",
                  color: "inherit",
                  backgroundColor: "inherit",
                  borderBottom: "1px solid #ccc",
                  textAlign: "right",
                }}
                placeholder="Xin nhập"
              />
            </Form.Item>
            <Form.Item label="Tiền thừa trả khách">
              <Input
                disabled
                value={customerPayment - totalPayment}
                style={{
                  border: "none",
                  boxShadow: "none",
                  color: "#000",
                  background: "inherit",
                  textAlign: "right",
                  borderBottom: "1px solid #ccc",
                }}
              />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button type="primary" onClick={handleCreateOrder}>
                Tạo đơn hàng
              </Button>
            </div>
          </Form>
        </div>
      </Col>
      <PrintComponent
        visible={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        orderId={orderId}
        orderDetails={{
          customer: selectedCustomer,
          orderProducts,
          totalPayment,
          customerPayment,
          orderNote,
        }}
      />
    </Row>
  );
};

export default ModalAddOrder;
