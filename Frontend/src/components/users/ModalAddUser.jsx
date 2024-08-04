import { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import userApi from '../../api/userApi';
import LoadingSpinner from '../LoadingSpinner';
import validateEmail from '../../helpers/validateEmail';

const { Option } = Select;
const predefinedRoles = ["admin", "customerService", "warehouseStaff", "seller"];

const ModalAddUser = ({ visible, setVisible, fetchUsers, pageCurrent, pageSize }) => {

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleAddModalOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      await userApi.signup(values);
      message.success("Tạo mới người dùng thành công!");
      fetchUsers('',pageCurrent, pageSize);
    } catch (error) {
      message.error('Tạo người dùng thất bại!');
      console.error('Error creating user:', error);
    }
    setVisible(false);
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
        title="Tạo người dùng"
        open={visible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
      >
        <Form form={form} layout="vertical" name="create_user_form">
          <Form.Item label="Email" name="email" rules={[{ required: true },{ validator: validateEmail }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: false }]}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Chọn vai trò"
              optionFilterProp="children"
            >
              {predefinedRoles.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      }
    </>
  );
};

export default ModalAddUser;
