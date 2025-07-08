import axios from "axios";
import { AuthService } from "./AuthService";

const apiClient = axios.create({
    baseURL: "http://localhost:8000/multiservices/", // Base URL actualizada
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
});

// Interceptor de solicitud: se ejecuta antes de enviar la petición
apiClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    console.error("Error en la solicitud a la API: ", error);
    return Promise.reject(error);
});

// Interceptor de respuesta: se ejecuta cuando se recibe una respuesta
apiClient.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    if (error.response && error.response.status === 401) {
        try {
            const refresh = localStorage.getItem("refresh_token");
            if (!refresh) throw new Error("No hay refresh token disponible");

            const tokenResponse = await new AuthService().refreshToken(refresh);
            localStorage.setItem("access_token", tokenResponse.access);

            // Reintenta la solicitud original con el nuevo token
            error.config.headers["Authorization"] = `Bearer ${tokenResponse.access}`;
            return apiClient.request(error.config);
        } catch (authError) {
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            console.error("Error de autenticación al renovar el token:", authError);
            return Promise.reject(authError);
        }
    }

    console.error("Error en la respuesta de la API: ", error.response);
    return Promise.reject(error);
});

export default apiClient;
