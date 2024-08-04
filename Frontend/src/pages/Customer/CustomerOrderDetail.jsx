import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Row, Col } from 'antd';
import LoadingSpinner from '../../components/LoadingSpinner';
import ModalViewProduct from '../../components/customers/ModalViewProduct';
import formatTime from '../../helpers/formatTime';
import orderApi from '../../api/orderApi';
import customerApi from '../../api/customerApi';
import userApi from "../../api/userApi";
import { IoArrowBack } from "react-icons/io5";

const CustomerOrderDetail = () => {
    const { idOrder } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [customerCode, setCustomerCode] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [username, setUsername] = useState(null);
    const [visibleModalProduct, setVisibleModalProduct] = useState(false); 

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getOrderDetailsById(idOrder);
            setOrder(response);
            fetchCustomerCode(response.customerId);
            fetchUserName(response.userId);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
        setLoading(false);
    };

    const fetchUserName = async (userId) => {
        setLoading(true);
        try {
            const response = await userApi.getById(userId);
            setUsername(response.data.username);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
        setLoading(false);
    }

    const fetchCustomerCode = async (customerId) => {
        setLoading(true);
        try {
            const response = await customerApi.getById(customerId);
            setCustomerCode(response.data.code);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
        setLoading(false);
    }
    
    const handleRowClick = (productId) => {
        setSelectedProductId(productId);
        setVisibleModalProduct(true);
    }

    const productColumns = [
        { title: 'ID sản phẩm', dataIndex: 'productId', key: 'productId' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
    ];

    const handleBack = () => {
        navigate(-1);
    }

    return (
        <>
            { loading ? <LoadingSpinner /> : 
                <>
                    {order && (
                        <>
                            <h2>
                                <span className="icon-back" onClick={handleBack}>
                                    <IoArrowBack />
                                </span>
                                Chi tiết đơn hàng #{order.code}
                            </h2>
                            <Card title="Thông tin đơn hàng">
                                <Row>
                                    <Col span={12}>
                                        <p>Mã khách hàng: {customerCode}</p>
                                        <p>Nhân viên hỗ trợ: {username}</p>
                                    </Col>
                                    <Col span={12}>
                                        <p>Tổng chi phí: {order.totalAmount}</p>
                                        <p>Thời gian tạo đơn: {formatTime(`${order.createdDate}`)}</p>
                                    </Col>
                                </Row>
                            </Card>

                            <Card title="Danh sách sản phẩm">
                                <Table
                                    dataSource={order.orderDetails}
                                    columns={productColumns}
                                    rowKey="productId"
                                    onRow={(record) => ({
                                        onClick: () => handleRowClick(record.productId),
                                    })}
                                />
                            </Card>
                            { visibleModalProduct &&
                                <ModalViewProduct
                                    productId={selectedProductId}
                                    visible={visibleModalProduct}
                                    onClose={() => setVisibleModalProduct(false)}
                                />
                            }
                        </>
                    )}
                </>
            }
        </>
    );
};

export default CustomerOrderDetail;
