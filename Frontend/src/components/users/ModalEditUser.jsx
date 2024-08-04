import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import userApi from '../../api/userApi';
import LoadingSpinner from '../LoadingSpinner';
import validateEmail from '../../helpers/validateEmail';

const { Option } = Select;

const allowedRoles = ['ROLE_ADMIN', 'ROLE_CUSTOMERSERVICE', 'ROLE_SELLER', 'ROLE_WAREHOUSESTAFF', 'ROLE_USER'];

const ModalEditUser = ({ visible, setVisible, user, fetchUsers, pageCurrent, pageSize }) => {
  const [form] = Form.useForm();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormValues();
  }, []);

  const setFormValues = () => {
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      roles: user.roles,
    });

    setSelectedRoles(user.roles);
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      await userApi.updateUser(user.id, { ...values, roles: selectedRoles });
      fetchUsers('',pageCurrent, pageSize);
      message.success('Cập nhật thông tin người dùng thành công!');
    } catch (error) {
      console.error('Cập nhật thất bại:', error);
      message.error(error.message);
    }
    setVisible(false);
    setLoading(false);
  };

  const availableRoles = allowedRoles.filter((role) => !selectedRoles.includes(role));

  return (
    <>
      {loading ? <LoadingSpinner /> : <>
        <Modal
          title={`ID Tài khoản: ${user.id}`}
          open={visible}
          onOk={handleOk}
          onCancel={() => setVisible(false)}
        >
          <Form form={form} layout="vertical" name="edit_user_form">
            <Form.Item label="Tên" name="username" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email' }, { validator: validateEmail }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Vai trò" name="roles" rules={[{ required: true }]}>
              <Select mode="tags" placeholder="Chọn vai trò" onChange={setSelectedRoles} value={selectedRoles}>
                {availableRoles.map((role) => (
                  <Option key={role} value={role}>
                    {role}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>}
    </>
  );
};

export default ModalEditUser;
