import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexto/conAutenticacion';

const RutaProtegida = ({ children, rolesPermitidos }) => {
    const { user, isCheckingAuth } = useAuth();
    if (isCheckingAuth) {
        return <div>Cargando autenticación...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
        const rutasDeInicio = {
            'coordinador': '/coordinador/inicio',
            'admin': '/admin/inicio',
            'profesor': '/profesor/inicio', 
            'default': '/login' 
        };

        const rutaInicio = rutasDeInicio[user.rol] || rutasDeInicio['default'];
        return <Navigate to={rutaInicio} replace />;
    }
    return children;
};

export default RutaProtegida;
