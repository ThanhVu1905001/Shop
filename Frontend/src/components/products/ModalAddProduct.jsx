import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import productApi from "../../api/productApi";
import { useState } from "react";

const ModalAddProduct = ({
  visible,
  setVisible,
  fetchData,
  pageCurrent,
  pageSize,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} tải lên thành công!`);
      setImageUrl(info.file.response);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại!`);
    }
  };

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (!imageUrl) {
        message.error("Vui lòng chọn ảnh sản phẩm!");
        return;
      }
      values.image = imageUrl;

      await productApi.addProduct(values);
      message.success("Thêm sản phẩm thành công!");
      setVisible(false);
      form.resetFields();
      fetchData("", pageCurrent, pageSize);
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("Thêm sản phẩm thất bại!");
    }
  };

  const handleAddModalCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Thêm sản phẩm"
      open={visible}
      onCancel={handleAddModalCancel}
      onOk={handleAddModalOk}
    >
      <Form form={form} layout="vertical" name="add_product_form">
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
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddProduct;
