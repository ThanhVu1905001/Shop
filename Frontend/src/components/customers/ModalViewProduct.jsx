import { useState, useEffect } from 'react';
import { Modal, Row, Col, Button } from 'antd';
import productApi from '../../api/productApi';
import LoadingSpinner from '../LoadingSpinner';

const ModalViewProduct = ({ productId, visible, onClose }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            const response = await productApi.getById(productId);
            setProduct(response.data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchProductDetails();
    }, []);

    return (
        <Modal
            title={`Thông tin sản phẩm`}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
        >
            {loading ? (
                <LoadingSpinner />
            ) : (
                <Row gutter={16}>
                    <Col span={12}>
                        <p>Mã sản phẩm: {product?.code}</p>
                        <p>Tên sản phẩm: {product?.name}</p>
                        <p>Giá sản phẩm: {product?.price}</p>
                        <p>Số lượng còn trong kho: {product?.available}</p>
                        <p>Mô tả: {product?.description}</p>
                    </Col>
                    <Col span={12}>
                        {product?.image && (
                            <img
                                src={product?.image}
                                alt="Product"
                                style={{ maxWidth: "100%", maxHeight: "400px" }}
                            />
                        )}
                    </Col>
                </Row>
            )}
        </Modal>
    );
};

export default ModalViewProduct;
