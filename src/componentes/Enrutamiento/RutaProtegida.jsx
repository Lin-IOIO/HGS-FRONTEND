import React from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '../../contexto/conAutenticacion';

const RutaProtegida = ({ children, rolesPermitidos }) => {
    const { user, isCheckingAuth } = useAuth();
    if (isCheckingAuth) {
        return <div>Cargando autenticación...</div>;
    }
    if (!user || !user.rol) {
        return <Redirect to="/login" />;
    }

    if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
        const rutasDeInicio = {
            'coordinador': '/coordinador/inicio',
            'admin': '/admin/inicio',
            'profesor': '/profesor/inicio', 
            'default': '/login' 
        };

        const rutaInicio = rutasDeInicio[user.rol] || rutasDeInicio['default'];
        return <Redirect to={rutaInicio} />;
    }
    return children;
};

export default RutaProtegida;
