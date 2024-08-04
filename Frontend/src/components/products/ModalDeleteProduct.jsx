import { Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";

const ModalDeleteProduct = ({ visible, setVisible, idProductDelete }) => {
  const navigate = useNavigate();

  const handleDeleteConfirm = async () => {
    try {
      await productApi.deleteProduct(idProductDelete);
      message.success("Xóa sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Xóa sản phẩm thất bại!");
    }
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title="Xác nhận xóa sản phẩm"
      visible={visible}
      onOk={handleDeleteConfirm}
      onCancel={handleCancel} // Sử dụng hàm handleCancel khi nhấn Hủy
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <p>Bạn có chắc chắn muốn xóa thông tin sản phẩm?</p>
    </Modal>
  );
};

export default ModalDeleteProduct;
