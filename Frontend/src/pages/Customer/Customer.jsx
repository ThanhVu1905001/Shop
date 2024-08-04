import { useState, useEffect } from "react";
import { Table, Button, message, Input, Space, Upload, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import customerApi from "../../api/customerApi.jsx";
import ModalAddCustomer from "../../components/customers/ModalAddCustomer.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [keyword, setKeyword] = useState('');
  const pageSize = 5;

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã khách hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalSpending",
      key: "totalSpending",
    },
    {
      title: "Số đơn hàng",
      dataIndex: "totalOrders",
      key: "totalOrders",
    },
  ];

  useEffect(() => {
    fetchData(keyword, pageCurrent, pageSize);
  }, [pageCurrent]);

  const fetchData = async (keyword, page, pageSize) => {
    try {
      const response = await customerApi.getCustomers(keyword, page, pageSize);
      setCustomers(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      message.error("Tải dữ liệu thất bại");
    }
    setLoading(false);
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8091/admin/customers/upload", formData);
      message.success("File uploaded successfully");
      fetchData(keyword, pageCurrent, pageSize);
    } catch (error) {
      message.error("File upload failed");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get("http://localhost:8091/admin/customers/download", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "customers.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      message.error("Tải về thất bại");
    }
  };

  const handleRowClick = (record) => {
    navigate(`/admin/customers/${record.id}`);
  };

  const handleSearch = async () => {
    setPageCurrent(1);
    await fetchData(keyword, pageCurrent, pageSize);
  };

  const handleBack = () => {
    navigate(-1);
  }

  return (
    <>
      <h2>
        <span className="icon-back" onClick={handleBack}>
          <IoArrowBack />
        </span>
        Danh sách khách hàng
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
          marginTop: 10,
          }}
      >
        <Upload
          beforeUpload={() => false}
          showUploadList={false}
          onChange={handleUpload}
        >
          <Button icon={<UploadOutlined />}>Tải lên</Button>
        </Upload>
        <Popconfirm
          title="Bạn có chắc muốn tải tệp về?"
          onConfirm={handleDownload}
          okText="Tải về"
          cancelText="Hủy"
        >
          <Button icon={<DownloadOutlined />}>Tải về</Button>
        </Popconfirm>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <Input
          placeholder="Tìm kiếm khách hàng theo tên, mã khách hàng, số điện thoại, email"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: "50%" }}
          suffix={
            <Space>
              <SearchOutlined style={{ color: "#1890ff" }} />
            </Space>
          }
        />
        <Button type="primary" onClick={() => setAddModalVisible(true)}>
          Thêm khách hàng
        </Button>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={customers}
            rowKey="id"
            pagination={{
              current: pageCurrent,
              pageSize: pageSize,
              total: totalItems,
              onChange: (page) => setPageCurrent(page),
            }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            style={{ marginBottom: 20, marginTop: 20 }}
          />
        </>
      )}

      {addModalVisible && (
        <ModalAddCustomer
          visible={addModalVisible}
          setVisible={setAddModalVisible}
          fetchData={fetchData}
          pageCurrent={pageCurrent}
          pageSize={pageSize}
        />
      )}
    </>
  );
};

export default Customer;