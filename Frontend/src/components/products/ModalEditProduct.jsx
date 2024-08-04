import { useEffect, useState } from "react";
import { Modal, Form, Input, message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import productApi from "../../api/productApi";

const ModalEditProduct = ({
  visible,
  setVisible,
  productEdit,
  fetchProductDetails,
}) => {
  const product = productEdit;
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  const setFormValues = () => {
    form.setFieldsValue({
      code: product.code,
      name: product.name,
      price: product.price,
      onHand: product.onHand,
      description: product.description,
    });
    setImageUrl(product.image);
  };

  useEffect(() => {
    setFormValues();
  }, []);

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} tải lên thành công.`);
      setImageUrl(info.file.response);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();

      values.image = imageUrl;

      await productApi.updateProduct(product.id, values);
      fetchProductDetails();
      message.success("Cập nhật thông tin sản phẩm thành công!");
    } catch (error) {
      message.error("Cập nhật thông tin sản phẩm thất bại!");
    }
    setVisible(false);
  };

  return (
    <Modal
      title="Sửa thông tin sản phẩm"
      open={visible}
      onOk={handleEditModalOk}
      onCancel={() => setVisible(false)}
    >
      <Form form={form} layout="vertical" name="add_product_form">
        <Form.Item
          label="Mã sản phẩm"
          name="code"
          rules={[{ required: true, message: "Please input product code!" }]}
        >
          <Input type="string" />
        </Form.Item>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng điền tên sản phẩm!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Giá sản phẩm"
          name="price"
          rules={[{ required: true, message: "Vui lòng điền giá sản phẩm!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="onHand"
          rules={[{ required: true, message: "Vui lòng điền số lượng!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Ảnh sản phẩm"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            name="file"
            action="http://localhost:8091/api/image/upload-image"
            listType="picture"
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Product"
              style={{ maxWidth: "50px", marginTop: "50px" }}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditProduct;
