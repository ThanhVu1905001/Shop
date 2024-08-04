import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Spin, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import AuthApi from "../api/authApi";
import LoadingSpinner from "../components/LoadingSpinner";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/admin";
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const onFinish = async (values) => {
        setMessage(null);
        setLoading(true);

        try {
            await AuthApi.login(values.username, values.password);
            navigate(from, { replace: true });
        } catch (error) {
            setMessage("Tài khoản hoặc mật khẩu không đúng");
        }
        setLoading(false);
    };

    return (
        <>
            {loading ? <LoadingSpinner /> : 
                <div className="login-background">
                    <div className="login-left">
                        <div className="login-content">
                            <h1>Phần mềm quản lý bán hàng Sapo</h1>
                        </div>
                        <div className="login-image">
                        </div>
                    </div>
                    <div className="login-right">
                        <div className="login-container">
                            <div className="card card-container">
                                <h2 className="login-title">Đăng nhập</h2>
                                <Form
                                    name="login"
                                    initialValues={{ remember: true }}
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        name="username"
                                        rules={[{ required: true, message: 'Hãy điền tên của bạn!' }]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="Username" />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: 'Hãy điền mật khẩu!' }]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                                    </Form.Item>

                                    {message && <Alert message={message} type="error" showIcon />}

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="btn-block" loading={loading}>
                                            {loading && <Spin size="small" />}
                                            <span>Đăng nhập</span>
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Login;
