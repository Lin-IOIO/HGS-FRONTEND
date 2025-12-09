import { put } from "apis/funciones";
import { useAuth } from "contexto/conAutenticacion";
import { useEffect, useState } from "react";

export function usePut(url, body) {
    const { token } = useAuth();
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [datos, setDatos] = useState(null);

    useEffect(() => {
        if (url && body) {
            put(url, body, token).then((datos) => {
                setDatos(datos);
                setCargando(false);
                setError(false);
            }).catch(() => {
                setError(true);
                setCargando(false);
            })
        }
    }, [token, body, url]);

    return [datos, cargando, error];
}