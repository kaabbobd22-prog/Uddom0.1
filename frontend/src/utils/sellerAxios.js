// src/utils/sellerAxios.js
// Dedicated axios instance for all Seller API calls.
// Automatically attaches the sellerToken from localStorage.

import axios from 'axios';

const sellerAPI = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

sellerAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('sellerToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto logout on 401
sellerAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('sellerToken');
            localStorage.removeItem('sellerData');
            window.location.href = '/seller/login';
        }
        return Promise.reject(error);
    }
);

export default sellerAPI;
