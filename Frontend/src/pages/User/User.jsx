import { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import userApi from '../../api/userApi';
import ModalEditUser from '../../components/users/ModalEditUser';
import ModalAddUser from '../../components/users/ModalAddUser';
import ModalDeleteUser from '../../components/users/ModalDeleteUser';
import LoadingSpinner from '../../components/LoadingSpinner';
import { IoArrowBack } from "react-icons/io5";
import { useNavigate} from 'react-router-dom';

const User = () => {
  const navigate = useNavigate();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [keyword, setKeyword] = useState('');
  const pageSize = 5;

  useEffect(() => {
    fetchUsers(keyword, pageCurrent, pageSize);
  }, [pageCurrent]);

  const fetchUsers = async (keyword, page, pageSize) => {
    setLoading(true);
    try {
      const response = await userApi.getAllUsers(keyword, page, pageSize);
      setUsers(response.data.content);
      setQuantity(response.data.totalElements);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu người dùng');
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const handleEditUser = (record) => {
    setEditUser(record);
    setEditModalVisible(true);
  };

  const handleDeleteUser = async (id) => {
    setDeleteUserId(id);
    setDeleteModalVisible(true);
  }

  const handleSearch = async () => {
    setPageCurrent(1);
    await fetchUsers(keyword, 1, pageSize);
  };

  const handleBack = () => {
    navigate(-1);
  }

  const columns = [
    { title: 'Tên', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <>
          {roles.map((role) => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditUser(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDeleteUser(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>
        <span className="icon-back" onClick={handleBack}>
          <IoArrowBack />
        </span>
        Danh sách người dùng
      </h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 }}>
        <Input
          placeholder="Tìm kiếm khách hàng theo tên, email"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch} 
          style={{ width: '50%' }}
          suffix={
            <Space>
              <SearchOutlined style={{ color: '#1890ff' }} />
            </Space>
          }
        />
        <Button type="primary" onClick={() => setAddModalVisible(true)}>
          Tạo người dùng
        </Button>
      </div>
      
      {loading ? <LoadingSpinner /> : 
        <>
          <Table 
            dataSource={users} 
            columns={columns} 
            rowKey="id" 
            pagination={{
              current: pageCurrent,
              pageSize: pageSize,
              total: quantity,
              onChange: (page) => setPageCurrent(page),
            }}
            loading={loading} 
          />
        </>
      }

      {addModalVisible && (
          <ModalAddUser
            visible={addModalVisible}
            setVisible={setAddModalVisible}
            fetchUsers={fetchUsers}
            pageCurrent={pageCurrent}
            pageSize={pageSize}
          />
      )}

      { editModalVisible && (
          <ModalEditUser
            visible={editModalVisible}
            setVisible={setEditModalVisible}
            user={editUser}
            fetchUsers={fetchUsers}
            pageCurrent={pageCurrent}
            pageSize={pageSize}
          />
      )}

      { deleteModalVisible && (
          <ModalDeleteUser
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            deleteUserId={deleteUserId}
            fetchUsers={fetchUsers}
            pageCurrent={pageCurrent}
            pageSize={pageSize}
          />
      )}
    </>
  );
};

export default User;
