import ListProduct from "../../components/products/ListProducts";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  }
  return (
    <>
      <h2>
        <span className="icon-back" onClick={handleBack}>
          <IoArrowBack />
        </span>
        Danh sách Sản phẩm
      </h2>
      <ListProduct />
    </>
  );
};

export default Product;
