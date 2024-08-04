import { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import customerApi from '../../api/customerApi';
import ModalEditCustomer from '../../components/customers/ModalEditCustomer';
import ModalDeleteCustomer from '../../components/customers/ModalDeleteCustomer';
import TableOrderHistory from '../../components/customers/TableCustomerOrder';
import LoadingSpinner from '../../components/LoadingSpinner';
import formatTime from '../../helpers/formatTime'; 
import { IoArrowBack } from "react-icons/io5";

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    useEffect(() => {
        fetchCustomerDetails();
    }, []);

    const fetchCustomerDetails = async () => {
        setLoading(true);
        try {
            const response = await customerApi.getById(id);
            setCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
        setLoading(false);
    };

    const handleBack = () => {
        navigate(-1);
    }

    return (
        <>
            { loading ? <LoadingSpinner /> : 
                <>
                    {customer && (
                        <>
                            <h2>
                                <span className="icon-back" onClick={handleBack}>
                                    <IoArrowBack />
                                </span>
                                Thông tin khách hàng: {customer?.name}
                            </h2>
                            
                            <div
                                style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginBottom: 10,
                                marginTop: 10,
                                }}
                            >
                                <Space>
                                    <Button type="primary" onClick={() => setEditModalVisible(true)} >
                                        Cập nhật
                                    </Button>
                                    <Button type="primary" danger onClick={() => setDeleteModalVisible(true)}>
                                        Xóa dữ liệu
                                    </Button>
                                </Space>
                            </div>
        
                            <Card title="Thông tin cá nhân" style={{ marginBottom: 20, marginTop: 20 }}>
                                <Row>
                                <Col span={12}>
                                    <p>Mã khách hàng: {customer.code}</p>
                                    <p>Địa chỉ: {customer.address}</p>
                                    <p>Số điện thoại: {customer.phone}</p>
                                </Col>
                                <Col span={12}>
                                    <p>Email: {customer.email}</p>
                                    <p>Mô tả: {customer.description ? customer.description : <>Không</>}</p>
                                </Col>
                                </Row>
                            </Card>
        
                            <Card title="Thông tin mua hàng" style={{ marginBottom: 20 }}>
                                <Row>
                                    <Col span={12}>
                                        <p>Tổng chi tiêu: {customer.totalSpending}</p>
                                        <p>Ngày mua hàng gần nhất: {customer.mostRecentOrder ? formatTime(`${customer.mostRecentOrder}`) : <>Không</>}</p>
                                    </Col>
                                    <Col span={12}>
                                        <p>Tổng SL đơn hàng: {customer.totalOrders}</p>
                                    </Col>
                                </Row>
                            </Card>
        
                            { customer.totalOrders > 0 ? (
                                <Card title="Lịch sử mua hàng" style={{ marginBottom: 20 }}>
                                    <TableOrderHistory idCustomer={customer.id} />
                                </Card>
                                ) : (
                                    <></>
                                )
                            }
                        </>
                    )}
                </>
            }
            

            { editModalVisible && (
                <ModalEditCustomer
                    visible={editModalVisible}
                    setVisible={setEditModalVisible}
                    customerEdit={customer}
                    fetchCustomerDetails={fetchCustomerDetails}
                />
            )}

            { deleteModalVisible && (
                <ModalDeleteCustomer
                    visible={deleteModalVisible}
                    setVisible={setDeleteModalVisible}
                    idCustomerDelete={customer.id}
                />
            )}
        </>
    );
};

export default CustomerDetail;
