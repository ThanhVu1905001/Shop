import ListOrder from "../../components/orders/ListOrder";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Order = () => {
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
                Danh sách đơn hàng
            </h2>
            <ListOrder />
        </>
    );
}

export default Order;