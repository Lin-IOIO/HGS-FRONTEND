import { eliminar } from "apis/funciones";
import { useAuth } from "contexto/conAutenticacion";
import { useEffect, useState } from "react";

export function useDelete(url, initial) {
    const { token } = useAuth();
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [datos, setDatos] = useState(initial);

    useEffect(() => {
        if (url) {
            eliminar(url, token).then((datos) => {
                setDatos(datos);
                setCargando(false);
                setError(false);
            }).catch(() => {
                setError(true);
                setCargando(false);
            })
        }
    }, [token, url]);

    return [datos, cargando, error];
}