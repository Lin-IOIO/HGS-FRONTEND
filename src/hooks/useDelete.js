import { useAuth } from "contexto/conAutenticacion";
import { useState } from "react";
import { eliminar } from "apis/funciones"; 

export function useDelete() {
    const { token } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const ejecutarEliminacion = async (url) => {
        setCargando(true);
        setError(null);

        try {
            await eliminar(url, token);
            setCargando(false);
            return true;
        } catch (err) {
            setError(err);
            setCargando(false);
            return false;
        }
    };

    return { ejecutarEliminacion, cargando, error };
}