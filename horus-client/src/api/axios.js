import axios from 'axios';

const api = axios.create({
    //baseURL: 'http://127.0.0.1:8000/api',
    baseURL: 'http://10.41.2.221:8000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;