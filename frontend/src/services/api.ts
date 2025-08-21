import axios, {type AxiosResponse } from 'axios';
import type {ApiError} from '../types';

// Configuración base del servicio de la REST Api
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Intereceptor de peticiones de la API (en caso de autenticación)
api.interceptors.request.use(
    (config) => {
        // En caso de existir tokens, se agregan aquí
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para respuestas y manejo de errores
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        console.error('API Error:', error);

        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'Error desconocido',
            status: error.response?.status,
        };

        return Promise.reject(apiError);
    }
);

export default api;