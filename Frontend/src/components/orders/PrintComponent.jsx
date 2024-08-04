import React from "react";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PrintComponent = ({ visible, onCancel, orderId, orderDetails }) => {
  const navigate = useNavigate();

  console.log('orderDetails', orderDetails);

  const handlePrint = () => {
    const { customer, orderProducts, totalPayment, customerPayment, orderNote } = orderDetails;

    const documentDefinition = {
      content: [
        { text: "Hóa Đơn", fontSize: 18, margin: [0, 0, 0, 10] },
        { text: `Khách Hàng: ${customer?.name}`, fontSize: 12, margin: [0, 0, 0, 8] },
        { text: `Địa Chỉ: ${customer?.address}`, fontSize: 12, margin: [0, 0, 0, 8] },
        { text: `Điện Thoại: ${customer?.phone}`, fontSize: 12, margin: [0, 0, 0, 10] },
        {
          table: {
            headerRows: 1,
            body: [
              ["STT", "Sản Phẩm", "Số Lượng", "Đơn Giá", "Thành Tiền"],
              ...orderProducts.map((product, index) => [
                index + 1,
                product.name,
                product.onHand.toString(),
                product.price.toString(),
                product.total.toString(),
              ]),
            ],
          },
          margin: [0, 10, 0, 10],
        },
        { text: "Tổng Cộng", margin: [0, 10, 0, 10] },
        { text: totalPayment.toString(), margin: [0, 0, 0, 10] },
        { text: `Tiền Khách Đưa: ${customerPayment}`, margin: [0, 0, 0, 10] },
        { text: `Phần Trả Lại Khách: ${customerPayment - totalPayment}`, margin: [0, 0, 0, 10] },
        { text: `Ghi Chú: ${orderNote}`, margin: [0, 0, 0, 10] },
      ],
      defaultStyle: {
        font: "Roboto",
      },
    };

    pdfMake.createPdf(documentDefinition).download("hoa-don.pdf");

    navigate(`/admin/orders/${orderId}`);
    onCancel();
  };

  const handleCancel = () => {
    navigate(`/admin/orders/${orderId}`);
    onCancel();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      title="In hóa đơn"
      footer={[
        <Button key="print" type="primary" onClick={handlePrint}>
          In
        </Button>,
      ]}
    >
      <div>
        <p>Thông tin khách hàng: {orderDetails.customer?.name}</p>
        <table >
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản Phẩm</th>
              <th>Số Lượng</th>
              <th>Đơn Giá</th>
              <th>Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.orderProducts.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.onHand}</td>
                <td>{product.price}</td>
                <td>{product.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4">Tổng Cộng</td>
              <td>{orderDetails.totalPayment}</td>
            </tr>
            <tr>
              <td colSpan="4">Tiền Khách Đưa</td>
              <td>{orderDetails.customerPayment}</td>
            </tr>
            <tr>
              <td colSpan="4">Phần Trả Lại Khách</td>
              <td>{orderDetails.customerPayment - orderDetails.totalPayment}</td>
            </tr>
          </tfoot>
        </table>
        <p>Ghi chú: {orderDetails.orderNote}</p>
      </div>
    </Modal>
  );
};

export default PrintComponent;