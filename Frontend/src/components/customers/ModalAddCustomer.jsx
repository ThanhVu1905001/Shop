import { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import customerApi from '../../api/customerApi';
import LoadingSpinner from '../LoadingSpinner';
import validateEmail from '../../helpers/validateEmail';
import validatePhone from '../../helpers/validatePhone';
import LocationSelects from '../LocationSelects.jsx';

const ModalAddCustomer = ({ visible, setVisible, fetchData, pageCurrent, pageSize }) => {

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleAddModalOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      await customerApi.addCustomer({ ...values, address: values.address || '' });
      message.success('Thêm mới khách hàng thành công!');
      setVisible(false);
      form.resetFields(); 
      fetchData('', pageCurrent, pageSize);
    } catch (error) {
      console.error(error);
      message.error('Thêm mới khách hàng thất bại: số điện thoại hoặc email đã tồn tại');
    }
    setLoading(false);
  };

  const handleAddModalCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <>
      { loading ? <LoadingSpinner /> : 
        <Modal
          title="Add Customer"
          open={visible}
          onCancel={handleAddModalCancel}
          onOk={handleAddModalOk}
        >
          <Form form={form} layout="vertical" name="add_customer_form">
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: 'Bạn cần điền tên!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
              <LocationSelects form={form} loading={loading}/>
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Bạn cần điền số điện thoại!' },
                { validator: validatePhone }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Bạn cần điền email!' },
                { validator: validateEmail }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      }
    </>
  );
};

export default ModalAddCustomer;
