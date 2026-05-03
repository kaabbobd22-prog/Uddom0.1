import axios from 'axios';

const API = axios.create({
    // .env থেকে লিঙ্কটি নিচ্ছে, না থাকলে লোকালহোস্ট ব্যবহার করবে
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://uddom0-1.onrender.com/api',
});

// রিকোয়েস্ট পাঠানোর আগে অটোমেটিক টোকেন যুক্ত করার লজিক (ঐচ্ছিক কিন্তু জরুরি)
// src/api/axios.js update
API.interceptors.request.use((config) => {
    // Admin ba Customer — jekono ekta token thaklei seta pathabe
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;