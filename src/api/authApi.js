import apiClient from './apiClient';

// Login
export const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
};

// Register
export const register = async (email, password) => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
};

