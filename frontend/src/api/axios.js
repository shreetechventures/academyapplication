// frontend/src/api/axios.js

import axios from 'axios';

const instance = axios.create({
  // baseURL: process.env.REACT_APP_API_URL

  baseURL: "http://localhost:5000",   // ✅ Backend only
  headers: {
    "Content-Type": "application/json"
  }
});

// Add token automatically
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
