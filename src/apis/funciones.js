import axios from "axios";

export async function get(url, token) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.get(url, config);

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        console.error("Error en la llamada a la API:", error);
        throw error;
    }
}

export async function post(url, body, token) {
    try {
        const configAuth = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const response = await axios.post(url, body, token === "" ? config : configAuth);

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        console.error("Error en la llamada a la API:", error);
        throw error;
    }
}

export async function put(url, body, token) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.put(url, body, config);

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        console.error("Error en la llamada a la API:", error);
        throw error;
    }
}

export async function eliminar(url, token) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.delete(url, config);

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        console.error("Error en la llamada a la API:", error);
        throw error;
    }
}