import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: 'http://192.168.56.1:8080/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});


export const logout = async () => {
    try {
        await SecureStore.deleteItemAsync('userToken');
        console.log("Token eliminado correctamente");
    } catch (error) {
        console.error("Error al eliminar el token:", error);
    }
};


api.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        
  
        const isPublicPath = config.url.includes('auth') || 
                             config.url.includes('horarios') || 
                             config.url.includes('sedes') ||
                             config.url.includes('canchas');

        if (token && !isPublicPath) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.log("Error en interceptor:", error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;