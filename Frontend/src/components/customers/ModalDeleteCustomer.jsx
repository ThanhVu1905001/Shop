import { useState } from 'react';
import { Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import customerApi from '../../api/customerApi';
import LoadingSpinner from '../LoadingSpinner';

const ModalDeleteCustomer = ({ visible, setVisible, idCustomerDelete }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await customerApi.deleteCustomer(idCustomerDelete);
            message.success('Xóa khách hàng thành công!');
            navigate('/admin/customers');
        } catch (error) {
            message.error('Xóa khách hàng thất bại!');
        }
        setVisible(false);
        setLoading(false);
    };
    

    return (
        <>
            { loading ? <LoadingSpinner /> : 
                <Modal
                    title="Xác nhận xóa khách hàng"
                    open={visible}
                    onOk={handleDeleteConfirm}
                    onCancel={() => setVisible(false)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                >
                    <p>Bạn có chắc chắn muốn xóa thông tin khách hàng?</p>
                </Modal>
            }   
        </>
    );
}

export default ModalDeleteCustomer;