import { get } from "apis/funciones";
import { useAuth } from "contexto/conAutenticacion";
import { useEffect, useState } from "react";

export function useGet(url, initial) {
    const { token } = useAuth();
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [datos, setDatos] = useState(initial);

    useEffect(() => {
        if (url) {
            get(url, token)
                .then((datos) => {
                    setDatos(datos);
                    setCargando(false);
                    setError(null);
                })
                .catch((err) => {
                    setError(err?.response?.data?.message || err?.message || 'Error al cargar los datos.');
                    setCargando(false);
                });
        }
    }, [token, url]);

    return [datos, cargando, error];
}