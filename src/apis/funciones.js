import axios from "axios";

export async function get(url, token) {
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error en GET:", error);
        throw error;
    }
}

export async function post(url, body, token) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await axios.post(url, body, { headers });
        return response.data;
    } catch (error) {
        console.error("Error en POST:", error);
        throw error;
    }
}

export async function put(url, body, token) {
    try {
        const response = await axios.put(url, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error en PUT:", error);
        throw error;
    }
}

export async function eliminar(url, token) {
    try {
        const response = await axios.delete(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error en DELETE:", error);
        throw error;
    }
}