import { put } from "apis/funciones";
import { useAuth } from "contexto/conAutenticacion";
import { useState } from "react";

export function usePut() { 
    const { token } = useAuth();
    const [cargando, setCargando] = useState(false); 
    const [error, setError] = useState(null);
    const [datosRespuesta, setDatosRespuesta] = useState(null); 

    const ejecutarPut = async (url, body) => {
        setCargando(true);
        setError(null);
        setDatosRespuesta(null);

        try {
            const respuesta = await put(url, body, token); 
            setDatosRespuesta(respuesta);
            setCargando(false);
            return { exito: true, data: respuesta };
        } catch (err) {
            setError(err);
            setCargando(false);
            return { exito: false, error: err }; 
        }
    };
    return { ejecutarPut, cargando, error, datosRespuesta };
}