const validatePhone = (rule, value) => {
    if (!/^\d{10,11}$/.test(value)) {
        return Promise.reject('Số điện thoại không hợp lệ');
    }
    return Promise.resolve();
};

export default validatePhone;