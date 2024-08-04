import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_REACT_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user.accessToken;
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});


export default axiosClient;
