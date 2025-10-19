import axios, { AxiosInstance } from 'axios';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para requests
apiClient.interceptors.request.use(
    (config) => {
        // Você pode adicionar tokens de autenticação aqui no futuro
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para responses
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Tratamento de erros global
        if (error.response) {
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            console.error('Network Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
