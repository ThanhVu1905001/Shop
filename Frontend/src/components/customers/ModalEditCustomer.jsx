import { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import customerApi from '../../api/customerApi';
import LoadingSpinner from '../LoadingSpinner';
import validateEmail from '../../helpers/validateEmail';
import validatePhone from '../../helpers/validatePhone';

const ModalEditCustomer = ({ visible, setVisible, customerEdit, fetchCustomerDetails }) => {
    const customer = customerEdit;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const setFormValues = () => {
        form.setFieldsValue({
            id: customer.id,
            name: customer.name,
            code: customer.code,
            address: customer.address,
            phone: customer.phone,
            email: customer.email,
            description: customer.description,
        });
    }

    useEffect(() => {
        setFormValues();
    }, []);

    const handleEditModalOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            await customerApi.updateCustomer(customer.id, values);
            fetchCustomerDetails();
            message.success('Cập nhật thông tin khách hàng thành công!');
        } catch (error) {
            console.error('Error updating customer:', error);
            message.error('Cập nhật thất bạt', error.message);
        }
        setVisible(false);
        setLoading(false);
    };

    return (
        <>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <Modal
                    title="Sửa thông tin khách hàng"
                    open={visible}
                    onOk={handleEditModalOk}
                    onCancel={() => setVisible(false)}
                >
                    <Form form={form} layout="vertical" name="edit_customer_form">
                        <Form.Item label="Id" name="id" initialValue={customer.id}>
                            <Input readOnly />
                        </Form.Item>
                        <Form.Item label="Mã khách hàng" name="code" initialValue={customer.code}>
                            <Input readOnly />
                        </Form.Item>
                        <Form.Item label="Tên" name="name" initialValue={customer.name} rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Địa chỉ" name="address" initialValue={customer.address}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone" initialValue={customer.phone} rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }, { validator: validatePhone }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email" initialValue={customer.email} rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email' }, { validator: validateEmail }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Mô tả" name="description" initialValue={customer.description}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </>
    );
};

export default ModalEditCustomer;
