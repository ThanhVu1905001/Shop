import ModalAddOrder from "../../components/orders/ModalAddOrder";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const AddOrder = () => {
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
                Tạo đơn hàng
            </h2>
            <ModalAddOrder />
        </>
    );
}

export default AddOrder;
//chỉnh lại ngày tháng theo kiểu việt nam, chỉnh lại nút xóa cho đẹp