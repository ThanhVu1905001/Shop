import { Spin } from 'antd';

const LoadingSpinner = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
            }}
        >
            <Spin size="large"/>
        </div>
    );
};

export default LoadingSpinner;
