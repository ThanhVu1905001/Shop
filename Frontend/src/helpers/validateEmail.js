
const validateEmail = (rule, value) => {
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
        return Promise.reject('Email không hợp lệ');
    }
    return Promise.resolve();
};

export default validateEmail;