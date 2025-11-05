import React from 'react';
import { useAuth } from '../../contexto/conAutenticacion';
// import { Navigate } from 'react-router-dom'; // No lo usaremos por ahora, solo devolvemos los hijos.

const RutaProtegida = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // En una app real, aquí se usaría <Navigate to="/login" />
        // Por ahora, solo devuelve un mensaje si la simulación falla:
        return <h1>Redirigiendo al Login... (Simulación)</h1>;
    }
    
    // Si la simulación de autenticación es exitosa, devuelve los componentes hijos
    return children;
};

export default RutaProtegida;