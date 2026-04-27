import axiosInstance from "./axios.js"

export const registerUser = async (userData) => {
    const response = await axiosInstance.post('/users/register', userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axiosInstance.post('/users/login', userData);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
}
