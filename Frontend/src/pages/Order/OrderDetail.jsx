import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Popconfirm, message, Spin, Empty, Table } from 'antd';
import orderApi from '../../api/orderApi.jsx';
import formatTime from '../../helpers/formatTime';
import customerApi from '../../api/customerApi.jsx';
import userApi from '../../api/userApi.jsx';
import productApi from '../../api/productApi.jsx';
import { IoArrowBack } from "react-icons/io5";
import { parseISO, format } from "date-fns";

const OrderDetail = () => {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState(null);
  const [userName, setUserName] = useState(null);
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  }
  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getOrderDetailsById(id);
      setOrderDetail(response);

      const customerResponse = await customerApi.getById(response.customerId);
      const userResponse = await userApi.getById(response.userId);

      setCustomerName(customerResponse.data.name);
      setUserName(userResponse.data.username);

      const products = await Promise.all(
        response.orderDetails.map(async (orderItem) => {
          const productResponse = await productApi.getById(orderItem.productId);
          return {
            ...orderItem,
            name: productResponse.data.name,
            code: productResponse.data.code,
            image: productResponse.data.image,
            totalAmount: orderItem.onHand * orderItem.price,
          };
        })
      );
        setProductData(products);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    } finally {
      setLoading(false);
    }
  };
  const customerCardStyles = {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px',
    maxWidth: '100%',
    borderRadius: '5px',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  };
  
  const customerInfoStyles = {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
  };
  
  const fieldStyles = {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center', // Căn giữa theo chiều dọc
  };
  
  const labelStyles = {
    marginRight: '8px',
    minWidth: '120px', // Để đảm bảo rộng cố định của nhãn
  };
  
  const valueStyles = {
    flex: '1', // Để giá trị chiếm phần còn lại của không gian
  };
  const deleteButtonStyles = {
    backgroundColor: '#ff4d4f', // Màu đỏ nhạt
    color: '#fff', // Màu chữ là trắng
    border: 'none', // Không có viền
  };

  const deleteButtonContainerStyles = {
    display: 'flex',
    justifyContent: 'center', // Căn giữa ngang
  };

  if (loading) {
    return <Spin indicator={<div>Đang tải...</div>} />;
  }
  if (!orderDetail) {
    return <Empty description="Không tìm thấy đơn hàng" />;
  }
  const renderCard = () => {
    const handleDeleteOrder = async () => {
      try {
        // Gọi API để xóa đơn hàng
        await orderApi.deleteOrder(id);
        message.success('Đơn hàng đã được xóa thành công');
        navigate('/admin/orders');
      } catch (error) {
        console.error('Error deleting order:', error);
        message.error('Đã xảy ra lỗi khi xóa đơn hàng');
      }
    };
  
    return (
        <div style={customerCardStyles}>
          <div style={customerInfoStyles}>
            <h3>{orderDetail.code}</h3>
            
            <div style={fieldStyles}>
              <span style={labelStyles}>Tên khách hàng:</span>
              <span style={valueStyles}>{customerName}</span>
            </div>
    
            <div style={fieldStyles}>
              <span style={labelStyles}>Nhân viên:</span>
              <span style={valueStyles}>{userName}</span>
            </div>
    
            <div style={fieldStyles}>
              <span style={labelStyles}>Tổng tiền:</span>
              <span style={valueStyles}>{orderDetail.totalAmount}</span>
            </div>
    
            <div style={fieldStyles}>
              <span style={labelStyles}>Ngày tạo đơn:</span>
              <span style={valueStyles}>{format(new Date(orderDetail.createdDate), 'dd/MM/yyyy HH:mm:ss')}</span>
            </div>
    
            {/* Thêm nút xóa đơn hàng và Popconfirm */}
            <div style={deleteButtonContainerStyles}>
              <Popconfirm
                title="Bạn có chắc muốn xóa đơn hàng này?"
                onConfirm={handleDeleteOrder}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button style={deleteButtonStyles} type="danger">
                  Xóa đơn hàng
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      );
  };

  const productColumns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      flex: 1,
      key: 'image',
      render: text => <img src={text} alt="product" style={{width: '50px'}}/>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      flex: 1,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      key: 'code',
      flex: 1,
    },
    {
      title: 'Số lượng',
      dataIndex: 'onHand',
      flex: 1,
      key: 'onHand',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      flex: 1,
    },
  ];
  const renderProductTable = () => {
    return (
        <div style={{ marginTop: '20px' }}>
            <Table
                dataSource={productData}
                columns={productColumns}
                pagination={false}
                rowKey={(record) => record.productId}
            />
        </div>
    );
  };

  return (
    <>
      <h2>
        <span className="icon-back" onClick={handleBack}>
          <IoArrowBack />
        </span>

        Chi tiết đơn hàng
      </h2>
      <Row gutter={[16, 16]}>
        
        <Col xs={24} sm={24} md={14}>
        {renderProductTable()}
        </Col>
        <Col xs={24} sm={24} md={10}>
        <div style={{ marginTop: '20px' }}>
          {renderCard()}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default OrderDetail;
