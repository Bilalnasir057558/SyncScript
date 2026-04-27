import axiosInstance from "./axios.js"

export const registerUser = async (userData) => {
    const response = await axiosInstance.post('/users/register', userData);
    return response;
};

export const loginUser = async (userData) => {
    const response = await axiosInstance.post('/users/login', userData);
    return response;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/users/me');
    return response;
}
