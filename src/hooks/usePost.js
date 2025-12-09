import { post } from "apis/funciones";
import { useAuth } from "contexto/conAutenticacion";
import { useEffect, useState } from "react";

export function usePost(url, body) {
    const { token } = useAuth();
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [datos, setDatos] = useState(null);

    useEffect(() => {
        if (url && body) {
            post(url, body, token).then((datos) => {
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