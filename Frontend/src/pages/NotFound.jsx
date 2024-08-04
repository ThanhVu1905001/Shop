import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        status="404"
        title="404 - Không tìm thấy trang"
        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập."
        extra={
          <Link to="/admin">
            <Button type="primary">Về trang chủ</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
