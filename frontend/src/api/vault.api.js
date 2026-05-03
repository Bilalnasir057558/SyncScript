import axiosInstance from "./axios.js"


export const createVault = async (vaultData) => {
    const respone = await axiosInstance.post('/vaults', vaultData);
    return respone.data;
}
