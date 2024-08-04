import { useState, useEffect } from "react";
import { Button, Card, Table, Row, Col, Space } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";
import ModalDeleteProduct from "./../../components/products/ModalDeleteProduct";
import ModalEditProduct from "../../components/products/ModalEditProduct";
import formatTime from "../../helpers/formatTime";
import { IoArrowBack } from "react-icons/io5";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await productApi.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  }

  return (
    <div>
      <Row align="middle" justify="space-between">
        <Col flex="auto">
          <h2>
            <span className="icon-back" onClick={handleBack}>
              <IoArrowBack />
            </span>
            Thông tin sản phẩm
          </h2>
        </Col>
        <Col>
          <Space>
            <Button type="primary" onClick={() => setEditModalVisible(true)}>
              Cập nhật
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => setDeleteModalVisible(true)}
            >
              Xóa sản phẩm
            </Button>
          </Space>
        </Col>
      </Row>
      {loading && <p>Loading...</p>}
      {product && (
        <>
          <Card
            title="Chi tiết sản phẩm"
            style={{ marginBottom: 20, marginTop: 20 }}
          >
            <Row>
              <Col span={12}>
                <p>Mã sản phẩm: {product.code}</p>
                <p>Tên sản phẩm: {product.name}</p>
                <p>Giá sản phẩm: {product.price}Đ</p>
                <p>Số lượng: {product.onHand}</p>
                <p>Mô tả: {product.description}</p>
              </Col>
              <Col span={12}>
                {product.image && (
                  <img
                    src={product.image}
                    alt="Product"
                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                  />
                )}
              </Col>
            </Row>
          </Card>
          <Card
            title="Chi tiết sản phẩm"
            style={{ marginBottom: 20, marginTop: 20 }}
          >
            <Row>
              <Col span={12}>
                <p>Số lượng đã giao dịch: {product.committed}</p>
                <p>Số lượng trong kho: {product.available}</p>
              </Col>
              <Col span={12}>
                <p>Ngày tạo: {formatTime(product.createdDate)}</p>
                <p>Ngày cập nhật: {formatTime(product.updatedDate)}</p>
              </Col>
            </Row>
          </Card>
        </>
      )}
      {editModalVisible && (
        <ModalEditProduct
          visible={editModalVisible}
          setVisible={setEditModalVisible}
          productEdit={product}
          fetchProductDetails={fetchProductDetails}
        />
      )}

      {deleteModalVisible && (
        <ModalDeleteProduct
          visible={deleteModalVisible}
          setVisible={setDeleteModalVisible}
          idProductDelete={product.idt}
        />
      )}
    </div>
  );
};

export default ProductDetail;
