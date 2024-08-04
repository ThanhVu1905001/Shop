import { useState } from 'react';
import { Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import userApi from '../../api/userApi';
import LoadingSpinner from '../LoadingSpinner';

const ModalDeleteUser = ({ visible, setVisible, deleteUserId, fetchUsers, pageCurrent, pageSize  }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await userApi.deleteUserById(deleteUserId);
            fetchUsers('',1, pageSize);
            message.success('Xóa khách hàng thành công!');
            navigate('/admin/users');
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
                    title="Xác nhận xóa người dùng"
                    open={visible}
                    onOk={handleDeleteConfirm}
                    onCancel={() => setVisible(false)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                >
                    <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                </Modal>
            }   
        </>
    );
}

export default ModalDeleteUser;