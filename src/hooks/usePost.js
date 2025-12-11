import { useAuth } from "contexto/conAutenticacion";
import { useState } from "react";
import { post } from "apis/funciones"

export function usePost() {
    const { token } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [datosRespuesta, setDatosRespuesta] = useState(null); 

    const ejecutarPost = async (url, body) => {
        setCargando(true);
        setError(null);
        setDatosRespuesta(null);

        try {
            const respuesta = await post(url, body, token); 
            setDatosRespuesta(respuesta);
            setCargando(false);
            return { exito: true, data: respuesta };
        } catch (err) {
            setError(err);
            setCargando(false);
            return { exito: false, error: err };
        }
    };
    return { ejecutarPost, cargando, error, datosRespuesta };
}