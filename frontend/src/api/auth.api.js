import axiosInstance from "./axios.js"

export const registerUser = async (userData) => {
    const response = await axiosInstance.post('/users/register', userData);
    return response;
};
