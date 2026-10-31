import axios from 'axios';
export const api = axios.create({baseURL:import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'});
api.interceptors.request.use((config)=>{const token=localStorage.getItem('cc_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use((r)=>r,(error)=>Promise.reject(error.response?.data?.error?.message || error.message || 'Something went wrong'));
