import { useState, useEffect } from 'react';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import orderApi from '../../api/orderApi';
import LoadingSpinner from '../LoadingSpinner';
import formatTime from '../../helpers/formatTime';

const TableOrderHistory = ({ idCustomer }) => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getByCustomerId(idCustomer);
            setOrders(response);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
        setLoading(false);
    };

    const handleRowClick = (record) => {
        navigate(`/admin/customers/${idCustomer}/orders/${record.id}`);
    };

    const columns = [
        { title: 'Mã đơn hàng', dataIndex: 'code', key: 'code' },
        { title: 'Thời gian tạo đơn', dataIndex: 'createdDate', key: 'createdDate', render: (text) => formatTime(text) },
        { title: 'Tổng số tiền', dataIndex: 'totalAmount', key: 'totalAmount' },
        { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
    ];

    return (
        <>
            {loading ? <LoadingSpinner /> : 
                <Table
                    dataSource={orders}
                    columns={columns}
                    rowKey="id"
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                />
            }
        </>
    );
};

export default TableOrderHistory;
